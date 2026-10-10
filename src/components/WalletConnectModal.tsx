import React, { useState } from 'react';
import * as xrpl from 'xrpl';
import { WalletState, NetworkType } from '../types';
import { fetchAccountInfo, fundTestnetWallet } from '../utils/xrpl';
import { 
  X, 
  Wallet, 
  Droplets, 
  Key, 
  QrCode, 
  AlertCircle, 
  Loader2, 
  Eye, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { playClick, playSnap, playSuccess } from '../utils/audio';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  network: NetworkType;
  onConnect: (wallet: WalletState) => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  network,
  onConnect,
}) => {
  const [activeTab, setActiveTab] = useState<'faucet' | 'secret' | 'readonly'>('faucet');
  const [secretInput, setSecretInput] = useState<string>('');
  const [addressInput, setAddressInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle instant testnet account creation & faucet
  const handleGenerateAndFund = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      playClick();
      const res = await fundTestnetWallet(network);
      const walletState: WalletState = {
        address: res.wallet.address,
        balanceXrp: res.balance.toString(),
        sequence: 1,
        walletType: 'secret',
        secret: res.wallet.seed,
      };
      playSuccess();
      onConnect(walletState);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fund wallet via faucet');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle secret key / seed input
  const handleConnectWithSecret = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      playClick();
      const trimmed = secretInput.trim();
      const wallet = xrpl.Wallet.fromSeed(trimmed);
      const info = await fetchAccountInfo(network, wallet.address);

      const walletState: WalletState = {
        address: wallet.address,
        balanceXrp: info.balanceXrp,
        sequence: info.sequence,
        walletType: 'secret',
        secret: trimmed,
      };

      playSuccess();
      onConnect(walletState);
      onClose();
    } catch (err: any) {
      setErrorMsg('Invalid seed or family secret. Expected XRPL format starting with "s...".');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle read-only / simulation address
  const handleConnectReadonly = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      playClick();
      const trimmed = addressInput.trim();
      if (!xrpl.isValidAddress(trimmed)) {
        throw new Error('Invalid XRPL r-address.');
      }
      const info = await fetchAccountInfo(network, trimmed);

      const walletState: WalletState = {
        address: trimmed,
        balanceXrp: info.balanceXrp,
        sequence: info.sequence,
        walletType: 'demo',
      };

      playSuccess();
      onConnect(walletState);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ledger-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-ledger-900 border border-ledger-750 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ledger-800 pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-brass" />
            <h3 className="font-sans font-bold text-base text-white">
              Connect XRPL Wallet
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

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-ledger-950 p-1 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('faucet')}
            className={`py-1.5 rounded transition-all ${
              activeTab === 'faucet' ? 'bg-ledger-800 text-white shadow-xs font-semibold' : 'text-ledger-400 hover:text-ledger-200'
            }`}
          >
            Instant Faucet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('secret')}
            className={`py-1.5 rounded transition-all ${
              activeTab === 'secret' ? 'bg-ledger-800 text-white shadow-xs font-semibold' : 'text-ledger-400 hover:text-ledger-200'
            }`}
          >
            Secret Key
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('readonly')}
            className={`py-1.5 rounded transition-all ${
              activeTab === 'readonly' ? 'bg-ledger-800 text-white shadow-xs font-semibold' : 'text-ledger-400 hover:text-ledger-200'
            }`}
          >
            Read-Only
          </button>
        </div>

        {/* Tab 1: Instant Faucet */}
        {activeTab === 'faucet' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200 leading-relaxed space-y-2">
              <div className="font-semibold text-cyan-glow flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Instant 1-Click Sandbox Testnet</span>
              </div>
              <p>
                Generates a fresh keypair and requests 1,000 free test XRP from the XRPL Altnet faucet. Perfect for testing atomic Batch transactions risk-free.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateAndFund}
              disabled={isLoading || network === 'mainnet'}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-ledger-950 font-bold text-xs shadow-cyan-glow transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Requesting 1,000 Testnet XRP...</span>
                </>
              ) : (
                <>
                  <Droplets className="w-4 h-4" />
                  <span>Generate & Fund Test Account</span>
                </>
              )}
            </button>

            {network === 'mainnet' && (
              <div className="text-[11px] text-amber-400 text-center">
                Switch to Testnet in the top bar to use the free faucet.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Secret Key / Seed */}
        {activeTab === 'secret' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-ledger-950 border border-ledger-800 text-xs text-ledger-300 leading-relaxed">
              Enter your family seed (<code className="text-brass">s...</code>). Keys are kept strictly in browser memory for signing and never transmitted to any third party.
            </div>

            <div>
              <label className="block text-xs font-mono text-ledger-400 mb-1.5">
                Secret Seed (s...)
              </label>
              <input
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                placeholder="sEdVq... or s..."
                className="w-full bg-ledger-950 border border-ledger-800 focus:border-brass text-white font-mono text-xs rounded-lg px-3 py-2.5 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleConnectWithSecret}
              disabled={isLoading || !secretInput.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brass hover:bg-brass-400 text-ledger-950 font-bold text-xs shadow-amber-glow transition-all disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Account...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Connect & Authorize</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab 3: Read-Only Address */}
        {activeTab === 'readonly' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-ledger-950 border border-ledger-800 text-xs text-ledger-300 leading-relaxed">
              Connect any public XRPL address to simulate batches, inspect fees, and test payloads without holding signing keys.
            </div>

            <div>
              <label className="block text-xs font-mono text-ledger-400 mb-1.5">
                Account Address (r...)
              </label>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
                className="w-full bg-ledger-950 border border-ledger-800 focus:border-brass text-white font-mono text-xs rounded-lg px-3 py-2.5 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleConnectReadonly}
              disabled={isLoading || !addressInput.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-ledger-800 hover:bg-ledger-750 text-white font-bold text-xs transition-colors disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fetching Account Data...</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Set Active Simulation Account</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

      </div>
    </div>
  );
};
