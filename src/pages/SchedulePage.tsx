import { useState } from 'react';
import {
  Clock,
  Info,
  Calendar,
  Sparkles,
  MapPin,
  Download,
  CheckCircle2,
  Layers,
  Flame,
} from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import { SCHEDULE, EVENT } from '@/lib/constants';
import { useScrollReveal } from '@/lib/hooks';

type FilterType = 'all' | 'morning' | 'afternoon' | 'finals';

interface ScheduleItemWithTag {
  time: string;
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
  period: 'morning' | 'afternoon' | 'finals';
}

const ENRICHED_SCHEDULE: ScheduleItemWithTag[] = [
  {
    time: '09:30 AM',
    title: 'Registration & Badge Check-in',
    desc: 'Participant verification, kit collection, and welcome onboarding.',
    tag: 'Check-in',
    tagColor: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
    period: 'morning',
  },
  {
    time: '10:00 AM',
    title: 'Opening Ceremony & Keynote',
    desc: 'Introduction to Hack Ascension 2026, problem statements, and vision.',
    tag: 'Ceremony',
    tagColor: 'border-orange-500/40 text-orange-300 bg-orange-500/10',
    period: 'morning',
  },
  {
    time: '10:30 AM',
    title: 'Technical Deep-Dive Session',
    desc: 'Core computing concepts, development toolchains, and modern APIs.',
    tag: 'Workshop',
    tagColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
    period: 'morning',
  },
  {
    time: '12:00 PM',
    title: 'Interactive Challenge & Sprint 1',
    desc: 'First phase problem-solving, rapid prototyping, and mentor guidance.',
    tag: 'Hackathon',
    tagColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
    period: 'morning',
  },
  {
    time: '01:00 PM',
    title: 'Lunch & Networking Break',
    desc: 'Refresh, recharge, and connect with peers and student chapter mentors.',
    tag: 'Break',
    tagColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
    period: 'afternoon',
  },
  {
    time: '02:00 PM',
    title: 'Innovation & Code Sprint 2',
    desc: 'Intense collaborative development, debugging, and feature completion.',
    tag: 'Sprint',
    tagColor: 'border-orange-500/40 text-orange-300 bg-orange-500/10',
    period: 'afternoon',
  },
  {
    time: '03:30 PM',
    title: 'Final Submission & Pitching Interaction',
    desc: 'Code repository freeze, slide deck submission, and jury presentation.',
    tag: 'Evaluation',
    tagColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10',
    period: 'finals',
  },
  {
    time: '04:15 PM',
    title: 'Valedictory & Prize Distribution',
    desc: 'Awarding winners, certificate distribution, and chapter closing notes.',
    tag: 'Awards',
    tagColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
    period: 'finals',
  },
  {
    time: '04:30 PM',
    title: 'Official Event Conclusion',
    desc: 'Group photograph and wrap-up of Hack Ascension 2026.',
    tag: 'Wrap-up',
    tagColor: 'border-slate-500/40 text-slate-300 bg-slate-500/10',
    period: 'finals',
  },
];

export default function SchedulePage() {
  const { ref, inView } = useScrollReveal();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredItems =
    filter === 'all'
      ? ENRICHED_SCHEDULE
      : ENRICHED_SCHEDULE.filter((item) => item.period === filter);

  const downloadCalendarFile = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ACM Student Chapter//Hack Ascension 2026//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:hack-ascension-2026@acm-amrita',
      'DTSTAMP:20260901T000000Z',
      'DTSTART:20260903T040000Z',
      'DTEND:20260903T110000Z',
      'SUMMARY:Hack Ascension 2026 - ACM Student Chapter',
      'DESCRIPTION:Flagship hackathon organized by ACM Student Chapter at Amrita Vishwa Vidyapeetham, Nagercoil.',
      'LOCATION:Amriteshwari Hall, Amrita Vishwa Vidyapeetham, Nagercoil Campus',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Hack_Ascension_2026_Schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <PageHero
        label="Itinerary"
        title={<>EVENT <span className="text-gradient-orange">SCHEDULE</span></>}
        subtitle="A high-intensity day of workshops, coding challenges, and innovation."
      />

      <section className="relative section-pad pt-4 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header Controls & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-orange-400 text-xs font-mono uppercase tracking-widest font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{EVENT.date} · {EVENT.venue}</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-white mt-1">Timeline & Milestones</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={downloadCalendarFile}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 text-xs font-medium text-slate-200 hover:border-orange-500/50 hover:text-white transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" />
                Add to Calendar (.ics)
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {[
              { id: 'all', label: 'All Sessions' },
              { id: 'morning', label: 'Morning Track' },
              { id: 'afternoon', label: 'Afternoon Sprint' },
              { id: 'finals', label: 'Pitching & Awards' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as FilterType)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  filter === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.35)] scale-105'
                    : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Timeline */}
          <div ref={ref} className="relative">
            {/* Vertical Line */}
            <div
              className="absolute left-4 sm:left-6 top-3 bottom-3 w-px bg-gradient-to-b from-orange-500/60 via-blue-500/40 to-transparent"
              aria-hidden="true"
            />

            <div className="space-y-6">
              {filteredItems.map((item, i) => (
                <div
                  key={item.title}
                  className={`reveal ${inView ? 'in-view' : ''} relative pl-12 sm:pl-16 group`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-1.5 sm:left-3.5 top-5 w-6 h-6 rounded-full bg-navy-950 border-2 border-orange-400/80 flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.4)] group-hover:scale-125 transition-transform duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  </div>

                  {/* Card */}
                  <div className="glass rounded-2xl p-5 sm:p-6 border-slate-800/90 hover:border-orange-500/40 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-md border border-orange-500/20">
                          <Clock className="w-3.5 h-3.5" />
                          {item.time}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {EVENT.venue}
                        </span>
                      </div>

                      <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-orange-200 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-12 flex items-start gap-3.5 glass rounded-2xl p-5 border-amber-500/30 bg-amber-500/5">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <strong className="text-amber-300 font-semibold block mb-0.5">
                Note on Timing & Check-In
              </strong>
              Please report to Amriteshwari Hall by 9:15 AM for smooth badge verification.
              Live schedule updates will be announced by the stage coordinators.
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <Button to="/register" size="lg">
              <Sparkles className="w-4 h-4" />
              REGISTER FOR HACKATHON
            </Button>
            <Button to="/submit" variant="secondary" size="lg">
              SUBMIT DELIVERABLES
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
