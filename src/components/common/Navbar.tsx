import React, { useState, useRef, useEffect } from 'react';
import {
  Cpu,
  Search,
  Moon,
  Sun,
  Bookmark,
  Award,
  Sliders,
  Menu,
  X,
  ExternalLink,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { categories, allSubtopics } from '../../data/categories';
import { UserProgress } from '../../types/os';

interface NavbarProps {
  progress: UserProgress;
  onNavigateHome: () => void;
  onSelectCategory: (catId: string) => void;
  onSelectSubtopic: (topicId: string) => void;
  onOpenDashboard: () => void;
  onOpenBookmarks: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  onNavigateHome,
  onSelectCategory,
  onSelectSubtopic,
  onOpenDashboard,
  onOpenBookmarks,
  isDarkMode,
  onToggleDarkMode,
  onToggleSidebar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter search results
  const searchResults = searchQuery.trim()
    ? allSubtopics.filter(
        s =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.section.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalTopics = allSubtopics.length;
  const completedCount = progress.completedTopics.length;
  const bookmarkCount = progress.bookmarkedTopics.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Toggle & App Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                OS Learning Hub
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  v2.0
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Interactive OS Simulator
              </div>
            </div>
          </button>
        </div>

        {/* Center: Search Bar with Autocomplete Dropdown */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topics (e.g. Round Robin, Banker's, Paging, Deadlock)..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="p-1 divide-y divide-slate-100 dark:divide-slate-800">
                  {searchResults.map(topic => {
                    const isCompleted = progress.completedTopics.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        onClick={() => {
                          onSelectSubtopic(topic.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center justify-between group transition cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-2">
                            {topic.title}
                            {topic.badge && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold">
                                {topic.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {topic.section}
                          </div>
                        </div>
                        {isCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching topics found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions (Simulators, Dashboard, Bookmarks, Theme Toggle) */}
        <div className="flex items-center gap-2">
          {/* Direct Link to Simulators */}
          <button
            onClick={() => onSelectSubtopic('cpu-scheduling-algorithms')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-semibold transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulators</span>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Bookmarked Topics"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Progress / Dashboard */}
          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Learning Dashboard"
          >
            <Award className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline font-bold">
              {completedCount}/{totalTopics}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
