import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
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
      console.log('[v0] Admin allowlist lookup failed:', allowlistError.message);
      await supabase.auth.signOut();
      setError('Could not verify admin access. Please try again.');
      setBusy(false);
      return;
    }

    if (!adminRow) {
      console.log('[v0] Authenticated user is not allowlisted:', authData.user.id);
      await supabase.auth.signOut();
      setError('Access denied: Account not allowlisted.');
      setBusy(false);
      return;
    }

    navigate('/admin/dashboard');
  }
  return <main className="flex min-h-screen bg-[#070b13] text-slate-100"><aside className="hidden w-72 shrink-0 flex-col justify-between border-r border-slate-800/80 bg-[#0b101a] p-8 md:flex"><div><Link to="/" className="flex items-start text-white"><span className="font-display text-base font-bold leading-6 tracking-tight">Amrita Vishwa Vidyapeetham<br /><span className="text-xs font-medium text-orange-300">Nagercoil Campus</span></span></Link><div className="mt-16"><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-orange-300">Operations / Content desk</p><h2 className="mt-3 font-display text-3xl font-bold">Chapter overview</h2><p className="mt-4 text-sm leading-6 text-slate-500">Sign in to manage events, resources, and the public chapter portal.</p></div></div><Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white"><ArrowLeft className="size-4" /> Public portal</Link></aside><div className="flex min-w-0 flex-1 items-center justify-center px-5 py-10 sm:px-8"><div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8"><Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white md:hidden"><ArrowLeft className="size-4" /> Back to portal</Link><LockKeyhole className="mb-5 size-9 text-orange-300" /><p className="font-mono text-xs uppercase tracking-[0.25em] text-orange-300">Private workspace</p><h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Admin sign in</h1><p className="mt-3 text-sm leading-6 text-slate-400">Use your existing Supabase account. Admin access is granted separately through the allowlist.</p><form onSubmit={submit} className="mt-8 flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm text-slate-300">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-300" /></label><label className="flex flex-col gap-2 text-sm text-slate-300">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-300" /></label>{error && <p role="alert" className="text-sm text-red-300">{error}</p>}<button disabled={busy} className="rounded-xl bg-orange-300 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50">{busy ? 'Checking…' : 'Enter dashboard'}</button></form></div></div></main>;
}
