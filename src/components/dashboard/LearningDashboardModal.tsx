import React from 'react';
import {
  X,
  Award,
  Bookmark,
  Clock,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { UserProgress } from '../../types/os';
import { categories, allSubtopics, getSubtopicById } from '../../data/categories';

interface LearningDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSelectTopic: (topicId: string) => void;
  onResetProgress: () => void;
  initialTab?: 'progress' | 'bookmarks';
}

export const LearningDashboardModal: React.FC<LearningDashboardModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSelectTopic,
  onResetProgress,
  initialTab = 'progress'
}) => {
  const [activeTab, setActiveTab] = React.useState<'progress' | 'bookmarks'>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const totalTopics = allSubtopics.length;
  const completedCount = progress.completedTopics.length;
  const progressPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Quiz calculations
  const quizScoresList = Object.values(progress.quizScores);
  const totalQuizzesTaken = quizScoresList.length;
  const totalQuestions = quizScoresList.reduce((acc, q) => acc + q.total, 0);
  const totalCorrect = quizScoresList.reduce((acc, q) => acc + q.score, 0);
  const avgQuizPct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Student Learning Dashboard
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your syllabus progress, quiz scores, and saved topics.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex px-6 pt-4 border-b border-slate-100 dark:border-slate-800 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('progress')}
            className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'progress'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Progress Overview
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookmarks'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Bookmarked Topics ({progress.bookmarkedTopics.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'progress' ? (
            <>
              {/* Top Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-center">
                  <div className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                    Topics Completed
                  </div>
                  <div className="text-2xl font-black text-indigo-950 dark:text-indigo-100 mt-1 font-mono">
                    {completedCount} / {totalTopics}
                  </div>
                  <div className="text-[10px] text-indigo-600/80 mt-0.5">{progressPct}% syllabus</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                  <div className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                    Quiz Accuracy
                  </div>
                  <div className="text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-1 font-mono">
                    {avgQuizPct}%
                  </div>
                  <div className="text-[10px] text-emerald-600/80 mt-0.5">
                    {totalCorrect} of {totalQuestions} correct
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
                  <div className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">
                    Quizzes Solved
                  </div>
                  <div className="text-2xl font-black text-amber-950 dark:text-amber-100 mt-1 font-mono">
                    {totalQuizzesTaken}
                  </div>
                  <div className="text-[10px] text-amber-600/80 mt-0.5">Knowledge checks</div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Progress by Operating System Category
                </h4>
                <div className="space-y-2.5">
                  {categories.map(cat => {
                    const inCat = cat.subtopics.filter(s =>
                      progress.completedTopics.includes(s.id)
                    ).length;
                    const catPct = Math.round((inCat / cat.subtopics.length) * 100);

                    return (
                      <div
                        key={cat.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                      >
                        <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                          <span className="text-slate-800 dark:text-slate-200">{cat.title}</span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400">
                            {inCat} / {cat.subtopics.length} ({catPct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            style={{ width: `${catPct}%` }}
                            className="h-full bg-indigo-600 rounded-full transition-all"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recently Visited */}
              {progress.recentlyVisited.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Recently Visited Topics
                  </h4>
                  <div className="space-y-1.5">
                    {progress.recentlyVisited.slice(0, 5).map(topicId => {
                      const topicData = getSubtopicById(topicId);
                      if (!topicData) return null;
                      return (
                        <button
                          key={topicId}
                          onClick={() => {
                            onSelectTopic(topicId);
                            onClose();
                          }}
                          className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-800/60 transition flex items-center justify-between text-xs cursor-pointer group"
                        >
                          <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {topicData.subtopic.title}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            {topicData.category.title} <ArrowRight className="w-3 h-3" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Bookmarks Tab */
            <div className="space-y-3">
              {progress.bookmarkedTopics.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  No topics bookmarked yet. Click the Bookmark icon on any topic page to save it for quick revision!
                </div>
              ) : (
                <div className="space-y-2">
                  {progress.bookmarkedTopics.map(topicId => {
                    const topicData = getSubtopicById(topicId);
                    if (!topicData) return null;
                    const isDone = progress.completedTopics.includes(topicId);

                    return (
                      <button
                        key={topicId}
                        onClick={() => {
                          onSelectTopic(topicId);
                          onClose();
                        }}
                        className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition flex items-center justify-between text-xs cursor-pointer group bg-slate-50/50 dark:bg-slate-800/30"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-2">
                            {topicData.subtopic.title}
                            {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {topicData.subtopic.section} • {topicData.category.title}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Reset */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all learning progress and quiz scores?')) {
                onResetProgress();
              }
            }}
            className="text-slate-400 hover:text-red-500 flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset All Learning Progress
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition cursor-pointer font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
