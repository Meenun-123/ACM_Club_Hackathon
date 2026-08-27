import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ExternalLink, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { eventStatus, formatEventDate, getEvents, whatsappUrl, type EventRecord } from '@/lib/portal';

const filters = ['All', 'Upcoming', 'Ongoing', 'Past'] as const;

export default function EventsHub() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => { getEvents().then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false)); }, []);
  const visible = useMemo(() => filter === 'All' ? events : events.filter((event) => eventStatus(event.event_date) === filter), [events, filter]);

  return <section className="mx-auto max-w-7xl px-6 py-20" id="events">
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div><p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-orange-300">The event hub</p><h2 className="font-display text-4xl font-bold text-white sm:text-5xl">Find your next room.</h2><p className="mt-3 max-w-xl text-slate-400">Workshops, build nights, and conversations for people who like making things.</p></div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Event status">
        {filters.map((item) => <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={`rounded-full border px-4 py-2 text-sm transition ${filter === item ? 'border-orange-300 bg-orange-300 text-slate-950' : 'border-slate-700 text-slate-400 hover:border-slate-400 hover:text-white'}`}>{item}</button>)}
      </div>
    </div>
    {loading ? <div className="grid gap-4 md:grid-cols-3">{[1,2,3].map((item) => <div key={item} className="h-60 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70" />)}</div> : visible.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-700 px-6 py-14 text-center"><Sparkles className="mx-auto mb-4 text-orange-300" /><h3 className="font-display text-xl font-semibold text-white">No events in this lane yet.</h3><p className="mt-2 text-slate-400">Check back soon for the next chapter.</p></div> : <div className="grid gap-4 md:grid-cols-3">{visible.map((event) => { const status = eventStatus(event.event_date); return <article key={event.id} className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/75 transition hover:-translate-y-1 hover:border-orange-300/50">{event.banner_url ? <img src={event.banner_url} alt="" className="h-36 w-full object-cover" /> : <div className="h-2 bg-orange-300" />}<div className="p-5"><div className="mb-4 flex items-center justify-between gap-3"><span className="rounded-full border border-orange-300/40 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-orange-200">{status}</span><span className="text-xs text-slate-500">{formatEventDate(event.event_date)}</span></div><h3 className="font-display text-2xl font-semibold text-white">{event.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{event.description}</p><div className="mt-5 flex flex-col gap-2 text-sm text-slate-400"><span className="flex items-center gap-2"><MapPin className="size-4 text-orange-300" />{event.venue}</span>{event.start_time && <span className="flex items-center gap-2"><CalendarDays className="size-4 text-orange-300" />{event.start_time.slice(0,5)}</span>}</div><div className="mt-6 flex flex-wrap gap-2">{event.registration_url && status !== 'Past' && <a href={event.registration_url} target="_blank" rel="noreferrer" className="rounded-full bg-orange-300 px-4 py-2 text-sm font-semibold text-slate-950">Register</a>}{event.coordinator_phone && <a href={whatsappUrl(event.coordinator_phone)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500"><MessageCircle className="size-4" />Ask coordinator</a>}{event.registration_url && status === 'Past' && <a href={event.registration_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-orange-200">View recap <ExternalLink className="size-4" /></a>}</div></div></article>; })}</div>}
  </section>;
}
