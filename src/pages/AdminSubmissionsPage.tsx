import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ClipboardList,
  Download,
  ExternalLink,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  Presentation,
  Search,
  ToggleLeft,
  ToggleRight,
  UploadCloud,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Info,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';
import AcmLogo from '@/components/ui/AcmLogo';
import {
  getSubmissions,
  getSubmissionsOpen,
  setSubmissionsOpen,
  updateSubmission,
  deleteSubmission,
  type SubmissionRecord,
} from '@/lib/portal';

export default function AdminSubmissionsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<SubmissionRecord[]>([]);
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);
  const [submissionsOpen, setSubmissionsOpenState] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [message, setMessage] = useState('');

  // Edit modal state
  const [editingSubmission, setEditingSubmission] = useState<SubmissionRecord | null>(null);
  const [editForm, setEditForm] = useState<Partial<SubmissionRecord>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete modal state
  const [deletingSubmission, setDeletingSubmission] = useState<SubmissionRecord | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const refreshData = async () => {
    try {
      const [submissions, isOpen] = await Promise.all([
        getSubmissions(),
        getSubmissionsOpen(),
      ]);
      setRows(submissions);
      setSubmissionsOpenState(isOpen);
    } catch (err: any) {
      console.error('Failed to load submissions:', err);
      setMessage('Could not load submissions data.');
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return navigate('/admin/login', { replace: true });
      const { data: admin } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle();
      if (!admin) return navigate('/admin/login', { replace: true });

      await refreshData();
      setReady(true);
    });
  }, [navigate]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.team_name.toLowerCase().includes(q) ||
        r.leader_name.toLowerCase().includes(q) ||
        r.leader_roll_no.toLowerCase().includes(q) ||
        r.class_name.toLowerCase().includes(q) ||
        r.section.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const handleToggleSubmissions = async () => {
    setToggling(true);
    try {
      const nextState = !submissionsOpen;
      await setSubmissionsOpen(nextState);
      setSubmissionsOpenState(nextState);
      setMessage(
        nextState
          ? 'Submissions portal is now OPEN.'
          : 'Submissions portal is now LOCKED / CLOSED.'
      );
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      console.error('Failed to toggle submissions:', err);
      setMessage('Failed to update submission status.');
    } finally {
      setToggling(false);
    }
  };

  const handleStartEdit = (submission: SubmissionRecord) => {
    setEditingSubmission(submission);
    setEditForm({
      team_name: submission.team_name,
      leader_name: submission.leader_name,
      leader_roll_no: submission.leader_roll_no,
      class_name: submission.class_name,
      section: submission.section,
      github_url: submission.github_url,
      drive_url: submission.drive_url,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubmission) return;
    setSavingEdit(true);

    try {
      await updateSubmission(editingSubmission.id, editForm);
      setRows((prev) =>
        prev.map((item) =>
          item.id === editingSubmission.id ? ({ ...item, ...editForm } as SubmissionRecord) : item
        )
      );
      setMessage(`Successfully updated deliverables for team "${editForm.team_name}".`);
      setEditingSubmission(null);
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      console.error('Failed to update submission:', err);
      setMessage(`Failed to save changes: ${err?.message || 'Check database permissions'}`);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSubmission) return;
    setDeletingBusy(true);

    try {
      await deleteSubmission(deletingSubmission.id);
      setRows((prev) => prev.filter((item) => item.id !== deletingSubmission.id));
      setMessage(`Deleted deliverables for team "${deletingSubmission.team_name}".`);
      setDeletingSubmission(null);
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      console.error('Failed to delete submission:', err);
      setMessage(`Failed to delete submission: ${err?.message || 'Check database permissions'}`);
    } finally {
      setDeletingBusy(false);
    }
  };

  const exportToExcel = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const exportData = rows.map((row) => ({
      'Team Name': row.team_name,
      'Leader Name': row.leader_name,
      'Roll Number': row.leader_roll_no,
      'Class': row.class_name,
      'Section': row.section,
      'GitHub Link': `=HYPERLINK("${row.github_url}", "${row.github_url}")`,
      'Google Drive PPT Link': `=HYPERLINK("${row.drive_url}", "${row.drive_url}")`,
      'Submitted At': new Date(row.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Format formula cells so hyperlinks are immediately clickable
    Object.keys(worksheet).forEach((cellKey) => {
      if (cellKey.startsWith('!')) return;
      const cell = worksheet[cellKey];
      if (cell && typeof cell.v === 'string' && cell.v.startsWith('=')) {
        cell.f = cell.v.slice(1);
        delete cell.v;
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
    XLSX.writeFile(workbook, `Hackathon_Submissions_${dateStr}.xlsx`);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b13] text-slate-400">
        Checking admin access…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070b13] text-slate-100 flex">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800/80 bg-[#0b101a] p-5 md:flex">
        <Link to="/" className="mb-10 flex min-w-0 items-center text-white">
          <AcmLogo variant="sidebar" />
        </Link>
        <nav className="flex flex-col gap-2">
          <Link
            to="/admin/dashboard"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <LayoutDashboard className="size-4" />
            Overview & Events
          </Link>
          <Link
            to="/admin/registrations"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <ClipboardList className="size-4" />
            Registrations
          </Link>
          <Link
            to="/admin/submissions"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold bg-orange-400 text-slate-950 transition"
          >
            <UploadCloud className="size-4" />
            Submissions
          </Link>
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500 hover:text-white">
            <ArrowLeft className="size-4" /> Public portal
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500 hover:text-white">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 flex flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-[#0b101a] px-5 py-5 sm:px-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-300">
              Operations / Submissions Desk
            </p>
            <h1 className="font-display text-2xl font-bold">Hackathon Deliverables</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Master Submissions Switch */}
            <button
              onClick={handleToggleSubmissions}
              disabled={toggling}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                submissionsOpen
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
              }`}
              title="Toggle public submissions open/closed"
            >
              {submissionsOpen ? (
                <>
                  <ToggleRight className="size-5 text-emerald-400" />
                  Submissions: OPEN
                </>
              ) : (
                <>
                  <ToggleLeft className="size-5 text-rose-400" />
                  Submissions: CLOSED
                </>
              )}
            </button>

            {/* Export Excel Button */}
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-orange-300"
            >
              <Download className="size-4" /> Export Submissions to Excel
            </button>

            <button
              onClick={logout}
              aria-label="Sign out"
              className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:text-white md:hidden"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-800 bg-[#0b101a] px-5 py-3 md:hidden">
          <Link
            to="/admin/dashboard"
            className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
          >
            Overview
          </Link>
          <Link
            to="/admin/registrations"
            className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
          >
            Registrations
          </Link>
          <Link
            to="/admin/submissions"
            className="rounded-xl bg-orange-400 px-4 py-2 text-xs font-bold text-slate-950"
          >
            Submissions
          </Link>
        </div>

        <div className="mx-auto max-w-7xl w-full space-y-6 p-5 sm:p-8 flex-1">
          {message && (
            <div className="rounded-xl border border-orange-400/30 bg-orange-400/10 px-4 py-3 text-sm text-orange-200">
              {message}
            </div>
          )}

          {/* Search Bar & Summary Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search team, leader, roll no, or section…"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-400"
              />
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>Total Submissions: <strong className="text-white font-mono">{rows.length}</strong></span>
              {query && (
                <span>(Matching: <strong className="text-orange-300 font-mono">{filtered.length}</strong>)</span>
              )}
            </div>
          </div>

          {/* Submissions Table with Edit and Delete Action Buttons */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0b101a]">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500 bg-slate-950/40">
                <tr>
                  <th className="p-4">Submitted At</th>
                  <th className="p-4">Team Name</th>
                  <th className="p-4">Leader / Roll No</th>
                  <th className="p-4">Class & Section</th>
                  <th className="p-4">GitHub Repository</th>
                  <th className="p-4">Google Drive PPT</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-slate-800/70 hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(row.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4 font-semibold text-white">{row.team_name}</td>
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{row.leader_name}</div>
                      <div className="text-xs text-slate-500 font-mono">{row.leader_roll_no}</div>
                    </td>
                    <td className="p-4 text-slate-300">
                      <div>{row.class_name}</div>
                      <div className="text-xs text-slate-500">Sec: {row.section}</div>
                    </td>
                    <td className="p-4">
                      <a
                        href={row.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-orange-300 hover:border-orange-400 hover:text-orange-200 transition-colors"
                      >
                        <FolderGit2 className="size-3.5" /> Repo <ExternalLink className="size-3" />
                      </a>
                    </td>
                    <td className="p-4">
                      <a
                        href={row.drive_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-cyan-300 hover:border-cyan-400 hover:text-cyan-200 transition-colors"
                      >
                        <Presentation className="size-3.5" /> Slides <ExternalLink className="size-3" />
                      </a>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleStartEdit(row)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-200 hover:border-orange-400 hover:text-orange-300 transition-colors"
                          title="Edit submission details"
                        >
                          <Pencil className="size-3.5 text-orange-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setDeletingSubmission(row)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-medium text-red-300 hover:bg-red-500/20 hover:border-red-500/60 transition-colors"
                          title="Delete submission"
                        >
                          <Trash2 className="size-3.5 text-red-400" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!filtered.length && (
              <div className="p-12 text-center text-sm text-slate-500">
                {query ? 'No matching deliverables found.' : 'No deliverables submitted yet.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Submission Modal */}
      {editingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-[#0d1322] p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Pencil className="size-5 text-orange-400" />
                  Edit Deliverables
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Editing submission for team <strong className="text-orange-300">{editingSubmission.team_name}</strong>
                </p>
              </div>

              <button
                onClick={() => setEditingSubmission(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Team Name</label>
                <input
                  required
                  value={editForm.team_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, team_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-400 outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Leader Name</label>
                  <input
                    required
                    value={editForm.leader_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, leader_name: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Leader Roll No</label>
                  <input
                    required
                    value={editForm.leader_roll_no || ''}
                    onChange={(e) => setEditForm({ ...editForm, leader_roll_no: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Class / Branch</label>
                  <input
                    required
                    value={editForm.class_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, class_name: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Section</label>
                  <input
                    required
                    value={editForm.section || ''}
                    onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub Repository URL</label>
                <input
                  required
                  type="url"
                  value={editForm.github_url || ''}
                  onChange={(e) => setEditForm({ ...editForm, github_url: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Google Drive Presentation URL</label>
                <input
                  required
                  type="url"
                  value={editForm.drive_url || ''}
                  onChange={(e) => setEditForm({ ...editForm, drive_url: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-400 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSubmission(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-400 text-slate-950 text-sm font-bold hover:bg-orange-300 transition-all disabled:opacity-50"
                >
                  {savingEdit ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-[#0d1322] p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle className="size-6" />
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-2">
              Delete Deliverables?
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to permanently delete the submitted deliverables for team{' '}
              <strong className="text-white">"{deletingSubmission.team_name}"</strong>? This will remove their repository and slide deck links.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingSubmission(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingBusy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
              >
                {deletingBusy ? 'Deleting…' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
