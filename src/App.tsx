import React, { useState, useEffect } from 'react';
import * as xrpl from 'xrpl';
import { 
  NetworkType, 
  WalletState, 
  BatchMode, 
  InnerTransaction, 
  SimulationResult, 
  ExecutionResult 
} from './types';
import { PRESETS, BatchPreset } from './utils/presets';
import { 
  fetchLedgerStatus, 
  fetchAccountInfo, 
  fundTestnetWallet, 
  simulateBatch, 
  executeBatchWithWallet,
  compileBatchPayload 
} from './utils/xrpl';
import { Navbar } from './components/Navbar';
import { BatchHeader } from './components/BatchHeader';
import { CassetteSlot } from './components/CassetteSlot';
import { BatchSummary } from './components/BatchSummary';
import { CsvImportModal } from './components/CsvImportModal';
import { JsonInspectorModal } from './components/JsonInspectorModal';
import { WalletConnectModal } from './components/WalletConnectModal';
import { ExecutionResultModal } from './components/ExecutionResultModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { 
  Layers, 
  ShieldCheck, 
  Info, 
  Plus, 
  ExternalLink,
  Sparkles,
  Zap,
  Lock
} from 'lucide-react';
import { playClick, playSnap } from './utils/audio';

export const App: React.FC = () => {
  const [network, setNetwork] = useState<NetworkType>('testnet');
  const [ledgerIndex, setLedgerIndex] = useState<number | null>(null);
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [mode, setMode] = useState<BatchMode>('ALLORNOTHING');

  // Seed default 3-way contributor batch
  const [slots, setSlots] = useState<InnerTransaction[]>(() => {
    return PRESETS[0].items.slice(0, 3);
  });

  const [isPro, setIsPro] = useState<boolean>(() => {
    return localStorage.getItem('knippa_pro') === 'true';
  });

  // Async process flags
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isFauceting, setIsFauceting] = useState<boolean>(false);

  // Results & Simulation
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  // Modals
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState<boolean>(false);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);

  const maxSlots = isPro ? 8 : 3;

  // Poll live ledger index
  useEffect(() => {
    let isMounted = true;
    const poll = async () => {
      try {
        const info = await fetchLedgerStatus(network);
        if (isMounted) setLedgerIndex(info.ledgerIndex);
      } catch (e) {}
    };

    poll();
    const interval = setInterval(poll, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [network]);

  // Refresh wallet balance on network switch or block update
  useEffect(() => {
    if (!wallet) return;
    let isMounted = true;
    fetchAccountInfo(network, wallet.address)
      .then((info) => {
        if (isMounted) {
          setWallet((prev) => prev ? { ...prev, balanceXrp: info.balanceXrp, sequence: info.sequence } : null);
        }
      })
      .catch(() => {});
  }, [network, ledgerIndex]);

  // Slot mutations
  const handleAddSlot = () => {
    if (slots.length >= maxSlots) {
      if (!isPro) setIsProModalOpen(true);
      return;
    }
    const newSlot: InnerTransaction = {
      id: 'slot-' + Date.now(),
      type: 'Payment',
      destination: '',
      amount: '10',
      currency: 'XRP',
      memo: '',
    };
    setSlots([...slots, newSlot]);
  };

  const handleUpdateSlot = (id: string, updated: InnerTransaction) => {
    setSlots(slots.map((s) => (s.id === id ? updated : s)));
    setSimulation(null); // invalidate previous simulation
  };

  const handleRemoveSlot = (id: string) => {
    playSnap();
    setSlots(slots.filter((s) => s.id !== id));
    setSimulation(null);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    playClick();
    const copy = [...slots];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    setSlots(copy);
    setSimulation(null);
  };

  const handleMoveDown = (index: number) => {
    if (index >= slots.length - 1) return;
    playClick();
    const copy = [...slots];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    setSlots(copy);
    setSimulation(null);
  };

  const handleClearAll = () => {
    setSlots([]);
    setSimulation(null);
  };

  const handleApplyPreset = (preset: BatchPreset) => {
    const itemsToLoad = isPro ? preset.items : preset.items.slice(0, 3);
    setMode(preset.mode);
    setSlots(itemsToLoad);
    setSimulation(null);
    if (!isPro && preset.items.length > 3) {
      setTimeout(() => setIsProModalOpen(true), 600);
    }
  };

  const handleCsvImport = (imported: InnerTransaction[]) => {
    setSlots(imported);
    setSimulation(null);
  };

  // Faucet request
  const handleFaucetRequest = async () => {
    setIsFauceting(true);
    try {
      const res = await fundTestnetWallet(network);
      setWallet({
        address: res.wallet.address,
        balanceXrp: res.balance.toString(),
        sequence: 1,
        walletType: 'secret',
        secret: res.wallet.seed,
      });
    } catch (err: any) {
      alert(err.message || 'Faucet request failed');
    } finally {
      setIsFauceting(false);
    }
  };

  // Simulate Batch
  const handleSimulate = async () => {
    if (slots.length < 2) return;
    setIsSimulating(true);
    try {
      const sender = wallet ? wallet.address : 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH';
      const seq = wallet ? wallet.sequence : 1;
      const sim = await simulateBatch(network, sender, mode, slots, seq);
      setSimulation(sim);
    } catch (err: any) {
      alert(err.message || 'Simulation error');
    } finally {
      setIsSimulating(false);
    }
  };

  // Execute Batch live
  const handleExecute = async () => {
    if (!wallet || !wallet.secret || slots.length < 2) return;
    setIsExecuting(true);
    try {
      const w = xrpl.Wallet.fromSeed(wallet.secret);
      const res = await executeBatchWithWallet(network, w, mode, slots);
      setExecutionResult(res);
      setIsExecutionModalOpen(true);
      // Refresh wallet balance
      const freshInfo = await fetchAccountInfo(network, wallet.address);
      setWallet({ ...wallet, balanceXrp: freshInfo.balanceXrp, sequence: freshInfo.sequence });
    } catch (err: any) {
      alert(err.message || 'Execution error');
    } finally {
      setIsExecuting(false);
    }
  };

  // Pre-compiled JSON for inspector
  const compiledJson = React.useMemo(() => {
    try {
      const sender = wallet ? wallet.address : 'rSenderAddressPlaceholder1234567890';
      const seq = wallet ? wallet.sequence : 100;
      return compileBatchPayload(sender, mode, slots.length >= 2 ? slots : PRESETS[0].items.slice(0, 2), seq);
    } catch (e) {
      return { error: 'Add at least 2 operations to compile XLS-56 payload.' };
    }
  }, [wallet, mode, slots]);

  return (
    <div className="min-h-screen flex flex-col bg-ledger-950 text-ledger-100 font-sans selection:bg-brass selection:text-ledger-950">
      
      {/* 2px Amber Accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-brass-600 via-brass to-cyan-glow" />

      {/* Top Navbar */}
      <Navbar
        network={network}
        onSelectNetwork={setNetwork}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onDisconnectWallet={() => setWallet(null)}
        onFaucetRequest={handleFaucetRequest}
        isFauceting={isFauceting}
        ledgerIndex={ledgerIndex}
        isPro={isPro}
        onOpenProModal={() => setIsProModalOpen(true)}
      />

      {/* Hero Banner / Protocol Context */}
      <div className="border-b border-ledger-800 bg-ledger-900/40 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active on XRPL Mainnet (Oct 9, 2026)
              </span>
              <span className="text-xs text-ledger-400">
                • BatchV1_1 (XLS-56)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Knippa — Atomic Transaction Bundler
            </h1>
            <p className="text-xs sm:text-sm text-ledger-300 mt-1 max-w-2xl">
              Assemble between 2 and 8 operations into a single consensus transaction. 
              Guaranteed all-or-nothing settlement with zero partial execution risk.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 text-xs font-mono text-ledger-400 bg-ledger-950 p-2.5 rounded-xl border border-ledger-800">
            <div className="px-2">
              <div className="text-[10px] uppercase text-ledger-500">Outer Fee</div>
              <div className="text-emerald-400 font-bold">≈ 25-50 drops</div>
            </div>
            <div className="h-6 w-px bg-ledger-800" />
            <div className="px-2">
              <div className="text-[10px] uppercase text-ledger-500">Atomic Rollback</div>
              <div className="text-brass font-bold">100% Native</div>
            </div>
            <div className="h-6 w-px bg-ledger-800" />
            <div className="px-2">
              <div className="text-[10px] uppercase text-ledger-500">Max Inner Ops</div>
              <div className="text-white font-bold">8 Slots</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Dual-Pane Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column (8 cols): Batch Header & Cassette Slots */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Batch Controls & Mode Selector */}
            <BatchHeader
              mode={mode}
              onSelectMode={setMode}
              slotCount={slots.length}
              maxSlots={maxSlots}
              onAddSlot={handleAddSlot}
              onClearAll={handleClearAll}
              onOpenCsvModal={() => setIsCsvModalOpen(true)}
              onOpenJsonModal={() => setIsJsonModalOpen(true)}
              onApplyPreset={handleApplyPreset}
            />

            {/* Cassette Slots Rack */}
            <div className="space-y-3">
              {slots.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-ledger-800 bg-ledger-900/30 space-y-3">
                  <Layers className="w-8 h-8 text-ledger-500 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white text-sm">Your Batch Cassette is Empty</h4>
                    <p className="text-xs text-ledger-400 max-w-sm mx-auto">
                      Add operations manually, import a CSV payout list, or select a pre-configured preset above.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSlot}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brass hover:bg-brass-400 text-ledger-950 font-bold text-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Insert First Operation</span>
                  </button>
                </div>
              ) : (
                slots.map((slot, index) => (
                  <CassetteSlot
                    key={slot.id}
                    slot={slot}
                    index={index}
                    totalSlots={slots.length}
                    onUpdate={(updated) => handleUpdateSlot(slot.id, updated)}
                    onRemove={() => handleRemoveSlot(slot.id)}
                    onMoveUp={() => handleMoveUp(index)}
                    onMoveDown={() => handleMoveDown(index)}
                  />
                ))
              )}
            </div>

            {/* Quick Add Slot Button under rack */}
            {slots.length > 0 && slots.length < maxSlots && (
              <button
                type="button"
                onClick={handleAddSlot}
                className="w-full py-3 rounded-xl border border-dashed border-ledger-750 hover:border-brass/60 bg-ledger-900/40 hover:bg-ledger-850/60 text-ledger-400 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4 text-brass" />
                <span>Add Operation Slot ({slots.length + 1} / {maxSlots})</span>
              </button>
            )}

            {!isPro && slots.length >= 3 && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-brass-950/40 via-ledger-900 to-ledger-900 border border-brass/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brass shrink-0" />
                  <span className="text-ledger-300">
                    Free tier supports up to <strong>3 slots</strong>. Unlock <strong>Knippa Pro</strong> for all 8 slots and bulk CSV.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProModalOpen(true)}
                  className="px-3 py-1.5 rounded bg-brass hover:bg-brass-400 text-ledger-950 font-bold text-xs shrink-0 transition-colors"
                >
                  Upgrade to 8 Slots
                </button>
              </div>
            )}

          </div>

          {/* Right Column (4 cols): Sticky Consensus Dispatch Desk */}
          <div className="lg:col-span-4 space-y-4">
            <div className="sticky top-20 space-y-4">
              
              <BatchSummary
                mode={mode}
                items={slots}
                wallet={wallet}
                onSimulate={handleSimulate}
                onExecute={handleExecute}
                isSimulating={isSimulating}
                isExecuting={isExecuting}
                simulation={simulation}
              />

              {/* Protocol explainer card */}
              <div className="p-4 rounded-xl bg-ledger-900 border border-ledger-800 text-xs text-ledger-300 space-y-2.5">
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <Info className="w-4 h-4 text-brass" />
                  <span>Why BatchV1_1 is a Game Changer</span>
                </div>
                <p className="text-[11px] text-ledger-400 leading-relaxed">
                  Before XLS-56, executing multiple payments or swaps required sequential signing, multiple transaction fees, and the danger of partial execution if transaction #3 failed after #1 and #2 had succeeded.
                </p>
                <p className="text-[11px] text-ledger-400 leading-relaxed">
                  With native <code className="text-white">Batch</code>, the XRPL validation engine processes the entire container atomically in a single ledger close.
                </p>
                <div className="pt-2 border-t border-ledger-800 flex items-center justify-between text-[11px]">
                  <a
                    href="https://xrpl.org/docs/references/protocol/transactions/types/batch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brass hover:underline"
                  >
                    <span>Read XLS-56 Spec</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-ledger-500 font-mono">rippled v3.3.0+</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-ledger-950 border-t border-ledger-800 py-6 px-4 mt-12 text-xs text-ledger-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brass shrink-0" />
            <span>
              <strong>100% Client-Side Privacy:</strong> Secret seeds and private keys never leave your browser memory.
            </span>
          </div>

          <div className="flex items-center gap-4 text-ledger-500 text-[11px] font-mono">
            <span>XLS-56 BatchV1_1</span>
            <span>•</span>
            <span>XLS-75 Delegation</span>
            <span>•</span>
            <span>Harkco Studio</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        network={network}
        onConnect={(w) => setWallet(w)}
      />

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImport={handleCsvImport}
        maxSlots={maxSlots}
      />

      <JsonInspectorModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        payload={compiledJson}
      />

      <ExecutionResultModal
        isOpen={isExecutionModalOpen}
        onClose={() => setIsExecutionModalOpen(false)}
        result={executionResult}
      />

      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onUpgradeSuccess={() => setIsPro(true)}
        isPro={isPro}
      />

    </div>
  );
};

export default App;
