import React, { useState } from 'react';
import { InnerTransaction } from '../types';
import { isValidAddress } from '../utils/xrpl';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { playClick, playSnap } from '../utils/audio';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: InnerTransaction[]) => void;
  maxSlots: number;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  maxSlots,
}) => {
  const [csvText, setCsvText] = useState<string>(
`rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH,15.5,XRP,101,Contributor Payout
rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYrC,22.0,XRP,102,Design Retainer
rLNaPoKeeBjZe2qs6x52yVPZpZ8TD4dcCc,30.0,XRP,103,Infra Budget
rEb8TK3gBgk5auZyyY67a4StAZ6amWA42S,12.5,XRP,,Community Split`
  );

  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcessCsv = () => {
    try {
      setParseError(null);
      const lines = csvText.trim().split('\n');
      const parsedItems: InnerTransaction[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('#')) continue;

        const cols = line.split(',').map((c) => c.trim());
        if (cols.length < 2) continue;

        const destination = cols[0];
        const amount = cols[1];
        const currency = cols[2] || 'XRP';
        const tag = cols[3] && !isNaN(parseInt(cols[3], 10)) ? parseInt(cols[3], 10) : undefined;
        const memo = cols[4] || '';

        if (!isValidAddress(destination)) {
          throw new Error(`Line ${i + 1}: Invalid XRPL address "${destination}"`);
        }

        parsedItems.push({
          id: 'csv-' + Date.now() + '-' + i,
          type: 'Payment',
          destination,
          amount,
          currency,
          destinationTag: tag,
          memo,
        });
      }

      if (parsedItems.length < 2) {
        throw new Error('Batch must contain at least 2 transactions according to XLS-56.');
      }

      if (parsedItems.length > maxSlots) {
        throw new Error(`CSV has ${parsedItems.length} items, but maximum allowed is ${maxSlots}.`);
      }

      playSnap();
      onImport(parsedItems);
      onClose();
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse CSV');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ledger-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-ledger-900 border border-ledger-750 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ledger-800 pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-brass" />
            <h3 className="font-sans font-bold text-base text-white">
              Import Payouts from CSV
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-ledger-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-ledger-300 leading-relaxed space-y-1">
          <p>
            Paste comma-separated rows. Expected format:
          </p>
          <div className="p-2 rounded bg-ledger-950 font-mono text-[11px] text-brass">
            address, amount, currency, [tag], [memo]
          </div>
        </div>

        {/* CSV Textarea */}
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          rows={8}
          className="w-full bg-ledger-950 border border-ledger-800 focus:border-brass text-white font-mono text-xs rounded-lg p-3 focus:outline-none"
        />

        {parseError && (
          <div className="flex items-center gap-2 p-2.5 rounded bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-ledger-800 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded text-ledger-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleProcessCsv}
            className="px-4 py-2 rounded bg-brass hover:bg-brass-400 text-ledger-950 font-bold transition-all shadow-amber-glow"
          >
            Load into Cassette
          </button>
        </div>

      </div>
    </div>
  );
};
