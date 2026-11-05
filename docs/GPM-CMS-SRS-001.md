# GPM-CMS-SRS-001
## Software Requirements Specification — Griya Pustaka Mandiri CMS

Status: Baseline design / implementation migration prepared  
Application: https://griyapustakamandiri.web.id  
Repository: landsunda321-lab/pixel-perfect-replica  
Branch: main

## 1. Objectives
Provide one workflow for manuscript intake, editorial review, book production, ISBN administration, publication, distribution, public catalogues, and website maintenance.

## 2. Roles
- Super Admin: bootstrap account and full system authority.
- Admin: user administration, profile/legal settings, approval and publication, maintenance and system controls.
- Editor: manuscript, editorial, production, ISBN record preparation, catalogue metadata, distribution and editorial content. Editor cannot change legal identity, manage users, or publish a book to the public catalogue.
- Existing Author role is retained for backward compatibility and may submit/view only their own manuscripts. It is not part of the initial two-role operating model unless explicitly enabled.

## 3. Publication workflow
received -> administrative_review -> editorial_review -> revision -> editorial_approved -> production -> isbn_preparation -> isbn_submitted -> isbn_approved -> ready_to_publish -> published -> distributed.
Rejected and archived are terminal/administrative states. State changes must be audited. ISBN approved means the official number has been recorded and verified by the publisher; the CMS does not submit ISBN applications to Perpusnas.

## 4. Catalogue visibility
- internal: only authenticated Admin/Editor.
- preparation_public: visible only in the separate "Dalam Persiapan" public section when approved by Admin.
- published_public: visible in the published catalogue only after Admin approval, production completion, publication metadata validation and ISBN validation where applicable.
- Public catalogue queries must never mix preparation_public with published_public.
- Never invent ISBNs, publication dates, author credentials, or distribution links.

## 5. Main modules
1. Dashboard and task overview.
2. Manuscript intake, author relation, file versions and status history.
3. Editorial assignments, reviews and revision tracking.
4. Production projects and task assignments.
5. ISBN application records and supporting documents.
6. Book catalogue, metadata, covers and public detail pages.
7. Distribution channels and availability.
8. News/articles and static publisher pages.
9. Maintenance schedules, logs, backup logs and activity audit.

## 6. Security
- Server-side role checks on every write and protected read.
- Private manuscript and ISBN files must use private storage or short-lived signed access; do not store them in public Blob paths.
- Validate MIME type, file size and ownership on uploads.
- Soft archive business records; avoid destructive deletion for books/manuscripts.
- Audit login, account changes, manuscript transitions, editorial decisions, production changes, ISBN changes, publication and maintenance.
- Keep secrets in Vercel environment variables. Never commit credentials.
- Apply migrations to staging first, take a verified backup, then production.

## 7. Data model
Existing tables retained: gpm_cms_users, gpm_cms_sessions, gpm_cms_audit_log, gpm_cms_books, gpm_cms_authors, gpm_cms_manuscripts.
Additive tables: gpm_cms_editorial_reviews, gpm_cms_manuscript_revisions, gpm_cms_production_projects, gpm_cms_production_tasks, gpm_cms_isbn_applications, gpm_cms_isbn_documents, gpm_cms_distribution_channels, gpm_cms_book_distributions, gpm_cms_posts, gpm_cms_maintenance_tasks, gpm_cms_maintenance_logs, gpm_cms_backup_logs.
See migrations/20261105_gpm_publishing_cms.sql.

## 8. Acceptance criteria
- Admin and Editor permissions are enforced server-side, not only hidden in UI.
- Editor cannot publish books or change publisher legal identity.
- Public preparation and published catalogues are separate endpoints/views.
- No book is published without explicit Admin approval.
- ISBN field is unique when populated and is never auto-generated.
- Manuscript files are not publicly accessible.
- Every workflow transition is timestamped and attributed to a user.
- Maintenance tasks can be scheduled and completion/failure logged.
- Backup process has verifiable restore testing; a log alone is not proof of backup.
- Existing catalogue, author, login and upload features continue to work.

## 9. Rollout
Phase 0: schema and route audit.  
Phase 1: additive migration and role/permission hardening.  
Phase 2: manuscript/editorial workflow.  
Phase 3: production and ISBN administration.  
Phase 4: separate public catalogues and distribution.  
Phase 5: maintenance dashboard, tests and deployment verification.
