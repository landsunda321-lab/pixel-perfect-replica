-- GPM CMS expansion: editorial, production, ISBN, distribution and maintenance.
-- Additive and idempotent. Review against a staging database before applying to production.
BEGIN;

ALTER TABLE public.gpm_cms_manuscripts
  ADD COLUMN IF NOT EXISTS manuscript_code text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS language text DEFAULT 'id',
  ADD COLUMN IF NOT EXISTS received_at timestamptz,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS assigned_editor_id uuid REFERENCES public.gpm_cms_users(id),
  ADD COLUMN IF NOT EXISTS editorial_due_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS gpm_cms_manuscripts_code_uidx
  ON public.gpm_cms_manuscripts(manuscript_code) WHERE manuscript_code IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.gpm_cms_editorial_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manuscript_id uuid NOT NULL REFERENCES public.gpm_cms_manuscripts(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES public.gpm_cms_users(id),
  review_type text NOT NULL DEFAULT 'substantive',
  decision text NOT NULL DEFAULT 'in_review',
  notes text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gpm_editorial_review_type_ck CHECK (review_type IN ('administrative','substantive','language','reference','final')),
  CONSTRAINT gpm_editorial_decision_ck CHECK (decision IN ('in_review','revision_required','approved','rejected'))
);

CREATE TABLE IF NOT EXISTS public.gpm_cms_manuscript_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manuscript_id uuid NOT NULL REFERENCES public.gpm_cms_manuscripts(id) ON DELETE CASCADE,
  revision_no integer NOT NULL,
  file_url text,
  change_summary text,
  submitted_by uuid REFERENCES public.gpm_cms_users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(manuscript_id, revision_no)
);

CREATE TABLE IF NOT EXISTS public.gpm_cms_production_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES public.gpm_cms_books(id) ON DELETE SET NULL,
  manuscript_id uuid REFERENCES public.gpm_cms_manuscripts(id) ON DELETE SET NULL,
  project_code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'not_started',
  target_release_date date,
  approved_by uuid REFERENCES public.gpm_cms_users(id),
  approved_at timestamptz,
  created_by uuid REFERENCES public.gpm_cms_users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gpm_production_status_ck CHECK (status IN ('not_started','design','layout','proofreading','final_review','completed','cancelled'))
);

CREATE TABLE IF NOT EXISTS public.gpm_cms_production_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.gpm_cms_production_projects(id) ON DELETE CASCADE,
  task_type text NOT NULL,
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES public.gpm_cms_users(id),
  status text NOT NULL DEFAULT 'pending',
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gpm_production_task_status_ck CHECK (status IN ('pending','in_progress','review','completed','blocked'))
);

CREATE TABLE IF NOT EXISTS public.gpm_cms_isbn_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.gpm_cms_books(id) ON DELETE CASCADE,
  application_reference text,
  status text NOT NULL DEFAULT 'preparation',
  submitted_at timestamptz,
  isbn_number text,
  approval_date date,
  notes text,
  created_by uuid REFERENCES public.gpm_cms_users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gpm_isbn_status_ck CHECK (status IN ('preparation','submitted','revision_required','approved','rejected'))
);
CREATE UNIQUE INDEX IF NOT EXISTS gpm_cms_isbn_number_uidx
  ON public.gpm_cms_isbn_applications(isbn_number) WHERE isbn_number IS NOT NULL AND isbn_number <> '';

CREATE TABLE IF NOT EXISTS public.gpm_cms_isbn_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.gpm_cms_isbn_applications(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_url text NOT NULL,
  uploaded_by uuid REFERENCES public.gpm_cms_users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gpm_cms_books
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'internal',
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.gpm_cms_users(id),
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS first_published_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS gpm_cms_books_slug_uidx
  ON public.gpm_cms_books(slug) WHERE slug IS NOT NULL;
ALTER TABLE public.gpm_cms_books
  ADD CONSTRAINT gpm_cms_books_visibility_ck
  CHECK (visibility IN ('internal','preparation_public','published_public')) NOT VALID;

CREATE TABLE IF NOT EXISTS public.gpm_cms_distribution_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  channel_type text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gpm_cms_book_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.gpm_cms_books(id) ON DELETE CASCADE,
  channel_id uuid REFERENCES public.gpm_cms_distribution_channels(id) ON DELETE SET NULL,
  format text NOT NULL,
  access_type text NOT NULL DEFAULT 'information',
  price integer,
  url text,
  availability text NOT NULL DEFAULT 'planned',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gpm_cms_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_url text,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_by uuid REFERENCES public.gpm_cms_users(id),
  updated_by uuid REFERENCES public.gpm_cms_users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gpm_posts_status_ck CHECK (status IN ('draft','review','published','archived'))
);

CREATE TABLE IF NOT EXISTS public.gpm_cms_maintenance_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  frequency text NOT NULL DEFAULT 'monthly',
  next_due_at date,
  assigned_to uuid REFERENCES public.gpm_cms_users(id),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gpm_maintenance_frequency_ck CHECK (frequency IN ('weekly','monthly','quarterly','yearly','ad_hoc'))
);

CREATE TABLE IF NOT EXISTS public.gpm_cms_maintenance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES public.gpm_cms_maintenance_tasks(id) ON DELETE SET NULL,
  activity text NOT NULL,
  result text NOT NULL DEFAULT 'completed',
  notes text,
  performed_by uuid REFERENCES public.gpm_cms_users(id),
  performed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gpm_maintenance_result_ck CHECK (result IN ('completed','failed','skipped','needs_follow_up'))
);

CREATE TABLE IF NOT EXISTS public.gpm_cms_backup_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type text NOT NULL,
  storage_reference text,
  status text NOT NULL,
  size_bytes bigint,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  notes text,
  CONSTRAINT gpm_backup_status_ck CHECK (status IN ('started','completed','failed'))
);

CREATE INDEX IF NOT EXISTS gpm_editorial_reviews_manuscript_idx ON public.gpm_cms_editorial_reviews(manuscript_id, created_at DESC);
CREATE INDEX IF NOT EXISTS gpm_production_tasks_project_idx ON public.gpm_cms_production_tasks(project_id, status);
CREATE INDEX IF NOT EXISTS gpm_isbn_applications_book_idx ON public.gpm_cms_isbn_applications(book_id, created_at DESC);
CREATE INDEX IF NOT EXISTS gpm_maintenance_due_idx ON public.gpm_cms_maintenance_tasks(next_due_at) WHERE active=true;
CREATE INDEX IF NOT EXISTS gpm_posts_public_idx ON public.gpm_cms_posts(status, published_at DESC);

COMMIT;
