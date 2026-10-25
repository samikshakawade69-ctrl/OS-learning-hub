/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProgress } from './types/os';
import { categories, allSubtopics, getCategoryById, getSubtopicById } from './data/categories';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Breadcrumb } from './components/common/Breadcrumb';
import { TopicLayout } from './components/common/TopicLayout';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { CategoryView } from './components/dashboard/CategoryView';
import { LearningDashboardModal } from './components/dashboard/LearningDashboardModal';

const STORAGE_KEY_PROGRESS = 'os_learning_hub_progress_v2';
const STORAGE_KEY_THEME = 'os_learning_hub_theme';

const INITIAL_PROGRESS: UserProgress = {
  completedTopics: [],
  bookmarkedTopics: [],
  quizScores: {},
  recentlyVisited: []
};

export default function App() {
  // Navigation states
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Modals
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState<boolean>(false);
  const [dashboardModalTab, setDashboardModalTab] = useState<'progress' | 'bookmarks'>('progress');

  // Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // User Progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse progress from localStorage', e);
    }
    return INITIAL_PROGRESS;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDarkMode]);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  // Track recently visited topic
  const recordVisit = (topicId: string) => {
    setProgress(prev => {
      const updated = [topicId, ...prev.recentlyVisited.filter(id => id !== topicId)].slice(0, 10);
      return { ...prev, recentlyVisited: updated };
    });
  };

  // Navigation handlers
  const handleNavigateHome = () => {
    setCurrentCategoryId(null);
    setCurrentTopicId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId: string) => {
    setCurrentCategoryId(catId);
    setCurrentTopicId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTopic = (topicId: string) => {
    const found = getSubtopicById(topicId);
    if (found) {
      setCurrentCategoryId(found.category.id);
      setCurrentTopicId(topicId);
      recordVisit(topicId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle topic completion
  const handleToggleComplete = (topicId: string) => {
    setProgress(prev => {
      const exists = prev.completedTopics.includes(topicId);
      const updated = exists
        ? prev.completedTopics.filter(id => id !== topicId)
        : [...prev.completedTopics, topicId];
      return { ...prev, completedTopics: updated };
    });
  };

  // Toggle topic bookmark
  const handleToggleBookmark = (topicId: string) => {
    setProgress(prev => {
      const exists = prev.bookmarkedTopics.includes(topicId);
      const updated = exists
        ? prev.bookmarkedTopics.filter(id => id !== topicId)
        : [...prev.bookmarkedTopics, topicId];
      return { ...prev, bookmarkedTopics: updated };
    });
  };

  // Save quiz score
  const handleQuizComplete = (topicId: string, score: number, total: number) => {
    setProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [topicId]: {
          score,
          total,
          completedAt: new Date().toISOString()
        }
      },
      completedTopics: prev.completedTopics.includes(topicId)
        ? prev.completedTopics
        : [...prev.completedTopics, topicId]
    }));
  };

  // Reset all progress
  const handleResetProgress = () => {
    setProgress(INITIAL_PROGRESS);
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
    setIsDashboardModalOpen(false);
  };

  // Get current objects
  const activeCategory = currentCategoryId ? getCategoryById(currentCategoryId) || null : null;
  const activeSubtopicData = currentTopicId ? getSubtopicById(currentTopicId) : null;
  const activeSubtopic = activeSubtopicData ? activeSubtopicData.subtopic : null;

  // Previous & Next navigation logic
  const allTopicIndex = currentTopicId
    ? allSubtopics.findIndex(s => s.id === currentTopicId)
    : -1;

  const prevTopic = allTopicIndex > 0 ? allSubtopics[allTopicIndex - 1] : null;
  const nextTopic =
    allTopicIndex >= 0 && allTopicIndex < allSubtopics.length - 1
      ? allSubtopics[allTopicIndex + 1]
      : null;

  const isShowingHome = !currentCategoryId && !currentTopicId;
  const isShowingCategory = !!currentCategoryId && !currentTopicId;
  const isShowingTopic = !!currentTopicId && !!activeSubtopic;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        progress={progress}
        onNavigateHome={handleNavigateHome}
        onSelectCategory={handleSelectCategory}
        onSelectSubtopic={handleSelectTopic}
        onOpenDashboard={() => {
          setDashboardModalTab('progress');
          setIsDashboardModalOpen(true);
        }}
        onOpenBookmarks={() => {
          setDashboardModalTab('bookmarks');
          setIsDashboardModalOpen(true);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex w-full">
        {/* Sidebar Navigation */}
        <Sidebar
          currentTopicId={currentTopicId}
          currentCategoryId={currentCategoryId}
          progress={progress}
          onSelectTopic={handleSelectTopic}
          onSelectCategory={handleSelectCategory}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all w-full ${
            // In Topic or Category view, leave space for desktop sidebar
            !isShowingHome ? 'lg:pl-72' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {/* Breadcrumb Navigation */}
            {!isShowingHome && (
              <Breadcrumb
                category={activeCategory}
                subtopic={activeSubtopic}
                onNavigateHome={handleNavigateHome}
                onNavigateCategory={handleSelectCategory}
              />
            )}

            {/* View 1: Home Dashboard */}
            {isShowingHome && (
              <HomeDashboard
                progress={progress}
                onSelectCategory={handleSelectCategory}
                onSelectTopic={handleSelectTopic}
              />
            )}

            {/* View 2: Category Overview */}
            {isShowingCategory && activeCategory && (
              <CategoryView
                category={activeCategory}
                progress={progress}
                onSelectTopic={handleSelectTopic}
                onNavigateHome={handleNavigateHome}
              />
            )}

            {/* View 3: Subtopic Standard Layout (10 Sections) */}
            {isShowingTopic && activeSubtopic && activeSubtopicData && (
              <TopicLayout
                subtopic={activeSubtopic}
                category={activeSubtopicData.category}
                isCompleted={progress.completedTopics.includes(activeSubtopic.id)}
                isBookmarked={progress.bookmarkedTopics.includes(activeSubtopic.id)}
                onToggleComplete={() => handleToggleComplete(activeSubtopic.id)}
                onToggleBookmark={() => handleToggleBookmark(activeSubtopic.id)}
                onPrevTopic={prevTopic ? () => handleSelectTopic(prevTopic.id) : undefined}
                onNextTopic={nextTopic ? () => handleSelectTopic(nextTopic.id) : undefined}
                prevTopicTitle={prevTopic?.title}
                nextTopicTitle={nextTopic?.title}
                onQuizComplete={(score, total) => handleQuizComplete(activeSubtopic.id, score, total)}
                savedQuizScore={progress.quizScores[activeSubtopic.id]}
              />
            )}
          </div>
        </main>
      </div>

      {/* Progress & Bookmarks Modal */}
      <LearningDashboardModal
        isOpen={isDashboardModalOpen}
        onClose={() => setIsDashboardModalOpen(false)}
        progress={progress}
        onSelectTopic={handleSelectTopic}
        onResetProgress={handleResetProgress}
        initialTab={dashboardModalTab}
      />
    </div>
  );
}
