import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, RotateCcw, Play, CheckCircle2, AlertCircle } from 'lucide-react';

type StepP = 'remainder' | 'set_flag' | 'set_turn' | 'wait_loop' | 'critical' | 'exit';

export const PetersonAlgorithmSimulator: React.FC = () => {
  const [flag0, setFlag0] = useState<boolean>(false);
  const [flag1, setFlag1] = useState<boolean>(false);
  const [turn, setTurn] = useState<number>(0);

  const [p0Step, setP0Step] = useState<StepP>('remainder');
  const [p1Step, setP1Step] = useState<StepP>('remainder');

  const [log, setLog] = useState<string>('Simulator ready. Step P0 or P1 to trace Peterson\'s algorithm.');

  const handleStepP0 = () => {
    switch (p0Step) {
      case 'remainder':
        setP0Step('set_flag');
        setFlag0(true);
        setLog('P0: Executed "flag[0] = true". (P0 wants to enter CS).');
        break;
      case 'set_flag':
        setP0Step('set_turn');
        setTurn(1);
        setLog('P0: Executed "turn = 1". (Politeness: giving priority to P1).');
        break;
      case 'set_turn':
      case 'wait_loop':
        // Check while(flag[1] && turn == 1)
        if (flag1 && turn === 1) {
          setP0Step('wait_loop');
          setLog('P0: Condition (flag[1] && turn == 1) is TRUE! P0 must wait/busy loop.');
        } else {
          setP0Step('critical');
          setLog('P0: Condition is FALSE! P0 safely enters CRITICAL SECTION.');
        }
        break;
      case 'critical':
        setP0Step('exit');
        setFlag0(false);
        setLog('P0: Exiting CS. Executed "flag[0] = false".');
        break;
      case 'exit':
        setP0Step('remainder');
        setLog('P0: Back to Remainder Section.');
        break;
    }
  };

  const handleStepP1 = () => {
    switch (p1Step) {
      case 'remainder':
        setP1Step('set_flag');
        setFlag1(true);
        setLog('P1: Executed "flag[1] = true". (P1 wants to enter CS).');
        break;
      case 'set_flag':
        setP1Step('set_turn');
        setTurn(0);
        setLog('P1: Executed "turn = 0". (Politeness: giving priority to P0).');
        break;
      case 'set_turn':
      case 'wait_loop':
        // Check while(flag[0] && turn == 0)
        if (flag0 && turn === 0) {
          setP1Step('wait_loop');
          setLog('P1: Condition (flag[0] && turn == 0) is TRUE! P1 must wait/busy loop.');
        } else {
          setP1Step('critical');
          setLog('P1: Condition is FALSE! P1 safely enters CRITICAL SECTION.');
        }
        break;
      case 'critical':
        setP1Step('exit');
        setFlag1(false);
        setLog('P1: Exiting CS. Executed "flag[1] = false".');
        break;
      case 'exit':
        setP1Step('remainder');
        setLog('P1: Back to Remainder Section.');
        break;
    }
  };

  const simulateContention = () => {
    // Both want to enter simultaneously
    setFlag0(true);
    setFlag1(true);
    // Suppose P0 wrote turn=1 first, then P1 wrote turn=0 last
    setTurn(0);
    setP0Step('critical'); // P0 sees turn == 0 != 1, so P0 enters
    setP1Step('wait_loop'); // P1 sees flag0 && turn == 0 -> P1 blocked!
    setLog('Simultaneous Contention: Both set flag=true. P1 wrote turn=0 last. P0 enters CS; P1 waits until P0 finishes!');
  };

  const handleReset = () => {
    setFlag0(false);
    setFlag1(false);
    setTurn(0);
    setP0Step('remainder');
    setP1Step('remainder');
    setLog('Simulator reset.');
  };

  const isBothInCritical = p0Step === 'critical' && p1Step === 'critical';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Peterson’s Algorithm Interactive Trace
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Software solution for 2 processes demonstrating Mutual Exclusion, Progress, and Bounded Waiting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={simulateContention}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            Simulate Contention
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Shared Variables Bar */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">flag[0] (P0 Wants CS)</div>
          <div className="text-2xl font-black text-blue-950 dark:text-blue-100 mt-1 font-mono">
            {flag0 ? 'TRUE' : 'FALSE'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-center">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">turn (Priority)</div>
          <div className="text-2xl font-black text-purple-950 dark:text-purple-100 mt-1 font-mono">
            {turn} (Favors P{turn})
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">flag[1] (P1 Wants CS)</div>
          <div className="text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-1 font-mono">
            {flag1 ? 'TRUE' : 'FALSE'}
          </div>
        </div>
      </div>

      {/* Process States Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Process P0 */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/60">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400">Process P0</h4>
            <button
              onClick={handleStepP0}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              Step P0 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            <div className={`p-2 rounded ${p0Step === 'remainder' ? 'bg-blue-100 dark:bg-blue-900/60 font-bold' : 'text-slate-500'}`}>
              1. // Remainder Section
            </div>
            <div className={`p-2 rounded ${p0Step === 'set_flag' ? 'bg-blue-100 dark:bg-blue-900/60 font-bold' : 'text-slate-500'}`}>
              2. flag[0] = true;
            </div>
            <div className={`p-2 rounded ${p0Step === 'set_turn' ? 'bg-blue-100 dark:bg-blue-900/60 font-bold' : 'text-slate-500'}`}>
              3. turn = 1;
            </div>
            <div className={`p-2 rounded ${p0Step === 'wait_loop' ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold animate-pulse' : 'text-slate-500'}`}>
              4. while (flag[1] && turn == 1);
            </div>
            <div className={`p-2 rounded ${p0Step === 'critical' ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-bold' : 'text-slate-500'}`}>
              5. /* CRITICAL SECTION */
            </div>
            <div className={`p-2 rounded ${p0Step === 'exit' ? 'bg-blue-100 dark:bg-blue-900/60 font-bold' : 'text-slate-500'}`}>
              6. flag[0] = false;
            </div>
          </div>
        </div>

        {/* Process P1 */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/60">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">Process P1</h4>
            <button
              onClick={handleStepP1}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              Step P1 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            <div className={`p-2 rounded ${p1Step === 'remainder' ? 'bg-emerald-100 dark:bg-emerald-900/60 font-bold' : 'text-slate-500'}`}>
              1. // Remainder Section
            </div>
            <div className={`p-2 rounded ${p1Step === 'set_flag' ? 'bg-emerald-100 dark:bg-emerald-900/60 font-bold' : 'text-slate-500'}`}>
              2. flag[1] = true;
            </div>
            <div className={`p-2 rounded ${p1Step === 'set_turn' ? 'bg-emerald-100 dark:bg-emerald-900/60 font-bold' : 'text-slate-500'}`}>
              3. turn = 0;
            </div>
            <div className={`p-2 rounded ${p1Step === 'wait_loop' ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold animate-pulse' : 'text-slate-500'}`}>
              4. while (flag[0] && turn == 0);
            </div>
            <div className={`p-2 rounded ${p1Step === 'critical' ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-bold' : 'text-slate-500'}`}>
              5. /* CRITICAL SECTION */
            </div>
            <div className={`p-2 rounded ${p1Step === 'exit' ? 'bg-emerald-100 dark:bg-emerald-900/60 font-bold' : 'text-slate-500'}`}>
              6. flag[1] = false;
            </div>
          </div>
        </div>
      </div>

      {/* Critical Section Visual Gate */}
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 bg-slate-100/60 dark:bg-slate-800/40 text-center my-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Shared Critical Section Arena
        </div>
        <div className="flex items-center justify-center gap-4 min-h-[44px]">
          {p0Step === 'critical' && (
            <span className="px-4 py-2 rounded-xl bg-blue-600 text-white font-black text-sm shadow animate-pulse">
              Process P0 Inside Critical Section
            </span>
          )}
          {p1Step === 'critical' && (
            <span className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-sm shadow animate-pulse">
              Process P1 Inside Critical Section
            </span>
          )}
          {p0Step !== 'critical' && p1Step !== 'critical' && (
            <span className="text-xs text-slate-400 font-medium">Critical Section is Empty (Free)</span>
          )}
        </div>
      </div>

      {/* Log */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
        <strong>Trace Log: </strong> {log}
      </div>
    </div>
  );
};
