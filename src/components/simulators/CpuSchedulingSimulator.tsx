import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Zap, Clock, Info, ChevronRight, BarChart2 } from 'lucide-react';

export interface ProcessItem {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  color: string;
}

export type SchedulingAlgo = 'fcfs' | 'sjf-non' | 'srtf' | 'priority-non' | 'priority-pre' | 'round-robin';

interface GanttSegment {
  processName: string;
  isIdle: boolean;
  startTime: number;
  endTime: number;
  color: string;
}

interface ProcessResult {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
  color: string;
}

const PRESET_COLORS = [
  '#4f46e5', // indigo
  '#059669', // emerald
  '#d97706', // amber
  '#db2777', // pink
  '#0284c7', // sky
  '#7c3aed', // violet
  '#dc2626', // red
  '#0d9488'  // teal
];

const PRESETS: Record<string, { name: string; algo: SchedulingAlgo; quantum: number; processes: ProcessItem[] }> = {
  examProblem: {
    name: 'Standard Exam Problem',
    algo: 'fcfs',
    quantum: 2,
    processes: [
      { id: '1', name: 'P1', arrivalTime: 0, burstTime: 5, priority: 2, color: PRESET_COLORS[0] },
      { id: '2', name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1, color: PRESET_COLORS[1] },
      { id: '3', name: 'P3', arrivalTime: 2, burstTime: 8, priority: 4, color: PRESET_COLORS[2] },
      { id: '4', name: 'P4', arrivalTime: 3, burstTime: 6, priority: 3, color: PRESET_COLORS[3] }
    ]
  },
  convoyEffect: {
    name: 'Convoy Effect Demo',
    algo: 'fcfs',
    quantum: 4,
    processes: [
      { id: '1', name: 'P1 (Heavy)', arrivalTime: 0, burstTime: 20, priority: 3, color: PRESET_COLORS[0] },
      { id: '2', name: 'P2 (Quick)', arrivalTime: 1, burstTime: 2, priority: 1, color: PRESET_COLORS[1] },
      { id: '3', name: 'P3 (Quick)', arrivalTime: 2, burstTime: 2, priority: 2, color: PRESET_COLORS[2] }
    ]
  },
  roundRobinDemo: {
    name: 'Round Robin Quantum Demo',
    algo: 'round-robin',
    quantum: 2,
    processes: [
      { id: '1', name: 'P1', arrivalTime: 0, burstTime: 5, priority: 2, color: PRESET_COLORS[0] },
      { id: '2', name: 'P2', arrivalTime: 0, burstTime: 4, priority: 1, color: PRESET_COLORS[1] },
      { id: '3', name: 'P3', arrivalTime: 0, burstTime: 2, priority: 3, color: PRESET_COLORS[2] },
      { id: '4', name: 'P4', arrivalTime: 0, burstTime: 1, priority: 4, color: PRESET_COLORS[3] }
    ]
  }
};

