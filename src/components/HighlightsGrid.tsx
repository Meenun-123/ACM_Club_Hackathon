import { useScrollReveal } from '@/lib/hooks';
import GlassCard from './ui/GlassCard';
import { GraduationCap, Dumbbell, Hammer, TrendingUp, Trophy, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Dumbbell,
  Hammer,
  TrendingUp,
  Trophy,
  Rocket,
};

const ITEMS = [
  { title: 'Learn', desc: 'Build a strong foundation and discover new possibilities.', icon: 'GraduationCap' },
  { title: 'Practice', desc: 'Turn concepts into practical skills through engaging challenges.', icon: 'Dumbbell' },
  { title: 'Build', desc: 'Create, experiment and transform ideas into working solutions.', icon: 'Hammer' },
  { title: 'Grow', desc: 'Develop technical ability, creativity and confidence.', icon: 'TrendingUp' },
  { title: 'Succeed', desc: 'Challenge yourself and showcase what you can accomplish.', icon: 'Trophy' },
  { title: 'Ascend', desc: 'Take your first major step into the world of technology.', icon: 'Rocket' },
];

export default function HighlightsGrid() {
  const { ref, inView } = useScrollReveal();

  return (
    <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {ITEMS.map((item, i) => {
        const Icon = ICONS[item.icon];
        return (
          <div
            key={item.title}
            className={`reveal ${inView ? 'in-view' : ''}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <GlassCard hover className="p-7 h-full group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-500/20 to-cyan-400/10 border border-electric-500/30 flex items-center justify-center group-hover:border-orange-500/50 transition-colors duration-500">
                  {Icon && <Icon className="w-6 h-6 text-cyan-400 group-hover:text-orange-400 transition-colors duration-500" />}
                </div>
                <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              <div className="mt-5 h-px w-full bg-gradient-to-r from-electric-500/20 to-transparent group-hover:from-orange-500/40 transition-colors duration-500" />
            </GlassCard>
          </div>
        );
      })}
    </div>
  );
}
