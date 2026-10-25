import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  ShieldAlert,
  Layers,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { categories } from '../../data/categories';
import { UserProgress } from '../../types/os';

interface SidebarProps {
  currentTopicId: string | null;
  currentCategoryId: string | null;
  progress: UserProgress;
  onSelectTopic: (topicId: string) => void;
  onSelectCategory: (catId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentTopicId,
  currentCategoryId,
  progress,
  onSelectTopic,
  onSelectCategory,
  isOpen,
  onClose
}) => {
  // Keep track of which category accordion is open (default all open or current category)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'memory-management': true,
    'process-management': true,
    'deadlock-management': true,
    'process-synchronization': true
  });

  const toggleCategory = (catId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 lg:hidden">
          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Course Syllabus & Topics
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable list of categories and subtopics */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {categories.map(cat => {
            const isAccordionOpen = !!openCategories[cat.id];
            const isCategoryActive = currentCategoryId === cat.id;
            const completedInCat = cat.subtopics.filter(s =>
              progress.completedTopics.includes(s.id)
            ).length;

            return (
              <div
                key={cat.id}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden bg-slate-50/50 dark:bg-slate-900/40"
              >
                {/* Category Header */}
                <div
                  className={`p-2.5 flex items-center justify-between cursor-pointer transition select-none ${
                    isCategoryActive
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-bold'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <div className="flex items-center gap-2 text-xs font-bold truncate">
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {ICON_MAP[cat.iconName] || <BookOpen className="w-4 h-4" />}
                    </span>
                    <span className="truncate">{cat.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      {completedInCat}/{cat.subtopics.length}
                    </span>
                    {isAccordionOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Subtopic Items */}
                {isAccordionOpen && (
                  <div className="py-1 px-1.5 space-y-0.5 bg-white dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800">
                    {cat.subtopics.map(topic => {
                      const isSelected = currentTopicId === topic.id;
                      const isCompleted = progress.completedTopics.includes(topic.id);

                      return (
                        <button
                          key={topic.id}
                          onClick={() => {
                            onSelectTopic(topic.id);
                            onClose();
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between group transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-bold shadow-sm'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isCompleted ? (
                              <CheckCircle2
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSelected ? 'text-white' : 'text-emerald-500'
                                }`}
                              />
                            ) : (
                              <div
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  isSelected
                                    ? 'bg-white'
                                    : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-indigo-400'
                                }`}
                              />
                            )}
                            <span className="truncate">{topic.title}</span>
                          </div>

                          {topic.simulatorType && (
                            <span
                              className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase shrink-0 ml-1 ${
                                isSelected
                                  ? 'bg-indigo-700 text-indigo-100'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              SIM
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Exam & Practical Prep Simulator
          </div>
        </div>
      </aside>
    </>
  );
};
