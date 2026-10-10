import React from 'react';
import { BatchMode } from '../types';
import { PRESETS, BatchPreset } from '../utils/presets';
import { 
  ShieldCheck, 
  Split, 
  FastForward, 
  ListOrdered, 
  Upload, 
  Code2, 
  Plus, 
  Trash2,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { playClick, playSnap } from '../utils/audio';

interface BatchHeaderProps {
  mode: BatchMode;
  onSelectMode: (mode: BatchMode) => void;
  slotCount: number;
  maxSlots: number;
  onAddSlot: () => void;
  onClearAll: () => void;
  onOpenCsvModal: () => void;
  onOpenJsonModal: () => void;
  onApplyPreset: (preset: BatchPreset) => void;
}

export const BatchHeader: React.FC<BatchHeaderProps> = ({
  mode,
  onSelectMode,
  slotCount,
  maxSlots,
  onAddSlot,
  onClearAll,
  onOpenCsvModal,
  onOpenJsonModal,
  onApplyPreset,
}) => {
  const modeInfo: Record<BatchMode, { label: string; icon: any; color: string; desc: string }> = {
    ALLORNOTHING: {
      label: 'All or Nothing (Atomic)',
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30',
      desc: 'Guaranteed 100% atomic execution. If any operation fails, the entire batch reverts completely.',
    },
    ONLYONE: {
      label: 'Only One (Contingency)',
      icon: Split,
      color: 'text-brass border-brass/40 bg-brass/10',
      desc: 'Executes the first successful operation and cancels the others. Ideal for alternative limit orders.',
    },
    UNTILFAILURE: {
      label: 'Until Failure',
      icon: FastForward,
      color: 'text-blue-400 border-blue-500/40 bg-blue-950/30',
      desc: 'Processes operations sequentially and stops immediately if one fails.',
    },
    INDEPENDENT: {
      label: 'Independent',
      icon: ListOrdered,
      color: 'text-purple-400 border-purple-500/40 bg-purple-950/30',
      desc: 'Executes as many valid operations as possible regardless of individual failures.',
    },
  };

  const current = modeInfo[mode];
  const CurrentIcon = current.icon;

  return (
    <div className="bg-ledger-900 border border-ledger-750 rounded-xl p-4 sm:p-5 shadow-cassette space-y-4">
      {/* Top row: Title, Mode toggle, and Slots meter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Mode Selector Cluster */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-ledger-400">
              Execution Mode (Flag):
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['ALLORNOTHING', 'ONLYONE', 'UNTILFAILURE', 'INDEPENDENT'] as BatchMode[]).map((m) => {
              const active = mode === m;
              const info = modeInfo[m];
              const Icon = info.icon;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    playClick();
                    onSelectMode(m);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    active
                      ? `${info.color} shadow-sm font-semibold`
                      : 'bg-ledger-850 border-ledger-750 text-ledger-400 hover:text-white hover:border-ledger-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{info.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slot capacity meter */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-ledger-800">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase text-ledger-400">
              Cassette Capacity
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-lg font-bold text-white tabular-nums">
                {slotCount}
              </span>
              <span className="text-xs text-ledger-500">
                / {maxSlots} operations
              </span>
            </div>
          </div>

          {/* Slot visual dots */}
          <div className="grid grid-cols-4 gap-1 p-1.5 rounded-md bg-ledger-950 border border-ledger-800">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-sm transition-all ${
                  i < slotCount
                    ? 'bg-brass shadow-amber-glow'
                    : 'bg-ledger-800 opacity-40'
                }`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Mode explanation banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ledger-950/60 border border-ledger-800 text-xs text-ledger-300">
        <CurrentIcon className="w-4 h-4 text-brass shrink-0" />
        <span className="leading-snug">{current.desc}</span>
      </div>

      {/* Bottom actions row: Presets, CSV, JSON, Add slot */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-ledger-800 text-xs">
        
        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
          <div className="relative min-w-0 max-w-[160px] sm:max-w-none">
            <select
              defaultValue=""
              onChange={(e) => {
                const found = PRESETS.find((p) => p.id === e.target.value);
                if (found) {
                  playSnap();
                  onApplyPreset(found);
                }
                e.target.value = '';
              }}
              className="appearance-none bg-ledger-850 hover:bg-ledger-800 border border-ledger-700 text-ledger-200 text-xs rounded px-2.5 py-1.5 pr-6 cursor-pointer focus:outline-none focus:border-brass transition-colors w-full truncate"
            >
              <option value="" disabled>Load Batch Preset...</option>
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.badge}: {p.name} ({p.items.length} ops)
                </option>
              ))}
            </select>
            <Bookmark className="w-3 h-3 text-ledger-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => {
              playClick();
              onOpenCsvModal();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-ledger-850 hover:bg-ledger-800 border border-ledger-700 text-ledger-300 hover:text-white transition-colors shrink-0"
            title="Import recipient addresses & amounts from CSV"
          >
            <Upload className="w-3.5 h-3.5 text-brass" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              onOpenJsonModal();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-ledger-850 hover:bg-ledger-800 border border-ledger-700 text-ledger-300 hover:text-white transition-colors shrink-0"
            title="Inspect raw XLS-56 Batch JSON payload"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-glow" />
            <span className="hidden sm:inline">Raw JSON</span>
          </button>
        </div>

        {/* Add slot & Clear */}
        <div className="flex items-center gap-2 ml-auto">
          {slotCount > 0 && (
            <button
              type="button"
              onClick={() => {
                playClick();
                onClearAll();
              }}
              className="inline-flex items-center gap-1 text-xs text-ledger-400 hover:text-red-400 px-2 py-1 transition-colors"
              title="Clear all cassette slots"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playSnap();
              onAddSlot();
            }}
            disabled={slotCount >= maxSlots}
            className="btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-brass hover:bg-brass-400 text-ledger-950 font-semibold text-xs transition-all shadow-amber-glow disabled:opacity-40 disabled:pointer-events-none"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Slot</span>
          </button>
        </div>

      </div>

    </div>
  );
};
