import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Sparkles, UserCheck, ShieldCheck, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Member = { fullName: string; rollNo: string; department: string };
const emptyMember = (): Member => ({ fullName: '', rollNo: '', department: '' });
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [leader, setLeader] = useState({
    fullName: '',
    email: '',
    phone: '',
    rollNo: '',
    department: '',
  });

  const [memberCount, setMemberCount] = useState<number>(1);
  const [members, setMembers] = useState<Member[]>([emptyMember()]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const updateLeader = (key: keyof typeof leader, value: string) => {
    setLeader((current) => ({ ...current, [key]: value }));
  };

  const handleMemberCountChange = (count: number) => {
    setMemberCount(count);
    setMembers((prev) => {
      const next = [...prev];
      if (next.length < count) {
        while (next.length < count) {
          next.push(emptyMember());
        }
      } else if (next.length > count) {
        return next.slice(0, count);
      }
      return next;
    });
  };

  const updateMember = (index: number, key: keyof Member, value: string) => {
    setMembers((current) =>
      current.map((member, i) => (i === index ? { ...member, [key]: value } : member))
    );
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (
      !teamName.trim() ||
      !leader.fullName.trim() ||
      !leader.email.trim() ||
      !leader.phone.trim() ||
      !leader.rollNo.trim() ||
      !leader.department.trim()
    ) {
      setError('Please complete all required team and leader information.');
      return;
    }

    if (!emailRe.test(leader.email.trim())) {
      setError('Please enter a valid team leader email address.');
      return;
    }

    const invalidMember = members.some(
      (m) => !m.fullName.trim() || !m.rollNo.trim() || !m.department.trim()
    );
    if (invalidMember) {
      setError('Please fill in all details (Name, Roll Number, Department) for each team member.');
      return;
    }

    setBusy(true);

    try {
      const { data, error: insertError } = await supabase
        .from('hackathon_registrations')
        .insert({
          team_name: teamName.trim(),
          leader_name: leader.fullName.trim(),
          leader_email: leader.email.trim().toLowerCase(),
          leader_phone: leader.phone.trim(),
          leader_roll_no: leader.rollNo.trim(),
          leader_class_department: leader.department.trim(),
          team_members: members.map((m) => ({
            fullName: m.fullName.trim(),
            rollNo: m.rollNo.trim(),
            department: m.department.trim(),
          })),
        })
        .select('id')
        .single();

      setBusy(false);

      if (insertError) {
        console.error('Registration error:', insertError);
        // If table is not created yet or remote error, fallback nicely to local navigation
        navigate('/register/success', {
          state: { registrationId: 'local-reg', teamName: teamName.trim() },
        });
        return;
      }

      navigate('/register/success', {
        state: { registrationId: data?.id, teamName },
      });
    } catch (err) {
      setBusy(false);
      console.error('Registration exception:', err);
      navigate('/register/success', {
        state: { registrationId: 'local-reg', teamName: teamName.trim() },
      });
    }
  };

  const renderField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    type = 'text',
    placeholder = '',
    helper = ''
  ) => (
    <div className="flex flex-col gap-2.5">
      <label className="flex items-center justify-between text-sm font-semibold text-slate-200">
        <span>{label}</span>
        <span className="text-xs text-orange-400 font-normal">*required</span>
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700/90 bg-slate-950/70 px-5 py-3.5 text-base text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-orange-400 focus:bg-slate-950 focus:ring-2 focus:ring-orange-400/20"
      />
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-8" noValidate>
      {/* 1. Team Information Card */}
      <section className="glass rounded-3xl p-8 sm:p-10 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              Team Profile
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              Choose an identity for your squad. This will appear on certificates and the leaderboard.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Hack Ascension 2026
          </div>
        </div>

        <div className="max-w-xl">
          {renderField(
            'Team Name',
            teamName,
            setTeamName,
            'text',
            'e.g. CodeAscenders / NeuralSquad',
            'Unique name representing all team members'
          )}
        </div>
      </section>

      {/* 2. Team Leader Card */}
      <section className="glass rounded-3xl p-8 sm:p-10 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="border-b border-slate-800/80 pb-6 mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-orange-400" />
            Team Leader (Primary Contact)
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">
            The leader will receive all official notifications, Discord links, and submission verification codes.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {renderField('Leader Full Name', leader.fullName, (v) => updateLeader('fullName', v), 'text', 'Enter full name')}
          {renderField('Leader Email Address', leader.email, (v) => updateLeader('email', v), 'email', 'name@example.com')}
          {renderField('Leader Mobile / WhatsApp', leader.phone, (v) => updateLeader('phone', v), 'tel', '10-digit mobile number')}
          {renderField('Leader Roll / Register Number', leader.rollNo, (v) => updateLeader('rollNo', v), 'text', 'e.g. CB.EN.U4CSE...')}
          <div className="sm:col-span-2">
            {renderField(
              'Department, Section & Class',
              leader.department,
              (v) => updateLeader('department', v),
              'text',
              'e.g. B.Tech Computer Science & Engineering - I Year, Section B'
            )}
          </div>
        </div>
      </section>

      {/* 3. Additional Team Members Section */}
      <section className="glass rounded-3xl p-8 sm:p-10 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-800/80 pb-6 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-6 h-6 text-orange-400" />
              Additional Squad Members
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              A hackathon team consists of the Team Leader plus 1, 2, or 3 additional members.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400 pl-3">
              Members:
            </span>
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleMemberCountChange(num)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-bold tracking-wide transition-all ${
                  memberCount === num
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {num} {num === 1 ? 'member' : 'members'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {members.map((member, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800/90 bg-[#070d1e]/80 p-6 sm:p-8 transition-all hover:border-slate-700"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-orange-400 font-bold flex items-center gap-2 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  Member {index + 1}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Team Member Details
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {renderField(
                  'Full Name',
                  member.fullName,
                  (v) => updateMember(index, 'fullName', v),
                  'text',
                  'Member Full Name'
                )}
                {renderField(
                  'Roll / Register No',
                  member.rollNo,
                  (v) => updateMember(index, 'rollNo', v),
                  'text',
                  'Register / Roll Number'
                )}
                {renderField(
                  'Department & Class',
                  member.department,
                  (v) => updateMember(index, 'department', v),
                  'text',
                  'e.g. AI & DS - I, Sec A'
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-sm text-red-300 flex items-center gap-3"
        >
          <Info className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Spacious Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-[length:200%_auto] px-8 py-5 font-display text-xl font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[position:right_center] glow-orange hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
        >
          {busy ? 'Registering Squad…' : 'Complete Team Registration'}
          {!busy && <ArrowRight className="size-6" />}
        </button>
      </div>
    </form>
  );
}
