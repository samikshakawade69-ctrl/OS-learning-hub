import React, { useState } from 'react';
import {
  SubTopic,
  Category
} from '../../types/os';
import {
  Bookmark,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Cpu,
  Layers,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Check,
  X,
  Sparkles,
  Award
} from 'lucide-react';

// Import our simulator components
import { CpuSchedulingSimulator } from '../simulators/CpuSchedulingSimulator';
import { MemoryAllocationSimulator } from '../simulators/MemoryAllocationSimulator';
import { PageReplacementSimulator } from '../simulators/PageReplacementSimulator';
import { BankersSimulator } from '../simulators/BankersSimulator';
import { RagSimulator } from '../simulators/RagSimulator';
import { ProducerConsumerSimulator } from '../simulators/ProducerConsumerSimulator';
import { DiningPhilosophersSimulator } from '../simulators/DiningPhilosophersSimulator';
import { ReadersWritersSimulator } from '../simulators/ReadersWritersSimulator';
import { PetersonAlgorithmSimulator } from '../simulators/PetersonAlgorithmSimulator';
import { PagingAddressSimulator } from '../simulators/PagingAddressSimulator';

interface TopicLayoutProps {
  subtopic: SubTopic;
  category: Category;
  isCompleted: boolean;
  isBookmarked: boolean;
  onToggleComplete: () => void;
  onToggleBookmark: () => void;
  onPrevTopic?: () => void;
  onNextTopic?: () => void;
  prevTopicTitle?: string;
  nextTopicTitle?: string;
  onQuizComplete: (score: number, total: number) => void;
  savedQuizScore?: { score: number; total: number };
}

