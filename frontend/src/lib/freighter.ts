// src/lib/freighter.ts
// Freighter wallet connect, sign, and address helpers

import {
  isConnected,
  requestAccess,
  getAddress,
  signTransaction,
  getNetwork
} from "@stellar/freighter-api";

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: string | null;
}

/** Check if Freighter is installed */
export async function checkFreighter(): Promise<boolean> {
  const result = await isConnected();
  return result.isConnected;
}

/** Connect wallet and return address */
export async function connectWallet(): Promise<string> {
  const access = await requestAccess();
  if (access.error) throw new Error(access.error);

  const addr = await getAddress();
  if (addr.error) throw new Error(addr.error);

  return addr.address;
}

/** Get current connected address (without prompting) */
export async function getWalletAddress(): Promise<string | null> {
  try {
    const addr = await getAddress();
    return addr.error ? null : addr.address;
  } catch {
    return null;
  }
}

/** Get current network details */
export async function getWalletNetwork(): Promise<string | null> {
  try {
    const res = await getNetwork();
    return res?.networkPassphrase ?? null;
  } catch {
    return null;
  }
}
/** Sign a Stellar transaction XDR */
export async function signTx(
  xdr: string,
  networkPassphrase: string
): Promise<string> {
  const result = await signTransaction(xdr, { networkPassphrase });
  if (result.error) throw new Error(result.error);
  return result.signedTxXdr;
}
