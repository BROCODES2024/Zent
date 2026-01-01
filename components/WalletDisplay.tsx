"use client";

import { useState } from "react";
import { WalletData, getSolBalance } from "@/lib/wallet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ChevronDown,
  RefreshCw,
  Zap,
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

  // SOL ONLY state
  const [solLoading, setSolLoading] = useState(false);
  const [solBalance, setSolBalance] = useState("0.0000");
  const [hasFetchedSol, setHasFetchedSol] = useState(false);

  const fetchSol = async () => {
    setSolLoading(true);
    try {
      const balance = await getSolBalance(wallet.solana.address);
      setSolBalance(balance);
      setHasFetchedSol(true);
    } catch (error) {
      alert("Failed to fetch SOL balance. Devnet might be congested.");
    } finally {
      setSolLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <Card className="group overflow-hidden bg-[#FFFAE2] border border-[#EADDA6] shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Wallet Header */}
      <div
        className="p-6 cursor-pointer hover:bg-[#EADDA6]/20 transition-colors relative"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#E6E18F] opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FEFCAD] border border-[#EADDA6] flex items-center justify-center font-bold text-[#92977E] group-hover:bg-[#E6E18F] transition-colors shadow-sm">
              {wallet.accountIndex + 1}
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#92977E] tracking-tight">
                Wallet {wallet.accountIndex + 1}
              </h3>
              <p className="text-xs font-mono text-[#92977E]/60 mt-0.5 uppercase tracking-wider font-semibold">
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
                className="text-[#92977E]/40 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <div
              className={`transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <ChevronDown className="w-5 h-5 text-[#92977E]/40 group-hover:text-[#92977E]" />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-[#EADDA6] pt-6 bg-[#FEFCAD]/30">
          {/* Controls Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 px-3 rounded-full border border-orange-500/30 text-orange-600 bg-orange-500/10 flex items-center text-[10px] font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3 mr-2" />
              Devnet Mode
            </div>
          </div>

          {/* Ethereum Section (Static - No Balance Check) */}
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E6E18F] flex items-center justify-center shadow-sm">
                  <span className="text-[#5e634e] text-xs font-bold">ETH</span>
                </div>
                <label className="text-sm font-bold text-[#5e634e]">
                  Ethereum
                </label>
              </div>
            </div>

            <div className="space-y-3 pl-3 border-l-2 border-[#EADDA6] ml-4">
              {/* Address */}
              <div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-[#EADDA6] rounded-xl px-4 py-3 text-xs text-[#5e634e] font-mono break-all shadow-inner">
                    {wallet.ethereum.address}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(wallet.ethereum.address, "ETH Address")
                    }
                    className="text-[#92977E]/50 hover:text-[#92977E] hover:bg-[#E6E18F]/20 rounded-xl"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Private Key */}
              <div className="bg-[#EADDA6]/20 p-3 rounded-xl border border-[#EADDA6]/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#92977E] uppercase">
                    Private Key
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEthKey(!showEthKey)}
                    className="h-5 px-2 text-[10px] text-[#92977E]"
                  >
                    {showEthKey ? "Hide" : "Reveal"}
                  </Button>
                </div>
                {showEthKey ? (
                  <div className="font-mono text-xs text-[#5e634e] break-all bg-white p-2 rounded border border-[#EADDA6]">
                    {wallet.ethereum.privateKey}
                  </div>
                ) : (
                  <div className="h-6 bg-[#92977E]/10 rounded flex items-center justify-center">
                    <span className="text-[#92977E]/40 text-xs">
                      •••••••••••••
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-[#EADDA6]" />

          {/* Solana Section (With Balance Check) */}
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#92977E] flex items-center justify-center shadow-sm">
                  <span className="text-[#FEFCAD] text-xs font-bold">SOL</span>
                </div>
                <label className="text-sm font-bold text-[#5e634e]">
                  Solana Devnet
                </label>
              </div>

              {/* SOL Balance Check Button */}
              <div className="flex items-center gap-2">
                {hasFetchedSol && (
                  <div className="text-sm font-mono text-[#92977E] font-bold mr-2">
                    {solBalance} SOL
                  </div>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={fetchSol}
                  disabled={solLoading}
                  className="h-7 px-3 text-xs bg-[#EADDA6]/40 text-[#92977E] hover:bg-[#EADDA6] rounded-lg"
                >
                  <RefreshCw
                    className={`w-3 h-3 mr-1 ${
                      solLoading ? "animate-spin" : ""
                    }`}
                  />
                  {solLoading
                    ? "Loading..."
                    : hasFetchedSol
                    ? "Refresh"
                    : "Check Balance"}
                </Button>
              </div>
            </div>

            <div className="space-y-3 pl-3 border-l-2 border-[#EADDA6] ml-4">
              <div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-[#EADDA6] rounded-xl px-4 py-3 text-xs text-[#5e634e] font-mono break-all shadow-inner">
                    {wallet.solana.address}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(wallet.solana.address, "SOL Address")
                    }
                    className="text-[#92977E]/50 hover:text-[#92977E] hover:bg-[#E6E18F]/20 rounded-xl"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Private Key */}
              <div className="bg-[#EADDA6]/20 p-3 rounded-xl border border-[#EADDA6]/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#92977E] uppercase">
                    Private Key
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSolKey(!showSolKey)}
                    className="h-5 px-2 text-[10px] text-[#92977E]"
                  >
                    {showSolKey ? "Hide" : "Reveal"}
                  </Button>
                </div>
                {showSolKey ? (
                  <div className="font-mono text-xs text-[#5e634e] break-all bg-white p-2 rounded border border-[#EADDA6]">
                    {wallet.solana.privateKey}
                  </div>
                ) : (
                  <div className="h-6 bg-[#92977E]/10 rounded flex items-center justify-center">
                    <span className="text-[#92977E]/40 text-xs">
                      •••••••••••••
                    </span>
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
