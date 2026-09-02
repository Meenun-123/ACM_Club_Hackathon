import { supabase } from '@/lib/supabase';

export type EventRecord = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  start_time: string | null;
  venue: string;
  coordinator_name: string;
  coordinator_phone: string;
  banner_url: string | null;
  registration_url: string | null;
};

export type ResourceRecord = {
  id: string;
  title: string;
  description: string;
  category: 'PDF' | 'Slides' | 'Code/GitHub' | 'Drive';
  resource_url: string;
};

function parseEventDate(eventDate: string | null | undefined) {
  if (!eventDate) return null;
  const value = String(eventDate).trim();
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function eventStatus(eventDate: string | null | undefined): 'Upcoming' | 'Ongoing' | 'Past' {
  const date = parseEventDate(eventDate);
  if (!date) return 'Past';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date.getTime() > today.getTime()) return 'Upcoming';
  if (date.getTime() === today.getTime()) return 'Ongoing';
  return 'Past';
}

export async function getEvents() {
  const { data, error } = await supabase.from('events').select('id,title,description,event_date,start_time,venue,coordinator_name,coordinator_phone,banner_url,registration_url').order('event_date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as EventRecord[];
}

export async function getResources() {
  const { data, error } = await supabase.from('resources').select('id,title,description,category,resource_url').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ResourceRecord[];
}

export async function isCurrentAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
  return Boolean(data);
}

export type SubmissionRecord = {
  id: string;
  team_name: string;
  leader_name: string;
  leader_roll_no: string;
  class_name: string;
  section: string;
  github_url: string;
  drive_url: string;
  created_at: string;
};

const LOCAL_SUBMISSIONS_KEY = 'hack_ascension_submissions_open';

export async function getSubmissionsOpen(): Promise<boolean> {
  // Check local cache/fallback first
  const localVal = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_SUBMISSIONS_KEY) : null;
  const localFallback = localVal !== null ? localVal === 'true' : true;

  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return localFallback;
    }

    if (typeof data.submissions_open === 'boolean') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_SUBMISSIONS_KEY, String(data.submissions_open));
      }
      return data.submissions_open;
    }
    if (data.value !== undefined) {
      const val = data.value === 'true' || data.value === true;
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_SUBMISSIONS_KEY, String(val));
      }
      return val;
    }
    return localFallback;
  } catch {
    return localFallback;
  }
}

export async function setSubmissionsOpen(isOpen: boolean): Promise<void> {
  // Always update localStorage so UI responds immediately
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_SUBMISSIONS_KEY, String(isOpen));
  }

  try {
    // Check if a row exists first
    const { data: existing, error: selectErr } = await supabase
      .from('system_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (selectErr) {
      console.warn('system_settings table query warning (using local state fallback):', selectErr.message);
      return; // gracefully fallback without breaking the UI
    }

    if (existing?.id) {
      const { error } = await supabase
        .from('system_settings')
        .update({ submissions_open: isOpen, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (error) {
        // Try without updated_at if column doesn't exist
        const { error: retryErr } = await supabase
          .from('system_settings')
          .update({ submissions_open: isOpen })
          .eq('id', existing.id);
        if (retryErr) console.warn('Supabase update warning:', retryErr.message);
      }
    } else {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ id: 'default', submissions_open: isOpen, updated_at: new Date().toISOString() });
      if (error) {
        const { error: retryErr } = await supabase
          .from('system_settings')
          .upsert({ id: 'default', submissions_open: isOpen });
        if (retryErr) console.warn('Supabase upsert warning:', retryErr.message);
      }
    }
  } catch (err: any) {
    console.warn('Supabase system_settings sync warning:', err?.message || err);
  }
}

export async function getSubmissions(): Promise<SubmissionRecord[]> {
  const { data, error } = await supabase
    .from('hackathon_submissions')
    .select('id,team_name,leader_name,leader_roll_no,class_name,section,github_url,drive_url,created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as SubmissionRecord[];
}

export async function submitDeliverables(payload: {
  team_name: string;
  leader_name: string;
  leader_roll_no: string;
  class_name: string;
  section: string;
  github_url: string;
  drive_url: string;
}) {
  const { data, error } = await supabase
    .from('hackathon_submissions')
    .insert([payload]);

  if (error) {
    console.error('Supabase submission error:', error);
    throw error;
  }
  return { id: 'submitted', ...payload };
}

export async function updateSubmission(id: string, updates: Partial<SubmissionRecord>) {
  const { data, error } = await supabase
    .from('hackathon_submissions')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteSubmission(id: string) {
  const { data, error } = await supabase
    .from('hackathon_submissions')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
}

export const formatEventDate = (date: string | null | undefined) => {
  const parsed = parseEventDate(date);
  if (!parsed) return 'Date to be announced';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsed);
};
export const whatsappUrl = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`;