export const CpuSchedulingSimulator: React.FC = () => {
  const [algo, setAlgo] = useState<SchedulingAlgo>('fcfs');
  const [quantum, setQuantum] = useState<number>(2);
  const [processes, setProcesses] = useState<ProcessItem[]>(PRESETS.examProblem.processes);
  
  // Animation state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // multiplier
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute simulation
  const { ganttChart, results, executionLogs, totalTime } = useMemo(() => {
    return runCpuScheduling(algo, processes, quantum);
  }, [algo, processes, quantum]);

  // Handle animation timer
  useEffect(() => {
    if (isPlaying) {
      if (currentTime >= totalTime) {
        setIsPlaying(false);
        return;
      }
      timerRef.current = setTimeout(() => {
        setCurrentTime(t => {
          if (t >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return t + 1;
        });
      }, 1000 / speed);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentTime, totalTime, speed]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleRunAll = () => {
    setIsPlaying(false);
    setCurrentTime(totalTime);
  };

  const handleAddProcess = () => {
    const nextNum = processes.length + 1;
    const color = PRESET_COLORS[(nextNum - 1) % PRESET_COLORS.length];
    setProcesses([
      ...processes,
      {
        id: String(Date.now()),
        name: `P${nextNum}`,
        arrivalTime: Math.min(...processes.map(p => p.arrivalTime), 0) + nextNum - 1,
        burstTime: Math.floor(Math.random() * 6) + 2,
        priority: nextNum,
        color
      }
    ]);
    handleReset();
  };

  const handleRemoveProcess = (id: string) => {
    if (processes.length <= 1) return;
    setProcesses(processes.filter(p => p.id !== id));
    handleReset();
  };

  const handleUpdateProcess = (id: string, field: keyof ProcessItem, value: any) => {
    setProcesses(processes.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
    handleReset();
  };

  const loadPreset = (presetKey: string) => {
    const p = PRESETS[presetKey];
    if (!p) return;
    setAlgo(p.algo);
    setQuantum(p.quantum);
    setProcesses(p.processes);
    handleReset();
  };

  // Calculations for averages
  const avgTAT = results.length > 0 ? (results.reduce((acc, r) => acc + r.turnaroundTime, 0) / results.length).toFixed(2) : '0';
  const avgWT = results.length > 0 ? (results.reduce((acc, r) => acc + r.waitingTime, 0) / results.length).toFixed(2) : '0';
  const avgRT = results.length > 0 ? (results.reduce((acc, r) => acc + r.responseTime, 0) / results.length).toFixed(2) : '0';
  const totalIdleTime = ganttChart.filter(g => g.isIdle).reduce((acc, g) => acc + (g.endTime - g.startTime), 0);
  const cpuUtilization = totalTime > 0 ? (((totalTime - totalIdleTime) / totalTime) * 100).toFixed(1) : '100';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Top Controls & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Interactive CPU Scheduling Simulator
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Configure processes, pick an algorithm, and watch real-time execution with Gantt chart animations.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Presets:</span>
          {Object.entries(PRESETS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 transition-colors font-medium cursor-pointer"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Algorithm Selector & Quantum */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Select Algorithm
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'fcfs', label: 'FCFS', desc: 'First Come First Serve' },
              { id: 'sjf-non', label: 'SJF (Non-Preemptive)', desc: 'Shortest Job First' },
              { id: 'srtf', label: 'SRTF (Preemptive)', desc: 'Shortest Remaining Time' },
              { id: 'priority-non', label: 'Priority (Non-Pre)', desc: 'Lowest # = Highest' },
              { id: 'priority-pre', label: 'Priority (Preemptive)', desc: 'Preemptive by Priority' },
              { id: 'round-robin', label: 'Round Robin', desc: 'Time Quantum Slicing' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setAlgo(item.id as SchedulingAlgo); handleReset(); }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  algo === item.id
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-sm">{item.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {algo === 'round-robin' && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-semibold text-sm mb-1">
                <Clock className="w-4 h-4 text-amber-600" /> Time Quantum (Slice)
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Max CPU time allocated per process turn before being returned to ready queue.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <input
                type="range"
                min="1"
                max="8"
                value={quantum}
                onChange={e => { setQuantum(Number(e.target.value)); handleReset(); }}
                className="flex-1 accent-amber-600"
              />
              <span className="font-bold text-lg text-amber-900 dark:text-amber-100 px-3 py-1 rounded bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700">
                {quantum} ms
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Process Table Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span>Process Queue ({processes.length})</span>
            <span className="text-xs font-normal text-slate-500">(Lower priority number = higher priority)</span>
          </h4>
          <button
            onClick={handleAddProcess}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Process
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <th className="p-3">Process</th>
                <th className="p-3">Arrival Time (AT)</th>
                <th className="p-3">Burst Time (BT)</th>
                {(algo === 'priority-non' || algo === 'priority-pre') && <th className="p-3">Priority</th>}
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {processes.map(proc => (
                <tr key={proc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-3 font-semibold flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: proc.color }} />
                    <input
                      type="text"
                      value={proc.name}
                      onChange={e => handleUpdateProcess(proc.id, 'name', e.target.value)}
                      className="w-24 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={proc.arrivalTime}
                      onChange={e => handleUpdateProcess(proc.id, 'arrivalTime', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={proc.burstTime}
                      onChange={e => handleUpdateProcess(proc.id, 'burstTime', Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </td>
                  {(algo === 'priority-non' || algo === 'priority-pre') && (
                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={proc.priority}
                        onChange={e => handleUpdateProcess(proc.id, 'priority', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </td>
                  )}
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleRemoveProcess(proc.id)}
                      disabled={processes.length <= 1}
                      className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 transition cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulation Playback Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-4 mb-6 shadow-inner flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2.5 rounded-lg flex items-center gap-2 font-medium text-xs transition cursor-pointer ${
              isPlaying ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Start Animation'}
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs"
            title="Reset to t=0"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>

          <button
            onClick={handleRunAll}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs"
            title="Jump to completion"
          >
            <Zap className="w-4 h-4 text-amber-400" /> Fast Forward
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="flex items-center gap-3 flex-1 max-w-xs min-w-[200px]">
          <span className="text-xs text-slate-400">Time:</span>
          <input
            type="range"
            min="0"
            max={totalTime}
            value={currentTime}
            onChange={e => {
              setIsPlaying(false);
              setCurrentTime(Number(e.target.value));
            }}
            className="flex-1 accent-indigo-500"
          />
          <span className="font-mono font-bold text-sm text-indigo-300 min-w-[40px] text-right">
            {currentTime} / {totalTime}
          </span>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 mr-1">Speed:</span>
          {[0.5, 1, 2].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded transition cursor-pointer ${
                speed === s ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Visual Gantt Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span>Visual Gantt Chart</span>
            <span className="text-xs font-normal text-slate-500">(Execution Timeline)</span>
          </h4>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            Active at t={currentTime}: {
              ganttChart.find(g => currentTime >= g.startTime && currentTime < g.endTime)?.processName || (currentTime === totalTime ? 'Completed' : 'Idle')
            }
          </span>
        </div>

        {/* Gantt Bar */}
        <div className="relative border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/50 p-1">
          <div className="h-16 flex w-full relative">
            {ganttChart.map((seg, idx) => {
              const segDuration = seg.endTime - seg.startTime;
              const widthPct = totalTime > 0 ? (segDuration / totalTime) * 100 : 0;
              const isPastOrCurrent = currentTime >= seg.endTime;
              const isCurrentlyExecuting = currentTime >= seg.startTime && currentTime < seg.endTime;

              return (
                <div
                  key={idx}
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: seg.isIdle ? '#94a3b8' : seg.color,
                    opacity: isPastOrCurrent || isCurrentlyExecuting ? 1 : 0.35
                  }}
                  className={`h-full flex flex-col items-center justify-center text-white font-bold text-xs transition-all relative border-r border-white/20 select-none ${
                    isCurrentlyExecuting ? 'ring-2 ring-amber-400 ring-inset z-10 scale-[1.01]' : ''
                  }`}
                  title={`${seg.processName} [${seg.startTime} - ${seg.endTime}]`}
                >
                  <span className="drop-shadow-md text-xs truncate px-1">
                    {seg.processName}
                  </span>
                  <span className="text-[10px] font-normal opacity-90 drop-shadow">
                    {segDuration}ms
                  </span>
                </div>
              );
            })}

            {/* Current Time Needle */}
            {totalTime > 0 && (
              <div
                style={{
                  left: `${(currentTime / totalTime) * 100}%`
                }}
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none transition-all shadow-[0_0_8px_rgba(239,68,68,0.8)]"
              >
                <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow" />
                <div className="absolute -bottom-5 -left-3 text-[10px] font-mono bg-red-600 text-white px-1 rounded shadow">
                  t={currentTime}
                </div>
              </div>
            )}
          </div>

          {/* Time markers beneath Gantt */}
          <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 px-1">
            <span>0</span>
            {ganttChart.map((seg, i) => (
              <span key={i}>{seg.endTime}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase">Avg Turnaround Time</div>
          <div className="text-2xl font-black text-indigo-950 dark:text-indigo-100 mt-1">{avgTAT} <span className="text-sm font-normal">ms</span></div>
          <div className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80 mt-0.5">TAT = CT - AT</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Avg Waiting Time</div>
          <div className="text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-1">{avgWT} <span className="text-sm font-normal">ms</span></div>
          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">WT = TAT - BT</div>
        </div>
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
          <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase">Avg Response Time</div>
          <div className="text-2xl font-black text-amber-950 dark:text-amber-100 mt-1">{avgRT} <span className="text-sm font-normal">ms</span></div>
          <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">First Run - AT</div>
        </div>
        <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
          <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase">CPU Utilization</div>
          <div className="text-2xl font-black text-purple-950 dark:text-purple-100 mt-1">{cpuUtilization}%</div>
          <div className="text-[11px] text-purple-600/80 dark:text-purple-400/80 mt-0.5">Idle: {totalIdleTime} ms</div>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
          <span>Process Execution Summary Table</span>
          <span className="text-xs font-normal text-slate-500">Formulas: TAT = CT - AT | WT = TAT - BT</span>
        </h4>
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <th className="p-3">Process</th>
                <th className="p-3">Arrival (AT)</th>
                <th className="p-3">Burst (BT)</th>
                {(algo === 'priority-non' || algo === 'priority-pre') && <th className="p-3">Priority</th>}
                <th className="p-3 font-bold text-indigo-600 dark:text-indigo-400">Completion (CT)</th>
                <th className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Turnaround (TAT)</th>
                <th className="p-3 font-bold text-amber-600 dark:text-amber-400">Waiting (WT)</th>
                <th className="p-3">Response (RT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-3 font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                    {r.name}
                  </td>
                  <td className="p-3 font-mono">{r.arrivalTime}</td>
                  <td className="p-3 font-mono">{r.burstTime}</td>
                  {(algo === 'priority-non' || algo === 'priority-pre') && <td className="p-3 font-mono">{r.priority}</td>}
                  <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{r.completionTime}</td>
                  <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{r.turnaroundTime}</td>
                  <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">{r.waitingTime}</td>
                  <td className="p-3 font-mono">{r.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step by Step Execution Logs */}
      <div className="mt-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-500" />
          Step-by-Step Execution Trace
        </h5>
        <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs text-slate-600 dark:text-slate-400 font-mono pr-2">
          {executionLogs.map((log, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-indigo-500 font-bold shrink-0">•</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Pure algorithmic function for all CPU scheduling algorithms
function runCpuScheduling(
  algo: SchedulingAlgo,
  procs: ProcessItem[],
  quantum: number
): { ganttChart: GanttSegment[]; results: ProcessResult[]; executionLogs: string[]; totalTime: number } {
  if (procs.length === 0) {
    return { ganttChart: [], results: [], executionLogs: [], totalTime: 0 };
  }

  // Clone processes
  const processes = procs.map(p => ({
    ...p,
    remainingTime: p.burstTime,
    firstRunTime: -1,
    completionTime: 0
  }));

  const ganttChart: GanttSegment[] = [];
  const executionLogs: string[] = [];

  let currentTime = 0;
  let completedCount = 0;
  const n = processes.length;

  if (algo === 'fcfs') {
    // Sort primarily by arrival time, then by order
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    for (const p of sorted) {
      if (currentTime < p.arrivalTime) {
        ganttChart.push({
          processName: 'Idle',
          isIdle: true,
          startTime: currentTime,
          endTime: p.arrivalTime,
          color: '#94a3b8'
        });
        executionLogs.push(`t=${currentTime} to t=${p.arrivalTime}: CPU is idle, waiting for ${p.name}.`);
        currentTime = p.arrivalTime;
      }
      p.firstRunTime = currentTime;
      const start = currentTime;
      currentTime += p.burstTime;
      p.completionTime = currentTime;
      ganttChart.push({
        processName: p.name,
        isIdle: false,
        startTime: start,
        endTime: currentTime,
        color: p.color
      });
      executionLogs.push(`t=${start}: ${p.name} starts running for ${p.burstTime}ms (finishes at t=${currentTime}).`);
    }
  } else if (algo === 'sjf-non') {
    // Non-preemptive Shortest Job First
    const completed = new Set<string>();
    while (completed.size < n) {
      const ready = processes.filter(p => !completed.has(p.id) && p.arrivalTime <= currentTime);
      if (ready.length === 0) {
        // Find next arrival
        const nextArrival = Math.min(...processes.filter(p => !completed.has(p.id)).map(p => p.arrivalTime));
        ganttChart.push({
          processName: 'Idle',
          isIdle: true,
          startTime: currentTime,
          endTime: nextArrival,
          color: '#94a3b8'
        });
        executionLogs.push(`t=${currentTime} to t=${nextArrival}: CPU idle.`);
        currentTime = nextArrival;
        continue;
      }
      // Pick shortest burst time
      ready.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime);
      const chosen = ready[0];
      chosen.firstRunTime = currentTime;
      const start = currentTime;
      currentTime += chosen.burstTime;
      chosen.completionTime = currentTime;
      completed.add(chosen.id);

      ganttChart.push({
        processName: chosen.name,
        isIdle: false,
        startTime: start,
        endTime: currentTime,
        color: chosen.color
      });
      executionLogs.push(`t=${start}: ${chosen.name} selected (shortest burst ${chosen.burstTime}ms), completes at t=${currentTime}.`);
    }
  } else if (algo === 'srtf') {
    // Preemptive SJF (SRTF) - simulate 1ms step
    let lastChosenId: string | null = null;
    let segStart = 0;

    while (completedCount < n) {
      const ready = processes.filter(p => p.remainingTime > 0 && p.arrivalTime <= currentTime);
      if (ready.length === 0) {
        const nextArr = Math.min(...processes.filter(p => p.remainingTime > 0).map(p => p.arrivalTime));
        if (lastChosenId !== null) {
          const prev = processes.find(p => p.id === lastChosenId)!;
          ganttChart.push({ processName: prev.name, isIdle: false, startTime: segStart, endTime: currentTime, color: prev.color });
          lastChosenId = null;
        }
        ganttChart.push({ processName: 'Idle', isIdle: true, startTime: currentTime, endTime: nextArr, color: '#94a3b8' });
        currentTime = nextArr;
        segStart = currentTime;
        continue;
      }

      // Pick shortest remaining time
      ready.sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime);
      const chosen = ready[0];

      if (chosen.id !== lastChosenId) {
        if (lastChosenId !== null) {
          const prev = processes.find(p => p.id === lastChosenId)!;
          ganttChart.push({ processName: prev.name, isIdle: false, startTime: segStart, endTime: currentTime, color: prev.color });
        }
        lastChosenId = chosen.id;
        segStart = currentTime;
      }

      if (chosen.firstRunTime === -1) {
        chosen.firstRunTime = currentTime;
      }

      chosen.remainingTime -= 1;
      currentTime += 1;

      if (chosen.remainingTime === 0) {
        chosen.completionTime = currentTime;
        completedCount++;
        ganttChart.push({ processName: chosen.name, isIdle: false, startTime: segStart, endTime: currentTime, color: chosen.color });
        executionLogs.push(`t=${currentTime}: ${chosen.name} completes remaining burst.`);
        lastChosenId = null;
        segStart = currentTime;
      }
    }
  } else if (algo === 'priority-non') {
    // Non-preemptive Priority (lower number = higher priority)
    const completed = new Set<string>();
    while (completed.size < n) {
      const ready = processes.filter(p => !completed.has(p.id) && p.arrivalTime <= currentTime);
      if (ready.length === 0) {
        const nextArrival = Math.min(...processes.filter(p => !completed.has(p.id)).map(p => p.arrivalTime));
        ganttChart.push({ processName: 'Idle', isIdle: true, startTime: currentTime, endTime: nextArrival, color: '#94a3b8' });
        currentTime = nextArrival;
        continue;
      }
      ready.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
      const chosen = ready[0];
      chosen.firstRunTime = currentTime;
      const start = currentTime;
      currentTime += chosen.burstTime;
      chosen.completionTime = currentTime;
      completed.add(chosen.id);

      ganttChart.push({ processName: chosen.name, isIdle: false, startTime: start, endTime: currentTime, color: chosen.color });
      executionLogs.push(`t=${start}: ${chosen.name} (Priority ${chosen.priority}) starts and finishes at t=${currentTime}.`);
    }
  } else if (algo === 'priority-pre') {
    // Preemptive Priority
    let lastChosenId: string | null = null;
    let segStart = 0;

    while (completedCount < n) {
      const ready = processes.filter(p => p.remainingTime > 0 && p.arrivalTime <= currentTime);
      if (ready.length === 0) {
        const nextArr = Math.min(...processes.filter(p => p.remainingTime > 0).map(p => p.arrivalTime));
        if (lastChosenId !== null) {
          const prev = processes.find(p => p.id === lastChosenId)!;
          ganttChart.push({ processName: prev.name, isIdle: false, startTime: segStart, endTime: currentTime, color: prev.color });
          lastChosenId = null;
        }
        ganttChart.push({ processName: 'Idle', isIdle: true, startTime: currentTime, endTime: nextArr, color: '#94a3b8' });
        currentTime = nextArr;
        segStart = currentTime;
        continue;
      }

      ready.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
      const chosen = ready[0];

      if (chosen.id !== lastChosenId) {
        if (lastChosenId !== null) {
          const prev = processes.find(p => p.id === lastChosenId)!;
          ganttChart.push({ processName: prev.name, isIdle: false, startTime: segStart, endTime: currentTime, color: prev.color });
          executionLogs.push(`t=${currentTime}: ${prev.name} preempted by higher priority ${chosen.name} (Priority ${chosen.priority}).`);
        }
        lastChosenId = chosen.id;
        segStart = currentTime;
      }

      if (chosen.firstRunTime === -1) {
        chosen.firstRunTime = currentTime;
      }

      chosen.remainingTime -= 1;
      currentTime += 1;

      if (chosen.remainingTime === 0) {
        chosen.completionTime = currentTime;
        completedCount++;
        ganttChart.push({ processName: chosen.name, isIdle: false, startTime: segStart, endTime: currentTime, color: chosen.color });
        executionLogs.push(`t=${currentTime}: ${chosen.name} completed.`);
        lastChosenId = null;
        segStart = currentTime;
      }
    }
  } else if (algo === 'round-robin') {
    // Round Robin with ready queue
    const q = Math.max(1, quantum);
    const readyQueue: typeof processes = [];
    const inQueue = new Set<string>();

    const checkArrivals = (time: number) => {
      processes
        .filter(p => p.arrivalTime <= time && !inQueue.has(p.id) && p.remainingTime > 0)
        .sort((a, b) => a.arrivalTime - b.arrivalTime)
        .forEach(p => {
          readyQueue.push(p);
          inQueue.add(p.id);
        });
    };

    checkArrivals(currentTime);

    while (completedCount < n) {
      if (readyQueue.length === 0) {
        const nextArr = Math.min(...processes.filter(p => p.remainingTime > 0).map(p => p.arrivalTime));
        ganttChart.push({ processName: 'Idle', isIdle: true, startTime: currentTime, endTime: nextArr, color: '#94a3b8' });
        currentTime = nextArr;
        checkArrivals(currentTime);
        continue;
      }

      const curr = readyQueue.shift()!;
      inQueue.delete(curr.id);

      if (curr.firstRunTime === -1) {
        curr.firstRunTime = currentTime;
      }

      const runDuration = Math.min(curr.remainingTime, q);
      const start = currentTime;
      currentTime += runDuration;
      curr.remainingTime -= runDuration;

      ganttChart.push({
        processName: curr.name,
        isIdle: false,
        startTime: start,
        endTime: currentTime,
        color: curr.color
      });

      // Check any new arrivals that entered during this run
      checkArrivals(currentTime);

      if (curr.remainingTime > 0) {
        readyQueue.push(curr);
        inQueue.add(curr.id);
        executionLogs.push(`t=${currentTime}: ${curr.name} slice (${runDuration}ms) expired, ${curr.remainingTime}ms remaining. Moved to back of queue.`);
      } else {
        curr.completionTime = currentTime;
        completedCount++;
        executionLogs.push(`t=${currentTime}: ${curr.name} finished execution.`);
      }
    }
  }

  // Combine adjacent identical segments in gantt chart for cleanliness
  const compressedGantt: GanttSegment[] = [];
  for (const seg of ganttChart) {
    if (compressedGantt.length === 0) {
      compressedGantt.push({ ...seg });
    } else {
      const last = compressedGantt[compressedGantt.length - 1];
      if (last.processName === seg.processName && last.isIdle === seg.isIdle) {
        last.endTime = seg.endTime;
      } else {
        compressedGantt.push({ ...seg });
      }
    }
  }

  // Calculate results
  const results: ProcessResult[] = processes.map(p => {
    const tat = p.completionTime - p.arrivalTime;
    const wt = tat - p.burstTime;
    const rt = (p.firstRunTime >= 0 ? p.firstRunTime : p.arrivalTime) - p.arrivalTime;
    return {
      id: p.id,
      name: p.name,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      priority: p.priority,
      completionTime: p.completionTime,
      turnaroundTime: Math.max(0, tat),
      waitingTime: Math.max(0, wt),
      responseTime: Math.max(0, rt),
      color: p.color
    };
  });

  return {
    ganttChart: compressedGantt,
    results,
    executionLogs,
    totalTime: currentTime
  };
}
