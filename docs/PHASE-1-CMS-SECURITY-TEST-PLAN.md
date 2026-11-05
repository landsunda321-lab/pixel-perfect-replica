# Phase 1 — CMS Security Hardening Test Plan

Branch: phase-1-security-hardening

## Server-side role matrix

| Action | Super Admin | Admin | Editor | Author | Anonymous |
|---|---:|---:|---:|---:|---:|
| Read CMS users | Allow | Allow | Deny | Deny | Deny |
| Create/deactivate users | Allow | Allow | Deny | Deny | Deny |
| Read books/authors | Allow | Allow | Allow | Deny | Deny |
| Create/update draft book | Allow | Allow | Allow | Deny | Deny |
| Set book public / publish | Allow | Allow | Deny | Deny | Deny |
| Set or change ISBN | Allow | Allow | Deny | Deny | Deny |
| Delete book | Allow | Allow | Deny | Deny | Deny |
| Read audit log | Allow | Allow | Deny | Deny | Deny |
| Submit own manuscript | Allow | Admin/Editor review | Deny | Own record only | Deny |

## Manual/API verification
1. Sign in as Editor. POST a draft book without ISBN and with show_public=false: expect 201.
2. As Editor, POST a book with show_public=true: expect 403.
3. As Editor, PATCH a book to publication_status=terbit or isbn_terbit: expect 403.
4. As Editor, attempt to change an existing ISBN: expect 403.
5. As Editor, update metadata of an existing ISBN book without changing its ISBN: expect normal update unless publication visibility requires Admin approval.
6. As Editor, DELETE a book: expect 403.
7. As Editor, GET users and audit-log: expect 403.
8. As Admin, repeat approved actions: expect success.
9. As Author, confirm manuscript ownership boundaries remain enforced.
10. As anonymous user, protected CMS endpoints must return 401.

## Deployment and database safety
- This phase changes application authorization logic only; it does not execute database DDL or mutate production data.
- The new audit-log endpoint reads the existing gpm_cms_audit_log table and requires Admin.
- Build and automated test suite must pass before merging.
- Confirm current production Super Admin account remains active before release.
- No credentials, database URLs, or bootstrap tokens belong in Git.

## Known behavior / follow-up
- Editors cannot edit a book while it is marked public or in a publishable status because the incoming CMS form carries the public flag. Admin must perform publication approval. A later UI iteration should separate editorial metadata updates from publication approval fields.
- The current public Blob upload path remains unsuitable for confidential manuscripts and ISBN supporting documents. Private storage is a separate required security task before those files are uploaded.
