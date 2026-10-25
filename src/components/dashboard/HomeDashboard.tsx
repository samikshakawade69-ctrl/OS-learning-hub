import React from 'react';
import {
  Cpu,
  Activity,
  ShieldAlert,
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  Play,
  CheckCircle2,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { categories, allSubtopics } from '../../data/categories';
import { UserProgress } from '../../types/os';

interface HomeDashboardProps {
  progress: UserProgress;
  onSelectCategory: (catId: string) => void;
  onSelectTopic: (topicId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-8 h-8" />,
  Activity: <Activity className="w-8 h-8" />,
  ShieldAlert: <ShieldAlert className="w-8 h-8" />,
  Layers: <Layers className="w-8 h-8" />
};

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  progress,
  onSelectCategory,
  onSelectTopic
}) => {
  const totalTopics = allSubtopics.length;
  const completedTopicsCount = progress.completedTopics.length;
  const progressPct = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

  const popularSimulators = [
    { id: 'cpu-scheduling-algorithms', name: 'CPU Scheduling (FCFS, SJF, RR, Priority)', cat: 'Process' },
    { id: 'memory-allocation-algorithms', name: 'Memory Allocation (First, Best, Worst Fit)', cat: 'Memory' },
    { id: 'bankers-algorithm-simulation', name: 'Banker’s Algorithm & Safe Sequences', cat: 'Deadlock' },
    { id: 'page-replacement-algorithms', name: 'Page Replacement (FIFO, LRU, Optimal)', cat: 'Memory' },
    { id: 'producer-consumer-problem', name: 'Producer-Consumer (Bounded Buffer)', cat: 'Sync' },
    { id: 'dining-philosophers-problem', name: 'Dining Philosophers (5 Chopsticks)', cat: 'Sync' }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 px-4 max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Operating Systems Exam & Lab Companion
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Welcome to <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">OS Learning Hub</span>
        </h1>

        <p className="text-lg sm:text-xl font-medium text-slate-600 dark:text-slate-400 italic max-w-2xl mx-auto">
          Learn Operating Systems Through Interactive Simulations
        </p>

        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Master core OS principles with simple explanations, animated Gantt charts, dynamic memory blocks, Banker’s safe sequences, and visual race condition solvers.
        </p>

        {/* Global Progress Bar Bar */}
        <div className="max-w-md mx-auto pt-4">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            <span>Your Overall Progress</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              {completedTopicsCount} / {totalTopics} Topics ({progressPct}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              style={{ width: `${progressPct}%` }}
              className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </section>

      {/* 4 Large Colorful Interactive Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Explore Core Operating System Domains
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click any category to dive into theory, diagrams, practice problems, and interactive simulators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map(cat => {
            const icon = ICON_MAP[cat.iconName];
            const completedCount = cat.subtopics.filter(s =>
              progress.completedTopics.includes(s.id)
            ).length;
            const catProgressPct = Math.round((completedCount / cat.subtopics.length) * 100);

            // Custom themes for each category
            let cardColorClass = 'border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-500';
            let iconBgClass = 'bg-indigo-600 text-white';
            let buttonBgClass = 'bg-indigo-600 hover:bg-indigo-700';

            if (cat.id === 'process-management') {
              cardColorClass = 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-500';
              iconBgClass = 'bg-emerald-600 text-white';
              buttonBgClass = 'bg-emerald-600 hover:bg-emerald-700';
            } else if (cat.id === 'deadlock-management') {
              cardColorClass = 'border-amber-200 dark:border-amber-900/60 hover:border-amber-500';
              iconBgClass = 'bg-amber-600 text-white';
              buttonBgClass = 'bg-amber-600 hover:bg-amber-700';
            } else if (cat.id === 'process-synchronization') {
              cardColorClass = 'border-purple-200 dark:border-purple-900/60 hover:border-purple-500';
              iconBgClass = 'bg-purple-600 text-white';
              buttonBgClass = 'bg-purple-600 hover:bg-purple-700';
            }

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative rounded-3xl border-2 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden ${cardColorClass}`}
              >
                {/* Top header & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform ${iconBgClass}`}
                    >
                      {icon}
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {cat.subtopics.length} Subtopics
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.title}
                  </h3>

                  <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1 mb-3">
                    {cat.subtitle}
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Progress & Explore Button */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-2">
                    <span>Category Progress</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {completedCount} / {cat.subtopics.length} Completed
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-6">
                    <div
                      style={{ width: `${catProgressPct}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${iconBgClass}`}
                    />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCategory(cat.id);
                    }}
                    className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition group-hover:gap-3 cursor-pointer ${buttonBgClass}`}
                  >
                    <span>Explore Topics</span>
                    <ArrowRight className="w-4 h-4 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Launch Simulators Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <Sliders className="w-4 h-4" /> Lab Practical Hub
              </div>
              <h3 className="text-2xl font-black tracking-tight">
                Quick Access Interactive Simulators
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Need to calculate Gantt charts for homework or test Banker&apos;s safe sequences for tomorrow&apos;s exam? Jump straight into the simulator!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularSimulators.map(sim => (
              <button
                key={sim.id}
                onClick={() => onSelectTopic(sim.id)}
                className="text-left p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition flex items-center justify-between group cursor-pointer backdrop-blur"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    {sim.name}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Category: {sim.cat}
                  </div>
                </div>
                <Play className="w-4 h-4 text-amber-400 shrink-0 ml-2 group-hover:scale-125 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
