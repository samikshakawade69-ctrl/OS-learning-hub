import React from 'react';
import { Category, SubTopic, UserProgress } from '../../types/os';
import {
  Cpu,
  Activity,
  ShieldAlert,
  Layers,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Sparkles,
  Sliders
} from 'lucide-react';

interface CategoryViewProps {
  category: Category;
  progress: UserProgress;
  onSelectTopic: (topicId: string) => void;
  onNavigateHome: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-8 h-8" />,
  Activity: <Activity className="w-8 h-8" />,
  ShieldAlert: <ShieldAlert className="w-8 h-8" />,
  Layers: <Layers className="w-8 h-8" />
};

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  progress,
  onSelectTopic,
  onNavigateHome
}) => {
  const completedInCat = category.subtopics.filter(s =>
    progress.completedTopics.includes(s.id)
  ).length;
  const pct = Math.round((completedInCat / category.subtopics.length) * 100);

  // Group subtopics by section
  const sectionsMap = new Map<string, SubTopic[]>();
  category.subtopics.forEach(sub => {
    const list = sectionsMap.get(sub.section) || [];
    list.push(sub);
    sectionsMap.set(sub.section, list);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Category Hero Banner */}
      <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shrink-0">
              {ICON_MAP[category.iconName]}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Operating Systems Module
              </span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {category.title}
              </h1>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                {category.subtitle}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-semibold text-slate-500 uppercase">Module Progress</div>
            <div className="text-xl font-mono font-black text-slate-900 dark:text-white mt-0.5">
              {completedInCat} / {category.subtopics.length} Done
            </div>
            <div className="w-36 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div
                style={{ width: `${pct}%` }}
                className="h-full bg-indigo-600 rounded-full transition-all"
              />
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-6 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-6">
          {category.description}
        </p>
      </div>

      {/* Subtopics Grouped by Section */}
      <div className="space-y-8">
        {Array.from(sectionsMap.entries()).map(([sectionTitle, subtopics]) => (
          <div key={sectionTitle} className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>{sectionTitle}</span>
              <span className="text-xs font-normal text-slate-400">
                ({subtopics.length} {subtopics.length === 1 ? 'topic' : 'topics'})
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subtopics.map(topic => {
                const isCompleted = progress.completedTopics.includes(topic.id);
                return (
                  <div
                    key={topic.id}
                    onClick={() => onSelectTopic(topic.id)}
                    className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {topic.section}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {topic.badge && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              {topic.badge}
                            </span>
                          )}
                          {isCompleted && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {topic.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {topic.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Explore Topic & Simulator</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
