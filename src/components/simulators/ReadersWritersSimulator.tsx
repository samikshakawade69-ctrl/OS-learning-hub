import React, { useState } from 'react';
import { Database, UserCheck, Edit3, ShieldAlert, CheckCircle, RotateCcw, Plus, Play } from 'lucide-react';

interface Actor {
  id: string;
  name: string;
  type: 'reader' | 'writer';
  status: 'waiting' | 'active';
}

export const ReadersWritersSimulator: React.FC = () => {
  const [readCount, setReadCount] = useState<number>(0);
  const [isWriterActive, setIsWriterActive] = useState<boolean>(false);
  const [activeWriterName, setActiveWriterName] = useState<string | null>(null);

  // Semaphores
  const [mutex, setMutex] = useState<number>(1);
  const [rwMutex, setRwMutex] = useState<number>(1);

  // Queues
  const [waitingReaders, setWaitingReaders] = useState<string[]>([]);
  const [waitingWriters, setWaitingWriters] = useState<string[]>([]);
  const [activeReaders, setActiveReaders] = useState<string[]>([]);

  const [counter, setCounter] = useState<number>(1);
  const [logs, setLogs] = useState<string[]>([
    'Initialized. rw_mutex=1 (Database free), mutex=1, read_count=0.'
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev.slice(0, 8)]);
  };

  const handleAddReader = () => {
    const rName = `Reader R${counter}`;
    setCounter(c => c + 1);

    if (isWriterActive) {
      // Must wait because database is exclusively locked by a writer
      setWaitingReaders(prev => [...prev, rName]);
      addLog(`[${rName} Arrived] Writer is active! Reader added to waiting queue.`);
    } else {
      // Can enter!
      const nextReadCount = readCount + 1;
      setReadCount(nextReadCount);
      setActiveReaders(prev => [...prev, rName]);

      if (nextReadCount === 1) {
        setRwMutex(0); // 1st reader locks rw_mutex
        addLog(`[${rName} Entered] FIRST READER locked rw_mutex (Writers now blocked). Total active readers: 1.`);
      } else {
        addLog(`[${rName} Entered] Concurrent read permitted! Total active readers: ${nextReadCount}.`);
      }
    }
  };

  const handleFinishReader = (rName: string) => {
    setActiveReaders(prev => prev.filter(r => r !== rName));
    const nextReadCount = readCount - 1;
    setReadCount(nextReadCount);

    if (nextReadCount === 0) {
      setRwMutex(1); // last reader unlocks rw_mutex
      addLog(`[${rName} Finished] LAST READER left! Released rw_mutex. Writers can now enter.`);
      // If any waiting writers, let first writer enter
      if (waitingWriters.length > 0) {
        const nextWriter = waitingWriters[0];
        setWaitingWriters(prev => prev.slice(1));
        setIsWriterActive(true);
        setActiveWriterName(nextWriter);
        setRwMutex(0);
        addLog(`[${nextWriter} Started] Acquired rw_mutex. Exclusive write in progress!`);
      }
    } else {
      addLog(`[${rName} Finished] Remaining active readers: ${nextReadCount}.`);
    }
  };

  const handleAddWriter = () => {
    const wName = `Writer W${counter}`;
    setCounter(c => c + 1);

    if (isWriterActive || readCount > 0) {
      // Must wait
      setWaitingWriters(prev => [...prev, wName]);
      addLog(`[${wName} Arrived] Database busy (${readCount > 0 ? `${readCount} readers active` : 'another writer writing'}). Added to wait queue.`);
    } else {
      // Can enter exclusively!
      setIsWriterActive(true);
      setActiveWriterName(wName);
      setRwMutex(0);
      addLog(`[${wName} Entered] Exclusively locked database (rw_mutex = 0). No readers or writers allowed.`);
    }
  };

  const handleFinishWriter = () => {
    if (!isWriterActive) return;
    const finishedWriter = activeWriterName;
    setIsWriterActive(false);
    setActiveWriterName(null);
    setRwMutex(1);
    addLog(`[${finishedWriter} Finished] Released rw_mutex.`);

    // First check waiting readers
    if (waitingReaders.length > 0) {
      const readersToAdmit = [...waitingReaders];
      setWaitingReaders([]);
      setActiveReaders(readersToAdmit);
      setReadCount(readersToAdmit.length);
      setRwMutex(0); // 1st reader locks
      addLog(`[Batch Admission] Admitted ${readersToAdmit.length} waiting readers concurrently! rw_mutex locked.`);
    } else if (waitingWriters.length > 0) {
      const nextWriter = waitingWriters[0];
      setWaitingWriters(prev => prev.slice(1));
      setIsWriterActive(true);
      setActiveWriterName(nextWriter);
      setRwMutex(0);
      addLog(`[${nextWriter} Started] Acquired rw_mutex.`);
    }
  };

  const handleReset = () => {
    setReadCount(0);
    setIsWriterActive(false);
    setActiveWriterName(null);
    setMutex(1);
    setRwMutex(1);
    setActiveReaders([]);
    setWaitingReaders([]);
    setWaitingWriters([]);
    setCounter(1);
    setLogs(['Reset simulator state. Database is free.']);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Readers-Writers Problem Simulator
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Simulate concurrent readers (shared read access) versus exclusive writers (single-access lock).
          </p>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition cursor-pointer"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Action Spawn Buttons & Semaphores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Active Readers</div>
          <div className="text-2xl font-black text-blue-950 dark:text-blue-100 mt-1 font-mono">{readCount}</div>
          <button
            onClick={handleAddReader}
            className="mt-2 w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Reader
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
          <div className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">Writer Exclusivity</div>
          <div className="text-2xl font-black text-rose-950 dark:text-rose-100 mt-1 font-mono">
            {isWriterActive ? 'LOCKED' : 'FREE'}
          </div>
          <button
            onClick={handleAddWriter}
            className="mt-2 w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Writer
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">rw_mutex</div>
          <div className="text-2xl font-black text-purple-950 dark:text-purple-100 mt-1 font-mono">{rwMutex}</div>
          <div className="text-[11px] text-purple-600/80 mt-1">0 = Database Locked</div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Waiting Queue</div>
          <div className="text-2xl font-black text-amber-950 dark:text-amber-100 mt-1 font-mono">
            {waitingReaders.length + waitingWriters.length}
          </div>
          <div className="text-[11px] text-amber-600/80 mt-1">
            {waitingReaders.length} R / {waitingWriters.length} W
          </div>
        </div>
      </div>

      {/* Visual Arena */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/60 my-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Waiting Area */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800 min-h-[160px]">
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
              Waiting Outside
            </h5>
            {waitingReaders.length === 0 && waitingWriters.length === 0 && (
              <div className="text-xs text-slate-400 italic">Queue is empty</div>
            )}
            <div className="space-y-1.5">
              {waitingWriters.map(w => (
                <div key={w} className="px-2 py-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-between">
                  <span>{w} (Writer)</span>
                  <span className="text-[10px] font-normal">Waiting for DB</span>
                </div>
              ))}
              {waitingReaders.map(r => (
                <div key={r} className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-between">
                  <span>{r} (Reader)</span>
                  <span className="text-[10px] font-normal">Waiting for Writer</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center Database */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-center shadow">
            <Database className={`w-14 h-14 ${isWriterActive ? 'text-rose-500 animate-bounce' : readCount > 0 ? 'text-blue-500' : 'text-slate-400'}`} />
            <h4 className="font-black text-sm text-slate-800 dark:text-slate-200 mt-2">
              Shared Database
            </h4>
            <div className="text-xs mt-1">
              {isWriterActive ? (
                <span className="text-rose-600 dark:text-rose-400 font-bold">
                  EXCLUSIVE WRITE IN PROGRESS ({activeWriterName})
                </span>
              ) : readCount > 0 ? (
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  CONCURRENT READ ({readCount} Readers)
                </span>
              ) : (
                <span className="text-emerald-600 font-medium">Idle & Available</span>
              )}
            </div>

            {isWriterActive && (
              <button
                onClick={handleFinishWriter}
                className="mt-3 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow transition cursor-pointer"
              >
                Complete Write Operation
              </button>
            )}
          </div>

          {/* Active Readers In Critical Section */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800 min-h-[160px]">
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
              Inside Database (Readers)
            </h5>
            {activeReaders.length === 0 && (
              <div className="text-xs text-slate-400 italic">No active readers</div>
            )}
            <div className="space-y-1.5">
              {activeReaders.map(r => (
                <div key={r} className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs font-bold flex items-center justify-between">
                  <span>{r}</span>
                  <button
                    onClick={() => handleFinishReader(r)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40">
        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Synchronization Event Log
        </h5>
        <div className="space-y-1 font-mono text-xs text-slate-600 dark:text-slate-400 max-h-24 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
