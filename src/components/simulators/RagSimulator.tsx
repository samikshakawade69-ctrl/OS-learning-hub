import React, { useState } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, GitCommit, Layers } from 'lucide-react';

interface RAGNode {
  id: string;
  name: string;
  type: 'process' | 'resource';
  instances?: number;
  x: number;
  y: number;
}

interface RAGEdge {
  from: string; // node id
  to: string;   // node id
  type: 'request' | 'assignment'; // request: P -> R, assignment: R -> P
}

const PRESET_DEADLOCK: { nodes: RAGNode[]; edges: RAGEdge[]; explanation: string } = {
  nodes: [
    { id: 'p1', name: 'P1', type: 'process', x: 120, y: 100 },
    { id: 'p2', name: 'P2', type: 'process', x: 380, y: 100 },
    { id: 'r1', name: 'R1', type: 'resource', instances: 1, x: 250, y: 50 },
    { id: 'r2', name: 'R2', type: 'resource', instances: 1, x: 250, y: 180 }
  ],
  edges: [
    { from: 'r1', to: 'p1', type: 'assignment' }, // R1 assigned to P1
    { from: 'p1', to: 'r2', type: 'request' },    // P1 requests R2
    { from: 'r2', to: 'p2', type: 'assignment' }, // R2 assigned to P2
    { from: 'p2', to: 'r1', type: 'request' }     // P2 requests R1 (Cycle!)
  ],
  explanation: 'Cycle Detected: P1 → R2 → P2 → R1 → P1. Since both R1 and R2 have single instances, a cycle implies a strict DEADLOCK.'
};

const PRESET_CYCLE_NO_DEADLOCK: { nodes: RAGNode[]; edges: RAGEdge[]; explanation: string } = {
  nodes: [
    { id: 'p1', name: 'P1', type: 'process', x: 100, y: 80 },
    { id: 'p2', name: 'P2', type: 'process', x: 250, y: 80 },
    { id: 'p3', name: 'P3', type: 'process', x: 400, y: 80 },
    { id: 'r1', name: 'R1', type: 'resource', instances: 2, x: 170, y: 180 },
    { id: 'r2', name: 'R2', type: 'resource', instances: 2, x: 330, y: 180 }
  ],
  edges: [
    { from: 'r1', to: 'p1', type: 'assignment' },
    { from: 'p1', to: 'r2', type: 'request' },
    { from: 'r2', to: 'p2', type: 'assignment' },
    { from: 'p2', to: 'r1', type: 'request' },
    { from: 'r2', to: 'p3', type: 'assignment' } // P3 also holds an instance of R2
  ],
  explanation: 'Cycle exists (P1-R2-P2-R1), BUT R2 has 2 instances and P3 holds one without requesting any more! Once P3 finishes, it releases its instance of R2, breaking the cycle. NOT DEADLOCKED.'
};

const PRESET_SAFE: { nodes: RAGNode[]; edges: RAGEdge[]; explanation: string } = {
  nodes: [
    { id: 'p1', name: 'P1', type: 'process', x: 120, y: 120 },
    { id: 'p2', name: 'P2', type: 'process', x: 380, y: 120 },
    { id: 'r1', name: 'R1', type: 'resource', instances: 2, x: 250, y: 60 },
    { id: 'r2', name: 'R2', type: 'resource', instances: 1, x: 250, y: 200 }
  ],
  edges: [
    { from: 'r1', to: 'p1', type: 'assignment' },
    { from: 'r1', to: 'p2', type: 'assignment' },
    { from: 'p1', to: 'r2', type: 'request' }
  ],
  explanation: 'No cycles found in the Resource Allocation Graph. System is completely deadlock-free.'
};

