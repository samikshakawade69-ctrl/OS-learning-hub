import React, { useState, useMemo } from 'react';
import { Binary, ArrowRight, Zap, RefreshCw, Cpu, Layers } from 'lucide-react';

export const PagingAddressSimulator: React.FC = () => {
  const [pageSizeKB, setPageSizeKB] = useState<number>(4); // 4 KB
  const [logicalAddress, setLogicalAddress] = useState<number>(13320);

  // Page table mappings: Page # -> Frame #
  const [pageTable, setPageTable] = useState<Record<number, number>>({
    0: 5,
    1: 2,
    2: 9,
    3: 7,
    4: 1,
    5: 8
  });

  // TLB simulation
  const [tlbEntries, setTlbEntries] = useState<{ page: number; frame: number }[]>([
    { page: 1, frame: 2 },
    { page: 3, frame: 7 }
  ]);

  const pageSizeBytes = pageSizeKB * 1024;
  const offsetBits = Math.log2(pageSizeBytes);

  // Calculations
  const pageNumber = Math.floor(logicalAddress / pageSizeBytes);
  const offset = logicalAddress % pageSizeBytes;
  const frameNumber = pageTable[pageNumber] ?? null;

  const isTlbHit = tlbEntries.some(e => e.page === pageNumber);

  const physicalAddress = frameNumber !== null ? frameNumber * pageSizeBytes + offset : null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Binary className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Paging & Address Translation Calculator
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Convert CPU Logical Address &lt;Page, Offset&gt; into RAM Physical Address &lt;Frame, Offset&gt; with TLB cache verification.
          </p>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Page Size:</span>
          {[1, 2, 4, 8].map(kb => (
            <button
              key={kb}
              onClick={() => setPageSizeKB(kb)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                pageSizeKB === kb
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {kb} KB
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            CPU Generated Logical Address (Decimal)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="65535"
              value={logicalAddress}
              onChange={e => setLogicalAddress(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 px-3 py-2 text-sm font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
            <button
              onClick={() => setLogicalAddress(Math.floor(Math.random() * 24000) + 1024)}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Random
            </button>
          </div>
          <div className="text-[11px] text-slate-400">
            Binary: <span className="font-mono">{logicalAddress.toString(2).padStart(16, '0')}</span>
          </div>
        </div>

        {/* TLB Status Box */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isTlbHit
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-950 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-950 dark:text-amber-200'
        }`}>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              TLB Cache Status
            </div>
            <div className="text-sm font-black mt-0.5">
              {isTlbHit ? 'TLB HIT! (1 CPU Cycle)' : 'TLB MISS (Page Table Walk in RAM Required)'}
            </div>
          </div>
          <div className="text-[11px] font-mono opacity-80 text-right">
            {isTlbHit ? 'Translation cached in MMU' : 'Loaded from RAM Page Table'}
          </div>
        </div>
      </div>

      {/* Logical Address Decomposition */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Step 1: Address Decomposition
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
              Page Number (p)
            </span>
            <div className="text-2xl font-black text-indigo-950 dark:text-indigo-100 font-mono mt-1">
              {pageNumber}
            </div>
            <div className="text-[11px] text-indigo-600/80 font-mono mt-0.5">
              = floor({logicalAddress} / {pageSizeBytes})
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              Offset (d)
            </span>
            <div className="text-2xl font-black text-emerald-950 dark:text-emerald-100 font-mono mt-1">
              {offset}
            </div>
            <div className="text-[11px] text-emerald-600/80 font-mono mt-0.5">
              = {logicalAddress} mod {pageSizeBytes} ({offsetBits} bits)
            </div>
          </div>
        </div>
      </div>

      {/* Page Table Mapping & Step 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Step 2: Page Table Lookup
          </h4>
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-center text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-2">Page # (Index)</th>
                  <th className="p-2">Frame # (Physical)</th>
                  <th className="p-2">Match Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {Object.entries(pageTable).map(([p, f]) => {
                  const isCurrent = Number(p) === pageNumber;
                  return (
                    <tr
                      key={p}
                      className={isCurrent ? 'bg-indigo-100 dark:bg-indigo-950/80 font-bold' : ''}
                    >
                      <td className="p-2">Page {p}</td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          max="32"
                          value={f}
                          onChange={e => {
                            setPageTable({
                              ...pageTable,
                              [Number(p)]: parseInt(e.target.value) || 0
                            });
                          }}
                          className="w-12 text-center py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </td>
                      <td className="p-2">
                        {isCurrent ? (
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">CURRENT MATCH →</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Physical Address Synthesis */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Step 3: Physical Address Generation
          </h4>
          <div className="border-2 border-indigo-300 dark:border-indigo-700 rounded-xl p-4 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col justify-between h-[210px]">
            <div>
              <div className="text-xs text-indigo-700 dark:text-indigo-300 font-bold">
                Formula: Physical Address = (Frame Number × Page Size) + Offset
              </div>
              <div className="mt-3 font-mono text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <div>• Frame Number (f) = <strong>{frameNumber !== null ? frameNumber : 'Page Fault!'}</strong></div>
                <div>• Page Size = <strong>{pageSizeBytes} bytes</strong></div>
                <div>• Offset (d) = <strong>{offset}</strong></div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-sm">
              <span className="text-[11px] text-slate-400 uppercase font-bold block">Final Physical RAM Address:</span>
              <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                {physicalAddress !== null ? physicalAddress : 'PAGE FAULT (Page not mapped)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
