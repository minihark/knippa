import React from 'react';
import { NetworkType, WalletState } from '../types';
import { NETWORKS } from '../utils/xrpl';
import { 
  Layers, 
  Wallet, 
  Droplets, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Radio, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { playClick } from '../utils/audio';

interface NavbarProps {
  network: NetworkType;
  onSelectNetwork: (net: NetworkType) => void;
  wallet: WalletState | null;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
  onFaucetRequest: () => void;
  isFauceting: boolean;
  ledgerIndex: number | null;
  isPro: boolean;
  onOpenProModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  network,
  onSelectNetwork,
  wallet,
  onOpenWalletModal,
  onDisconnectWallet,
  onFaucetRequest,
  isFauceting,
  ledgerIndex,
  isPro,
  onOpenProModal,
}) => {
  const currentNetwork = NETWORKS[network];

  return (
    <header className="sticky top-0 z-40 bg-ledger-950/90 backdrop-blur-md border-b border-ledger-750 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Protocol Tag */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            {/* Tactile Brass Stamp Mark */}
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-brass-400 via-brass-500 to-brass-700 p-0.5 shadow-amber-glow flex items-center justify-center">
              <div className="w-full h-full bg-ledger-950 rounded-[4px] flex items-center justify-center">
                <Layers className="w-4 h-4 text-brass" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-extrabold text-base tracking-tight text-white">
                  Knippa
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brass/10 border border-brass/30 text-brass">
                  XLS-56 Batch
                </span>
              </div>
              <div className="text-[10px] text-ledger-400 hidden sm:block">
                Tactile Atomic Dispatcher for XRPL
              </div>
            </div>
          </div>

          {/* Network indicator badge for mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-ledger-300">
              #{ledgerIndex ? ledgerIndex.toLocaleString() : '...'}
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto text-xs">
          
          {/* Live Consensus Ledger status (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-ledger-900 border border-ledger-800 text-ledger-300 font-mono text-[11px]">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Ledger:</span>
            <span className="text-white font-semibold tabular-nums">
              {ledgerIndex ? `#${ledgerIndex.toLocaleString()}` : 'Syncing...'}
            </span>
          </div>

          {/* Network Switcher */}
          <div className="relative">
            <select
              value={network}
              onChange={(e) => {
                playClick();
                onSelectNetwork(e.target.value as NetworkType);
              }}
              className="appearance-none bg-ledger-900 hover:bg-ledger-850 border border-ledger-750 hover:border-ledger-600 text-ledger-200 text-xs font-mono rounded px-2.5 py-1.5 pr-7 focus:outline-none focus:border-brass cursor-pointer transition-colors"
            >
              <option value="mainnet">Mainnet (Batch Active)</option>
              <option value="testnet">Testnet (Altnet)</option>
              <option value="devnet">Devnet</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-ledger-400 absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* Testnet Faucet Button (if supported) */}
          {currentNetwork.faucetSupported && (
            <button
              type="button"
              onClick={() => {
                playClick();
                onFaucetRequest();
              }}
              disabled={isFauceting}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/80 text-cyan-glow font-mono text-xs transition-colors disabled:opacity-50"
              title="Fund a free test wallet with 1,000 Testnet XRP"
            >
              <Droplets className={`w-3.5 h-3.5 ${isFauceting ? 'animate-spin' : ''}`} />
              <span>{isFauceting ? 'Funding...' : 'Faucet'}</span>
            </button>
          )}

          {/* Wallet Connection */}
          {wallet ? (
            <div className="flex items-center gap-1.5 bg-ledger-900 border border-ledger-750 rounded p-0.5 pl-2 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white font-semibold">
                {parseFloat(wallet.balanceXrp).toFixed(2)} XRP
              </span>
              <span className="text-ledger-400 text-[11px] hidden sm:inline">
                ({wallet.address.slice(0, 4)}...{wallet.address.slice(-4)})
              </span>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onDisconnectWallet();
                }}
                className="p-1 text-ledger-400 hover:text-red-400 transition-colors ml-1"
                title="Disconnect wallet"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                playClick();
                onOpenWalletModal();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-ledger-850 hover:bg-ledger-800 border border-ledger-700 text-white font-medium transition-all shadow-xs"
            >
              <Wallet className="w-3.5 h-3.5 text-brass" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Pro Pill / Modal */}
          {isPro ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-emerald-950/60 border border-emerald-700/80 text-emerald-400 font-semibold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pro</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                playClick();
                onOpenProModal();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-brass/10 hover:bg-brass/20 border border-brass/40 hover:border-brass text-brass font-semibold text-xs transition-all shadow-amber-glow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
