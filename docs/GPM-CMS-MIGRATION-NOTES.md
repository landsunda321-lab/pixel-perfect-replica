# GPM CMS Database Migration

File: migrations/20261105_gpm_publishing_cms.sql

## Safety
This is an additive, idempotent migration designed around the existing gpm_cms_* schema. It has NOT been run against the production Neon database.

Before applying:
1. Verify a current database backup and restore procedure.
2. Apply to a staging branch/database first.
3. Confirm existing table and column names and UUID types.
4. Run application tests and verify public catalogue queries.
5. Apply to production only after staging passes.

The migration adds editorial reviews/revisions, production projects/tasks, ISBN application/document records, distribution channels, posts, maintenance tasks/logs, backup logs, and book visibility/approval metadata.

Do not expose private manuscript or ISBN documents through public Vercel Blob URLs. The current upload implementation uses public Blob access; private file storage must be implemented separately before uploading confidential manuscripts.
