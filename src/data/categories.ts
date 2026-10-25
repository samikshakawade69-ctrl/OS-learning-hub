import { Category } from '../types/os';
import { memorySubtopics } from './memoryData';
import { processSubtopics } from './processData';
import { deadlockSubtopics } from './deadlockData';
import { syncSubtopics } from './syncData';

export const categories: Category[] = [
  {
    id: 'memory-management',
    title: 'Memory Management',
    subtitle: 'RAM Allocation, Paging, Segmentation & Virtual Memory',
    description: 'Master how the operating system coordinates physical RAM, converts addresses through MMU & TLB, handles page faults, and optimizes allocation with First/Best/Worst Fit.',
    iconName: 'Cpu',
    themeColor: {
      primary: 'indigo-600',
      light: 'indigo-50',
      border: 'indigo-200',
      text: 'indigo-700',
      badgeBg: 'indigo-100',
      gradient: 'from-indigo-600 via-blue-600 to-indigo-800'
    },
    subtopics: memorySubtopics
  },
  {
    id: 'process-management',
    title: 'Process Management',
    subtitle: 'States, PCB, Context Switching & CPU Scheduling',
    description: 'Explore the heart of multitasking OS: process lifecycles, states, and interactive CPU scheduling with animated Gantt charts for FCFS, SJF, SRTF, Priority & Round Robin.',
    iconName: 'Activity',
    themeColor: {
      primary: 'emerald-600',
      light: 'emerald-50',
      border: 'emerald-200',
      text: 'emerald-700',
      badgeBg: 'emerald-100',
      gradient: 'from-emerald-600 via-teal-600 to-emerald-800'
    },
    subtopics: processSubtopics
  },
  {
    id: 'deadlock-management',
    title: 'Deadlock Management',
    subtitle: 'Coffman Conditions, Prevention, Banker’s Algorithm & RAG',
    description: 'Understand how deadlocks freeze computers. Simulate Banker’s algorithm with step-by-step safe sequence checks and inspect Resource Allocation Graphs with cycle detection.',
    iconName: 'ShieldAlert',
    themeColor: {
      primary: 'amber-600',
      light: 'amber-50',
      border: 'amber-200',
      text: 'amber-700',
      badgeBg: 'amber-100',
      gradient: 'from-amber-600 via-orange-600 to-amber-800'
    },
    subtopics: deadlockSubtopics
  },
  {
    id: 'process-synchronization',
    title: 'Process Synchronization',
    subtitle: 'Race Conditions, Semaphores, Mutex & Classical Problems',
    description: 'Solve race conditions and coordinate concurrent threads. Explore interactive animations of Producer-Consumer, Readers-Writers, Dining Philosophers, and Peterson’s Algorithm.',
    iconName: 'Layers',
    themeColor: {
      primary: 'purple-600',
      light: 'purple-50',
      border: 'purple-200',
      text: 'purple-700',
      badgeBg: 'purple-100',
      gradient: 'from-purple-600 via-fuchsia-600 to-purple-800'
    },
    subtopics: syncSubtopics
  }
];

export const allSubtopics = categories.flatMap(c => c.subtopics);

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id);
}

export function getSubtopicById(id: string) {
  for (const cat of categories) {
    const found = cat.subtopics.find(s => s.id === id);
    if (found) return { subtopic: found, category: cat };
  }
  return null;
}
