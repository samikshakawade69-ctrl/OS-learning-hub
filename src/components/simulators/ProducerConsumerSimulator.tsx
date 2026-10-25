import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, ArrowRight, Shield, Layers, Package, ShoppingCart } from 'lucide-react';

interface BufferItem {
  id: number;
  label: string;
  producedAt: number;
}

export const ProducerConsumerSimulator: React.FC = () => {
  const BUFFER_CAPACITY = 5;
  const [buffer, setBuffer] = useState<BufferItem[]>([
    { id: 1, label: 'Data #1', producedAt: 0 },
    { id: 2, label: 'Data #2', producedAt: 1 }
  ]);

  // Semaphores
  // mutex: binary lock (1 = free, 0 = locked)
  const [mutex, setMutex] = useState<number>(1);
  const [empty, setEmpty] = useState<number>(BUFFER_CAPACITY - 2);
  const [full, setFull] = useState<number>(2);

  const [producerState, setProducerState] = useState<'idle' | 'waiting' | 'producing'>('idle');
  const [consumerState, setConsumerState] = useState<'idle' | 'waiting' | 'consuming'>('idle');

  const [counter, setCounter] = useState<number>(3);
  const [logs, setLogs] = useState<string[]>([
    'System initialized with buffer capacity = 5.',
    'Semaphores: mutex=1, empty=3, full=2.'
  ]);

  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev.slice(0, 9)]);
  };

  const handleProduce = () => {
    if (empty <= 0) {
      setProducerState('waiting');
      addLog(`[Producer BLOCKED] wait(empty) called, but empty = 0! Buffer full.`);
      return;
    }

    setProducerState('producing');
    const newItem: BufferItem = {
      id: counter,
      label: `Data #${counter}`,
      producedAt: Date.now()
    };
    setCounter(c => c + 1);

    setTimeout(() => {
      setBuffer(prev => [...prev, newItem]);
      setEmpty(e => e - 1);
      setFull(f => f + 1);
      setProducerState('idle');
      addLog(`[Producer] Produced ${newItem.label}. semaphores: empty=${empty - 1}, full=${full + 1}.`);
    }, 400);
  };

  const handleConsume = () => {
    if (full <= 0) {
      setConsumerState('waiting');
      addLog(`[Consumer BLOCKED] wait(full) called, but full = 0! Buffer empty.`);
      return;
    }

    setConsumerState('consuming');
    setTimeout(() => {
      let removedItem: BufferItem | null = null;
      setBuffer(prev => {
        if (prev.length === 0) return prev;
        removedItem = prev[0];
        return prev.slice(1);
      });
      setEmpty(e => e + 1);
      setFull(f => f - 1);
      setConsumerState('idle');
      if (removedItem) {
        addLog(`[Consumer] Consumed ${(removedItem as BufferItem).label}. semaphores: empty=${empty + 1}, full=${full - 1}.`);
      }
    }, 400);
  };

  const handleReset = () => {
    setAutoPlay(false);
    setBuffer([]);
    setEmpty(BUFFER_CAPACITY);
    setFull(0);
    setMutex(1);
    setCounter(1);
    setProducerState('idle');
    setConsumerState('idle');
    setLogs(['Buffer cleared. mutex=1, empty=5, full=0.']);
  };

  // Auto-play simulation
  useEffect(() => {
    if (autoPlay) {
      autoTimerRef.current = setInterval(() => {
        // Randomly produce or consume
        if (Math.random() > 0.45) {
          handleProduce();
        } else {
          handleConsume();
        }
      }, 1200);
    } else {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    }
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [autoPlay, empty, full, counter]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Producer-Consumer Simulator (Bounded Buffer)
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Interactive synchronization using three semaphores: <code className="text-purple-600 font-mono font-bold">mutex</code>, <code className="text-purple-600 font-mono font-bold">empty</code>, and <code className="text-purple-600 font-mono font-bold">full</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              autoPlay
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {autoPlay ? 'Pause Auto' : 'Auto Play'}
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
            title="Reset Buffer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Semaphore KPI Gauges */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-center">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Semaphore: MUTEX
          </div>
          <div className="text-2xl font-black text-purple-950 dark:text-purple-100 mt-1 font-mono">
            {mutex}
          </div>
          <div className="text-[11px] text-purple-600/80 mt-0.5">Binary Lock (1 = Free)</div>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Semaphore: EMPTY
          </div>
          <div className="text-2xl font-black text-blue-950 dark:text-blue-100 mt-1 font-mono">
            {empty}
          </div>
          <div className="text-[11px] text-blue-600/80 mt-0.5">Empty slots left / 5</div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Semaphore: FULL
          </div>
          <div className="text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-1 font-mono">
            {full}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Filled items in buffer</div>
        </div>
      </div>

      {/* Main Visual Arena: Producer -> Bounded Buffer -> Consumer */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/60 my-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Producer Card */}
          <div className="flex-1 w-full flex flex-col items-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Producer Process</h4>
            <div className="text-xs text-slate-400 mb-3">
              State:{' '}
              <span
                className={`font-semibold ${
                  producerState === 'producing'
                    ? 'text-emerald-500'
                    : producerState === 'waiting'
                    ? 'text-rose-500 animate-pulse'
                    : 'text-slate-500'
                }`}
              >
                {producerState.toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleProduce}
              disabled={autoPlay}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              Produce Item <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="text-[10px] text-slate-400 font-mono mt-2">
              wait(empty) → wait(mutex)
            </div>
          </div>

          {/* Bounded Buffer 5 Slots */}
          <div className="flex-2 w-full flex flex-col items-center">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Shared Circular Buffer (5 Slots)
            </div>
            <div className="grid grid-cols-5 gap-2 w-full max-w-md p-3 bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700">
              {Array.from({ length: BUFFER_CAPACITY }).map((_, idx) => {
                const item = buffer[idx];
                return (
                  <div
                    key={idx}
                    className={`h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-1 transition-all ${
                      item
                        ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-400 text-purple-900 dark:text-purple-200 shadow-sm scale-95'
                        : 'border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-slate-900/40 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400">Slot {idx}</span>
                    {item ? (
                      <div className="flex flex-col items-center mt-1">
                        <Package className="w-5 h-5 text-purple-600" />
                        <span className="text-[10px] font-bold mt-0.5 truncate">{item.label}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 mt-2">empty</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-slate-500 mt-2 font-mono">
              Occupied: {buffer.length} / {BUFFER_CAPACITY}
            </div>
          </div>

          {/* Consumer Card */}
          <div className="flex-1 w-full flex flex-col items-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Consumer Process</h4>
            <div className="text-xs text-slate-400 mb-3">
              State:{' '}
              <span
                className={`font-semibold ${
                  consumerState === 'consuming'
                    ? 'text-emerald-500'
                    : consumerState === 'waiting'
                    ? 'text-rose-500 animate-pulse'
                    : 'text-slate-500'
                }`}
              >
                {consumerState.toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleConsume}
              disabled={autoPlay}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              Consume Item <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="text-[10px] text-slate-400 font-mono mt-2">
              wait(full) → wait(mutex)
            </div>
          </div>
        </div>
      </div>

      {/* Live Event Logs */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40">
        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Real-Time Semaphore Events
        </h5>
        <div className="space-y-1 font-mono text-xs text-slate-600 dark:text-slate-400 max-h-28 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
