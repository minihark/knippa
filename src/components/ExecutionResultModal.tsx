import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ExecutionResult } from '../types';
import { 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Layers, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { playSuccess, playClick } from '../utils/audio';

interface ExecutionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ExecutionResult | null;
}

export const ExecutionResultModal: React.FC<ExecutionResultModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  useEffect(() => {
    if (isOpen && result && result.success) {
      playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E5A93C', '#00E5FF', '#10B981', '#FFFFFF'],
        });
      } catch (e) {}
    }
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const handleCopyReceipt = () => {
    playClick();
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ledger-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-ledger-900 border border-ledger-750 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ledger-800 pb-3">
          <div className="flex items-center gap-2">
            {result.success ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="font-sans font-bold text-base text-white">
                {result.success ? 'Atomic Batch Broadcast Successful' : 'Batch Execution Failed'}
              </h3>
              <p className="text-xs text-ledger-400 font-mono">
                {result.engineResult}
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

        {/* Execution Summary Banner */}
        <div className="p-4 rounded-xl bg-ledger-950 border border-ledger-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-ledger-400">Execution Mode:</span>
            <span className="font-mono font-bold text-brass">
              {result.executionMode} (Atomic)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-ledger-400">Bundled Operations:</span>
            <span className="font-mono font-bold text-white">
              {result.itemCount} Transactions Executed in 1 Consensus Round
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-ledger-400">Total Outflow:</span>
            <span className="font-mono font-bold text-white">
              {result.totalAmountXrp} XRP
            </span>
          </div>

          {result.ledgerIndex && (
            <div className="flex items-center justify-between">
              <span className="text-ledger-400">Validated Ledger Index:</span>
              <span className="font-mono font-semibold text-emerald-400">
                #{result.ledgerIndex.toLocaleString()}
              </span>
            </div>
          )}

          {/* Tx Hash */}
          <div className="pt-2 border-t border-ledger-850 space-y-1">
            <span className="text-[11px] font-mono text-ledger-500 uppercase">Transaction Hash:</span>
            <div className="p-2 rounded bg-ledger-900 border border-ledger-800 font-mono text-[11px] text-cyan-glow break-all select-all">
              {result.hash}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={handleCopyReceipt}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ledger-850 hover:bg-ledger-800 border border-ledger-750 text-ledger-300 hover:text-white text-xs font-mono font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Receipt Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Receipt</span>
              </>
            )}
          </button>

          <a
            href={result.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brass hover:bg-brass-400 text-ledger-950 font-bold text-xs shadow-amber-glow transition-all"
          >
            <span>View on XRPL Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
