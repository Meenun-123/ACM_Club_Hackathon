import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Member = { fullName: string; rollNo: string; department: string; email: string };
const emptyMember = (): Member => ({ fullName: '', rollNo: '', department: '', email: '' });
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [leader, setLeader] = useState({ fullName: '', email: '', phone: '', rollNo: '', department: '' });
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const updateLeader = (key: keyof typeof leader, value: string) => setLeader((current) => ({ ...current, [key]: value }));
  const updateMember = (index: number, key: keyof Member, value: string) => setMembers((current) => current.map((member, i) => i === index ? { ...member, [key]: value } : member));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    if (!teamName.trim() || Object.values(leader).some((value) => !value.trim()) || members.some((member) => !member.fullName.trim() || !member.rollNo.trim() || !member.department.trim() || !emailRe.test(member.email))) { setError('Please complete all required team and member fields with valid emails.'); return; }
    if (!emailRe.test(leader.email)) { setError('Please enter a valid team leader email.'); return; }
    setBusy(true);
    const { data, error: insertError } = await supabase.from('hackathon_registrations').insert({ team_name: teamName.trim(), leader_name: leader.fullName.trim(), leader_email: leader.email.trim().toLowerCase(), leader_phone: leader.phone.trim(), leader_roll_no: leader.rollNo.trim(), leader_class_department: leader.department.trim(), team_members: members }).select('id').single();
    setBusy(false);
    if (insertError) { setError('Unable to submit registration. Please try again.'); return; }
    navigate('/register/success', { state: { registrationId: data?.id, teamName } });
  };
  const field = (label: string, value: string, onChange: (value: string) => void, type = 'text', required = true) => <label className="flex flex-col gap-2 text-sm text-slate-300">{label}{required && <span className="sr-only"> required</span>}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-orange-300" /></label>;
  return <form onSubmit={submit} className="space-y-6" noValidate><section className="glass rounded-2xl p-5 sm:p-7"><h2 className="font-display text-2xl font-bold text-white">Team information</h2><div className="mt-5">{field('Team name', teamName, setTeamName)}</div></section><section className="glass rounded-2xl p-5 sm:p-7"><h2 className="font-display text-2xl font-bold text-white">Team leader</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{field('Full name', leader.fullName, (v) => updateLeader('fullName', v))}{field('Email address', leader.email, (v) => updateLeader('email', v), 'email')}{field('Phone number', leader.phone, (v) => updateLeader('phone', v), 'tel')}{field('Roll / register number', leader.rollNo, (v) => updateLeader('rollNo', v))}<div className="sm:col-span-2">{field('Class / department & year', leader.department, (v) => updateLeader('department', v))}</div></div></section><section className="glass rounded-2xl p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><h2 className="font-display text-2xl font-bold text-white">Team members</h2><p className="mt-1 text-sm text-slate-400">Add up to three additional members.</p></div>{members.length < 3 && <button type="button" onClick={() => setMembers([...members, emptyMember()])} className="inline-flex items-center gap-2 rounded-lg border border-orange-300/40 px-3 py-2 text-sm font-semibold text-orange-200"><Plus className="size-4" /> Add member</button>}</div><div className="mt-5 space-y-5">{members.map((member, index) => <div key={index} className="rounded-xl border border-slate-700 p-4"><div className="mb-4 flex items-center justify-between"><span className="font-mono text-xs uppercase tracking-widest text-orange-300">Member {index + 1}</span><button type="button" onClick={() => setMembers(members.filter((_, i) => i !== index))} className="inline-flex items-center gap-1 text-xs text-red-300"><Trash2 className="size-4" /> Remove</button></div><div className="grid gap-4 sm:grid-cols-2">{field('Full name', member.fullName, (v) => updateMember(index, 'fullName', v))}{field('Email', member.email, (v) => updateMember(index, 'email', v), 'email')}{field('Roll / register number', member.rollNo, (v) => updateMember(index, 'rollNo', v))}{field('Class / department', member.department, (v) => updateMember(index, 'department', v))}</div></div>)}</div></section>{error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}<button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-4 font-display text-lg font-bold text-white transition hover:bg-orange-400 disabled:opacity-50">{busy ? 'Submitting…' : 'Complete registration'} {!busy && <ArrowRight className="size-5" />}</button></form>;
}
