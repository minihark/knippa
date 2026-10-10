import React from 'react';
import { BatchMode, InnerTransaction, SimulationResult, WalletState } from '../types';
import { 
  Zap, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Fuel, 
  Lock, 
  Loader2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { playClick } from '../utils/audio';

interface BatchSummaryProps {
  mode: BatchMode;
  items: InnerTransaction[];
  wallet: WalletState | null;
  onSimulate: () => void;
  onExecute: () => void;
  isSimulating: boolean;
  isExecuting: boolean;
  simulation: SimulationResult | null;
}

export const BatchSummary: React.FC<BatchSummaryProps> = ({
  mode,
  items,
  wallet,
  onSimulate,
  onExecute,
  isSimulating,
  isExecuting,
  simulation,
}) => {
  // Compute aggregated totals
  let totalXrp = 0;
  const currencyTotals: Record<string, number> = {};

  for (const item of items) {
    if (item.type === 'Payment') {
      const amt = parseFloat(item.amount) || 0;
      if (item.currency === 'XRP') {
        totalXrp += amt;
      } else {
        currencyTotals[item.currency] = (currencyTotals[item.currency] || 0) + amt;
      }
    }
  }

  const estimatedFeeDrops = simulation?.estimatedFeeDrops || String(Math.max(25, items.length * 15));
  const estimatedFeeXrp = (parseInt(estimatedFeeDrops, 10) / 1000000).toFixed(6);

  const hasMinimum = items.length >= 2;
  const hasMaximum = items.length <= 8;
  const isCountValid = hasMinimum && hasMaximum;

  const userBalance = wallet ? parseFloat(wallet.balanceXrp) || 0 : 0;
  const totalRequired = totalXrp + parseFloat(estimatedFeeXrp);
  const hasSufficientFunds = wallet ? userBalance >= totalRequired : true;

  const canExecute = isCountValid && wallet && hasSufficientFunds && !isExecuting;

  return (
    <div className="bg-ledger-900 border border-ledger-750 rounded-xl p-5 shadow-cassette space-y-5">
      
      {/* Desk Title */}
      <div className="flex items-center justify-between pb-3 border-b border-ledger-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brass" />
          <h3 className="font-mono text-xs uppercase font-bold text-white tracking-wider">
            Consensus Dispatch Desk
          </h3>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-ledger-800 text-ledger-300">
          XLS-56 Verified
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-ledger-950 border border-ledger-800 space-y-1">
          <span className="text-[10px] font-mono uppercase text-ledger-400">Total Outflow (XRP)</span>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            {totalXrp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            <span className="text-xs text-ledger-400 font-normal ml-1">XRP</span>
          </div>
          {Object.entries(currencyTotals).map(([cur, amt]) => (
            <div key={cur} className="text-[11px] font-mono text-brass tabular-nums">
              + {amt.toLocaleString()} {cur}
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-ledger-950 border border-ledger-800 space-y-1">
          <span className="text-[10px] font-mono uppercase text-ledger-400">Network Fee (Outer)</span>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {estimatedFeeDrops}
            <span className="text-xs text-ledger-400 font-normal ml-1">drops</span>
          </div>
          <div className="text-[10px] font-mono text-ledger-500">
            ≈ {estimatedFeeXrp} XRP
          </div>
        </div>
      </div>

      {/* Protocol Constraint Checkers */}
      <div className="space-y-1.5 text-xs">
        {!hasMinimum && (
          <div className="flex items-center gap-2 p-2 rounded bg-amber-950/30 border border-amber-800/40 text-amber-300 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>XLS-56 requires a minimum of <strong>2 operations</strong> in a batch (currently {items.length}).</span>
          </div>
        )}

        {wallet && !hasSufficientFunds && (
          <div className="flex items-center gap-2 p-2 rounded bg-red-950/30 border border-red-800/40 text-red-300 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Insufficient balance. Need ~{totalRequired.toFixed(4)} XRP, wallet has {userBalance.toFixed(2)} XRP.</span>
          </div>
        )}

        {simulation && simulation.valid && (
          <div className="flex items-center gap-2 p-2 rounded bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{simulation.engineResultMessage}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        {/* Simulate button */}
        <button
          type="button"
          onClick={() => {
            playClick();
            onSimulate();
          }}
          disabled={!isCountValid || isSimulating || isExecuting}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-ledger-850 hover:bg-ledger-800 border border-ledger-700 text-ledger-200 font-medium text-xs transition-colors disabled:opacity-40"
        >
          {isSimulating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brass" />
              <span>Simulating on Ledger...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-cyan-glow" />
              <span>Dry Run & Simulate Payload</span>
            </>
          )}
        </button>

        {/* Execute button */}
        <button
          type="button"
          onClick={() => {
            playClick();
            onExecute();
          }}
          disabled={!canExecute}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-brass-600 via-brass to-brass-400 hover:from-brass-500 hover:to-brass-300 text-ledger-950 font-extrabold text-xs shadow-amber-glow transition-all disabled:opacity-40 disabled:shadow-none"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Broadcasting BatchV1_1 Transaction...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Broadcast {items.length}-Tx Atomic Batch</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </>
          )}
        </button>

        {!wallet && (
          <div className="text-center text-[11px] text-ledger-500 pt-1">
            Connect wallet or test secret above to broadcast live
          </div>
        )}
      </div>

      {/* Security note */}
      <div className="flex items-center gap-1.5 justify-center text-[10px] text-ledger-500 pt-1">
        <Lock className="w-3 h-3 text-ledger-500" />
        <span>Keys stay in memory / client-side. Zero external logging.</span>
      </div>

    </div>
  );
};
