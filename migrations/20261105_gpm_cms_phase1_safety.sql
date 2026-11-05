-- GPM CMS Phase 1: operational safety indexes only.
-- No records are modified or removed. Apply to staging before production.
BEGIN;

CREATE INDEX IF NOT EXISTS gpm_cms_sessions_expires_at_idx
  ON public.gpm_cms_sessions (expires_at);

CREATE INDEX IF NOT EXISTS gpm_cms_audit_log_created_at_idx
  ON public.gpm_cms_audit_log (created_at DESC);

CREATE INDEX IF NOT EXISTS gpm_cms_manuscripts_author_status_updated_idx
  ON public.gpm_cms_manuscripts (author_id, status, updated_at DESC);

COMMIT;
