import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { Category, SubTopic } from '../../types/os';

interface BreadcrumbProps {
  category?: Category | null;
  subtopic?: SubTopic | null;
  onNavigateHome: () => void;
  onNavigateCategory: (catId: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  category,
  subtopic,
  onNavigateHome,
  onNavigateCategory
}) => {
  return (
    <nav className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 py-3 mb-4 overflow-x-auto">
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home Dashboard</span>
      </button>

      {category && (
        <>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-300 dark:text-slate-600 shrink-0" />
          <button
            onClick={() => onNavigateCategory(category.id)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer shrink-0"
          >
            {category.title}
          </button>
        </>
      )}

      {subtopic && (
        <>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-300 dark:text-slate-600 shrink-0" />
          <span className="font-bold text-slate-900 dark:text-white truncate">
            {subtopic.title}
          </span>
        </>
      )}
    </nav>
  );
};
