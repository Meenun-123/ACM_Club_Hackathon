import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [drawerOpen, setDrawerOpen] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password;
    setBusy(true);
    setError('');

    if (!normalizedEmail || !normalizedPassword) {
      setError('Enter your email and password.');
      setBusy(false);
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: normalizedPassword,
    });

    if (authError || !authData.user) {
      console.log('[v0] Supabase sign-in failed:', authError?.message ?? 'No user returned');
      setError('Invalid email or password. Check that the Auth user exists and is confirmed.');
      setBusy(false);
      return;
    }

    console.log('[v0] Supabase sign-in succeeded:', authData.user.id);
    const { data: adminRow, error: allowlistError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (allowlistError) {
      console.log('Admin allowlist lookup failed:', allowlistError.message);
      await supabase.auth.signOut();
      setError('Could not verify admin access. Please try again.');
      setBusy(false);
      return;
    }

    if (!adminRow) {
      console.log('Authenticated user is not allowlisted:', authData.user.id);
      await supabase.auth.signOut();
      setError('Access denied: Account not allowlisted.');
      setBusy(false);
      return;
    }

    navigate('/admin/dashboard');
  }
  const sidebar = <><div><Link to="/" className="drawer-branding flex items-center gap-3 text-white" onClick={() => setDrawerOpen(false)}><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-display font-extrabold text-sm border border-blue-400/30">ACM</div><div className="leading-tight"><div className="font-display text-sm font-bold tracking-tight">ACM Student Chapter</div><div className="text-[10px] uppercase tracking-wider text-orange-300">Amrita Nagercoil · Admin</div></div></Link><div className="mt-16 drawer-overview"><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-orange-300">Operations / Content desk</p><h2 className="mt-3 font-display text-3xl font-bold">Chapter overview</h2><p className="mt-4 text-sm leading-6 text-slate-500">Sign in to manage events, resources, registrations, and project submissions.</p></div></div><Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white" onClick={() => setDrawerOpen(false)}><ArrowLeft className="size-4" /> Public portal</Link></>;
  return <main className="relative flex min-h-screen bg-[#070b13] text-slate-100"><button type="button" aria-label="Open admin navigation" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)} className="absolute left-4 top-4 z-20 inline-flex size-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 text-slate-200 shadow-lg md:hidden"><Menu className="size-5" /></button><aside className="hidden w-72 shrink-0 flex-col justify-between border-r border-slate-800/80 bg-[#0b101a] p-8 md:flex"><div><Link to="/" className="flex items-center gap-3 text-white"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-display font-extrabold text-sm border border-blue-400/30">ACM</div><div className="leading-tight"><div className="font-display text-sm font-bold tracking-tight">ACM Student Chapter</div><div className="text-[10px] uppercase tracking-wider text-orange-300">Amrita Nagercoil · Admin</div></div></Link><div className="mt-16"><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-orange-300">Operations / Content desk</p><h2 className="mt-3 font-display text-3xl font-bold">Chapter overview</h2><p className="mt-4 text-sm leading-6 text-slate-500">Sign in to manage events, resources, registrations, and project submissions.</p></div></div><Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white"><ArrowLeft className="size-4" /> Public portal</Link></aside>{drawerOpen && <><button type="button" aria-label="Close admin navigation" className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setDrawerOpen(false)} /><aside className="mobile-admin-drawer fixed inset-y-0 left-0 z-40 flex w-[min(18rem,86vw)] flex-col justify-between border-r border-slate-800 bg-[#0b101a] p-7 shadow-2xl transition-transform md:hidden"><button type="button" aria-label="Close navigation" onClick={() => setDrawerOpen(false)} className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X className="size-5" /></button>{sidebar}</aside></>}<div className="flex min-w-0 flex-1 items-center justify-center px-5 py-10 sm:px-8"><div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8"><Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white md:hidden"><ArrowLeft className="size-4" /> Back to portal</Link><LockKeyhole className="mb-5 size-9 text-orange-300" /><p className="font-mono text-xs uppercase tracking-[0.25em] text-orange-300">Private workspace</p><h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Admin sign in</h1><p className="mt-3 text-sm leading-6 text-slate-400">Use your existing Supabase account. Admin access is granted separately through the allowlist.</p><form onSubmit={submit} className="mt-8 flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm text-slate-300">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-300" /></label><label className="flex flex-col gap-2 text-sm text-slate-300">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-300" /></label>{error && <p role="alert" className="text-sm text-red-300">{error}</p>}<button disabled={busy} className="rounded-xl bg-orange-300 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50">{busy ? 'Checking…' : 'Enter dashboard'}</button></form></div></div></main>;
}
