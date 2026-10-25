import React, { useState, useMemo } from 'react';
import { Layers, RotateCcw, Plus, Trash2, ArrowRight, CheckCircle2, XCircle, AlertTriangle, Cpu } from 'lucide-react';

interface MemoryBlock {
  id: string;
  size: number;
}

interface ProcessRequest {
  id: string;
  name: string;
  size: number;
  color: string;
}

export type MemoryFitAlgo = 'first-fit' | 'best-fit' | 'worst-fit';

const PROCESS_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const DEFAULT_BLOCKS: MemoryBlock[] = [
  { id: 'b1', size: 100 },
  { id: 'b2', size: 500 },
  { id: 'b3', size: 200 },
  { id: 'b4', size: 300 },
  { id: 'b5', size: 600 }
];

const DEFAULT_PROCESSES: ProcessRequest[] = [
  { id: 'p1', name: 'P1', size: 212, color: PROCESS_COLORS[0] },
  { id: 'p2', name: 'P2', size: 417, color: PROCESS_COLORS[1] },
  { id: 'p3', name: 'P3', size: 112, color: PROCESS_COLORS[2] },
  { id: 'p4', name: 'P4', size: 426, color: PROCESS_COLORS[3] }
];

interface AllocationResult {
  blockAllocations: {
    blockId: string;
    originalSize: number;
    allocatedProcess: ProcessRequest | null;
    remainingHole: number;
  }[];
  processStatus: {
    process: ProcessRequest;
    allocated: boolean;
    blockIndex?: number;
    blockSize?: number;
    leftover?: number;
    reason: string;
  }[];
  totalMemory: number;
  totalAllocated: number;
  totalFree: number;
  externalFragmentation: number;
}

