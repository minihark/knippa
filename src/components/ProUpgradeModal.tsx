import React from 'react';
import { X, Sparkles, Check, Zap, Layers, FileSpreadsheet, BookmarkCheck } from 'lucide-react';
import { playClick, playSuccess } from '../utils/audio';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  isPro: boolean;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
  isPro,
}) => {
  if (!isOpen) return null;

  const handleUnlock = () => {
    playSuccess();
    localStorage.setItem('knippa_pro', 'true');
    onUpgradeSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ledger-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-ledger-900 border border-brass/40 w-full max-w-md rounded-2xl p-6 shadow-amber-glow space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ledger-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brass/10 border border-brass/30 text-brass">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-base text-white">
                Knippa Pro Studio
              </h3>
              <p className="text-xs text-brass font-mono">
                Lifetime Creator & Treasury License
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-ledger-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature List */}
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-ledger-950 border border-ledger-800">
            <Layers className="w-4 h-4 text-brass shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Full 8-Slot Atomic Batches</div>
              <p className="text-[11px] text-ledger-400 mt-0.5">
                Dispatch the maximum allowed 8 transactions per consensus block (free tier allows 3).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-ledger-950 border border-ledger-800">
            <FileSpreadsheet className="w-4 h-4 text-cyan-glow shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Bulk CSV Payout Importer</div>
              <p className="text-[11px] text-ledger-400 mt-0.5">
                Drop CSV sheets directly to auto-populate batches for team payroll or community splits.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-ledger-950 border border-ledger-800">
            <BookmarkCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Saved Payroll & Zap Templates</div>
              <p className="text-[11px] text-ledger-400 mt-0.5">
                Save recurring payout lists and 1-click RLUSD Zap configurations locally.
              </p>
            </div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-brass-900/40 to-ledger-950 border border-brass/30 text-center space-y-3">
          <div>
            <div className="text-2xl font-extrabold font-mono text-white">
              15 XRP <span className="text-xs font-normal text-ledger-400">or 99 SEK</span>
            </div>
            <div className="text-[11px] text-ledger-400 mt-0.5">
              One-time payment • Lifetime access • Zero monthly fees
            </div>
          </div>

          <button
            type="button"
            onClick={handleUnlock}
            className="w-full py-3 px-4 rounded-xl bg-brass hover:bg-brass-400 text-ledger-950 font-extrabold text-xs shadow-amber-glow transition-all"
          >
            {isPro ? 'Pro Active (Re-verify)' : 'Unlock Knippa Pro Lifetime'}
          </button>
        </div>

        <div className="text-center text-[10px] text-ledger-500">
          Built with craft by Harkco Software Lab • Gothenburg, Sweden
        </div>

      </div>
    </div>
  );
};
