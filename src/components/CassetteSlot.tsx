import React from 'react';
import { InnerTransaction, InnerTxType } from '../types';
import { isValidAddress } from '../utils/xrpl';
import { 
  ArrowUpRight, 
  ShieldAlert, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Key, 
  Tag, 
  FileText,
  Repeat,
  BadgePercent
} from 'lucide-react';
import { playClick } from '../utils/audio';

interface CassetteSlotProps {
  slot: InnerTransaction;
  index: number;
  totalSlots: number;
  onUpdate: (updated: InnerTransaction) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const CassetteSlot: React.FC<CassetteSlotProps> = ({
  slot,
  index,
  totalSlots,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  const isAddressValid = slot.destination ? isValidAddress(slot.destination) : false;

  const handleTypeChange = (newType: InnerTxType) => {
    playClick();
    onUpdate({
      ...slot,
      type: newType,
      currency: newType === 'TrustSet' ? 'RLUSD' : slot.currency,
      issuer: newType === 'TrustSet' ? 'rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV' : slot.issuer,
      trustLimit: newType === 'TrustSet' ? '10000000' : slot.trustLimit,
    });
  };

  return (
    <div className="group relative bg-ledger-900 hover:bg-ledger-850/80 border border-ledger-750 hover:border-ledger-600 rounded-xl p-3.5 sm:p-4.5 transition-all shadow-slot">
      
      {/* Slot Header Row */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-ledger-800">
        
        {/* Left: Slot number & Type badge */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-brass px-2 py-0.5 rounded bg-brass/10 border border-brass/30">
            SLOT 0{index + 1}
          </span>

          <select
            value={slot.type}
            onChange={(e) => handleTypeChange(e.target.value as InnerTxType)}
            className="bg-ledger-950 border border-ledger-750 text-white text-xs rounded px-2 py-1 font-medium focus:outline-none focus:border-brass cursor-pointer"
          >
            <option value="Payment">Payment (Direct / IOU)</option>
            <option value="TrustSet">TrustSet (Token Line)</option>
            <option value="OfferCreate">OfferCreate (DEX Limit)</option>
          </select>
        </div>

        {/* Right: Slot order controls & delete */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1 rounded text-ledger-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Move operation up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalSlots - 1}
            className="p-1 rounded text-ledger-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Move operation down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded text-ledger-400 hover:text-red-400 transition-colors ml-1"
            title="Remove slot"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Slot Form Fields based on Type */}
      <div className="pt-3 space-y-3">
        
        {/* Case 1: PAYMENT */}
        {slot.type === 'Payment' && (
          <>
            {/* Destination Address & Validation */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-ledger-400 mb-1">
                <span>Destination XRPL Address (r...)</span>
                {slot.destination && (
                  <span className={`font-mono text-[10px] ${isAddressValid ? 'text-emerald-400' : 'text-red-400 flex items-center gap-1'}`}>
                    {isAddressValid ? '✓ Valid format' : <><ShieldAlert className="w-3 h-3" /> Invalid address</>}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={slot.destination}
                onChange={(e) => onUpdate({ ...slot, destination: e.target.value })}
                placeholder="rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
                className="w-full bg-ledger-950 border border-ledger-800 focus:border-brass text-white font-mono text-xs rounded px-3 py-2 focus:outline-none transition-colors"
              />
            </div>

            {/* Amount & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-[11px] text-ledger-400 mb-1">Amount</label>
                <input
                  type="number"
                  step="any"
                  value={slot.amount}
                  onChange={(e) => onUpdate({ ...slot, amount: e.target.value })}
                  placeholder="25.0"
                  className="w-full bg-ledger-950 border border-ledger-800 focus:border-brass text-white font-mono text-xs rounded px-3 py-2 focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] text-ledger-400 mb-1">Currency</label>
                <select
                  value={slot.currency}
                  onChange={(e) => onUpdate({ ...slot, currency: e.target.value })}
                  className="w-full bg-ledger-950 border border-ledger-800 focus:border-brass text-white font-mono text-xs rounded px-2.5 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="XRP">XRP (Native)</option>
                  <option value="RLUSD">RLUSD (Ripple USD)</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] text-ledger-400 mb-1">Tag (Optional)</label>
                <input
                  type="number"
                  value={slot.destinationTag || ''}
                  onChange={(e) => onUpdate({ ...slot, destinationTag: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                  placeholder="e.g. 1024"
                  className="w-full bg-ledger-950 border border-ledger-800 focus:border-brass text-white font-mono text-xs rounded px-2.5 py-2 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Issuer field if IOU token */}
            {slot.currency !== 'XRP' && (
              <div>
                <label className="block text-[11px] text-ledger-400 mb-1">Issuer Address (r...)</label>
                <input
                  type="text"
                  value={slot.issuer || ''}
                  onChange={(e) => onUpdate({ ...slot, issuer: e.target.value })}
                  placeholder="rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV"
                  className="w-full bg-ledger-950 border border-ledger-800 focus:border-brass text-white font-mono text-xs rounded px-3 py-1.5 focus:outline-none transition-colors"
                />
              </div>
            )}

            {/* Memo */}
            <div>
              <input
                type="text"
                value={slot.memo || ''}
                onChange={(e) => onUpdate({ ...slot, memo: e.target.value })}
                placeholder="Optional Memo (e.g. Salary, Milestone #1, Invoice ref)"
                className="w-full bg-ledger-950/60 border border-ledger-800 focus:border-ledger-600 text-ledger-300 text-[11px] rounded px-3 py-1.5 focus:outline-none transition-colors"
              />
            </div>
          </>
        )}

        {/* Case 2: TRUSTSET */}
        {slot.type === 'TrustSet' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-blue-950/20 border border-blue-800/40 text-[11px] text-blue-300">
              Atomically establishes or updates trustline limit before subsequent batch swaps.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-ledger-400 mb-1">Token Currency</label>
                <input
                  type="text"
                  value={slot.currency}
                  onChange={(e) => onUpdate({ ...slot, currency: e.target.value })}
                  placeholder="RLUSD"
                  className="w-full bg-ledger-950 border border-ledger-800 focus:border-brass text-white font-mono text-xs rounded px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-ledger-400 mb-1">Trust Limit</label>
                <input
                  type="text"
                  value={slot.trustLimit || '10000000'}
                  onChange={(e) => onUpdate({ ...slot, trustLimit: e.target.value })}
                  placeholder="10000000"
                  className="w-full bg-ledger-950 border border-ledger-800 focus:border-brass text-white font-mono text-xs rounded px-3 py-2 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-ledger-400 mb-1">Issuer Address</label>
              <input
                type="text"
                value={slot.issuer || ''}
                onChange={(e) => onUpdate({ ...slot, issuer: e.target.value })}
                placeholder="rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV"
                className="w-full bg-ledger-950 border border-ledger-800 focus:border-brass text-white font-mono text-xs rounded px-3 py-2 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Case 3: OFFERCREATE */}
        {slot.type === 'OfferCreate' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded bg-ledger-950 border border-ledger-800 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-red-400">Taker Gets (You Sell)</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={slot.takerGetsValue || ''}
                    onChange={(e) => onUpdate({ ...slot, takerGetsValue: e.target.value })}
                    placeholder="100"
                    className="flex-1 bg-ledger-900 border border-ledger-750 text-white font-mono text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-brass"
                  />
                  <input
                    type="text"
                    value={slot.takerGetsCurrency || 'XRP'}
                    onChange={(e) => onUpdate({ ...slot, takerGetsCurrency: e.target.value })}
                    placeholder="XRP"
                    className="w-20 bg-ledger-900 border border-ledger-750 text-white font-mono text-xs rounded px-2 py-1.5 focus:outline-none focus:border-brass"
                  />
                </div>
              </div>

              <div className="p-3 rounded bg-ledger-950 border border-ledger-800 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">Taker Pays (You Buy)</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={slot.takerPaysValue || ''}
                    onChange={(e) => onUpdate({ ...slot, takerPaysValue: e.target.value })}
                    placeholder="55"
                    className="flex-1 bg-ledger-900 border border-ledger-750 text-white font-mono text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-brass"
                  />
                  <input
                    type="text"
                    value={slot.takerPaysCurrency || 'USD'}
                    onChange={(e) => onUpdate({ ...slot, takerPaysCurrency: e.target.value })}
                    placeholder="USD"
                    className="w-20 bg-ledger-900 border border-ledger-750 text-white font-mono text-xs rounded px-2 py-1.5 focus:outline-none focus:border-brass"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