export const TopicLayout: React.FC<TopicLayoutProps> = ({
  subtopic,
  category,
  isCompleted,
  isBookmarked,
  onToggleComplete,
  onToggleBookmark,
  onPrevTopic,
  onNextTopic,
  prevTopicTitle,
  nextTopicTitle,
  onQuizComplete,
  savedQuizScore
}) => {
  const { content } = subtopic;

  // Practice questions reveal answers
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(!!savedQuizScore);

  const toggleReveal = (idx: number) => {
    setRevealedAnswers(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleQuizSubmit = () => {
    let score = 0;
    content.quiz.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    setSubmittedQuiz(true);
    onQuizComplete(score, content.quiz.length);
  };

  const handleQuizReset = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
  };

  // Render proper simulator
  const renderSimulator = () => {
    switch (subtopic.simulatorType) {
      case 'cpu-scheduling':
        return <CpuSchedulingSimulator />;
      case 'memory-allocation':
        return <MemoryAllocationSimulator />;
      case 'page-replacement':
        return <PageReplacementSimulator />;
      case 'bankers':
        return <BankersSimulator />;
      case 'rag':
        return <RagSimulator />;
      case 'producer-consumer':
        return <ProducerConsumerSimulator />;
      case 'dining-philosophers':
        return <DiningPhilosophersSimulator />;
      case 'readers-writers':
        return <ReadersWritersSimulator />;
      case 'peterson':
        return <PetersonAlgorithmSimulator />;
      case 'paging-translation':
        return <PagingAddressSimulator />;
      default:
        return (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Cpu className="w-10 h-10 text-indigo-500 mx-auto mb-2 opacity-80" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Visual Demonstration & Flow Available Above
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              This concept is best understood via the step-by-step logic and visual diagrams in Sections 3 and 4!
            </p>
          </div>
        );
    }
  };

  return (
    <article className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* 1. Header & Actions */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {subtopic.section}
              </span>
              {subtopic.badge && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  {subtopic.badge}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {subtopic.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
              {subtopic.shortDescription}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleBookmark}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-700 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Bookmark Topic"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              onClick={onToggleComplete}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Introduction */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          1. Introduction
        </h2>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed text-sm shadow-sm">
          {content.introduction}
        </div>
      </section>

      {/* SECTION 2: Why Is It Used? */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          2. Why Is It Used?
        </h2>
        <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
          {content.whyUsed}
        </div>
      </section>

      {/* SECTION 3: How It Works */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          3. How It Works (Step-by-Step)
        </h2>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          {content.howItWorks.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Diagram / Visual Representation */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          4. Diagram & Architecture Flow
        </h2>
        <div className="p-5 rounded-2xl bg-slate-900 text-indigo-300 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner leading-relaxed">
          <pre>{content.diagramDescription}</pre>
        </div>
      </section>

      {/* SECTION 5: Example (Real-Life & Numerical) */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          5. Example & Problem Walkthrough
        </h2>
        <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-3">
          <div className="font-bold text-sm text-amber-900 dark:text-amber-200">
            {content.example.title}
          </div>
          <div className="text-xs text-amber-800 dark:text-amber-300/90 font-medium">
            <strong>Scenario: </strong>{content.example.scenario}
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
            {content.example.solution}
          </div>
        </div>
      </section>

      {/* SECTION 6: Interactive Simulation (Crucial Feature!) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            6. Interactive Simulation
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
            Hands-on Experimentation
          </span>
        </div>
        {renderSimulator()}
      </section>

      {/* SECTION 7: Advantages and Disadvantages */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          7. Advantages & Disadvantages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-3">
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              Advantages
            </div>
            <ul className="space-y-2 text-xs text-emerald-950 dark:text-emerald-100">
              {content.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm mb-3">
              <ThumbsDown className="w-4 h-4 text-rose-600" />
              Disadvantages
            </div>
            <ul className="space-y-2 text-xs text-rose-950 dark:text-rose-100">
              {content.disadvantages.map((dis, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{dis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 8: Exam Notes */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          8. High-Yield Exam Notes
        </h2>
        <div className="p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-2.5">
          {content.examNotes.map((note, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
              <span className="font-bold text-amber-600">★</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: Practice Questions */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          9. Practice Questions & Numerical Walkthroughs
        </h2>
        <div className="space-y-3">
          {content.practiceQuestions.map((pq, idx) => {
            const isRevealed = !!revealedAnswers[idx];
            return (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold mr-2">Q{idx + 1}.</span>
                    {pq.question}
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                    {pq.type}
                  </span>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => toggleReveal(idx)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {isRevealed ? 'Hide Answer' : 'Reveal Answer & Solution'}
                  </button>

                  {isRevealed && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {pq.answer}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 10: Quick Quiz */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            10. Quick Quiz & Knowledge Check
          </h2>
          {submittedQuiz && (
            <button
              onClick={handleQuizReset}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Retake Quiz
            </button>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {content.quiz.map((q, qIdx) => {
            const userChoice = selectedAnswers[q.id];
            const isAnswered = userChoice !== undefined;
            const isCorrect = userChoice === q.correctAnswer;

            return (
              <div key={q.id} className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {qIdx + 1}. {q.question}
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === optIdx;
                    let optionStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800';

                    if (submittedQuiz) {
                      if (optIdx === q.correctAnswer) {
                        optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold';
                      }
                    } else if (isSelected) {
                      optionStyle = 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-bold ring-2 ring-indigo-500/20';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submittedQuiz}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {submittedQuiz && optIdx === q.correctAnswer && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                        {submittedQuiz && isSelected && !isCorrect && (
                          <X className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {submittedQuiz && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                    <strong>Explanation: </strong>{q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Quiz button */}
          {!submittedQuiz ? (
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(selectedAnswers).length < content.quiz.length}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs transition cursor-pointer"
            >
              Submit Quiz & Check Score
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Quiz Results</span>
              <div className="text-2xl font-black text-indigo-950 dark:text-indigo-100 mt-1">
                Score: {content.quiz.filter(q => selectedAnswers[q.id] === q.correctAnswer).length} / {content.quiz.length}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Navigation Footer: Prev / Next Subtopic */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        {onPrevTopic ? (
          <button
            onClick={onPrevTopic}
            className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Previous Topic</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                {prevTopicTitle}
              </div>
            </div>
          </button>
        ) : <div />}

        {onNextTopic ? (
          <button
            onClick={onNextTopic}
            className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-right transition cursor-pointer group"
          >
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Next Topic</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                {nextTopicTitle}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : <div />}
      </div>
    </article>
  );
};
