import { describe, expect, it } from "vitest";

import {
  businessFieldLabel,
  canonicalLinks,
  domainLabel,
  hasOfficialContact,
  site,
} from "@/data/site";

describe("Konfigurasi identitas dan domain", () => {
  it("mencantumkan kode KBLI 58110 pada label bidang usaha", () => {
    expect(site.klbiCode).toBe("58110");
    expect(businessFieldLabel()).toBe("Penerbitan Buku (KBLI 58110)");
  });

  it("menyimpan domain griyapustakamandiri.my.id di konfigurasi", () => {
    expect(site.domain.host).toBe("griyapustakamandiri.my.id");
    expect(site.domain.url).toBe("https://griyapustakamandiri.my.id");
  });

  it("label domain selalu konsisten dengan status verifikasi", () => {
    if (site.domain.verified) {
      expect(domainLabel()).toBe(site.domain.host);
    } else {
      expect(domainLabel()).toContain("domain yang direncanakan");
    }
  });

  it("tidak mengirim canonical URL sebelum domain terpasang", () => {
    if (!site.domain.verified) {
      expect(canonicalLinks("/katalog-buku")).toEqual([]);
    } else {
      expect(canonicalLinks("/katalog-buku")).toEqual([
        { rel: "canonical", href: `${site.domain.url}/katalog-buku` },
      ]);
    }
  });

  it("tidak mengklaim kontak resmi yang belum tersedia", () => {
    for (const value of [site.contact.address, site.contact.email, site.contact.phone]) {
      if (value !== null) expect(value.trim().length).toBeGreaterThan(0);
    }
    expect(hasOfficialContact()).toBe(
      Boolean(site.contact.address || site.contact.email || site.contact.phone),
    );
  });
});
