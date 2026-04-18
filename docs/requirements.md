# TulongChain — Requirements

## Problem Statement

Natural disasters strike the Philippines regularly — typhoons, floods, earthquakes. 
Relief fundraising is fragmented across GCash, bank transfers, and social media.
Donors have no way to verify that funds reached beneficiaries.
Relief coordinators face slow settlement times and high remittance fees.

## Solution

TulongChain is a transparent, on-chain community disaster relief fund built on Stellar.
- Donors send USDC directly into a Soroban smart contract escrow
- Funds are locked until a declared emergency activates withdrawals
- Every donation and withdrawal is visible on Stellar Expert
- No banks. No middlemen. Settlement in <5 seconds.

## Target Users

- Filipino donors (OFWs, local residents) who want to contribute to disaster relief
- NGO / barangay coordinators who manage relief distribution
- SMEs and community orgs who want donation transparency

## Functional Requirements

| # | Requirement |
|---|---|
| 1 | Users can connect Freighter wallet (Testnet) |
| 2 | Users can donate any USDC amount to the contract |
| 3 | Admin can declare a disaster emergency |
| 4 | Admin can withdraw USDC during an active emergency |
| 5 | Admin can lift the emergency status |
| 6 | Anyone can view total donated, withdrawn, and balance |
| 7 | Activity feed shows all on-chain events in real time |

## Non-Functional Requirements

- All transactions settle on Stellar Testnet
- Contract passes 5+ unit tests via `cargo test`
- Frontend runs on `localhost:5173` via Vite
- No traditional backend — state lives on-chain + Convex
