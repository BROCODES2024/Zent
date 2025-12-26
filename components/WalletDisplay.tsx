"use client";

import { useState } from "react";
import { WalletData } from "@/lib/wallet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
      {/* Wallet Header */}
      <div
        className="p-6 cursor-pointer hover:bg-slate-800/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Wallet {wallet.accountIndex + 1}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Account Index: {wallet.accountIndex}
            </p>
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
                className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </div>
      </div>

      {/* Wallet Details */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6">
          {/* Ethereum Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">ETH</span>
              </div>
              <label className="text-sm font-medium text-slate-300">
                Ethereum
              </label>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Address
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono break-all">
                    {wallet.ethereum.address}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(
                        wallet.ethereum.address,
                        "Ethereum address"
                      )
                    }
                    className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-500">Private Key</label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowEthKey(!showEthKey)}
                    className="h-6 w-6 text-slate-400 hover:text-white"
                  >
                    {showEthKey ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                {showEthKey ? (
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono break-all">
                      {wallet.ethereum.privateKey}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(
                          wallet.ethereum.privateKey,
                          "Ethereum private key"
                        )
                      }
                      className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-500 text-center">
                    •••••••••••••••••
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Solana Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">SOL</span>
              </div>
              <label className="text-sm font-medium text-slate-300">
                Solana
              </label>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Address
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono break-all">
                    {wallet.solana.address}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(wallet.solana.address, "Solana address")
                    }
                    className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-500">Private Key</label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSolKey(!showSolKey)}
                    className="h-6 w-6 text-slate-400 hover:text-white"
                  >
                    {showSolKey ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                {showSolKey ? (
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono break-all">
                      {wallet.solana.privateKey}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(
                          wallet.solana.privateKey,
                          "Solana private key"
                        )
                      }
                      className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-500 text-center">
                    •••••••••••••••••
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
