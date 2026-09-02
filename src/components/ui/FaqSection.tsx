import { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Who is eligible to participate in Hack Ascension 2026?',
    answer:
      'The hackathon is open to all first-year B.Tech students across all departments and specializations at Amrita Vishwa Vidyapeetham, Nagercoil Campus.',
    category: 'Eligibility',
  },
  {
    question: 'How many members can be on a team?',
    answer:
      'Teams must consist of a minimum of 2 members and a maximum of 4 members (1 Team Leader + 1, 2, or 3 additional members). Inter-departmental squads are encouraged!',
    category: 'Team Formation',
  },
  {
    question: 'Is there any registration or entry fee?',
    answer:
      'No! Registration is 100% free of charge and fully organized by the ACM Student Chapter with faculty support.',
    category: 'Registration',
  },
  {
    question: 'What do we need to bring on the day of the hackathon?',
    answer:
      'Each team member should bring their laptop, power adapters/chargers, student ID card, and any development software or extensions they prefer to use.',
    category: 'Event Day',
  },
  {
    question: 'How and when do we submit our project deliverables?',
    answer:
      'Teams must submit their GitHub repository link and Google Drive presentation deck via the Deliverables Submission portal (/submit) before the 03:30 PM deadline on event day.',
    category: 'Submissions',
  },
  {
    question: 'What awards and recognition will be given?',
    answer:
      'Top podium finishers will receive cash prizes, trophies, and certificates of excellence. All valid participants will receive official ACM Student Chapter certificates of participation.',
    category: 'Awards',
  },
];

export default function FaqSection({ className = '' }: { className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={`relative section-pad pt-0 overflow-hidden ${className}`}>
      <div className="relative max-w-5xl mx-auto px-6 sm:px-8">
        <SectionHeading
          label="Got Questions?"
          title={<>FREQUENTLY ASKED <span className="text-gradient-orange">QUESTIONS</span></>}
          subtitle="Everything you need to know about team formation, rules, and event day logistics."
        />

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.question}
                className={`glass rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-orange-500/50 bg-slate-900/90 shadow-[0_10px_30px_rgba(249,115,22,0.12)]'
                    : 'border-slate-800 hover:border-slate-700 bg-[#070d1e]/60'
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="flex items-center justify-between w-full p-6 sm:p-7 text-left gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3 font-display text-lg sm:text-xl font-bold text-white">
                    <span className={`w-2 h-2 rounded-full transition-colors ${isOpen ? 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-slate-600'}`} />
                    {faq.question}
                  </span>
                  <div
                    className={`p-2 rounded-xl border border-slate-800 bg-slate-950/80 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-orange-400 border-orange-500/40' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