export const MemoryAllocationSimulator: React.FC = () => {
  const [algo, setAlgo] = useState<MemoryFitAlgo>('first-fit');
  const [blocks, setBlocks] = useState<MemoryBlock[]>(DEFAULT_BLOCKS);
  const [processes, setProcesses] = useState<ProcessRequest[]>(DEFAULT_PROCESSES);
  const [stepIndex, setStepIndex] = useState<number>(processes.length); // default full allocation

  // Run allocation computation
  const allocation = useMemo(() => {
    return computeMemoryAllocation(algo, blocks, processes.slice(0, stepIndex));
  }, [algo, blocks, processes, stepIndex]);

  const handleReset = () => {
    setStepIndex(0);
  };

  const handleStepNext = () => {
    setStepIndex(prev => Math.min(processes.length, prev + 1));
  };

  const handleAllocateAll = () => {
    setStepIndex(processes.length);
  };

  const handleAddBlock = () => {
    const nextId = `b${blocks.length + 1}`;
    setBlocks([...blocks, { id: nextId, size: 250 }]);
    setStepIndex(0);
  };

  const handleRemoveBlock = (id: string) => {
    if (blocks.length <= 1) return;
    setBlocks(blocks.filter(b => b.id !== id));
    setStepIndex(0);
  };

  const handleAddProcess = () => {
    const nextNum = processes.length + 1;
    const color = PROCESS_COLORS[(nextNum - 1) % PROCESS_COLORS.length];
    setProcesses([...processes, { id: `p${Date.now()}`, name: `P${nextNum}`, size: 150, color }]);
    setStepIndex(0);
  };

  const handleRemoveProcess = (id: string) => {
    if (processes.length <= 1) return;
    setProcesses(processes.filter(p => p.id !== id));
    setStepIndex(0);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Memory Allocation Simulator (First Fit, Best Fit, Worst Fit)
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Simulate how the Operating System assigns incoming variable-sized processes to free memory blocks.
          </p>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {(['first-fit', 'best-fit', 'worst-fit'] as MemoryFitAlgo[]).map(key => (
            <button
              key={key}
              onClick={() => { setAlgo(key); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                algo === key
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {key.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        {/* Memory Blocks Configuration */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Memory Partitions (KB)
            </div>
            <button
              onClick={handleAddBlock}
              className="text-xs px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Add Block
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {blocks.map((block, idx) => (
              <div key={block.id} className="flex items-center gap-1 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">B{idx + 1}:</span>
                <input
                  type="number"
                  min="20"
                  max="2000"
                  value={block.size}
                  onChange={e => {
                    const val = Math.max(10, parseInt(e.target.value) || 0);
                    setBlocks(blocks.map(b => b.id === block.id ? { ...b, size: val } : b));
                  }}
                  className="w-full text-xs font-mono font-semibold px-1 py-0.5 rounded bg-transparent text-slate-900 dark:text-slate-100"
                />
                <span className="text-[10px] text-slate-400">KB</span>
                <button
                  onClick={() => handleRemoveBlock(block.id)}
                  disabled={blocks.length <= 1}
                  className="text-slate-300 hover:text-red-500 disabled:opacity-20 cursor-pointer ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Process Requests */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500" />
              Incoming Processes
            </div>
            <button
              onClick={handleAddProcess}
              className="text-xs px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Add Process
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
            {processes.map((proc, idx) => (
              <div key={proc.id} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: proc.color }} />
                <input
                  type="text"
                  value={proc.name}
                  onChange={e => {
                    setProcesses(processes.map(p => p.id === proc.id ? { ...p, name: e.target.value } : p));
                  }}
                  className="w-12 text-xs font-bold text-slate-800 dark:text-slate-200 bg-transparent"
                />
                <input
                  type="number"
                  min="10"
                  max="2000"
                  value={proc.size}
                  onChange={e => {
                    const val = Math.max(10, parseInt(e.target.value) || 0);
                    setProcesses(processes.map(p => p.id === proc.id ? { ...p, size: val } : p));
                  }}
                  className="w-16 text-xs font-mono font-semibold px-1 py-0.5 rounded bg-transparent text-slate-900 dark:text-slate-100"
                />
                <span className="text-[10px] text-slate-400">KB</span>
                <button
                  onClick={() => handleRemoveProcess(proc.id)}
                  disabled={processes.length <= 1}
                  className="text-slate-300 hover:text-red-500 disabled:opacity-20 cursor-pointer ml-auto"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Controls */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-3 rounded-xl mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleStepNext}
            disabled={stepIndex >= processes.length}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            Step Next Process <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleAllocateAll}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition cursor-pointer"
          >
            Allocate All
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Processed: <span className="text-white font-bold">{stepIndex}</span> of {processes.length}
        </div>
      </div>

      {/* Visual Memory Blocks Layout */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center justify-between">
          <span>Physical Memory Blocks (Visual Layout)</span>
          <span className="text-xs font-normal text-slate-500">
            Total RAM: {allocation.totalMemory} KB | Allocated: {allocation.totalAllocated} KB | Free: {allocation.totalFree} KB
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {allocation.blockAllocations.map((blk, idx) => {
            const hasProc = blk.allocatedProcess !== null;
            const proc = blk.allocatedProcess;
            const usedPct = hasProc ? Math.min(100, (proc!.size / blk.originalSize) * 100) : 0;

            return (
              <div
                key={blk.blockId}
                className="border-2 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/60 transition-all flex flex-col justify-between h-48 border-slate-300 dark:border-slate-700"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Block {idx + 1}</span>
                    <span className="font-mono text-slate-500">{blk.originalSize} KB</span>
                  </div>
                </div>

                {/* Inner representation */}
                <div className="w-full flex-1 my-2 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden flex flex-col justify-end relative border border-slate-300 dark:border-slate-600">
                  {hasProc ? (
                    <>
                      {/* Leftover hole */}
                      {blk.remainingHole > 0 && (
                        <div
                          style={{ height: `${100 - usedPct}%` }}
                          className="bg-stripes-slate flex items-center justify-center text-[10px] font-mono text-slate-600 dark:text-slate-300 border-b border-dashed border-slate-400"
                        >
                          Free {blk.remainingHole}K
                        </div>
                      )}
                      {/* Allocated section */}
                      <div
                        style={{
                          height: `${usedPct}%`,
                          backgroundColor: proc!.color
                        }}
                        className="flex flex-col items-center justify-center text-white font-bold p-1 shadow-inner text-xs transition-all animate-pulse"
                      >
                        <span>{proc!.name}</span>
                        <span className="text-[10px] font-normal">{proc!.size} KB</span>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs font-mono font-medium">
                      Entirely Free
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-center font-medium">
                  {hasProc ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Allocated ({proc!.name})
                    </span>
                  ) : (
                    <span className="text-slate-400">Available</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Allocation Status & External Fragmentation Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status of Each Process */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
            Process Allocation Status
          </h5>
          <div className="space-y-2">
            {allocation.processStatus.map(status => (
              <div
                key={status.process.id}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                  status.allocated
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {status.allocated ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold">{status.process.name}</span> ({status.process.size} KB):{' '}
                    <span className="font-normal">{status.reason}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Behavior Explanation */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/30">
          <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Algorithm Analysis: {algo.toUpperCase().replace('-', ' ')}
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            {algo === 'first-fit' && (
              <>
                <strong>First Fit</strong> scans from Block 1 and allocates the very first block with size ≥ process size. It is the fastest because it avoids scanning the entire list.
              </>
            )}
            {algo === 'best-fit' && (
              <>
                <strong>Best Fit</strong> inspects ALL free blocks and chooses the one with the smallest leftover space. Notice that it creates very small leftover holes, which can worsen external fragmentation!
              </>
            )}
            {algo === 'worst-fit' && (
              <>
                <strong>Worst Fit</strong> searches all blocks and picks the LARGEST hole. The idea is to leave behind a substantial remainder hole that other jobs can still use.
              </>
            )}
          </p>

          <div className="text-xs p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Unallocated Memory:</span>
              <span className="font-mono font-bold">{allocation.totalFree} KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Processes Waiting (External Fragmentation):</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                {allocation.processStatus.filter(s => !status).length > 0 ? 'Yes (Can be solved by Compaction)' : 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function computeMemoryAllocation(
  algo: MemoryFitAlgo,
  blocks: MemoryBlock[],
  processes: ProcessRequest[]
): AllocationResult {
  const totalMemory = blocks.reduce((acc, b) => acc + b.size, 0);

  // Track each block's state
  const blockState = blocks.map(b => ({
    blockId: b.id,
    originalSize: b.size,
    allocatedProcess: null as ProcessRequest | null,
    remainingHole: b.size
  }));

  const processStatus: AllocationResult['processStatus'] = [];

  for (const proc of processes) {
    let chosenIdx = -1;

    if (algo === 'first-fit') {
      for (let i = 0; i < blockState.length; i++) {
        if (!blockState[i].allocatedProcess && blockState[i].originalSize >= proc.size) {
          chosenIdx = i;
          break;
        }
      }
    } else if (algo === 'best-fit') {
      let minLeftover = Infinity;
      for (let i = 0; i < blockState.length; i++) {
        if (!blockState[i].allocatedProcess && blockState[i].originalSize >= proc.size) {
          const leftover = blockState[i].originalSize - proc.size;
          if (leftover < minLeftover) {
            minLeftover = leftover;
            chosenIdx = i;
          }
        }
      }
    } else if (algo === 'worst-fit') {
      let maxLeftover = -1;
      for (let i = 0; i < blockState.length; i++) {
        if (!blockState[i].allocatedProcess && blockState[i].originalSize >= proc.size) {
          const leftover = blockState[i].originalSize - proc.size;
          if (leftover > maxLeftover) {
            maxLeftover = leftover;
            chosenIdx = i;
          }
        }
      }
    }

    if (chosenIdx !== -1) {
      blockState[chosenIdx].allocatedProcess = proc;
      blockState[chosenIdx].remainingHole = blockState[chosenIdx].originalSize - proc.size;
      processStatus.push({
        process: proc,
        allocated: true,
        blockIndex: chosenIdx + 1,
        blockSize: blockState[chosenIdx].originalSize,
        leftover: blockState[chosenIdx].remainingHole,
        reason: `Allocated to Block ${chosenIdx + 1} (${blockState[chosenIdx].originalSize} KB). Leftover: ${blockState[chosenIdx].remainingHole} KB.`
      });
    } else {
      processStatus.push({
        process: proc,
        allocated: false,
        reason: 'Cannot allocate: No single free block is large enough.'
      });
    }
  }

  const totalAllocated = blockState.reduce((acc, b) => acc + (b.allocatedProcess ? b.allocatedProcess.size : 0), 0);
  const totalFree = totalMemory - totalAllocated;

  return {
    blockAllocations: blockState,
    processStatus,
    totalMemory,
    totalAllocated,
    totalFree,
    externalFragmentation: totalFree
  };
}
