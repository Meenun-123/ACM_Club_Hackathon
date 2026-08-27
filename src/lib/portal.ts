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

export function eventStatus(eventDate: string): 'Upcoming' | 'Ongoing' | 'Past' {
  const today = new Date();
  const date = new Date(`${eventDate}T00:00:00`);
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

export const formatEventDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T00:00:00`));
export const whatsappUrl = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`;
