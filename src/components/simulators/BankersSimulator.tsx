import React, { useState, useMemo } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, RotateCcw, ArrowRight, Play, RefreshCw, HelpCircle } from 'lucide-react';

interface BankersState {
  numProcesses: number;
  numResources: number;
  allocation: number[][];
  max: number[][];
  available: number[];
}

const PRESET_SAFE: BankersState = {
  numProcesses: 5,
  numResources: 3,
  allocation: [
    [0, 1, 0], // P0
    [2, 0, 0], // P1
    [3, 0, 2], // P2
    [2, 1, 1], // P3
    [0, 0, 2]  // P4
  ],
  max: [
    [7, 5, 3], // P0
    [3, 2, 2], // P1
    [9, 0, 2], // P2
    [2, 2, 2], // P3
    [4, 3, 3]  // P4
  ],
  available: [3, 3, 2]
};

const PRESET_UNSAFE: BankersState = {
  numProcesses: 4,
  numResources: 3,
  allocation: [
    [1, 0, 1],
    [2, 1, 0],
    [3, 0, 1],
    [2, 1, 1]
  ],
  max: [
    [4, 3, 3],
    [3, 2, 2],
    [9, 0, 2],
    [3, 3, 3]
  ],
  available: [1, 0, 0]
};

interface StepRecord {
  processIndex: number;
  processName: string;
  need: number[];
  workBefore: number[];
  allocation: number[];
  workAfter: number[];
  explanation: string;
}

