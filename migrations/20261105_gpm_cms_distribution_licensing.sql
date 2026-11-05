-- Add explicit copyright and licensing metadata for public distribution.
ALTER TABLE public.gpm_cms_books
  ADD COLUMN IF NOT EXISTS license_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS license_url text,
  ADD COLUMN IF NOT EXISTS rights_holder text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS rights_notice text NOT NULL DEFAULT '';

-- Public catalogue only exposes published, non-demo books.
CREATE INDEX IF NOT EXISTS gpm_cms_books_public_distribution_idx
  ON public.gpm_cms_books (publication_status, show_public, is_demo, created_at DESC);

COMMENT ON COLUMN public.gpm_cms_books.license_name IS 'Human-readable license or access terms shown with an Open Access title.';
COMMENT ON COLUMN public.gpm_cms_books.license_url IS 'HTTPS URL to the full license text.';
COMMENT ON COLUMN public.gpm_cms_books.rights_holder IS 'Copyright or rights holder displayed for the title.';
COMMENT ON COLUMN public.gpm_cms_books.rights_notice IS 'Additional copyright and reuse notice.';
