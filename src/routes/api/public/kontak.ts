import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const contactInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(2000),
  /** Honeypot: nilai apa pun yang diisi bot akan diabaikan tanpa menyimpan pesan. */
  website: z.string().max(200).optional(),
});

export const Route = createFileRoute("/api/public/kontak")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Permintaan tidak valid." }, { status: 400 });
        }

        const parsed = contactInputSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Periksa kembali isian formulir." },
            { status: 400 },
          );
        }

        // Honeypot terisi: diam-diam abaikan tanpa menyimpan apa pun.
        if (parsed.data.website && parsed.data.website.length > 0) {
          return Response.json({ ok: true });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        let insertError: { message: string } | null = null;
        try {
          const result = await supabaseAdmin.from("contact_messages").insert({
            name: parsed.data.name,
            email: parsed.data.email,
            subject: parsed.data.subject,
            message: parsed.data.message,
          });
          insertError = result.error;
        } catch (configError) {
          const message = configError instanceof Error ? configError.message : String(configError);
          const notConfigured = message.includes("Missing Supabase environment variable");
          console.error(
            `[kontak] ${notConfigured ? "Backend pesan belum dikonfigurasi" : "Backend pesan gagal"}:`,
            message,
          );
          return Response.json(
            {
              ok: false,
              code: notConfigured ? "not_configured" : "error",
              error: notConfigured
                ? "Layanan penyimpanan pesan belum terkonfigurasi."
                : "Pesan gagal dikirim. Silakan coba lagi.",
            },
            { status: notConfigured ? 503 : 500 },
          );
        }

        if (insertError) {
          console.error("[kontak] Gagal menyimpan pesan:", insertError.message);
          return Response.json(
            { ok: false, code: "error", error: "Pesan gagal dikirim. Silakan coba lagi." },
            { status: 500 },
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
