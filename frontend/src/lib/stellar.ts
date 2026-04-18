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

const server = new SorobanRpc.Server(CONFIG.rpcUrl);

/** Build, simulate, sign, and submit a contract call */
async function invokeContract(
  callerAddress: string,
  method: string,
  args: xdr.ScVal[]
): Promise<unknown> {
  const account = await server.getAccount(callerAddress);
  const contract = new Contract(CONFIG.contractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: CONFIG.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  // Simulate to get footprint
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

  // Poll for completion
  let getResult = await server.getTransaction(submitResult.hash);
  while (getResult.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
    await new Promise((r) => setTimeout(r, 1000));
    getResult = await server.getTransaction(submitResult.hash);
  }

  if (getResult.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
    return getResult.returnValue ? scValToNative(getResult.returnValue) : null;
  }

  throw new Error("Transaction failed");
}

/** Read-only call (no signing needed) */
async function readContract(method: string, args: xdr.ScVal[] = []): Promise<unknown> {
  const contract = new Contract(CONFIG.contractId);
  // Use a dummy source for simulation reads
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

  return simResult.result?.retval ? scValToNative(simResult.result.retval) : null;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function donate(
  callerAddress: string,
  amountUsdc: number
): Promise<void> {
  await invokeContract(callerAddress, "donate", [
    new Address(callerAddress).toScVal(),
    new Address(CONFIG.usdcContractId).toScVal(),
    nativeToScVal(toUSDC(amountUsdc), { type: "i128" }),
  ]);
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

export async function getTotalDonated(): Promise<number> {
  const val = await readContract("get_total_donated");
  return val ? Number(val) / 1e7 : 0;
}

export async function getTotalWithdrawn(): Promise<number> {
  const val = await readContract("get_total_withdrawn");
  return val ? Number(val) / 1e7 : 0;
}

export async function getBalance(): Promise<number> {
  const val = await readContract("get_balance");
  return val ? Number(val) / 1e7 : 0;
}

export async function isEmergency(): Promise<boolean> {
  const val = await readContract("is_emergency");
  return Boolean(val);
}
