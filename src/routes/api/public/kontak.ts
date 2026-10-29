import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const contactInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100),
  email: z
    .string()
    .trim()
    .email()
    .max(255),
  subject: z
    .string()
    .trim()
    .min(1)
    .max(150),
  message: z
    .string()
    .trim()
    .min(1)
    .max(2000),
  /** Honeypot: harus kosong atau tidak ada. */
  website: z.string().max(0).optional(),
});

export const Route = createFileRoute("/api/public/kontak")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json(
            { ok: false, error: "Permintaan tidak valid." },
            { status: 400 },
          );
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
        const { error } = await supabaseAdmin.from("contact_messages").insert({
          name: parsed.data.name,
          email: parsed.data.email,
          subject: parsed.data.subject,
          message: parsed.data.message,
        });

        if (error) {
          console.error("[kontak] Gagal menyimpan pesan:", error.message);
          return Response.json(
            { ok: false, error: "Pesan gagal dikirim. Silakan coba lagi." },
            { status: 500 },
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
