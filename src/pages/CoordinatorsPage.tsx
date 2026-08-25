import PageHero from '@/components/ui/PageHero';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { STUDENT_COORDINATORS, FACULTY_COORDINATORS } from '@/lib/constants';
import { useScrollReveal } from '@/lib/hooks';

function initials(name: string) {
  return name
    .replace(/^(Mrs\.|Mr\.|Dr\.)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function CoordinatorCard({ name, role, index }: { name: string; role: string; index: number }) {
  const { ref, inView } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'in-view' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <GlassCard hover className="p-8 text-center h-full group">
        {/* Avatar */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/30 to-electric-500/20 blur-xl group-hover:from-orange-500/40 transition-all duration-500" />
          <div className="relative w-24 h-24 rounded-full bg-navy-800 border-2 border-electric-500/30 flex items-center justify-center group-hover:border-orange-500/50 transition-colors duration-500">
            <span className="font-display text-2xl font-bold text-gradient-orange">
              {initials(name)}
            </span>
          </div>
        </div>
        <h3 className="font-display text-lg font-bold text-white leading-tight">{name}</h3>
        <p className="mt-2 text-sm text-slate-400">{role}</p>
        <div className="mt-5 h-px w-12 mx-auto bg-gradient-to-r from-orange-500/40 to-transparent" />
      </GlassCard>
    </div>
  );
}

export default function CoordinatorsPage() {
  return (
    <>
      <PageHero
        label="The Team"
        title={<>MEET THE <span className="text-gradient-orange">TEAM</span></>}
        subtitle="The people behind Hack Ascension 2026."
      />

      {/* Student Coordinators */}
      <section className="relative section-pad">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Student Coordinators"
            title={<>STUDENT <span className="text-gradient-orange">COORDINATORS</span></>}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {STUDENT_COORDINATORS.map((c, i) => (
              <CoordinatorCard key={c.name} name={c.name} role={c.role} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Coordinators */}
      <section className="relative section-pad pt-0 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Faculty Coordinators"
            title={<>FACULTY <span className="text-gradient-orange">COORDINATORS</span></>}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            {FACULTY_COORDINATORS.map((c, i) => (
              <CoordinatorCard key={c.name} name={c.name} role={c.role} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
