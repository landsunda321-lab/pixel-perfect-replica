import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const navigate=useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const r=await fetch("/api/cms?action=login",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email,password})});
      const data=await r.json();
      if(!r.ok) throw new Error(data.error||"Login gagal.");
      await navigate({to:"/admin"});
    } catch(err) { setError(err instanceof Error?err.message:"Login gagal."); }
    finally {setBusy(false);}
  }
  return <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-14">
    <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">Griya Pustaka Mandiri</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-slate-900">Masuk CMS</h1>
      <p className="mt-2 text-sm text-slate-500">Gunakan akun yang dibuat oleh Super Admin.</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">Email<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-600"/></label>
        <label className="block text-sm font-semibold text-slate-700">Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-600"/></label>
        {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-[#17396c] px-4 py-3 font-bold text-white disabled:opacity-60">{busy?"Memeriksa...":"Masuk"}</button>
      </form>
      <Link to="/" className="mt-6 block text-center text-sm text-blue-700 hover:underline">Kembali ke website</Link>
    </section>
  </main>;
}
