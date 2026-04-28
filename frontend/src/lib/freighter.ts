// src/lib/freighter.ts
// Freighter wallet connect, sign, and address helpers
// Enforces Testnet-only usage

import {
  isConnected,
  requestAccess,
  getAddress,
  signTransaction,
  getNetwork,
  getNetworkDetails,
} from "@stellar/freighter-api";
import * as StellarSDK from "@stellar/stellar-sdk";
import { Networks } from "@stellar/stellar-sdk";

// Testnet constants
export const TESTNET_NETWORK_PASSPHRASE = Networks.TESTNET;
export const TESTNET_HORIZON_URL = "https://horizon-testnet.stellar.org";
export const TESTNET_RPC_URL = "https://soroban-testnet.stellar.org";

// Mainnet constant for comparison
export const MAINNET_NETWORK_PASSPHRASE = Networks.PUBLIC;

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: string | null;
}

/**
 * Error thrown when Freighter is not using Testnet
 */
export class WrongNetworkError extends Error {
  constructor(currentNetwork: string) {
    super(
      `Wrong network detected. Please switch Freighter to Testnet.\n` +
      `Current network: ${currentNetwork || 'Unknown'}\n` +
      `Expected: ${TESTNET_NETWORK_PASSPHRASE}`
    );
    this.name = "WrongNetworkError";
  }
}

/**
 * Error thrown when account is not funded
 */
export class AccountNotFundedError extends Error {
  constructor(address: string) {
    super(
      `Account ${address.slice(0, 8)}... is not funded.\n` +
      `Please fund your Testnet account using the Friendbot:\n` +
      `https://friendbot.stellar.org?addr=${address}`
    );
    this.name = "AccountNotFundedError";
  }
}

// ─── Network Validation ───────────────────────────────────────────────────────

/**
 * Check if Freighter is installed and accessible
 */
export async function checkFreighter(): Promise<boolean> {
  try {
    const result = await isConnected();
    return result?.isConnected || false;
  } catch (err) {
    console.error("Freighter check failed:", err);
    return false;
  }
}

/**
 * Ensure Freighter is connected to Testnet
 * @throws WrongNetworkError if on Mainnet or wrong network
 */
export async function ensureTestnet(): Promise<any> {
  const network = await getNetwork();
  
  if (!network) {
    throw new Error("Could not retrieve Freighter network details. Is Freighter installed?");
  }

  // Check network passphrase
  if (network.networkPassphrase !== TESTNET_NETWORK_PASSPHRASE) {
    throw new WrongNetworkError(network.networkPassphrase || "Not specified");
  }

  return getNetworkDetails();
}

// ─── Wallet Connection & Address Retrieval ───────────────────────────────────

/**
 * Connect wallet and return address (enforces Testnet)
 * @throws WrongNetworkError if not on Testnet
 */
export async function connectWallet(): Promise<string> {
  // Verify Testnet before connecting
  await ensureTestnet();

  const access = await requestAccess();
  if (access.error) {
    throw new Error(`Connection failed: ${access.error}`);
  }

  const addr = await getAddress();
  if (addr.error) {
    throw new Error(`Address retrieval failed: ${addr.error}`);
  }
  if (!addr.address) {
    throw new Error("No address returned from Freighter");
  }

  return addr.address;
}

/**
 * Get current connected address (without prompting)
 * Returns null if not connected
 */
export async function getWalletAddress(): Promise<string | null> {
  try {
    const addr = await getAddress();
    return addr.error ? null : addr.address;
  } catch (err) {
    console.error("Failed to get wallet address:", err);
    return null;
  }
}

/**
 * Get current network details
 */
export async function getWalletNetwork(): Promise<string | null> {
  try {
    const res = await getNetwork();
    return res?.networkPassphrase ?? null;
  } catch (err) {
    console.error("Failed to get wallet network:", err);
    return null;
  }
}

// ─── Account & Balance Operations ────────────────────────────────────────────

