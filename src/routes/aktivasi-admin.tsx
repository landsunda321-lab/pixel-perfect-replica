import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/aktivasi-admin")({ component: ActivatePage });

function ActivatePage() {
  const [token,setToken]=useState(""); const [name,setName]=useState(""); const [email,setEmail]=useState("");
  const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [done,setDone]=useState(false); const [busy,setBusy]=useState(false);
  const navigate=useNavigate();
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const r=await fetch("/api/cms?action=setup",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({token,name,email,password})});
      const data=await r.json(); if(!r.ok) throw new Error(data.error||"Aktivasi gagal.");
      setDone(true);
    } catch(err) {setError(err instanceof Error?err.message:"Aktivasi gagal.");}
    finally {setBusy(false);}
  }
  return <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-14">
    <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">Pengaturan awal CMS</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-slate-900">Aktivasi Super Admin</h1>
      {done ? <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-emerald-900"><p className="font-bold">Super Admin berhasil dibuat.</p><p className="mt-1 text-sm">Hapus GPM_BOOTSTRAP_TOKEN dari Environment Variables Vercel, lalu lakukan redeploy.</p><button onClick={()=>navigate({to:"/login"})} className="mt-4 rounded-xl bg-[#17396c] px-5 py-3 font-bold text-white">Ke halaman login</button></div> :
      <><p className="mt-2 text-sm leading-relaxed text-slate-500">Halaman ini hanya dapat digunakan satu kali untuk membuat akun Super Admin pertama. Jangan bagikan token aktivasi kepada orang lain.</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">Token aktivasi<input required type="password" value={token} onChange={e=>setToken(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal"/></label>
        <label className="block text-sm font-semibold text-slate-700">Nama lengkap<input required value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal"/></label>
        <label className="block text-sm font-semibold text-slate-700">Email untuk login<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal"/></label>
        <label className="block text-sm font-semibold text-slate-700">Password (minimal 12 karakter)<input required minLength={12} type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal"/></label>
        {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-[#17396c] px-4 py-3 font-bold text-white disabled:opacity-60">{busy?"Membuat akun...":"Buat Super Admin"}</button>
      </form></>}
      <Link to="/" className="mt-6 block text-center text-sm text-blue-700 hover:underline">Kembali ke website</Link>
    </section>
  </main>;
}