export const RagSimulator: React.FC = () => {
  const [scenarioKey, setScenarioKey] = useState<'deadlock' | 'multi-cycle' | 'safe'>('deadlock');

  const currentPreset =
    scenarioKey === 'deadlock'
      ? PRESET_DEADLOCK
      : scenarioKey === 'multi-cycle'
      ? PRESET_CYCLE_NO_DEADLOCK
      : PRESET_SAFE;

  const isDeadlocked = scenarioKey === 'deadlock';
  const hasCycle = scenarioKey !== 'safe';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Resource Allocation Graph (RAG) Visualizer
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Interactive directed graph showing Processes (circles), Resources (rectangles), Allocation edges, and Request edges.
          </p>
        </div>

        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setScenarioKey('deadlock')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              scenarioKey === 'deadlock'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Deadlock Cycle (1-Unit)
          </button>
          <button
            onClick={() => setScenarioKey('multi-cycle')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              scenarioKey === 'multi-cycle'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Cycle with Multi-Unit (No Deadlock)
          </button>
          <button
            onClick={() => setScenarioKey('safe')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              scenarioKey === 'safe'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Safe State (No Cycle)
          </button>
        </div>
      </div>

      {/* Status banner */}
      <div className="my-5">
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            isDeadlocked
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-950 dark:text-rose-200'
              : hasCycle
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-950 dark:text-amber-200'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-950 dark:text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {isDeadlocked ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <span className="font-bold text-sm">
              {isDeadlocked
                ? 'DEADLOCK DETECTED!'
                : hasCycle
                ? 'CYCLE DETECTED, BUT SAFE (Multi-instance)'
                : 'NO DEADLOCK (Safe Graph)'}
            </span>
          </div>
          <div className="text-[11px] opacity-90">{currentPreset.explanation}</div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-slate-950 p-4 flex justify-center overflow-x-auto">
        <svg width="520" height="260" viewBox="0 0 520 260" className="select-none">
          <defs>
            <marker
              id="arrow-request"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b" />
            </marker>
            <marker
              id="arrow-assignment"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#6366f1" />
            </marker>
          </defs>

          {/* Render Edges */}
          {currentPreset.edges.map((edge, idx) => {
            const fromNode = currentPreset.nodes.find(n => n.id === edge.from)!;
            const toNode = currentPreset.nodes.find(n => n.id === edge.to)!;
            const isRequest = edge.type === 'request';
            const color = isRequest ? '#f59e0b' : '#6366f1';
            const marker = isRequest ? 'url(#arrow-request)' : 'url(#arrow-assignment)';

            return (
              <g key={idx}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={color}
                  strokeWidth={isDeadlocked ? '3' : '2'}
                  strokeDasharray={isRequest ? '4 2' : 'none'}
                  markerEnd={marker}
                  className={isDeadlocked ? 'animate-pulse' : ''}
                />
              </g>
            );
          })}

          {/* Render Nodes */}
          {currentPreset.nodes.map(node => {
            if (node.type === 'process') {
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="24"
                    fill="#3b82f6"
                    stroke="#1d4ed8"
                    strokeWidth="2.5"
                    className="drop-shadow"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontWeight="bold"
                    fontSize="13"
                    fontFamily="monospace"
                  >
                    {node.name}
                  </text>
                </g>
              );
            } else {
              // Resource (Rectangle with instance dots)
              const width = 56;
              const height = 44;
              return (
                <g key={node.id}>
                  <rect
                    x={node.x - width / 2}
                    y={node.y - height / 2}
                    width={width}
                    height={height}
                    rx="6"
                    fill="#10b981"
                    stroke="#047857"
                    strokeWidth="2.5"
                    className="drop-shadow"
                  />
                  <text
                    x={node.x}
                    y={node.y - 6}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontWeight="bold"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {node.name}
                  </text>
                  {/* Dots for instances */}
                  <g transform={`translate(${node.x}, ${node.y + 10})`}>
                    {Array.from({ length: node.instances || 1 }).map((_, dIdx) => {
                      const spacing = 12;
                      const count = node.instances || 1;
                      const startX = -((count - 1) * spacing) / 2;
                      return (
                        <circle
                          key={dIdx}
                          cx={startX + dIdx * spacing}
                          cy="0"
                          r="3"
                          fill="#ffffff"
                        />
                      );
                    })}
                  </g>
                </g>
              );
            }
          })}
        </svg>
      </div>

      {/* Legend & Rules */}
      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-500 inline-block" />
            <span>Process Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block" />
            <span>Resource Node (dots = units)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-amber-500 inline-block" />
            <span>Request (P → R)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-indigo-500 inline-block" />
            <span>Assignment (R → P)</span>
          </div>
        </div>

        <div className="font-semibold text-slate-700 dark:text-slate-300">
          Golden Rule: Cycle + Single-instance = Deadlock (100% guarantee)
        </div>
      </div>
    </div>
  );
};
