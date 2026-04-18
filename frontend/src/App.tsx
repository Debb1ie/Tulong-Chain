// src/App.tsx
import { useState, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import HomePage from "./views/HomePage";
import DashboardPage from "./views/DashboardPage";
import { checkFreighter, connectWallet, getWalletAddress } from "./lib/freighter";
import type { WalletState } from "./types";
import "./styles/global.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export default function App() {
  const [page, setPage] = useState<"home" | "dashboard">("home");
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: null,
  });
  const [freighterInstalled, setFreighterInstalled] = useState(false);

  useEffect(() => {
    checkFreighter().then(setFreighterInstalled);
    getWalletAddress().then((addr) => {
      if (addr) setWallet({ connected: true, address: addr, network: "testnet" });
    });
  }, []);

  async function handleConnect() {
    try {
      const address = await connectWallet();
      setWallet({ connected: true, address, network: "testnet" });
    } catch (err) {
      alert("Could not connect Freighter: " + (err as Error).message);
    }
  }

  return (
    <ConvexProvider client={convex}>
      {page === "home" ? (
        <HomePage
          wallet={wallet}
          freighterInstalled={freighterInstalled}
          onConnect={handleConnect}
          onEnter={() => setPage("dashboard")}
        />
      ) : (
        <DashboardPage
          wallet={wallet}
          onBack={() => setPage("home")}
        />
      )}
    </ConvexProvider>
  );
}
