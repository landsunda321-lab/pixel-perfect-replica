# GPM CMS Phase 1 — Security and rollout

## Implemented application controls
- Admin and Super Admin may manage ordinary CMS accounts; Super Admin bootstrap remains exclusive.
- Editor cannot change a book's public visibility or publication status. Admin/Super Admin retain publication authority.
- Book deletion in the CMS is converted to archival (`publication_status = 'arsip'`, `show_public = false`) and audited.
- State-changing API requests carrying an Origin header are checked against the request host.
- Runtime schema DDL was removed from the request handler; schema changes belong in reviewed migrations.
- Existing Author ownership filtering remains enforced in server SQL.

## Database observations
- Existing CMS tables include users, sessions, audit log, books, authors, and manuscripts.
- User roles are constrained to `admin`, `editor`, and `author`.
- Session tokens are stored as unique hashes; sessions reference users with `ON DELETE CASCADE`.
- Books already support `publication_status = 'arsip'`; Phase 1 requires no destructive data conversion.

## Migration
Run `migrations/20261105_gpm_cms_phase1_safety.sql` against staging first. It adds only three indexes and does not change records.

## Outstanding security operations
- A tracked `.env` exists in the public repository. Do not read or reuse values from it. Rotate credentials that may have been committed, then remove the tracked file in a reviewed change and keep `.env*` ignored except safe examples.
- Private Vercel Blob storage is not yet provisioned. Do not upload manuscripts, contracts, or ISBN evidence to a public Blob store. Provision a private Blob store and use `@vercel/blob` >=2.3 before implementing authenticated private-file upload/download.
- Existing public PDF URLs must be treated as public.
- Production migration and deployment promotion require staging validation and explicit operator approval.
