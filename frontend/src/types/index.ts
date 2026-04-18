// src/types/index.ts

export interface DonationRecord {
  donor: string;
  amount: number;   // in USDC (human-readable)
  timestamp: number;
}

export interface WithdrawalRecord {
  coordinator: string;
  amount: number;   // in USDC (human-readable)
  purpose: string;
  timestamp: number;
}

export interface FundStats {
  totalDonated: number;
  totalWithdrawn: number;
  balance: number;
  isEmergency: boolean;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: string | null;
}
