import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ShieldCheck, AlertTriangle, Utensils, RefreshCw } from 'lucide-react';

type PhilState = 'thinking' | 'hungry' | 'eating';

interface Philosopher {
  id: number;
  name: string;
  state: PhilState;
  leftChopstick: number;
  rightChopstick: number;
  heldChopsticks: number[];
}

export const DiningPhilosophersSimulator: React.FC = () => {
  const NUM = 5;
  const [mode, setMode] = useState<'naive' | 'asymmetric'>('naive');
  
  // Philosophers
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([
    { id: 0, name: 'P0', state: 'thinking', leftChopstick: 0, rightChopstick: 1, heldChopsticks: [] },
    { id: 1, name: 'P1', state: 'thinking', leftChopstick: 1, rightChopstick: 2, heldChopsticks: [] },
    { id: 2, name: 'P2', state: 'thinking', leftChopstick: 2, rightChopstick: 3, heldChopsticks: [] },
    { id: 3, name: 'P3', state: 'thinking', leftChopstick: 3, rightChopstick: 4, heldChopsticks: [] },
    { id: 4, name: 'P4', state: 'thinking', leftChopstick: 4, rightChopstick: 0, heldChopsticks: [] }
  ]);

  // Chopstick holders (-1 if free, otherwise philosopher id)
  const [chopsticks, setChopsticks] = useState<number[]>([-1, -1, -1, -1, -1]);
  const [isDeadlocked, setIsDeadlocked] = useState<boolean>(false);
  const [log, setLog] = useState<string>('System initialized. All philosophers are thinking.');

  // Reset
  const handleReset = () => {
    setPhilosophers([
      { id: 0, name: 'P0', state: 'thinking', leftChopstick: 0, rightChopstick: 1, heldChopsticks: [] },
      { id: 1, name: 'P1', state: 'thinking', leftChopstick: 1, rightChopstick: 2, heldChopsticks: [] },
      { id: 2, name: 'P2', state: 'thinking', leftChopstick: 2, rightChopstick: 3, heldChopsticks: [] },
      { id: 3, name: 'P3', state: 'thinking', leftChopstick: 3, rightChopstick: 4, heldChopsticks: [] },
      { id: 4, name: 'P4', state: 'thinking', leftChopstick: 4, rightChopstick: 0, heldChopsticks: [] }
    ]);
    setChopsticks([-1, -1, -1, -1, -1]);
    setIsDeadlocked(false);
    setLog('Reset completed. All philosophers thinking.');
  };

  // Trigger Naive Deadlock condition: All 5 pick up left chopstick simultaneously
  const triggerDeadlockDemo = () => {
    handleReset();
    setTimeout(() => {
      // Each philosopher 0..4 acquires their left chopstick
      const newChopsticks = [0, 1, 2, 3, 4]; // C0 held by P0, C1 by P1, C2 by P2, C3 by P3, C4 by P4
      const newPhils: Philosopher[] = [
        { id: 0, name: 'P0', state: 'hungry', leftChopstick: 0, rightChopstick: 1, heldChopsticks: [0] },
        { id: 1, name: 'P1', state: 'hungry', leftChopstick: 1, rightChopstick: 2, heldChopsticks: [1] },
        { id: 2, name: 'P2', state: 'hungry', leftChopstick: 2, rightChopstick: 3, heldChopsticks: [2] },
        { id: 3, name: 'P3', state: 'hungry', leftChopstick: 3, rightChopstick: 4, heldChopsticks: [3] },
        { id: 4, name: 'P4', state: 'hungry', leftChopstick: 4, rightChopstick: 0, heldChopsticks: [4] }
      ];
      setChopsticks(newChopsticks);
      setPhilosophers(newPhils);
      setIsDeadlocked(true);
      setLog('DEADLOCK TRIGGERED! Every philosopher picked up their left chopstick. Now all 5 are waiting for their right chopstick in a closed circle. Circular Wait!');
    }, 100);
  };

  // Toggle single philosopher
  const togglePhilosopher = (id: number) => {
    if (isDeadlocked) return;
    const p = philosophers[id];

    if (p.state === 'thinking') {
      // Try to eat
      const leftC = p.leftChopstick;
      const rightC = p.rightChopstick;

      if (mode === 'asymmetric' && id === 4) {
        // P4 picks right first, then left
        if (chopsticks[rightC] === -1 && chopsticks[leftC] === -1) {
          const newC = [...chopsticks];
          newC[rightC] = id;
          newC[leftC] = id;
          setChopsticks(newC);
          setPhilosophers(philosophers.map(phil =>
            phil.id === id ? { ...phil, state: 'eating', heldChopsticks: [rightC, leftC] } : phil
          ));
          setLog(`P4 acquired Chopstick ${rightC} then ${leftC}. Now EATING!`);
        } else {
          setPhilosophers(philosophers.map(phil =>
            phil.id === id ? { ...phil, state: 'hungry' } : phil
          ));
          setLog(`P4 wants to eat (HUNGRY), but chopsticks are in use.`);
        }
      } else {
        // Normal (left then right)
        if (chopsticks[leftC] === -1 && chopsticks[rightC] === -1) {
          const newC = [...chopsticks];
          newC[leftC] = id;
          newC[rightC] = id;
          setChopsticks(newC);
          setPhilosophers(philosophers.map(phil =>
            phil.id === id ? { ...phil, state: 'eating', heldChopsticks: [leftC, rightC] } : phil
          ));
          setLog(`P${id} acquired Chopstick ${leftC} and ${rightC}. Now EATING!`);
        } else {
          setPhilosophers(philosophers.map(phil =>
            phil.id === id ? { ...phil, state: 'hungry' } : phil
          ));
          setLog(`P${id} is HUNGRY, waiting for chopsticks.`);
        }
      }
    } else if (p.state === 'hungry') {
      // Check if chopsticks became free
      const leftC = p.leftChopstick;
      const rightC = p.rightChopstick;
      if (chopsticks[leftC] === -1 && chopsticks[rightC] === -1) {
        const newC = [...chopsticks];
        newC[leftC] = id;
        newC[rightC] = id;
        setChopsticks(newC);
        setPhilosophers(philosophers.map(phil =>
          phil.id === id ? { ...phil, state: 'eating', heldChopsticks: [leftC, rightC] } : phil
        ));
        setLog(`P${id} acquired Chopsticks. Now EATING!`);
      } else {
        setLog(`P${id} still cannot eat. Chopsticks occupied.`);
      }
    } else {
      // Eating -> finish eating, release chopsticks, go back to thinking
      const newC = [...chopsticks];
      p.heldChopsticks.forEach(c => {
        newC[c] = -1;
      });
      setChopsticks(newC);
      setPhilosophers(philosophers.map(phil =>
        phil.id === id ? { ...phil, state: 'thinking', heldChopsticks: [] } : phil
      ));
      setLog(`P${id} finished eating. Released chopsticks. Now THINKING.`);
    }
  };

  // Positions for circular layout
  const philPositions = [
    { x: 250, y: 55 },   // P0 top
    { x: 380, y: 145 },  // P1 top-right
    { x: 335, y: 275 },  // P2 bottom-right
    { x: 165, y: 275 },  // P3 bottom-left
    { x: 120, y: 145 }   // P4 top-left
  ];

  const chopPositions = [
    { x: 320, y: 95 },   // C0 between P0 and P1
    { x: 375, y: 215 },  // C1 between P1 and P2
    { x: 250, y: 285 },  // C2 between P2 and P3
    { x: 125, y: 215 },  // C3 between P3 and P4
    { x: 180, y: 95 }    // C4 between P4 and P0
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Dining Philosophers Problem Simulator
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Classic synchronization dilemma illustrating race conditions, circular wait deadlock, and asymmetric solutions.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => { setMode('naive'); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              mode === 'naive'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Naive (Deadlock-Prone)
          </button>
          <button
            onClick={() => { setMode('asymmetric'); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              mode === 'asymmetric'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Asymmetric (Deadlock-Free)
          </button>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 my-5">
        <div className="flex items-center gap-2">
          {mode === 'naive' && (
            <button
              onClick={triggerDeadlockDemo}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" /> Trigger Deadlock Demo
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reset Table
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Click any philosopher circle to toggle state (Thinking → Hungry → Eating)
        </div>
      </div>

      {/* Deadlock Banner */}
      {isDeadlocked && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
          <div className="text-xs">
            <strong className="block text-sm">CIRCULAR WAIT DEADLOCK ACTIVE!</strong>
            All 5 philosophers are holding 1 chopstick and waiting indefinitely for their neighbor to release the next one.
          </div>
        </div>
      )}

      {/* Interactive Circular Table Canvas */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950 p-6 flex justify-center">
        <svg width="500" height="340" viewBox="0 0 500 340" className="select-none">
          {/* Table Surface */}
          <circle cx="250" cy="180" r="105" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="4" />
          <circle cx="250" cy="180" r="45" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          <text x="250" y="184" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
            NOODLE BOWL
          </text>

          {/* Chopsticks */}
          {chopPositions.map((pos, idx) => {
            const holder = chopsticks[idx];
            const isHeld = holder !== -1;
            return (
              <g key={idx} transform={`translate(${pos.x}, ${pos.y})`}>
                <line
                  x1="-10"
                  y1="-10"
                  x2="10"
                  y2="10"
                  stroke={isHeld ? '#ef4444' : '#64748b'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="0" r="7" fill={isHeld ? '#dc2626' : '#94a3b8'} />
                <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  {idx}
                </text>
              </g>
            );
          })}

          {/* Philosophers */}
          {philosophers.map((phil, idx) => {
            const pos = philPositions[idx];
            const isEating = phil.state === 'eating';
            const isHungry = phil.state === 'hungry';

            const fillColor = isEating ? '#10b981' : isHungry ? '#f59e0b' : '#3b82f6';
            const strokeColor = isEating ? '#047857' : isHungry ? '#b45309' : '#1d4ed8';

            return (
              <g
                key={phil.id}
                onClick={() => togglePhilosopher(phil.id)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="28"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="3"
                  className={isEating ? 'animate-pulse' : ''}
                />
                <text
                  x={pos.x}
                  y={pos.y - 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontWeight="bold"
                  fontSize="12"
                  fontFamily="monospace"
                >
                  {phil.name}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 11}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontWeight="600"
                  fontSize="9"
                >
                  {phil.state.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* State Log */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
        <strong>Event Log: </strong> {log}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            <span>Thinking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>Hungry (Waiting)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>Eating</span>
          </div>
        </div>
        <div className="font-semibold text-slate-700 dark:text-slate-300">
          Chopsticks: Red = In Use | Grey = Free
        </div>
      </div>
    </div>
  );
};
