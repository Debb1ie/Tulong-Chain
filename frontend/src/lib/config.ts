// src/lib/config.ts
// Central config — all values come from .env

export const CONFIG = {
  contractId: import.meta.env.VITE_CONTRACT_ID as string,
  usdcContractId: import.meta.env.VITE_USDC_CONTRACT_ID as string,
  network: import.meta.env.VITE_NETWORK as string,
  networkPassphrase: import.meta.env.VITE_NETWORK_PASSPHRASE as string,
  rpcUrl: import.meta.env.VITE_STELLAR_RPC_URL as string,
  horizonUrl: import.meta.env.VITE_HORIZON_URL as string,
};

// USDC has 7 decimal places on Stellar
export const USDC_DECIMALS = 7;

export const toUSDC = (amount: number): bigint =>
  BigInt(Math.round(amount * 10 ** USDC_DECIMALS));

export const fromUSDC = (amount: bigint): number =>
  Number(amount) / 10 ** USDC_DECIMALS;