/**
 * Create a Horizon server instance for Testnet
 */
function getHorizonServer() {
  // @ts-ignore
  return new StellarSDK.Server(TESTNET_HORIZON_URL);
}

/**
 * Check if an account exists and is funded on Testnet
 * @param address Stellar address to check
 * @returns true if account exists and has a balance
 */
export async function isAccountFunded(address: string): Promise<boolean> {
  try {
    const server = getHorizonServer();
    const account = await server.loadAccount(address);
    return account.balances && account.balances.length > 0;
  } catch (err: any) {
    // Horizon returns 404 for unfunded accounts
    if (err?.response?.status === 404) {
      return false;
    }
    // Network errors or other issues
    console.error("Failed to check account funding:", err);
    throw err;
  }
}

/**
 * Get the native XLM balance for an account on Testnet
 * @param address Stellar address
 * @returns XLM balance as string, or null if unfunded
 */
export async function getNativeBalance(address: string): Promise<string | null> {
  try {
    const server = getHorizonServer();
    const account = await server.loadAccount(address);
    const xlmBalance = account.balances.find((b: any) => b.asset_type === "native");
    return xlmBalance ? xlmBalance.balance : null;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return null; // Account not funded
    }
    console.error("Failed to get native balance:", err);
    throw err;
  }
}

/**
 * Get all token balances for an account on Testnet
 * @param address Stellar address
 * @returns Array of balances with asset type and amount
 */
export async function getAllBalances(address: string): Promise<any[]> {
  try {
    const server = getHorizonServer();
    const account = await server.loadAccount(address);
    return account.balances;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return []; // Account not funded
    }
    console.error("Failed to get all balances:", err);
    throw err;
  }
}

/**
 * Generate Friendbot funding URL for Testnet
 * @param address Stellar address to fund
 */
export function getFriendbotUrl(address: string, amount?: string): string {
  const base = "https://friendbot.stellar.org";
  const params = new URLSearchParams({ addr: address });
  if (amount) params.append("amount", amount);
  return `${base}?${params.toString()}`;
}

/**
 * Comprehensive account check - verifies network, connection, and funding
 * This is the recommended function to call before any transaction
 * 
 * @throws WrongNetworkError - if wallet is on wrong network
 * @throws AccountNotFundedError - if account has no balance
 * @throws Error - for other connection issues
 */
export async function verifyAccountReady(address: string): Promise<any> {
  // 1. Verify Testnet
  const network = await ensureTestnet();

  // 2. Verify address
  if (!address) {
    throw new Error("No wallet address provided");
  }

  // 3. Check account funding
  const balances = await getAllBalances(address);
  const hasXlm = balances.some((b: any) => b.asset_type === "native" && parseFloat(b.balance) > 0);

  if (!hasXlm) {
    throw new AccountNotFundedError(address);
  }

  return {
    address,
    network,
    balances,
    hasXlm,
  };
}

// ─── Transaction Signing ────────────────────────────────────────────────────

/**
 * Sign a Stellar transaction XDR using Freighter
 * @param xdr Transaction XDR string to sign
 * @param networkPassphrase Network passphrase (must match Testnet)
 * @throws WrongNetworkError if wallet is on wrong network
 */
export async function signTx(
  xdr: string,
  networkPassphrase: string
): Promise<string> {
  // Verify network before signing
  if (networkPassphrase !== TESTNET_NETWORK_PASSPHRASE) {
    throw new WrongNetworkError(networkPassphrase);
  }

  const result = await signTransaction(xdr, { networkPassphrase });
  
  if (result.error) {
    // Check if it's a network mismatch error from Freighter
    if (result.error.includes("network") || result.error.includes("testnet")) {
      throw new WrongNetworkError("Wallet reported network mismatch");
    }
    throw new Error(`Signing failed: ${result.error}`);
  }
  
  if (!result.signedTxXdr) {
    throw new Error("No signed transaction returned");
  }
  
  return result.signedTxXdr;
}