import postgres from "postgres";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const COOKIE = "gpm_cms_session";
const SESSION_DAYS = 7;
type Role = "admin" | "editor" | "author";
type User = { id: string; name: string; email: string; role: Role; is_super_admin: boolean };

let sqlClient: ReturnType<typeof postgres> | undefined;
function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL belum dikonfigurasi.");
  return (sqlClient ??= postgres(process.env.DATABASE_URL, { max: 5, idle_timeout: 20, connect_timeout: 10, prepare: false }));
}
function secret() {
  const value = process.env.GPM_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("GPM_SESSION_SECRET belum valid.");
  return value;
}
function tokenHash(token: string) { return createHmac("sha256", secret()).update(token).digest("hex"); }
function cookieValue(request: Request) {
  const raw = request.headers.get("cookie") || "";
  const part = raw.split(";").map(v => v.trim()).find(v => v.startsWith(COOKIE + "="));
  return part ? decodeURIComponent(part.slice(COOKIE.length + 1)) : "";
}
function setCookie(token: string, maxAge: number) {
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return Response.json(data, { status, headers });
}
async function readBody(request: Request) {
  try { return await request.json() as Record<string, unknown>; }
  catch { throw new Error("Format permintaan tidak valid."); }
}
function text(v: unknown, max = 5000) { return typeof v === "string" ? v.trim().slice(0, max) : ""; }
function slugify(value: string) {
  return value.normalize("NFKD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || "penulis";
}
async function uniqueAuthorSlug(name: string, excludeId = "") {
  const base = slugify(name);
  const rows = await db()`SELECT slug FROM public.gpm_cms_authors WHERE slug LIKE ${base + "%"} AND id::text <> ${excludeId}`;
  const used = new Set(rows.map((row: {slug:string|null}) => row.slug).filter(Boolean));
  if (!used.has(base)) return base;
  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix++;
  return `${base}-${suffix}`;
}
async function passwordHash(password: string) {
  if (password.length < 12) throw new Error("Password minimal 12 karakter.");
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64) as Buffer;
  return `scrypt:${salt.toString("hex")}:${key.toString("hex")}`;
}
async function verifyPassword(password: string, stored: string) {
  const [scheme, saltHex, keyHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
async function currentUser(request: Request): Promise<User | null> {
  const token = cookieValue(request);
  if (!token) return null;
  const rows = await db()`SELECT u.id,u.name,u.email,u.role,u.is_super_admin
    FROM public.gpm_cms_sessions s JOIN public.gpm_cms_users u ON u.id=s.user_id
    WHERE s.token_hash=${tokenHash(token)} AND s.expires_at > now() AND u.active=true LIMIT 1`;
  return (rows[0] as User | undefined) ?? null;
}
function requireRole(user: User | null, allowed: Role[]) {
  if (!user) throw Object.assign(new Error("Silakan login terlebih dahulu."), { status: 401 });
  if (!user.is_super_admin && !allowed.includes(user.role)) throw Object.assign(new Error("Anda tidak memiliki hak akses."), { status: 403 });
  return user;
}
async function audit(userId: string | null, action: string, entity: string, entityId = "", details = "") {
  await db()`INSERT INTO public.gpm_cms_audit_log(user_id,action,entity_type,entity_id,details)
    VALUES (${userId},${action},${entity},${entityId},${details})`;
}
export async function handleCmsRequest(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "";
  try {
    // Reject cross-origin state-changing requests; SameSite cookies are an additional layer.
    if (["POST", "PATCH", "DELETE"].includes(request.method)) {
      const origin = request.headers.get("origin");
      if (origin) {
        let originHost = "";
        try { originHost = new URL(origin).host; } catch { return json({ok:false,error:"Origin permintaan tidak valid."},403); }
        const expectedHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || new URL(request.url).host;
        if (originHost !== expectedHost) return json({ok:false,error:"Permintaan lintas situs ditolak."},403);
      }
    }
    if (request.method === "GET" && action === "public-books") {
      const rows = await db()`SELECT id,title,author,category,synopsis,cover_url,isbn,qrcbn,publication_status,is_demo,publication_year,publisher,page_count,book_size,book_format,language,print_available,print_price,digital_available,digital_access_type,digital_price,open_access,order_url,digital_access_url
        FROM public.gpm_cms_books WHERE show_public=true AND publication_status <> 'arsip' ORDER BY created_at DESC`;
      return json({ ok: true, items: rows });
    }
    if (request.method === "GET" && action === "public-book") {
      const id = text(url.searchParams.get("id"), 80);
      if (!id) return json({ok:false,error:"Buku tidak ditemukan."},404);
      const rows = await db()`SELECT id,title,author,category,synopsis,abstract,keywords,kata_pengantar,latar_belakang,glosarium,daftar_pustaka,cover_url,isbn,qrcbn,publication_status,
        publisher,publication_city,publication_year,publication_date,edition,page_count,book_size,book_format,language,pdf_url,allow_pdf_download,print_available,print_price,digital_available,digital_access_type,digital_price,open_access,order_url,digital_access_url
        FROM public.gpm_cms_books WHERE id::text=${id} AND show_public=true AND publication_status <> 'arsip' LIMIT 1`;
      return rows.length ? json({ok:true,item:rows[0]}) : json({ok:false,error:"Buku tidak ditemukan."},404);
    }
    if (request.method === "GET" && action === "public-authors") {
      const rows = await db()`SELECT id,slug,name,biography,expertise,photo_url,is_demo FROM public.gpm_cms_authors WHERE show_public=true AND is_demo=false ORDER BY name`;
      return json({ ok: true, items: rows });
    }
    if (request.method === "GET" && action === "public-author") {
      const slug = text(url.searchParams.get("slug"), 120);
      if (!slug) return json({ok:false,error:"Profil penulis tidak ditemukan."},404);
      const rows = await db()`SELECT id,slug,name,biography,expertise,photo_url FROM public.gpm_cms_authors WHERE slug=${slug} AND show_public=true AND is_demo=false LIMIT 1`;
      return rows.length ? json({ok:true,item:rows[0]}) : json({ok:false,error:"Profil penulis tidak ditemukan."},404);
    }
    if (request.method === "POST" && action === "setup") {
      const body = await readBody(request);
      const bootstrap = process.env.GPM_BOOTSTRAP_TOKEN || "";
      const supplied = text(body.token, 500);
      if (!bootstrap || !supplied || supplied.length !== bootstrap.length ||
          !timingSafeEqual(Buffer.from(supplied), Buffer.from(bootstrap))) return json({ ok:false,error:"Token aktivasi tidak valid." }, 403);
      const count = await db()`SELECT count(*)::int AS count FROM public.gpm_cms_users WHERE is_super_admin=true`;
      if (Number(count[0]?.count || 0) > 0) return json({ ok:false,error:"Super Admin sudah dibuat. Aktivasi pertama telah ditutup." }, 409);
      const name=text(body.name,120), email=text(body.email,255).toLowerCase(), password=text(body.password,200);
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) return json({ok:false,error:"Nama dan email yang valid wajib diisi."},400);
      const hash=await passwordHash(password);
      const rows=await db()`INSERT INTO public.gpm_cms_users(name,email,password_hash,role,is_super_admin)
        VALUES (${name},${email},${hash},'admin',true) RETURNING id`;
      await audit(String(rows[0].id),"bootstrap_super_admin","user",String(rows[0].id),"Super Admin pertama dibuat");
      return json({ok:true,message:"Super Admin berhasil dibuat. Silakan login."});
    }
    if (request.method === "POST" && action === "login") {
      const body=await readBody(request), email=text(body.email,255).toLowerCase(), password=text(body.password,200);
      const rows=await db()`SELECT id,name,email,role,is_super_admin,password_hash FROM public.gpm_cms_users WHERE email=${email} AND active=true LIMIT 1`;
      const user=rows[0];
      if (!user || !(await verifyPassword(password,String(user.password_hash)))) return json({ok:false,error:"Email atau password salah."},401);
      const token=randomBytes(32).toString("base64url"), hash=tokenHash(token);
      await db()`INSERT INTO public.gpm_cms_sessions(user_id,token_hash,expires_at) VALUES (${user.id},${hash},now()+interval '7 days')`;
      await audit(String(user.id),"login","session");
      return json({ok:true,user:{id:user.id,name:user.name,email:user.email,role:user.role,is_super_admin:user.is_super_admin}},
        200,{"Set-Cookie":setCookie(token,SESSION_DAYS*86400)});
    }
    if (request.method === "POST" && action === "logout") {
      const token=cookieValue(request);
      if (token) await db()`DELETE FROM public.gpm_cms_sessions WHERE token_hash=${tokenHash(token)}`;
      return json({ok:true},200,{"Set-Cookie":setCookie("",0)});
    }
    const user=await currentUser(request);
    if (request.method === "GET" && action === "me") return user ? json({ok:true,user}) : json({ok:false},401);

    if (request.method === "GET" && action === "users") {
      requireRole(user,["admin"]);
      const rows=await db()`SELECT id,name,email,role,active,is_super_admin,created_at FROM public.gpm_cms_users ORDER BY created_at DESC`;
      return json({ok:true,items:rows});
    }
    if (request.method === "POST" && action === "users") {
      requireRole(user,["admin"]);
      const body=await readBody(request), name=text(body.name,120), email=text(body.email,255).toLowerCase();
      const role=text(body.role,20) as Role, password=text(body.password,200);
      if (!name || !/^\S+@\S+\.\S+$/.test(email) || !["admin","editor","author"].includes(role)) return json({ok:false,error:"Data akun tidak valid."},400);
      const hash=await passwordHash(password);
      const rows=await db()`INSERT INTO public.gpm_cms_users(name,email,password_hash,role) VALUES (${name},${email},${hash},${role})
        RETURNING id,name,email,role,active,is_super_admin,created_at`;
      await audit(user!.id,"create_user","user",String(rows[0].id),role);
      return json({ok:true,item:rows[0]},201);
    }
    if (request.method === "PATCH" && action === "users") {
      requireRole(user,["admin"]);
      const body=await readBody(request), id=text(body.id,80), active=body.active===true;
      if (!id || id===user!.id) return json({ok:false,error:"Akun ini tidak dapat dinonaktifkan."},400);
      const rows=await db()`UPDATE public.gpm_cms_users SET active=${active},updated_at=now()
        WHERE id=${id} AND is_super_admin=false RETURNING id,active`;
      if (!rows.length) return json({ok:false,error:"Akun tidak ditemukan atau merupakan Super Admin."},404);
      await audit(user!.id,"change_user_status","user",id,String(active));
      return json({ok:true,item:rows[0]});
    }
    if (request.method === "GET" && action === "books") {
      requireRole(user,["admin","editor"]);
      const rows=await db()`SELECT * FROM public.gpm_cms_books ORDER BY updated_at DESC`;
      return json({ok:true,items:rows});
    }
    if (request.method === "POST" && action === "books") {
      requireRole(user,["admin","editor"]);
      const b=await readBody(request), title=text(b.title,300), author=text(b.author,200);
      if (!title || !author) return json({ok:false,error:"Judul dan penulis wajib diisi."},400);
      const canPublish = user!.is_super_admin || user!.role === "admin";
      const status = canPublish ? (text(b.publication_status,30) || "persiapan") : "persiapan";
      const showPublic = canPublish && b.show_public === true;
      const rows=await db()`INSERT INTO public.gpm_cms_books
        (title,subtitle,author,category,synopsis,cover_url,isbn,qrcbn,publication_status,is_demo,show_public,created_by,
         publisher,publication_city,publication_year,publication_date,edition,abstract,keywords,kata_pengantar,latar_belakang,glosarium,daftar_pustaka,page_count,book_size,book_format,language,pdf_url,allow_pdf_download,print_available,print_price,digital_available,digital_access_type,digital_price,open_access,order_url,digital_access_url)
        VALUES (${title},'',${author},${text(b.category,120)||"Umum"},${text(b.synopsis,10000)},${text(b.cover_url,2000)},${text(b.isbn,30)},${text(b.qrcbn,60)},${status},${b.is_demo===true},${showPublic},${user!.id},
         ${text(b.publisher,200)||"Griya Pustaka Mandiri"},${text(b.publication_city,120)||null},${Number.isInteger(Number(b.publication_year))&&Number(b.publication_year)>0?Number(b.publication_year):null},${text(b.publication_date,10)||null},${text(b.edition,100)},${text(b.abstract,20000)},${text(b.keywords,2000)},${text(b.kata_pengantar,20000)},${text(b.latar_belakang,20000)},${text(b.glosarium,20000)},${text(b.daftar_pustaka,30000)},${Number.isInteger(Number(b.page_count))&&Number(b.page_count)>0?Number(b.page_count):null},${text(b.book_size,80)},${text(b.book_format,40)},${text(b.language,80)},${text(b.pdf_url,2000)},${b.allow_pdf_download===true},${b.print_available===true},${Number.isInteger(Number(b.print_price))&&Number(b.print_price)>=0?Number(b.print_price):null},${b.digital_available===true},${["paid","free","none"].includes(text(b.digital_access_type,10))?text(b.digital_access_type,10):"none"},${Number.isInteger(Number(b.digital_price))&&Number(b.digital_price)>=0?Number(b.digital_price):null},${b.open_access===true},${text(b.order_url,2000)||null},${text(b.digital_access_url,2000)||null}) RETURNING *`;
      await audit(user!.id,"create_book","book",String(rows[0].id),title);
      return json({ok:true,item:rows[0]},201);
    }
    if (request.method === "PATCH" && action === "books") {
      requireRole(user,["admin","editor"]);
      const b=await readBody(request), id=text(b.id,80), title=text(b.title,300), author=text(b.author,200);
      if (!id || !title || !author) return json({ok:false,error:"Data buku tidak lengkap."},400);
      const canPublish = user!.is_super_admin || user!.role === "admin";
      const requestedStatus = text(b.publication_status,30) || "persiapan";
      const rows=await db()`UPDATE public.gpm_cms_books SET title=${title},subtitle='',author=${author},
        category=${text(b.category,120)||"Umum"},synopsis=${text(b.synopsis,10000)},cover_url=${text(b.cover_url,2000)},
        isbn=${text(b.isbn,30)},qrcbn=${text(b.qrcbn,60)},publication_status=CASE WHEN ${canPublish} THEN ${requestedStatus} ELSE publication_status END,is_demo=${b.is_demo===true},
        show_public=CASE WHEN ${canPublish} THEN ${b.show_public===true} ELSE show_public END,publisher=${text(b.publisher,200)||"Griya Pustaka Mandiri"},publication_city=${text(b.publication_city,120)||null},
        publication_year=${Number.isInteger(Number(b.publication_year))&&Number(b.publication_year)>0?Number(b.publication_year):null},
        publication_date=${text(b.publication_date,10)||null},edition=${text(b.edition,100)},abstract=${text(b.abstract,20000)},
        keywords=${text(b.keywords,2000)},kata_pengantar=${text(b.kata_pengantar,20000)},latar_belakang=${text(b.latar_belakang,20000)},glosarium=${text(b.glosarium,20000)},daftar_pustaka=${text(b.daftar_pustaka,30000)},
        page_count=${Number.isInteger(Number(b.page_count))&&Number(b.page_count)>0?Number(b.page_count):null},
        book_size=${text(b.book_size,80)},book_format=${text(b.book_format,40)},language=${text(b.language,80)},
        pdf_url=${text(b.pdf_url,2000)},allow_pdf_download=${b.allow_pdf_download===true},
        print_available=${b.print_available===true},print_price=${Number.isInteger(Number(b.print_price))&&Number(b.print_price)>=0?Number(b.print_price):null},digital_available=${b.digital_available===true},digital_access_type=${["paid","free","none"].includes(text(b.digital_access_type,10))?text(b.digital_access_type,10):"none"},digital_price=${Number.isInteger(Number(b.digital_price))&&Number(b.digital_price)>=0?Number(b.digital_price):null},open_access=${b.open_access===true},order_url=${text(b.order_url,2000)||null},digital_access_url=${text(b.digital_access_url,2000)||null},
        updated_at=now() WHERE id=${id} RETURNING *`;
      if (!rows.length) return json({ok:false,error:"Buku tidak ditemukan."},404);
      await audit(user!.id,"update_book","book",id,title);
      return json({ok:true,item:rows[0]});
    }
    if (request.method === "DELETE" && action === "books") {
      requireRole(user,["admin"]);
      const id=url.searchParams.get("id")||"";
      const rows=await db()`UPDATE public.gpm_cms_books SET publication_status='arsip',show_public=false,updated_at=now() WHERE id=${id} RETURNING id`;
      if (!rows.length) return json({ok:false,error:"Buku tidak ditemukan."},404);
      await audit(user!.id,"archive_book","book",id,"Buku diarsipkan; data dipertahankan");
      return json({ok:true});
    }
    if (request.method === "GET" && action === "authors") {
      requireRole(user,["admin","editor"]);
      const rows=await db()`SELECT * FROM public.gpm_cms_authors ORDER BY updated_at DESC`;
      return json({ok:true,items:rows});
    }
    if (request.method === "POST" && action === "authors") {
      requireRole(user,["admin","editor"]);
      const b=await readBody(request), name=text(b.name,200);
      if (!name) return json({ok:false,error:"Nama penulis wajib diisi."},400);
      const slug = await uniqueAuthorSlug(name);
      const rows=await db()`INSERT INTO public.gpm_cms_authors(slug,name,biography,expertise,photo_url,is_demo,show_public,created_by)
        VALUES (${slug},${name},${text(b.biography,10000)},${text(b.expertise,500)},${text(b.photo_url,2000)},${b.is_demo===true},${b.show_public===true},${user!.id}) RETURNING *`;
      await audit(user!.id,"create_author","author",String(rows[0].id),name);
      return json({ok:true,item:rows[0]},201);
    }
    if (request.method === "PATCH" && action === "authors") {
      requireRole(user,["admin","editor"]);
      const b=await readBody(request), id=text(b.id,80), name=text(b.name,200);
      if (!id || !name) return json({ok:false,error:"Data penulis tidak lengkap."},400);
      const slug = await uniqueAuthorSlug(name, id);
      const rows=await db()`UPDATE public.gpm_cms_authors SET slug=${slug},name=${name},biography=${text(b.biography,10000)},
        expertise=${text(b.expertise,500)},photo_url=${text(b.photo_url,2000)},is_demo=${b.is_demo===true},
        show_public=${b.show_public===true},updated_at=now() WHERE id=${id} RETURNING *`;
      if (!rows.length) return json({ok:false,error:"Penulis tidak ditemukan."},404);
      await audit(user!.id,"update_author","author",id,name);
      return json({ok:true,item:rows[0]});
    }
    if (request.method === "DELETE" && action === "authors") {
      requireRole(user,["admin","editor"]);
      const id=url.searchParams.get("id")||"";
      await db()`DELETE FROM public.gpm_cms_authors WHERE id=${id}`;
      await audit(user!.id,"delete_author","author",id);
      return json({ok:true});
    }
    if (request.method === "GET" && action === "manuscripts") {
      requireRole(user,["author","admin","editor"]);
      const rows=user!.role==="author" && !user!.is_super_admin
        ? await db()`SELECT * FROM public.gpm_cms_manuscripts WHERE author_id=${user!.id} ORDER BY updated_at DESC`
        : await db()`SELECT m.*,u.name AS author_name,u.email AS author_email FROM public.gpm_cms_manuscripts m JOIN public.gpm_cms_users u ON u.id=m.author_id ORDER BY m.updated_at DESC`;
      return json({ok:true,items:rows});
    }
    if (request.method === "POST" && action === "manuscripts") {
      requireRole(user,["author"]);
      const b=await readBody(request), title=text(b.title,300);
      if (!title) return json({ok:false,error:"Judul naskah wajib diisi."},400);
      const rows=await db()`INSERT INTO public.gpm_cms_manuscripts(author_id,title,synopsis,manuscript_url,status)
        VALUES (${user!.id},${title},${text(b.synopsis,10000)},${text(b.manuscript_url,2000)},'draft') RETURNING *`;
      await audit(user!.id,"create_manuscript","manuscript",String(rows[0].id),title);
      return json({ok:true,item:rows[0]},201);
    }
    if (request.method === "PATCH" && action === "manuscripts") {
      requireRole(user,["author","admin","editor"]);
      const b=await readBody(request), id=text(b.id,80);
      if (user!.role==="author" && !user!.is_super_admin) {
        const rows=await db()`UPDATE public.gpm_cms_manuscripts SET title=${text(b.title,300)},synopsis=${text(b.synopsis,10000)},
          manuscript_url=${text(b.manuscript_url,2000)},status='submitted',updated_at=now()
          WHERE id=${id} AND author_id=${user!.id} AND status IN ('draft','revision') RETURNING *`;
        if (!rows.length) return json({ok:false,error:"Naskah tidak ditemukan atau tidak dapat dikirim."},404);
        await audit(user!.id,"submit_manuscript","manuscript",id);
        return json({ok:true,item:rows[0]});
      }
      const status=text(b.status,30);
      if (!["revision","accepted","rejected"].includes(status)) return json({ok:false,error:"Status review tidak valid."},400);
      const rows=await db()`UPDATE public.gpm_cms_manuscripts SET status=${status},editor_notes=${text(b.editor_notes,5000)},updated_at=now() WHERE id=${id} RETURNING *`;
      if (!rows.length) return json({ok:false,error:"Naskah tidak ditemukan."},404);
      await audit(user!.id,"review_manuscript","manuscript",id,status);
      return json({ok:true,item:rows[0]});
    }
    return json({ok:false,error:"Endpoint tidak ditemukan."},404);
  } catch (error) {
    const status=Number((error as {status?:number})?.status)||400;
    const message=error instanceof Error ? error.message : "Terjadi kesalahan.";
    if (status>=500) console.error("[GPM CMS]",message);
    return json({ok:false,error:message},status);
  }
}


const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PDF_MIME_TYPES = ["application/pdf"];
const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export async function handleCmsImageUpload(request: Request) {
  try {
    if (request.method !== "POST") return json({ok:false,error:"Metode tidak diizinkan."},405);
    if (!process.env.BLOB_READ_WRITE_TOKEN) return json({ok:false,error:"Penyimpanan gambar belum terhubung. Periksa konfigurasi Blob."},503);
    const body = await request.json() as HandleUploadBody;
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const user = await currentUser(request);
        requireRole(user, ["admin", "editor"]);
        let payload: {kind?:string} = {};
        try { payload = JSON.parse(clientPayload || "{}"); } catch { throw new Error("Jenis unggahan tidak valid."); }
        const kind = payload.kind;
        if (kind !== "cover" && kind !== "author" && kind !== "book-pdf") throw new Error("Jenis berkas tidak diizinkan.");
        const prefix = kind === "cover" ? "gpm/covers/" : kind === "author" ? "gpm/authors/" : "gpm/books/";
        if (!pathname.startsWith(prefix)) throw new Error("Lokasi penyimpanan tidak valid.");
        return {
          allowedContentTypes: kind === "book-pdf" ? PDF_MIME_TYPES : IMAGE_MIME_TYPES,
          maximumSizeInBytes: kind === "book-pdf" ? 50 * 1024 * 1024 : IMAGE_MAX_BYTES,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 30,
          tokenPayload: JSON.stringify({ userId: user!.id, kind }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        if (!blob.url || !tokenPayload) throw new Error("Konfirmasi unggahan gambar tidak valid.");
      },
    });
    return json(response);
  } catch (error) {
    const status = Number((error as {status?:number})?.status) || 400;
    return json({ok:false,error:error instanceof Error ? error.message : "Unggahan gambar gagal."},status);
  }
}
