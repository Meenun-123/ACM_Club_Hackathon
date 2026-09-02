import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  Info,
  Lock,
  Presentation,
  ShieldAlert,
} from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import GlassCard from '@/components/ui/GlassCard';
import { getSubmissionsOpen, submitDeliverables } from '@/lib/portal';

const urlRe = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

function isValidUrl(string: string) {
  try {
    const url = new URL(string.startsWith('http') ? string : `https://${string}`);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function SubmitPage() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderRollNo, setLeaderRollNo] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [driveUrl, setDriveUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState<{
    id?: string;
    teamName: string;
    submittedAt: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    getSubmissionsOpen()
      .then((open) => {
        if (mounted) setIsOpen(open);
      })
      .catch(() => {
        if (mounted) setIsOpen(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !teamName.trim() ||
      !leaderName.trim() ||
      !leaderRollNo.trim() ||
      !className.trim() ||
      !section.trim() ||
      !githubUrl.trim() ||
      !driveUrl.trim()
    ) {
      setError('Please fill in all required deliverable fields.');
      return;
    }

    if (!isValidUrl(githubUrl.trim())) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/project).');
      return;
    }

    if (!isValidUrl(driveUrl.trim())) {
      setError('Please enter a valid Google Drive presentation URL.');
      return;
    }

    setSubmitting(true);

    try {
      const sanitizedGithub = githubUrl.trim().startsWith('http')
        ? githubUrl.trim()
        : `https://${githubUrl.trim()}`;
      const sanitizedDrive = driveUrl.trim().startsWith('http')
        ? driveUrl.trim()
        : `https://${driveUrl.trim()}`;

      const res = await submitDeliverables({
        team_name: teamName.trim(),
        leader_name: leaderName.trim(),
        leader_roll_no: leaderRollNo.trim(),
        class_name: className.trim(),
        section: section.trim(),
        github_url: sanitizedGithub,
        drive_url: sanitizedDrive,
      });

      setSubmitting(false);
      setSubmittedData({
        id: res?.id,
        teamName: teamName.trim(),
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err: any) {
      setSubmitting(false);
      console.error('Submission failed:', err);
      setError(
        err?.message
          ? `Submission failed: ${err.message}`
          : 'Failed to record deliverables. Please verify your connection and try again.'
      );
    }
  };

  const renderField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    type = 'text',
    placeholder = '',
    helperText?: string
  ) => (
    <div className="flex flex-col gap-2.5">
      <label className="text-sm font-semibold text-slate-200 flex items-center justify-between">
        <span>{label}</span>
        <span className="text-xs text-orange-400 font-normal">*required</span>
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700/90 bg-slate-950/70 px-5 py-3.5 text-base text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-orange-400 focus:bg-slate-950 focus:ring-2 focus:ring-orange-400/20"
      />
      {helperText && (
        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
          <Info className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          {helperText}
        </p>
      )}
    </div>
  );

  return (
    <>
      <PageHero
        label="Deliverables"
        title={<>PROJECT <span className="text-gradient-orange">SUBMISSION</span></>}
        subtitle="Submit your repository and presentation deck for final evaluation."
      />

      <section className="relative section-pad pt-4 pb-28 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/10 blur-[160px] rounded-full"
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-8">
          {loading ? (
            <div className="glass rounded-3xl p-16 text-center text-slate-400">
              <div className="w-10 h-10 mx-auto mb-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-base">Checking submission portal status…</p>
            </div>
          ) : !isOpen ? (
            /* Submissions Locked Alert Card */
            <div className="glass rounded-3xl p-8 sm:p-12 text-center border-orange-500/30 glow-orange">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-6 text-orange-400">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                Submissions are currently closed
              </h2>
              <p className="text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
                The deliverables submission portal is not accepting entries right now.
                Please check back during the designated submission window or contact your event coordinators.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/"
                  className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-medium hover:bg-slate-800 transition-colors"
                >
                  Return to Home
                </Link>
                <Link
                  to="/coordinators"
                  className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-400 transition-colors"
                >
                  Contact Coordinators
                </Link>
              </div>
            </div>
          ) : submittedData ? (
            /* Submission Success Card */
            <div className="glass rounded-3xl p-8 sm:p-12 text-center border-emerald-500/40 glow-blue animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-6 text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white mb-3">
                Deliverables Submitted!
              </h2>
              <p className="text-base text-slate-300 max-w-md mx-auto">
                Thank you, team <strong className="text-white">{submittedData.teamName}</strong>.
                Your project links have been recorded successfully at {submittedData.submittedAt}.
              </p>

              <div className="mt-8 p-5 rounded-2xl bg-navy-950/60 border border-slate-800 text-left max-w-md mx-auto space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Team:</span>
                  <span className="font-semibold text-white">{submittedData.teamName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-medium">Recorded for Evaluation</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Link
                  to="/"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-display font-semibold hover:from-orange-400 hover:to-orange-500 transition-all"
                >
                  Back to Portal
                </Link>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Team Leader & Class Identification */}
              <section className="glass rounded-3xl p-8 sm:p-10 border-slate-800 shadow-2xl">
                <div className="border-b border-slate-800/80 pb-6 mb-8">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                    Team Identification
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-400">
                    Enter your registered team name and leader details to link deliverables.
                  </p>
                </div>

                <div className="space-y-6">
                  {renderField('Team Name', teamName, setTeamName, 'text', 'e.g. CodeAscenders')}

                  <div className="grid gap-6 sm:grid-cols-2">
                    {renderField('Team Leader Full Name', leaderName, setLeaderName, 'text', 'Leader Full Name')}
                    {renderField('Team Leader Roll / Register Number', leaderRollNo, setLeaderRollNo, 'text', 'e.g. CB.EN.U4CSE...')}
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {renderField('Class', className, setClassName, 'text', 'e.g. I B.Tech CSE')}
                    {renderField('Section', section, setSection, 'text', 'e.g. A / B / C')}
                  </div>
                </div>
              </section>

              {/* Project Links (GitHub & Drive PPT) */}
              <section className="glass rounded-3xl p-8 sm:p-10 border-slate-800 shadow-2xl">
                <div className="border-b border-slate-800/80 pb-6 mb-8">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                    <FolderGit2 className="w-6 h-6 text-orange-400" />
                    Project Deliverables
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-400">
                    Provide direct URLs for your public codebase and presentation deck.
                  </p>
                </div>

                <div className="space-y-6">
                  {renderField(
                    'GitHub Repository URL',
                    githubUrl,
                    setGithubUrl,
                    'url',
                    'https://github.com/your-username/your-repo',
                    'Ensure repository visibility is set to Public or shared with organizers.'
                  )}

                  {renderField(
                    'Google Drive Presentation URL',
                    driveUrl,
                    setDriveUrl,
                    'url',
                    'https://docs.google.com/presentation/d/... or Google Drive link',
                    "Set Google Drive share permission to 'Anyone with the link can view'"
                  )}
                </div>
              </section>

              {error && (
                <div role="alert" className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-sm text-red-300 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-[length:200%_auto] px-8 py-5 font-display text-xl font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[position:right_center] glow-orange hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                >
                  {submitting ? 'Submitting Deliverables…' : 'Submit Hackathon Deliverables'}
                  {!submitting && <ArrowRight className="size-6" />}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
