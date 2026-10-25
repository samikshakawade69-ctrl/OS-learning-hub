import React, { useState, useMemo } from 'react';
import { ArrowRight, ArrowLeft, RotateCcw, Check, X, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

export type PageAlgo = 'fifo' | 'lru' | 'optimal';

interface StepFrameState {
  page: number;
  frames: (number | null)[];
  isFault: boolean;
  victimPage?: number | null;
  explanation: string;
}

const PRESET_STRINGS = [
  { name: 'Standard Textbook', str: '7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1' },
  { name: 'Belady\'s Anomaly (FIFO)', str: '1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5' },
  { name: 'High Locality', str: '1, 2, 1, 2, 3, 1, 2, 3, 4, 2, 1, 5' }
];

export const PageReplacementSimulator: React.FC = () => {
  const [algo, setAlgo] = useState<PageAlgo>('fifo');
  const [frameCount, setFrameCount] = useState<number>(3);
  const [rawString, setRawString] = useState<string>(PRESET_STRINGS[0].str);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Parse reference string
  const referencePages = useMemo(() => {
    return rawString
      .split(/[\s,]+/)
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
  }, [rawString]);

  // Compute all step states
  const steps: StepFrameState[] = useMemo(() => {
    return computePageReplacement(algo, referencePages, frameCount);
  }, [algo, referencePages, frameCount]);

  const currentStepData = steps[activeStep] || null;

  const totalFaults = steps.filter(s => s.isFault).length;
  const totalHits = steps.length - totalFaults;
  const hitRatio = steps.length > 0 ? ((totalHits / steps.length) * 100).toFixed(1) : '0';
  const faultRatio = steps.length > 0 ? ((totalFaults / steps.length) * 100).toFixed(1) : '0';

  const isBeladyPreset = rawString.includes('1, 2, 3, 4, 1, 2, 5');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Page Replacement Simulator (FIFO, LRU, Optimal)
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Compare page faults and frame evictions across classic virtual memory page replacement algorithms.
          </p>
        </div>

        {/* Algo Selector */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {[
            { id: 'fifo', label: 'FIFO' },
            { id: 'lru', label: 'LRU' },
            { id: 'optimal', label: 'Optimal' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setAlgo(item.id as PageAlgo); setActiveStep(0); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition cursor-pointer ${
                algo === item.id
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="md:col-span-2 space-y-2">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Page Reference String
          </label>
          <input
            type="text"
            value={rawString}
            onChange={e => { setRawString(e.target.value); setActiveStep(0); }}
            placeholder="e.g. 7, 0, 1, 2, 0, 3, 0, 4, 2, 3"
            className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400">Presets:</span>
            {PRESET_STRINGS.map(preset => (
              <button
                key={preset.name}
                onClick={() => { setRawString(preset.str); setActiveStep(0); }}
                className="text-[11px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Frames Counter */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Number of Page Frames
          </label>
          <div className="flex items-center gap-3">
            {[3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => { setFrameCount(num); setActiveStep(0); }}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition cursor-pointer ${
                  frameCount === num
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {num} Frames
              </button>
            ))}
          </div>
          {isBeladyPreset && algo === 'fifo' && (
            <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              Tip: Test 3 vs 4 frames to observe Belady's Anomaly!
            </div>
          )}
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
          <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold uppercase">Page Faults (Misses)</div>
          <div className="text-2xl font-black text-rose-950 dark:text-rose-100 mt-1">{totalFaults}</div>
          <div className="text-[11px] text-rose-600/80 mt-0.5">Fault Rate: {faultRatio}%</div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Page Hits</div>
          <div className="text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-1">{totalHits}</div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Hit Rate: {hitRatio}%</div>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase">Total References</div>
          <div className="text-2xl font-black text-indigo-950 dark:text-indigo-100 mt-1">{steps.length}</div>
          <div className="text-[11px] text-indigo-600/80 mt-0.5">{frameCount} physical frames</div>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
          <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase">Algorithm Mode</div>
          <div className="text-2xl font-black text-purple-950 dark:text-purple-100 mt-1 uppercase">{algo}</div>
          <div className="text-[11px] text-purple-600/80 mt-0.5">{algo === 'optimal' ? 'Future knowledge' : algo === 'lru' ? 'Least recently used' : 'First-in first-out'}</div>
        </div>
      </div>

      {/* Step by Step Navigation */}
      <div className="flex flex-wrap items-center justify-between bg-slate-900 text-white p-3 rounded-xl mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
            disabled={activeStep <= 0}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition cursor-pointer"
            title="Previous Page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-medium px-2">
            Step {steps.length > 0 ? activeStep + 1 : 0} of {steps.length}
          </span>
          <button
            onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={activeStep >= steps.length - 1}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 transition cursor-pointer"
            title="Next Page"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveStep(steps.length - 1)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            Show All
          </button>
          <button
            onClick={() => setActiveStep(0)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {currentStepData && (
          <div className="text-xs text-slate-300 font-mono flex items-center gap-2">
            Referencing Page: <span className="font-bold text-amber-400 text-sm">{currentStepData.page}</span>
            {currentStepData.isFault ? (
              <span className="px-2 py-0.5 rounded bg-rose-600/80 text-white text-[11px] font-bold">FAULT (MISS)</span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-600/80 text-white text-[11px] font-bold">HIT!</span>
            )}
          </div>
        )}
      </div>

      {/* Step Explanation Banner */}
      {currentStepData && (
        <div className="mb-6 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong>Step {activeStep + 1} Explanation: </strong>
            {currentStepData.explanation}
          </div>
        </div>
      )}

      {/* Full Frame Matrix Grid */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
        <table className="w-full text-center text-xs border-collapse">
          <thead>
            {/* Page Reference Header */}
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <th className="p-2.5 text-left bg-slate-200 dark:bg-slate-700/80 sticky left-0 min-w-[90px]">Page Ref</th>
              {steps.map((st, i) => (
                <th
                  key={i}
                  className={`p-2.5 font-mono cursor-pointer transition ${
                    i === activeStep ? 'bg-indigo-600 text-white scale-105' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => setActiveStep(i)}
                >
                  {st.page}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Rows for each Frame */}
            {Array.from({ length: frameCount }).map((_, frameIdx) => (
              <tr key={frameIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                <td className="p-2.5 text-left font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 sticky left-0">
                  Frame {frameIdx + 1}
                </td>
                {steps.map((st, i) => {
                  const val = st.frames[frameIdx];
                  const isCurrentStep = i === activeStep;
                  const isJustInserted = val === st.page && st.isFault;

                  return (
                    <td
                      key={i}
                      className={`p-2 font-mono font-bold transition ${
                        isCurrentStep ? 'bg-indigo-50 dark:bg-indigo-950/30' : ''
                      }`}
                    >
                      {val !== null ? (
                        <span
                          className={`inline-block w-7 h-7 leading-7 rounded-md text-xs ${
                            isJustInserted
                              ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-200 font-extrabold ring-1 ring-rose-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {val}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Hit / Miss Status Row */}
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-t-2 border-slate-200 dark:border-slate-700 font-bold">
              <td className="p-2.5 text-left text-slate-600 dark:text-slate-300 sticky left-0 bg-slate-100 dark:bg-slate-800">
                Status
              </td>
              {steps.map((st, i) => (
                <td key={i} className="p-2">
                  {st.isFault ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white font-bold text-[10px]" title="Page Fault (Miss)">
                      M
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-[10px]" title="Page Hit">
                      H
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Pure algorithmic simulation for FIFO, LRU, Optimal
function computePageReplacement(
  algo: PageAlgo,
  pages: number[],
  numFrames: number
): StepFrameState[] {
  const steps: StepFrameState[] = [];
  const currentFrames: (number | null)[] = Array(numFrames).fill(null);

  // FIFO tracking: queue of page insertion order
  const fifoQueue: number[] = [];
  // LRU tracking: map page -> last accessed time
  const lastAccess = new Map<number, number>();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const isHit = currentFrames.includes(page);

    if (isHit) {
      if (algo === 'lru') {
        lastAccess.set(page, i);
      }
      steps.push({
        page,
        frames: [...currentFrames],
        isFault: false,
        explanation: `Page ${page} is already in physical memory. Hit! No page fault.`
      });
      continue;
    }

    // Page Fault!
    let victim: number | null = null;
    let victimIdx = -1;

    // Check if an empty frame exists
    const emptyIndex = currentFrames.indexOf(null);
    if (emptyIndex !== -1) {
      victimIdx = emptyIndex;
      currentFrames[victimIdx] = page;
      fifoQueue.push(page);
      if (algo === 'lru') lastAccess.set(page, i);

      steps.push({
        page,
        frames: [...currentFrames],
        isFault: true,
        victimPage: null,
        explanation: `Empty Frame ${emptyIndex + 1} available. Page ${page} loaded directly (Page Fault).`
      });
      continue;
    }

    // All frames full -> eviction required!
    if (algo === 'fifo') {
      const oldestPage = fifoQueue.shift()!;
      victim = oldestPage;
      victimIdx = currentFrames.indexOf(oldestPage);
      currentFrames[victimIdx] = page;
      fifoQueue.push(page);
    } else if (algo === 'lru') {
      // Find page with lowest lastAccess index
      let leastRecentTime = Infinity;
      for (const p of currentFrames) {
        if (p !== null) {
          const t = lastAccess.get(p) ?? -1;
          if (t < leastRecentTime) {
            leastRecentTime = t;
            victim = p;
          }
        }
      }
      victimIdx = currentFrames.indexOf(victim!);
      currentFrames[victimIdx] = page;
      lastAccess.set(page, i);
    } else if (algo === 'optimal') {
      // Find page that won't be used for the longest in the future
      let farthestFutureUse = -1;
      for (const p of currentFrames) {
        if (p !== null) {
          let nextUse = Infinity;
          for (let f = i + 1; f < pages.length; f++) {
            if (pages[f] === p) {
              nextUse = f;
              break;
            }
          }
          if (nextUse > farthestFutureUse) {
            farthestFutureUse = nextUse;
            victim = p;
          }
        }
      }
      victimIdx = currentFrames.indexOf(victim!);
      currentFrames[victimIdx] = page;
    }

    const algoReason =
      algo === 'fifo'
        ? `Oldest inserted page was ${victim}.`
        : algo === 'lru'
        ? `Least recently referenced page was ${victim}.`
        : `Page ${victim} has farthest future reference.`;

    steps.push({
      page,
      frames: [...currentFrames],
      isFault: true,
      victimPage: victim,
      explanation: `All frames full. Evicted victim page ${victim} from Frame ${victimIdx + 1} (${algoReason}). Loaded page ${page}.`
    });
  }

  return steps;
}
