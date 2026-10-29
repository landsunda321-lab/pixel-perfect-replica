import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Mail, MapPin, Phone, Send, TriangleAlert } from "lucide-react";
import { useState, type FormEvent } from "react";

import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/data/site";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak Penerbit — Griya Pustaka Mandiri" },
      {
        name: "description",
        content:
          "Hubungi PT Griya Pustaka Mandiri — informasi kontak resmi dan formulir pertanyaan mengenai penerbitan buku.",
      },
      { property: "og:title", content: "Kontak Penerbit — Griya Pustaka Mandiri" },
      {
        property: "og:description",
        content: "Informasi kontak resmi dan formulir pertanyaan mengenai penerbitan buku.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // honeypot — wajib dibiarkan kosong
}

const EMPTY_FORM: ContactFormValues = { name: "", email: "", subject: "", message: "", website: "" };

const FIELD_CLASSES =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring";

function validate(values: ContactFormValues): Partial<Record<keyof ContactFormValues, string>> {
  const errors: Partial<Record<keyof ContactFormValues, string>> = {};
  if (!values.name.trim()) errors.name = "Nama wajib diisi.";
  else if (values.name.trim().length > 100) errors.name = "Nama maksimal 100 karakter.";
  if (!values.email.trim()) errors.email = "Email wajib diisi.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Format email tidak valid.";
  if (!values.subject.trim()) errors.subject = "Subjek wajib diisi.";
  else if (values.subject.trim().length > 150) errors.subject = "Subjek maksimal 150 karakter.";
  if (!values.message.trim()) errors.message = "Pesan wajib diisi.";
  else if (values.message.trim().length > 2000) errors.message = "Pesan maksimal 2000 karakter.";
  return errors;
}

function ContactPage() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const { address, email, phone, operatingHours } = site.contact;

  const update = (field: keyof ContactFormValues) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStatus("submitting");
    try {
      const response = await fetch("/api/public/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setValues(EMPTY_FORM);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const hasContactData = address || email || phone;

  return (
    <div className="flex flex-col">
      <section className="bg-mist">
        <div className="shell py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-azure">Kontak</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">
            Kontak Penerbit
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Sampaikan pertanyaan, masukan, atau permohonan informasi penerbitan kepada kami.
          </p>
        </div>
      </section>

      <section className="shell py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
          {/* Informasi kontak */}
          <div className="space-y-6">
            <SectionHeading eyebrow="Informasi" title="Kontak Resmi" />
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <dl className="space-y-5">
                {address ? (
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-azure" aria-hidden="true" />
                    <div>
                      <dt className="text-sm font-medium text-foreground">Alamat Resmi</dt>
                      <dd className="mt-1 text-sm text-muted-foreground">{address}</dd>
                    </div>
                  </div>
                ) : null}
                {email ? (
                  <div className="flex gap-3">
                    <Mail className="mt-0.5 size-5 shrink-0 text-azure" aria-hidden="true" />
                    <div>
                      <dt className="text-sm font-medium text-foreground">Email Resmi</dt>
                      <dd className="mt-1 text-sm text-muted-foreground">
                        <a
                          href={`mailto:${email}`}
                          className="transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          {email}
                        </a>
                      </dd>
                    </div>
                  </div>
                ) : null}
                {phone ? (
                  <div className="flex gap-3">
                    <Phone className="mt-0.5 size-5 shrink-0 text-azure" aria-hidden="true" />
                    <div>
                      <dt className="text-sm font-medium text-foreground">Nomor Telepon Resmi</dt>
                      <dd className="mt-1 text-sm text-muted-foreground">{phone}</dd>
                    </div>
                  </div>
                ) : null}
                {operatingHours ? (
                  <div>
                    <dt className="text-sm font-medium text-foreground">Jam Operasional</dt>
                    <dd className="mt-1 text-sm text-muted-foreground">{operatingHours}</dd>
                  </div>
                ) : null}
              </dl>
              {!hasContactData ? (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Alamat, email, dan nomor telepon resmi akan ditampilkan setelah data tersebut
                  dikonfirmasi dari dokumen legalitas perusahaan. Sementara itu, formulir di samping
                  adalah saluran kontak yang berfungsi.
                </p>
              ) : null}
            </div>
          </div>

          {/* Formulir kontak */}
          <div>
            <SectionHeading eyebrow="Formulir" title="Kirim Pesan" />
            {status === "success" ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-azure" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Pesan berhasil terkirim.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Terima kasih telah menghubungi {site.brandName}. Kami akan menindaklanjuti
                    pesan Anda.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-3 text-sm font-medium text-azure transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    Kirim pesan lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-foreground">
                      Nama <span aria-hidden="true" className="text-destructive">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={values.name}
                      onChange={update("name")}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      className={FIELD_CLASSES}
                      placeholder="Nama lengkap Anda"
                    />
                    {errors.name ? (
                      <p id="contact-name-error" className="mt-1.5 text-xs text-destructive">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-foreground">
                      Email <span aria-hidden="true" className="text-destructive">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={values.email}
                      onChange={update("email")}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      className={FIELD_CLASSES}
                      placeholder="nama@email.com"
                    />
                    {errors.email ? (
                      <p id="contact-email-error" className="mt-1.5 text-xs text-destructive">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-foreground">
                    Subjek <span aria-hidden="true" className="text-destructive">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    value={values.subject}
                    onChange={update("subject")}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                    className={FIELD_CLASSES}
                    placeholder="Perihal pesan"
                  />
                  {errors.subject ? (
                    <p id="contact-subject-error" className="mt-1.5 text-xs text-destructive">
                      {errors.subject}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">
                    Pesan <span aria-hidden="true" className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    value={values.message}
                    onChange={update("message")}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    className={`${FIELD_CLASSES} resize-y`}
                    placeholder="Tulis pesan Anda di sini"
                  />
                  {errors.message ? (
                    <p id="contact-message-error" className="mt-1.5 text-xs text-destructive">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                {/* Honeypot — tersembunyi dari pengunjung manusia */}
                <div aria-hidden="true" className="hidden">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={update("website")}
                  />
                </div>

                {status === "error" ? (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
                  >
                    <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
                    <p className="text-sm text-destructive">
                      Pesan gagal terkirim. Silakan coba lagi dalam beberapa saat.
                    </p>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:bg-navy-deep hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="size-4" aria-hidden="true" />
                  {status === "submitting" ? "Mengirim…" : "Kirim Pesan"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
