import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ClipboardList,
  Download,
  LayoutDashboard,
  LogOut,
  Search,
  UploadCloud,
  Users,
  X,
  Pencil,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';
import AcmLogo from '@/components/ui/AcmLogo';

type Registration = {
  id: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  leader_roll_no: string;
  leader_class_department: string;
  team_members: Array<{ fullName: string; rollNo: string; department: string }>;
  created_at: string;
};

export default function AdminRegistrationsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Registration[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Registration | null>(null);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const [copiedRoster, setCopiedRoster] = useState(false);

  // Edit state
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [editForm, setEditForm] = useState<Partial<Registration>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete state
  const [deletingRegistration, setDeletingRegistration] = useState<Registration | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const fetchRegistrations = async () => {
    const { data: registrations, error } = await supabase
      .from('hackathon_registrations')
      .select(
        'id,team_name,leader_name,leader_email,leader_phone,leader_roll_no,leader_class_department,team_members,created_at'
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch registrations:', error);
      setMessage('Failed to load registrations from Supabase.');
    } else {
      setRows((registrations ?? []) as Registration[]);
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

      await fetchRegistrations();
      setReady(true);
    });
  }, [navigate]);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = query.toLowerCase();
        return (
          r.team_name.toLowerCase().includes(q) ||
          r.leader_name.toLowerCase().includes(q) ||
          r.leader_roll_no.toLowerCase().includes(q) ||
          r.leader_class_department.toLowerCase().includes(q)
        );
      }),
    [rows, query]
  );

  const handleStartEdit = (reg: Registration) => {
    setEditingRegistration(reg);
    setEditForm({
      team_name: reg.team_name,
      leader_name: reg.leader_name,
      leader_email: reg.leader_email,
      leader_phone: reg.leader_phone,
      leader_roll_no: reg.leader_roll_no,
      leader_class_department: reg.leader_class_department,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRegistration) return;
    setSavingEdit(true);

    try {
      const { data, error } = await supabase
        .from('hackathon_registrations')
        .update(editForm)
        .eq('id', editingRegistration.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Database blocked update. Please ensure Row Level Security (RLS) policies are active.');
      }

      setRows((prev) =>
        prev.map((item) =>
          item.id === editingRegistration.id ? ({ ...item, ...editForm } as Registration) : item
        )
      );
      setMessage(`Updated registration for team "${editForm.team_name}".`);
      setEditingRegistration(null);
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      console.error('Failed to update registration:', err);
      setMessage(`Failed to update: ${err?.message || 'Check database permissions'}`);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingRegistration) return;
    setDeletingBusy(true);

    try {
      const { data, error } = await supabase
        .from('hackathon_registrations')
        .delete()
        .eq('id', deletingRegistration.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Database blocked deletion. Please ensure Row Level Security (RLS) policies are active.');
      }

      setRows((prev) => prev.filter((item) => item.id !== deletingRegistration.id));
      setMessage(`Deleted registration for team "${deletingRegistration.team_name}".`);
      setDeletingRegistration(null);
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      console.error('Failed to delete registration:', err);
      setMessage(`Failed to delete: ${err?.message || 'Check database permissions'}`);
    } finally {
      setDeletingBusy(false);
    }
  };

  const handleCopyRoster = (reg: Registration) => {
    const lines = [
      `Team: ${reg.team_name}`,
      `Leader: ${reg.leader_name} (${reg.leader_roll_no}) - ${reg.leader_class_department}`,
      `Phone: ${reg.leader_phone} | Email: ${reg.leader_email}`,
      'Members:',
      ...(reg.team_members || []).map(
        (m, i) => `  ${i + 1}. ${m.fullName} (${m.rollNo}) - ${m.department}`
      ),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedRoster(true);
    setTimeout(() => setCopiedRoster(false), 3000);
  };

  const exportToExcel = () => {
    const exportData = rows.map((r) => {
      const memberNames = (r.team_members || []).map((m) => `${m.fullName} (${m.rollNo})`).join(', ');
      return {
        'Team Name': r.team_name,
        'Leader Name': r.leader_name,
        'Leader Email': r.leader_email,
        'Leader Phone': r.leader_phone,
        'Leader Roll No': r.leader_roll_no,
        'Department & Class': r.leader_class_department,
        'Total Squad Size': 1 + (r.team_members?.length || 0),
        'Additional Members': memberNames,
        'Registered At': new Date(r.created_at).toLocaleString(),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    XLSX.writeFile(workbook, `Hackathon_Registrations_${new Date().toISOString().slice(0, 10)}.xlsx`);
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
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold bg-orange-400 text-slate-950 transition"
          >
            <ClipboardList className="size-4" />
            Registrations
          </Link>
          <Link
            to="/admin/submissions"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
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
              Operations / Registration Desk
            </p>
            <h1 className="font-display text-2xl font-bold">Hackathon Registrations</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-orange-300"
            >
              <Download className="size-4" /> Export Teams to Excel
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

        {/* Mobile Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-800 bg-[#0b101a] px-5 py-3 md:hidden">
          <Link
            to="/admin/dashboard"
            className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
          >
            Overview
          </Link>
          <Link
            to="/admin/registrations"
            className="rounded-xl bg-orange-400 px-4 py-2 text-xs font-bold text-slate-950"
          >
            Registrations
          </Link>
          <Link
            to="/admin/submissions"
            className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
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

          {/* Search Bar & Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search team, leader, or roll number…"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-400"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>Total Teams: <strong className="text-white font-mono">{rows.length}</strong></span>
              {query && (
                <span>(Matching: <strong className="text-orange-300 font-mono">{filtered.length}</strong>)</span>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0b101a]">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500 bg-slate-950/40">
                <tr>
                  <th className="p-4">Submitted</th>
                  <th className="p-4">Team Name</th>
                  <th className="p-4">Leader / Roll No</th>
                  <th className="p-4">Department & Class</th>
                  <th className="p-4">Squad Size</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-slate-800/70 hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(row.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 font-semibold text-white">{row.team_name}</td>
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{row.leader_name}</div>
                      <div className="text-xs text-slate-500 font-mono">{row.leader_roll_no}</div>
                    </td>
                    <td className="p-4 text-slate-300">{row.leader_class_department}</td>
                    <td className="p-4 text-slate-300">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1 text-xs text-orange-300 font-mono">
                        <Users className="size-3" />
                        1 + {row.team_members?.length ?? 0}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelected(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-orange-400 hover:text-white transition-colors"
                          title="View all team members"
                        >
                          <Eye className="size-3.5 text-orange-400" />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => handleStartEdit(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-orange-400 hover:text-orange-300 transition-colors"
                          title="Edit registration"
                        >
                          <Pencil className="size-3.5 text-orange-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setDeletingRegistration(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 hover:border-red-500/60 transition-colors"
                          title="Delete registration"
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
                {query ? 'No matching registrations found.' : 'No registrations found.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Team Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <section
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-orange-400">Team Profile</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-white">{selected.team_name}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="rounded-2xl border border-slate-800 bg-[#0b101a] p-4">
                <p className="font-mono text-xs uppercase tracking-wider text-orange-300 font-semibold mb-2">
                  Leader (Primary Contact)
                </p>
                <p className="text-white font-medium text-base">{selected.leader_name}</p>
                <p className="text-slate-400 mt-1">{selected.leader_email} · {selected.leader_phone}</p>
                <p className="text-slate-400">Roll No: <span className="text-slate-200 font-mono">{selected.leader_roll_no}</span></p>
                <p className="text-slate-400">Department & Class: <span className="text-slate-200">{selected.leader_class_department}</span></p>
              </div>

              {selected.team_members && selected.team_members.length > 0 && (
                <div className="space-y-3">
                  <p className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Additional Members ({selected.team_members.length})
                  </p>
                  {selected.team_members.map((member, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-[#0b101a] p-4">
                      <p className="font-semibold text-orange-200">Member {i + 1}: {member.fullName}</p>
                      <p className="text-slate-400 text-xs mt-1">Roll No: <span className="text-slate-200 font-mono">{member.rollNo}</span></p>
                      <p className="text-slate-400 text-xs">Department: <span className="text-slate-200">{member.department}</span></p>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleCopyRoster(selected)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-400 text-slate-950 font-bold text-xs hover:bg-orange-300 transition-colors"
                >
                  {copiedRoster ? <Check className="size-4" /> : <Copy className="size-4" />}
                  <span>{copiedRoster ? 'Roster Copied!' : 'Copy Team Roster'}</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Edit Registration Modal */}
      {editingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-[#0d1322] p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Pencil className="size-5 text-orange-400" />
                  Edit Team Registration
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Editing team <strong className="text-orange-300">{editingRegistration.team_name}</strong>
                </p>
              </div>

              <button
                onClick={() => setEditingRegistration(null)}
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Leader Email</label>
                  <input
                    required
                    type="email"
                    value={editForm.leader_email || ''}
                    onChange={(e) => setEditForm({ ...editForm, leader_email: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Leader Phone</label>
                  <input
                    required
                    type="tel"
                    value={editForm.leader_phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, leader_phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department & Class</label>
                <input
                  required
                  value={editForm.leader_class_department || ''}
                  onChange={(e) => setEditForm({ ...editForm, leader_class_department: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-400 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingRegistration(null)}
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

      {/* Delete Registration Modal */}
      {deletingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-[#0d1322] p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle className="size-6" />
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-2">
              Delete Team Registration?
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to permanently delete the registration for team{' '}
              <strong className="text-white">"{deletingRegistration.team_name}"</strong> and all its members?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingRegistration(null)}
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
