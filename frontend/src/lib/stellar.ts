// src/lib/stellar.ts
// All Soroban contract interactions for TulongChain

import {
  Contract,
  Networks,
  SorobanRpc,
  TransactionBuilder,
  nativeToScVal,
  scValToNative,
  Address,
  BASE_FEE,
  xdr,
} from "@stellar/stellar-sdk";
import { CONFIG, toUSDC } from "./config";
import { signTx } from "./freighter";
import { TESTNET_HORIZON_URL } from "./freighter";

const server = new SorobanRpc.Server(CONFIG.rpcUrl);

// Cache for read-only queries (5 second TTL)
const cache = new Map<string, { value: unknown; expiry: number }>();
const CACHE_TTL = 5000; // 5 seconds

function getCacheKey(method: string, args: xdr.ScVal[]): string {
  return `${method}:${args.map(a => a.toXDR()).join(",")}`;
}

/** Read-only call (no signing needed) with caching */
async function readContract(method: string, args: xdr.ScVal[] = [], useCache = true): Promise<unknown> {
  const cacheKey = getCacheKey(method, args);
  
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return cached.value;
    }
  }

  const contract = new Contract(CONFIG.contractId);
  const dummyAccount = await server.getAccount(
    "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN"
  ).catch(() => null);

  if (!dummyAccount) return null;

  const tx = new TransactionBuilder(dummyAccount, {
    fee: BASE_FEE,
    networkPassphrase: CONFIG.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(simResult)) {
    throw new Error(`Read failed: ${simResult.error}`);
  }

  const result = simResult.result?.retval ? scValToNative(simResult.result.retval) : null;
  
  cache.set(cacheKey, {
    value: result,
    expiry: Date.now() + CACHE_TTL
  });

  return result;
}

