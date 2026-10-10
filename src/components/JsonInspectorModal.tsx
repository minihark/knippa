import React, { useState } from 'react';
import { X, Copy, Check, Code2, Info } from 'lucide-react';
import { playClick } from '../utils/audio';

interface JsonInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: any;
}

export const JsonInspectorModal: React.FC<JsonInspectorModalProps> = ({
  isOpen,
  onClose,
  payload,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    playClick();
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ledger-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-ledger-900 border border-ledger-750 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ledger-800 pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-glow" />
            <h3 className="font-sans font-bold text-base text-white">
              Raw XLS-56 Batch Transaction Payload
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

        {/* Protocol Architecture Explanation */}
        <div className="p-3 rounded-lg bg-ledger-950 border border-ledger-800 text-xs text-ledger-300 space-y-1.5">
          <div className="flex items-center gap-2 text-brass font-mono font-semibold">
            <Info className="w-4 h-4" />
            <span>XLS-56 Batch Structure (rippled v3.3.0+ / BatchV1_1):</span>
          </div>
          <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-ledger-400">
            <li>Outer transaction is type <code className="text-white">Batch</code> with execution flag (e.g. 65536 for AllOrNothing).</li>
            <li>Inner operations are packaged inside <code className="text-white">RawTransactions[].RawTransaction</code>.</li>
            <li>Each inner operation sets <code className="text-white">Flags: 1073741824</code> (<code className="text-white">tfInnerBatchTxn</code>) and <code className="text-white">Fee: "0"</code>.</li>
          </ul>
        </div>

        {/* JSON Preview */}
        <div className="relative">
          <pre className="max-h-80 overflow-y-auto p-4 rounded-lg bg-ledger-950 border border-ledger-800 text-cyan-400 font-mono text-xs leading-relaxed select-all">
            {jsonString}
          </pre>

          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-ledger-800 hover:bg-ledger-750 text-white text-xs font-mono font-semibold transition-colors border border-ledger-700 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        </div>

        {/* Modal Close */}
        <div className="flex items-center justify-end pt-2 border-t border-ledger-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-ledger-800 hover:bg-ledger-750 text-white text-xs font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
