import { InnerTransaction, BatchMode } from '../types';

export interface BatchPreset {
  id: string;
  name: string;
  description: string;
  mode: BatchMode;
  badge: string;
  items: InnerTransaction[];
}

export const PRESETS: BatchPreset[] = [
  {
    id: 'team-split-4',
    name: '4-Way Contributor Split',
    description: 'Split revenue atomically among 4 team members. Reverts completely if any destination is invalid.',
    mode: 'ALLORNOTHING',
    badge: 'Payroll',
    items: [
      {
        id: 'slot-1',
        type: 'Payment',
        destination: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
        amount: '120',
        currency: 'XRP',
        memo: 'Knippa Dev Payout',
      },
      {
        id: 'slot-2',
        type: 'Payment',
        destination: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYrC',
        amount: '85',
        currency: 'XRP',
        memo: 'Design & Craft',
      },
      {
        id: 'slot-3',
        type: 'Payment',
        destination: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8TD4dcCc',
        amount: '50',
        currency: 'XRP',
        memo: 'Infrastructure & Ops',
      },
      {
        id: 'slot-4',
        type: 'Payment',
        destination: 'rEb8TK3gBgk5auZyyY67a4StAZ6amWA42S',
        amount: '45',
        currency: 'XRP',
        memo: 'Community Treasury',
      },
    ],
  },
  {
    id: 'rlusd-zap',
    name: 'RLUSD Atomic Zap & Onboard',
    description: 'Establish RLUSD trustline and fund your position in a single atomic transaction. No stranded trustlines.',
    mode: 'ALLORNOTHING',
    badge: 'DeFi Zap',
    items: [
      {
        id: 'slot-zap-1',
        type: 'TrustSet',
        destination: '',
        amount: '1000000',
        currency: 'RLUSD',
        issuer: 'rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV',
        trustLimit: '10000000',
      },
      {
        id: 'slot-zap-2',
        type: 'Payment',
        destination: 'rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV',
        amount: '25',
        currency: 'XRP',
        memo: 'Atomic RLUSD Swap Request',
      },
    ],
  },
  {
    id: 'max-airdrop-8',
    name: '8-Slot Max Bounty Dispatch',
    description: 'Full 8-slot maximal capacity batch disbursement. Tests maximum throughput per consensus block.',
    mode: 'ALLORNOTHING',
    badge: 'Max Batch',
    items: [
      { id: 'b-1', type: 'Payment', destination: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH', amount: '15', currency: 'XRP', memo: 'Bounty 1' },
      { id: 'b-2', type: 'Payment', destination: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYrC', amount: '15', currency: 'XRP', memo: 'Bounty 2' },
      { id: 'b-3', type: 'Payment', destination: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8TD4dcCc', amount: '15', currency: 'XRP', memo: 'Bounty 3' },
      { id: 'b-4', type: 'Payment', destination: 'rEb8TK3gBgk5auZyyY67a4StAZ6amWA42S', amount: '15', currency: 'XRP', memo: 'Bounty 4' },
      { id: 'b-5', type: 'Payment', destination: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh', amount: '15', currency: 'XRP', memo: 'Bounty 5' },
      { id: 'b-6', type: 'Payment', destination: 'r3kmLJN5D28dHuH8vZNUZpBh7Cbvv4gjAk', amount: '15', currency: 'XRP', memo: 'Bounty 6' },
      { id: 'b-7', type: 'Payment', destination: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe', amount: '15', currency: 'XRP', memo: 'Bounty 7' },
      { id: 'b-8', type: 'Payment', destination: 'r4bYQXue3nmF4PrAnA7w9GQ4S2eL8L6n3Z', amount: '15', currency: 'XRP', memo: 'Bounty 8' },
    ],
  },
  {
    id: 'contingency-hedge',
    name: 'Dual DEX Contingency (ONLYONE)',
    description: 'Submit two competing offer creations. Only the first eligible order executes; the other is skipped.',
    mode: 'ONLYONE',
    badge: 'Smart Order',
    items: [
      {
        id: 'hedge-1',
        type: 'OfferCreate',
        destination: '',
        amount: '',
        currency: '',
        takerGetsValue: '100',
        takerGetsCurrency: 'XRP',
        takerPaysValue: '55',
        takerPaysCurrency: 'USD',
      },
      {
        id: 'hedge-2',
        type: 'OfferCreate',
        destination: '',
        amount: '',
        currency: '',
        takerGetsValue: '100',
        takerGetsCurrency: 'XRP',
        takerPaysValue: '52',
        takerPaysCurrency: 'EUR',
      },
    ],
  },
];
