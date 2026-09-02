import { useEffect, useState } from 'react';
import { LockKeyhole, Send, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type FormState = { teamName: string; leaderName: string; leaderRollNo: string; className: string; section: string; githubLink: string; drivePptLink: string };
const initialForm: FormState = { teamName: '', leaderName: '', leaderRollNo: '', className: '', section: '', githubLink: '', drivePptLink: '' };

export default function SubmitPage() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    let active = true;
    supabase.from('system_settings').select('submissions_open').eq('id', true).maybeSingle().then(({ data }) => {
      if (active && data) setOpen(Boolean(data.submissions_open));
      if (active) setLoading(false);
    });
    const channel = supabase.channel('submission-settings').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'system_settings' }, (payload) => setOpen(Boolean(payload.new.submissions_open))).subscribe();
    return () => { active = false; void supabase.removeChannel(channel); };
  }, []);

  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const field = (label: string, key: keyof FormState, type = 'text') => <label className="flex flex-col gap-2 text-sm text-slate-300">{label}<input required type={type} value={form[key]} onChange={(event) => update(key, event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-orange-300" /></label>;
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage(''); if (!open) { setMessage('Submissions are currently locked.'); return; } setBusy(true);
    const { error } = await supabase.from('hackathon_submissions').insert({ team_name: form.teamName.trim(), leader_name: form.leaderName.trim(), leader_roll_no: form.leaderRollNo.trim(), class_name: form.className.trim(), section: form.section.trim(), github_link: form.githubLink.trim(), drive_ppt_link: form.drivePptLink.trim(), github_url: form.githubLink.trim(), presentation_url: form.drivePptLink.trim() });
    setBusy(false); setMessage(error ? 'Could not submit your project. Check the details and try again.' : 'Project submitted successfully.'); if (!error) setForm(initialForm);
  };

  return <main className="min-h-screen bg-[#070b13] px-5 py-12 text-slate-100 sm:px-8"><div className="mx-auto max-w-2xl"><header className="mb-8"><p className="font-mono text-xs uppercase tracking-[0.25em] text-orange-300">Hack Ascension 2026 / Deliverables</p><h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Submit Your Project</h1><p className="mt-3 text-slate-400">Share the final repository and presentation for your registered team.</p></header>{!loading && !open ? <section className="rounded-2xl border border-red-400/30 bg-red-400/10 p-8 text-center"><LockKeyhole className="mx-auto size-10 text-red-300" /><h2 className="mt-4 font-display text-2xl font-bold text-white">Submissions Locked</h2><p className="mt-2 text-sm text-red-100/75">Project submissions are currently closed by the organizers.</p></section> : <form onSubmit={submit} className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-8"><div className="grid gap-5 sm:grid-cols-2">{field('Team name', 'teamName')}{field('Team leader name', 'leaderName')}{field('Team leader roll / register number', 'leaderRollNo')}{field('Class', 'className')}{field('Section', 'section')}{field('GitHub repository URL', 'githubLink', 'url')}<div className="sm:col-span-2">{field('Google Drive presentation URL', 'drivePptLink', 'url')}</div></div><p className="flex items-start gap-2 text-xs leading-5 text-slate-400"><ExternalLink className="mt-0.5 size-4 shrink-0 text-orange-300" />Make sure your Google Drive link permission is set to &apos;Anyone with the link can view&apos;.</p>{message && <p role="status" className="text-sm text-orange-200">{message}</p>}<button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-display font-semibold text-white transition hover:bg-orange-400 hover:shadow-[0_0_24px_rgba(249,115,22,0.28)] disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Submitting…' : 'Submit Final Deliverables'}<Send className="size-4" /></button></form>}</div></main>;
}
