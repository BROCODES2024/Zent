"use client";

import { useState, useEffect } from "react";
import {
  WalletData,
  getEthBalance,
  getSolBalance,
  Network,
} from "@/lib/wallet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ChevronDown,
  RefreshCw,
  Globe,
} from "lucide-react";

interface WalletDisplayProps {
  wallet: WalletData;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

export default function WalletDisplay({
  wallet,
  onDelete,
  canDelete,
}: WalletDisplayProps) {
  const [showEthKey, setShowEthKey] = useState(false);
  const [showSolKey, setShowSolKey] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Balance State
  const [network, setNetwork] = useState<Network>("mainnet");
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState({ eth: "0.0000", sol: "0.0000" });

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const [ethBal, solBal] = await Promise.all([
        getEthBalance(wallet.ethereum.address, network),
        getSolBalance(wallet.solana.address, network),
      ]);
      setBalances({ eth: ethBal, sol: solBal });
    } catch (error) {
      console.error("Failed to fetch balances", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch balances when expanded or network changes
  useEffect(() => {
    if (isExpanded) {
      fetchBalances();
    }
  }, [isExpanded, network]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const toggleNetwork = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNetwork((prev) => (prev === "mainnet" ? "devnet" : "mainnet"));
  };

  return (
    <Card className="group overflow-hidden bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg">
      {/* Wallet Header */}
      <div
        className="p-6 cursor-pointer hover:bg-white/5 transition-colors relative"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Subtle accent line on the left */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Decorative Index Circle */}
            <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center font-mono text-slate-400 group-hover:text-purple-400 group-hover:border-purple-500/50 transition-colors">
              {wallet.accountIndex + 1}
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-purple-100 transition-colors">
                Wallet {wallet.accountIndex + 1}
              </h3>
              <p className="text-xs font-mono text-slate-500 mt-0.5 uppercase tracking-wider">
                Multi-Chain • Index {wallet.accountIndex}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(wallet.id);
                }}
                className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <div
              className={`transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Details */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-white/5 pt-6 bg-black/20">
          {/* Controls Bar (Network & Refresh) */}
          <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleNetwork}
                className={`h-8 text-xs font-bold uppercase tracking-wider border transition-all ${
                  network === "mainnet"
                    ? "border-green-500/30 text-green-400 bg-green-500/10"
                    : "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                }`}
              >
                <Globe className="w-3 h-3 mr-2" />
                {network}
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={fetchBalances}
              disabled={loading}
              className="h-8 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <RefreshCw
                className={`w-3 h-3 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Fetching..." : "Refresh Balances"}
            </Button>
          </div>

          {/* Ethereum Section */}
          <div className="relative group/eth">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  <span className="text-blue-400 text-xs font-bold">ETH</span>
                </div>
                <label className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Ethereum
                </label>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-white font-bold">
                  {balances.eth} ETH
                </div>
                <div className="text-[10px] text-slate-500 uppercase">
                  Balance
                </div>
              </div>
            </div>

            <div className="space-y-4 pl-2 border-l-2 border-blue-500/20 ml-4">
              {/* Address */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5 block font-semibold">
                  Public Address
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/50 border border-white/10 hover:border-blue-500/30 transition-colors rounded-xl px-4 py-3 text-sm text-slate-300 font-mono break-all shadow-inner">
                    {wallet.ethereum.address}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(
                        wallet.ethereum.address,
                        "Ethereum address"
                      )
                    }
                    className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Private Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    Private Key
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEthKey(!showEthKey)}
                    className="h-6 px-2 text-xs text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
                  >
                    {showEthKey ? (
                      <span className="flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Hide
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Reveal
                      </span>
                    )}
                  </Button>
                </div>
                {showEthKey ? (
                  <div className="flex gap-2 animate-in fade-in duration-300">
                    <div className="flex-1 bg-blue-950/20 border border-blue-500/20 rounded-xl px-4 py-3 text-sm text-blue-200 font-mono break-all shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                      {wallet.ethereum.privateKey}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(
                          wallet.ethereum.privateKey,
                          "Ethereum private key"
                        )
                      }
                      className="text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-600 font-mono text-center tracking-[0.2em] cursor-pointer hover:text-slate-400 hover:bg-white/5 transition-all"
                    onClick={() => setShowEthKey(true)}
                  >
                    ••••••••••••••••••••••••••••
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Solana Section */}
          <div className="relative group/sol">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  <span className="text-purple-400 text-xs font-bold">SOL</span>
                </div>
                <label className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Solana
                </label>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-white font-bold">
                  {balances.sol} SOL
                </div>
                <div className="text-[10px] text-slate-500 uppercase">
                  Balance
                </div>
              </div>
            </div>

            <div className="space-y-4 pl-2 border-l-2 border-purple-500/20 ml-4">
              {/* Address */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5 block font-semibold">
                  Public Address
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/50 border border-white/10 hover:border-purple-500/30 transition-colors rounded-xl px-4 py-3 text-sm text-slate-300 font-mono break-all shadow-inner">
                    {wallet.solana.address}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(wallet.solana.address, "Solana address")
                    }
                    className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Private Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    Private Key
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSolKey(!showSolKey)}
                    className="h-6 px-2 text-xs text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg"
                  >
                    {showSolKey ? (
                      <span className="flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Hide
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Reveal
                      </span>
                    )}
                  </Button>
                </div>
                {showSolKey ? (
                  <div className="flex gap-2 animate-in fade-in duration-300">
                    <div className="flex-1 bg-purple-950/20 border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-purple-200 font-mono break-all shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                      {wallet.solana.privateKey}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(
                          wallet.solana.privateKey,
                          "Solana private key"
                        )
                      }
                      className="text-purple-400 hover:text-white hover:bg-purple-500/20 rounded-xl"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-600 font-mono text-center tracking-[0.2em] cursor-pointer hover:text-slate-400 hover:bg-white/5 transition-all"
                    onClick={() => setShowSolKey(true)}
                  >
                    ••••••••••••••••••••••••••••
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