/** Build, simulate, sign, and submit a contract call */
async function invokeContract(
  callerAddress: string,
  method: string,
  args: xdr.ScVal[]
): Promise<{ result: unknown; txHash: string }> {
  const account = await server.getAccount(callerAddress);
  const contract = new Contract(CONFIG.contractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: CONFIG.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation failed: ${simResult.error}`);
  }

  const preparedTx = SorobanRpc.assembleTransaction(tx, simResult).build();
  const signedXdr = await signTx(preparedTx.toXDR(), CONFIG.networkPassphrase);

  const submitResult = await server.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, CONFIG.networkPassphrase)
  );

  if (submitResult.status === "ERROR") {
    throw new Error(`Submit failed: ${JSON.stringify(submitResult.errorResult)}`);
  }

  cache.clear();

  let getResult = await server.getTransaction(submitResult.hash);
  while (getResult.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
    await new Promise((r) => setTimeout(r, 1000));
    getResult = await server.getTransaction(submitResult.hash);
  }

  if (getResult.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
    return {
      result: getResult.returnValue ? scValToNative(getResult.returnValue) : null,
      txHash: submitResult.hash,
    };
  }

  throw new Error("Transaction failed");
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Donate USDC to the escrow contract */
export async function donate(
  callerAddress: string,
  amountUsdc: number
): Promise<string> {
  const { txHash } = await invokeContract(callerAddress, "donate", [
    new Address(callerAddress).toScVal(),
    new Address(CONFIG.usdcContractId).toScVal(),
    nativeToScVal(toUSDC(amountUsdc), { type: "i128" }),
  ]);
  return txHash;
}

/** Donate native XLM to the escrow contract */
export async function donateXlm(
  callerAddress: string,
  amountXlm: number
): Promise<string> {
  // XLM has 7 decimal places (1 XLM = 10,000,000 "stroops")
  const baseAmount = BigInt(Math.round(amountXlm * 10 ** 7));
  const { txHash } = await invokeContract(callerAddress, "donate_xlm", [
    new Address(callerAddress).toScVal(),
    nativeToScVal(baseAmount, { type: "i128" }),
  ]);
  return txHash;
}

export async function declareEmergency(callerAddress: string): Promise<void> {
  await invokeContract(callerAddress, "declare_emergency", []);
}

export async function liftEmergency(callerAddress: string): Promise<void> {
  await invokeContract(callerAddress, "lift_emergency", []);
}

export async function withdraw(
  callerAddress: string,
  amountUsdc: number,
  purpose: string
): Promise<void> {
  await invokeContract(callerAddress, "withdraw", [
    new Address(callerAddress).toScVal(),
    new Address(CONFIG.usdcContractId).toScVal(),
    nativeToScVal(toUSDC(amountUsdc), { type: "i128" }),
    nativeToScVal(purpose, { type: "string" }),
  ]);
}

export async function getTotalDonated(useCache = true): Promise<number> {
  const val = await readContract("get_total_donated", [], useCache);
  return val ? Number(val) / 1e7 : 0;
}

export async function getTotalWithdrawn(useCache = true): Promise<number> {
  const val = await readContract("get_total_withdrawn", [], useCache);
  return val ? Number(val) / 1e7 : 0;
}

export async function getBalance(useCache = true): Promise<number> {
  const val = await readContract("get_balance", [], useCache);
  return val ? Number(val) / 1e7 : 0;
}

export async function isEmergency(useCache = true): Promise<boolean> {
  const val = await readContract("is_emergency", [], useCache);
  return Boolean(val);
}

// ── Advanced Features ─────────────────────────────────────────────────────────

export async function isPaused(useCache = true): Promise<boolean> {
  const val = await readContract("is_paused", [], useCache);
  return Boolean(val);
}

export async function getTimelockDuration(useCache = true): Promise<number> {
  const val = await readContract("get_timelock_duration", [], useCache);
  return val ? Number(val) : 0;
}

export async function getTimelockInfo(useCache = true): Promise<{declared_at: number, activates_at: number}> {
  const val = await readContract("get_emergency_timelock", [], useCache) as {declared_at: number, activates_at: number} | null;
  return val || {declared_at: 0, activates_at: 0};
}

/** Get donation history from Horizon (payments to contract) */
export async function getDonationsFromHorizon(donorAddress?: string): Promise<Array<{
  amount: string;
  asset_code: string;
  asset_type: string;
  transaction_hash: string;
  created_at: string;
  from: string;
}>> {
  const url = donorAddress
    ? `https://horizon-testnet.stellar.org/accounts/${CONFIG.contractId}/payments?order=desc&limit=50`
    : `https://horizon-testnet.stellar.org/accounts/${CONFIG.contractId}/payments?order=desc&limit=50`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Horizon error ${res.status}`);
  const data = await res.json();

  let payments = (data._embedded?.records || []).filter((p: any) => p.type === "payment" && p.to === CONFIG.contractId);

  if (donorAddress) {
    payments = payments.filter((p: any) => p.from.toLowerCase() === donorAddress.toLowerCase());
  }

  return payments;
}

export async function pause(callerAddress: string): Promise<string> {
  const { txHash } = await invokeContract(callerAddress, "pause", []);
  return txHash;
}

export async function unpause(callerAddress: string): Promise<string> {
  const { txHash } = await invokeContract(callerAddress, "unpause", []);
  return txHash;
}

export async function setTimelock(callerAddress: string, seconds: number): Promise<string> {
  const { txHash } = await invokeContract(callerAddress, "set_timelock", [
    nativeToScVal(seconds, { type: "u64" })
  ]);
  return txHash;
}

// Batch operations (future)
export async function batchDonate(
  callerAddress: string,
  batches: Array<{token: string, amount: number, asset: string}>
): Promise<string> {
  throw new Error("Batch donate UI not yet implemented");
}

export async function batchWithdraw(
  callerAddress: string,
  token: string,
  batches: Array<{purpose: string, amount: number}>
): Promise<string> {
  throw new Error("Batch withdraw UI not yet implemented");
}
