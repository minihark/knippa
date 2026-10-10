# Knippa (knippa.apps.harkco.se)
> **Tactile Atomic Batch Dispatcher for the XRP Ledger**  
> Harnessing native `BatchV1_1` (XLS-56) multi-operation bundling with all-or-nothing consensus guarantees.

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![XRPL Amendment](https://img.shields.io/badge/XRPL-XLS--56%20BatchV1__1-008CE7.svg)](https://github.com/XRPLF/XRPL-Standards/discussions/156)
[![Status](https://img.shields.io/badge/Status-Live%20on%20Mainnet-10b981.svg)](https://knippa.apps.harkco.se)

---

## Overview

**Knippa** (Swedish for *"bundle"* or *"sheaf"*) is a tactile, privacy-first web studio for crafting, simulating, and dispatching atomic transaction bundles on the XRP Ledger.

Following the mainnet activation of the **`BatchV1_1`** amendment on October 9, 2026, XRPL accounts can atomically bundle up to 8 inner transactions (`Payment`, `TrustSet`, `OfferCreate`, etc.) into a single consensus envelope with zero inner fees and cryptographic all-or-nothing rollback guarantees.

### Key Capabilities
- **Native XLS-56 Enveloping**: Full compliance with outer `Batch` transaction types and flags:
  - `0x00010000` (`ALLORNOTHING`): Atomic execution — if any single inner operation fails, the entire batch reverts.
  - `0x00020000` (`ONLYONE`): Contingent orders — only the first viable transaction commits; all subsequent ops cancel.
  - `0x00040000` (`UNTILFAILURE`): Waterfall execution — stops at first failure without rolling back completed steps.
  - `0x00080000` (`INDEPENDENT`): Parallel operations — executed independently within ledger sequence bounds.
- **Inner Transaction Formatting**: Automatically injects `tfInnerBatchTxn` (`0x40000000`), sets `Fee: "0"`, blanks `SigningPubKey`, strips `TxnSignature`, and wraps entries in `RawTransaction`.
- **Zero Inner Fees**: Pay only ~25-50 drops once for the entire batch envelope instead of paying cumulative fees across multiple transactions.
- **Client-Side Cryptography**: Zero telemetry, zero private key transmission. All signing occurs locally in your browser using `xrpl.js`.
- **Tactile Sound & Feel**: Dynamic mechanical feedback with Web Audio synthesizers (haptic clicks, snaps, and execution chimes).
- **Pre-Built Bundles**:
  - 4-way Contributor Split (Payroll / RevShare)
  - RLUSD Atomic Zap (`TrustSet` + `Payment`)
  - 8-Slot Max Bounty Distribution
  - Contingent DEX Arb (`ONLYONE` contingent order)
- **CSV Batch Import & Raw JSON Inspector**: Import recipient addresses & amounts directly from spreadsheets or export raw XLS-56 JSON payloads.

---

## Tech Stack
- **Framework**: React 19 + TypeScript + Vite 5 + Tailwind CSS
- **XRPL Client**: `xrpl@5.3.0` (with `vite-plugin-node-polyfills` for client-side elliptic curve math)
- **Audio**: Web Audio API tactile synthesizers
- **Server**: Express 5 SPA runner on Node 22
- **Deployment**: Coolify on OrbStack (`knippa.apps.harkco.se`)

---

## Local Development

```bash
# Install dependencies
npm install

# Run Vite development server
npm run dev

# Build production bundle
npm run build

# Run production Express server
npm start
```

---

## Built by Harkco
Crafted with pride by **Harkco** (`apps.harkco.se`).
Monetized cleanly via direct value exchange (zero ads, optional Pro unlock).
