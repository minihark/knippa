export type BatchMode = 'ALLORNOTHING' | 'ONLYONE' | 'UNTILFAILURE' | 'INDEPENDENT';

export const BATCH_FLAGS: Record<BatchMode, number> = {
  ALLORNOTHING: 0x00010000, // 65536
  ONLYONE: 0x00020000,      // 131072
  UNTILFAILURE: 0x00040000, // 262144
  INDEPENDENT: 0x00080000,  // 524288
};

export const TF_INNER_BATCH_TXN = 0x40000000; // 1073741824

export type InnerTxType = 'Payment' | 'TrustSet' | 'OfferCreate';

export interface InnerTransaction {
  id: string;
  type: InnerTxType;
  // Payment fields
  destination: string;
  destinationTag?: number;
  amount: string; // e.g. "10.5"
  currency: string; // "XRP", "RLUSD", "USD"
  issuer?: string; // issuer for IOUs
  memo?: string;

  // TrustSet fields
  trustLimit?: string;
  
  // OfferCreate fields
  takerGetsValue?: string;
  takerGetsCurrency?: string;
  takerGetsIssuer?: string;
  takerPaysValue?: string;
  takerPaysCurrency?: string;
  takerPaysIssuer?: string;
}

export type NetworkType = 'mainnet' | 'testnet' | 'devnet';

export interface NetworkConfig {
  id: NetworkType;
  name: string;
  wsUrl: string;
  explorerUrl: string;
  faucetSupported: boolean;
}

export interface WalletState {
  address: string;
  balanceXrp: string;
  sequence: number;
  walletType: 'secret' | 'xaman' | 'crossmark' | 'demo';
  secret?: string; // only stored locally in memory if entered by user
}

export interface SimulationResult {
  valid: boolean;
  engineResult: string;
  engineResultMessage: string;
  estimatedFeeDrops: string;
  totalXrpRequired: string;
  rawPayload: any;
}

export interface ExecutionResult {
  success: boolean;
  hash: string;
  ledgerIndex?: number;
  engineResult: string;
  engineResultMessage?: string;
  executionMode: BatchMode;
  itemCount: number;
  totalAmountXrp: string;
  timestamp: string;
  explorerUrl: string;
}