export const BankersSimulator: React.FC = () => {
  const [state, setState] = useState<BankersState>(PRESET_SAFE);
  const [resourceNames, setResourceNames] = useState<string[]>(['A', 'B', 'C']);

  // Resource Request test form state
  const [requestProc, setRequestProc] = useState<number>(1);
  const [requestVector, setRequestVector] = useState<number[]>([1, 0, 2]);
  const [requestResult, setRequestResult] = useState<string | null>(null);

  // Compute Need Matrix
  const needMatrix = useMemo(() => {
    return state.max.map((row, pIdx) => {
      return row.map((mVal, rIdx) => {
        return Math.max(0, mVal - state.allocation[pIdx][rIdx]);
      });
    });
  }, [state]);

  // Run Safety Algorithm
  const safetyResult = useMemo(() => {
    return checkSafety(state, needMatrix);
  }, [state, needMatrix]);

  // Update cell values
  const handleUpdateAllocation = (p: number, r: number, val: number) => {
    const newAlloc = state.allocation.map((row, i) =>
      i === p ? row.map((v, j) => (j === r ? Math.max(0, val) : v)) : [...row]
    );
    setState({ ...state, allocation: newAlloc });
    setRequestResult(null);
  };

  const handleUpdateMax = (p: number, r: number, val: number) => {
    const newMax = state.max.map((row, i) =>
      i === p ? row.map((v, j) => (j === r ? Math.max(0, val) : v)) : [...row]
    );
    setState({ ...state, max: newMax });
    setRequestResult(null);
  };

  const handleUpdateAvailable = (r: number, val: number) => {
    const newAvail = state.available.map((v, j) => (j === r ? Math.max(0, val) : v));
    setState({ ...state, available: newAvail });
    setRequestResult(null);
  };

  const handleTestRequest = () => {
    // 1. Check if Request <= Need
    const pNeed = needMatrix[requestProc];
    for (let i = 0; i < state.numResources; i++) {
      if (requestVector[i] > pNeed[i]) {
        setRequestResult(`Error: Request (${requestVector.join(', ')}) exceeds Process P${requestProc}'s remaining Need (${pNeed.join(', ')}). Request DENIED.`);
        return;
      }
    }
    // 2. Check if Request <= Available
    for (let i = 0; i < state.numResources; i++) {
      if (requestVector[i] > state.available[i]) {
        setRequestResult(`Wait: Insufficient resources available. Process P${requestProc} must wait.`);
        return;
      }
    }
    // 3. Pretend to allocate and test safety
    const simulatedAlloc = state.allocation.map((row, i) =>
      i === requestProc ? row.map((v, j) => v + requestVector[j]) : [...row]
    );
    const simulatedAvail = state.available.map((v, j) => v - requestVector[j]);
    const simState: BankersState = {
      ...state,
      allocation: simulatedAlloc,
      available: simulatedAvail
    };
    const simNeed = simState.max.map((row, pIdx) =>
      row.map((mVal, rIdx) => Math.max(0, mVal - simState.allocation[pIdx][rIdx]))
    );
    const simSafety = checkSafety(simState, simNeed);

    if (simSafety.isSafe) {
      setRequestResult(`SAFE! Request can be granted immediately. New safe sequence: <${simSafety.safeSequence.map(p => `P${p}`).join(', ')}>`);
    } else {
      setRequestResult(`UNSAFE! Granting this request would lead the system into an unsafe state. Process P${requestProc} must wait.`);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Banker’s Algorithm Interactive Simulator
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Deadlock Avoidance: compute Need matrices, evaluate safe sequences, and simulate resource requests.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setState(PRESET_SAFE); setRequestResult(null); }}
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition font-semibold cursor-pointer"
          >
            Load Safe Preset
          </button>
          <button
            onClick={() => { setState(PRESET_UNSAFE); setRequestResult(null); }}
            className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition font-semibold cursor-pointer"
          >
            Load Unsafe Preset
          </button>
        </div>
      </div>

      {/* Safety Status Banner */}
      <div className="my-6">
        <div
          className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
            safetyResult.isSafe
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
              : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {safetyResult.isSafe ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <div>
              <div className="text-lg font-black tracking-wide">
                SYSTEM IS IN A {safetyResult.isSafe ? 'SAFE STATE' : 'UNSAFE STATE'}
              </div>
              <div className="text-xs font-medium opacity-90">
                {safetyResult.isSafe
                  ? 'All processes can finish without deadlock. Safe sequence found.'
                  : 'Deadlock may occur if all processes request their maximum resources simultaneously!'}
              </div>
            </div>
          </div>

          {safetyResult.isSafe && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Safe Sequence</span>
              <span className="text-sm font-mono font-black text-emerald-700 dark:text-emerald-400">
                &lt; {safetyResult.safeSequence.map(p => `P${p}`).join(' → ')} &gt;
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Matrices Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Allocation Matrix */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Allocation Matrix</span>
            <span className="text-[10px] text-slate-400 font-normal">Currently Held</span>
          </h4>
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500">
                <th className="p-1 text-left">P</th>
                {resourceNames.slice(0, state.numResources).map(r => (
                  <th key={r} className="p-1">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.allocation.map((row, pIdx) => (
                <tr key={pIdx}>
                  <td className="p-1 font-bold text-left text-slate-600 dark:text-slate-400">P{pIdx}</td>
                  {row.map((val, rIdx) => (
                    <td key={rIdx} className="p-1">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={val}
                        onChange={e => handleUpdateAllocation(pIdx, rIdx, parseInt(e.target.value) || 0)}
                        className="w-10 text-center font-mono font-semibold py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Max Matrix */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Max Matrix</span>
            <span className="text-[10px] text-slate-400 font-normal">Declared Need</span>
          </h4>
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500">
                <th className="p-1 text-left">P</th>
                {resourceNames.slice(0, state.numResources).map(r => (
                  <th key={r} className="p-1">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.max.map((row, pIdx) => (
                <tr key={pIdx}>
                  <td className="p-1 font-bold text-left text-slate-600 dark:text-slate-400">P{pIdx}</td>
                  {row.map((val, rIdx) => (
                    <td key={rIdx} className="p-1">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={val}
                        onChange={e => handleUpdateMax(pIdx, rIdx, parseInt(e.target.value) || 0)}
                        className="w-10 text-center font-mono font-semibold py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Need Matrix (Calculated) */}
        <div className="border-2 border-indigo-200 dark:border-indigo-800/80 rounded-xl p-3 bg-indigo-50/40 dark:bg-indigo-950/20">
          <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Need = Max - Alloc</span>
            <span className="text-[10px] text-indigo-500 font-semibold">Auto-Computed</span>
          </h4>
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="border-b border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                <th className="p-1 text-left">P</th>
                {resourceNames.slice(0, state.numResources).map(r => (
                  <th key={r} className="p-1">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {needMatrix.map((row, pIdx) => (
                <tr key={pIdx}>
                  <td className="p-1 font-bold text-left text-indigo-800 dark:text-indigo-300">P{pIdx}</td>
                  {row.map((val, rIdx) => (
                    <td key={rIdx} className="p-1">
                      <span className="inline-block w-10 text-center font-mono font-bold py-1 rounded bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200">
                        {val}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Available Resources Vector */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Available Resources
            </h4>
            <div className="space-y-2 mt-3">
              {state.available.map((val, rIdx) => (
                <div key={rIdx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Resource {resourceNames[rIdx]}</span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={val}
                    onChange={e => handleUpdateAvailable(rIdx, parseInt(e.target.value) || 0)}
                    className="w-12 text-center font-mono font-bold text-xs py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            Tip: Edit any value above in real-time to watch the safe sequence recalculate automatically!
          </div>
        </div>
      </div>

      {/* Step by Step Safety Trace */}
      <div className="mb-6 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>Step-by-Step Safety Algorithm Execution Trace</span>
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {safetyResult.steps.map((step, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono">
              <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span>Select {step.processName}</span>
              </div>
              <div className="text-slate-600 dark:text-slate-300 pl-7 space-y-0.5">
                <div>• Need: [{step.need.join(', ')}] ≤ Work: [{step.workBefore.join(', ')}] : TRUE</div>
                <div>• Process finishes and returns Allocation: [{step.allocation.join(', ')}]</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                  • New Work = [{step.workBefore.join(', ')}] + [{step.allocation.join(', ')}] = [{step.workAfter.join(', ')}]
                </div>
              </div>
            </div>
          ))}
          {safetyResult.steps.length === 0 && (
            <div className="text-xs text-rose-500 font-semibold p-2">
              No process can satisfy Need ≤ Work with the current Available resources. System enters Unsafe State immediately.
            </div>
          )}
        </div>
      </div>

      {/* Resource Request Algorithm Test Tool */}
      <div className="border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 bg-amber-50/40 dark:bg-amber-950/20">
        <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          Test Resource-Request Algorithm
        </h4>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-300 font-semibold">Process:</span>
            <select
              value={requestProc}
              onChange={e => { setRequestProc(Number(e.target.value)); setRequestResult(null); }}
              className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold"
            >
              {Array.from({ length: state.numProcesses }).map((_, idx) => (
                <option key={idx} value={idx}>P{idx}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-300 font-semibold">Request Vector:</span>
            {resourceNames.slice(0, state.numResources).map((r, idx) => (
              <div key={r} className="flex items-center gap-1">
                <span className="font-bold text-slate-500">{r}:</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={requestVector[idx] ?? 0}
                  onChange={e => {
                    const newReq = [...requestVector];
                    newReq[idx] = parseInt(e.target.value) || 0;
                    setRequestVector(newReq);
                    setRequestResult(null);
                  }}
                  className="w-10 px-1 py-1 text-center font-mono font-bold rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleTestRequest}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition cursor-pointer"
          >
            Can Request Be Granted?
          </button>
        </div>

        {requestResult && (
          <div className={`mt-3 p-3 rounded-lg text-xs font-mono font-semibold ${
            requestResult.startsWith('SAFE')
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300'
              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-300'
          }`}>
            {requestResult}
          </div>
        )}
      </div>
    </div>
  );
};

function checkSafety(
  state: BankersState,
  need: number[][]
): { isSafe: boolean; safeSequence: number[]; steps: StepRecord[] } {
  const { numProcesses, numResources, allocation } = state;
  const work = [...state.available];
  const finish = Array(numProcesses).fill(false);
  const safeSequence: number[] = [];
  const steps: StepRecord[] = [];

  let count = 0;
  while (count < numProcesses) {
    let found = false;

    for (let p = 0; p < numProcesses; p++) {
      if (!finish[p]) {
        // Check if Need[p] <= Work
        let canAllocate = true;
        for (let r = 0; r < numResources; r++) {
          if (need[p][r] > work[r]) {
            canAllocate = false;
            break;
          }
        }

        if (canAllocate) {
          const workBefore = [...work];
          for (let r = 0; r < numResources; r++) {
            work[r] += allocation[p][r];
          }
          const workAfter = [...work];
          finish[p] = true;
          safeSequence.push(p);
          steps.push({
            processIndex: p,
            processName: `P${p}`,
            need: [...need[p]],
            workBefore,
            allocation: [...allocation[p]],
            workAfter,
            explanation: `Process P${p} finished.`
          });
          found = true;
          count++;
          break; // restart scan
        }
      }
    }

    if (!found) {
      break; // unsafe state
    }
  }

  const isSafe = count === numProcesses;
  return { isSafe, safeSequence, steps };
}
