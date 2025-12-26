"use client";

import { useState } from "react";
import { generateSeedPhrase, deriveWallet, WalletData } from "@/lib/wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WalletDisplay from "./WalletDisplay";
import { Wallet, Plus, Eye, EyeOff, Copy, Trash2 } from "lucide-react";

export default function WalletGenerator() {
  const [seedPhrase, setSeedPhrase] = useState<string>("");
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [customSeedInput, setCustomSeedInput] = useState("");
  const [showSeed, setShowSeed] = useState(false);
  const [hasGeneratedVault, setHasGeneratedVault] = useState(false);

  const handleCreateVault = () => {
    const seed = customSeedInput.trim() || generateSeedPhrase();
    setSeedPhrase(seed);
    setCustomSeedInput("");
    setHasGeneratedVault(true);
    // Automatically create first wallet
    const firstWallet = deriveWallet(seed, 0);
    setWallets([firstWallet]);
  };

  const handleAddWallet = () => {
    if (!seedPhrase) return;
    const newIndex = wallets.length;
    const newWallet = deriveWallet(seedPhrase, newIndex);
    setWallets([...wallets, newWallet]);
  };

  const handleDeleteWallet = (id: string) => {
    if (wallets.length === 1) {
      alert("Cannot delete the last wallet. Clear the entire vault instead.");
      return;
    }
    setWallets(wallets.filter((w) => w.id !== id));
  };

  const handleClearVault = () => {
    if (
      confirm(
        "Are you sure you want to clear the entire vault? This will delete all wallets and the seed phrase."
      )
    ) {
      setSeedPhrase("");
      setWallets([]);
      setHasGeneratedVault(false);
      setShowSeed(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const seedWords = seedPhrase.split(" ");

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-white">Zent</h1>
        </div>
        <p className="text-slate-400 text-lg">
          A personal web-3 wallet for managing your crypto assets.
        </p>
      </div>

      {/* Vault Creation Section */}
      {!hasGeneratedVault ? (
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Create Your Vault
          </h2>
          <p className="text-slate-400 mb-6">
            Generate a new seed phrase or import an existing one. This seed
            phrase will be used to derive all your wallets.
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                Enter your secret phrase (or leave blank to generate)
              </label>
              <Input
                type="text"
                value={customSeedInput}
                onChange={(e) => setCustomSeedInput(e.target.value)}
                placeholder="Enter 12 or 24 word seed phrase..."
                className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
              />
            </div>
            <Button
              onClick={handleCreateVault}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              size="lg"
            >
              Create Vault
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Seed Phrase Display */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Secret Phrase
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSeed(!showSeed)}
                  className="text-slate-400 hover:text-white"
                >
                  {showSeed ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
            {showSeed ? (
              <div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {seedWords.map((word, i) => (
                    <div
                      key={i}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2"
                    >
                      <span className="text-xs text-slate-500 mr-2">
                        {i + 1}
                      </span>
                      <span className="text-sm text-white">{word}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(seedPhrase, "Seed phrase")}
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Copy className="w-3 h-3 mr-2" />
                  Copy Seed Phrase
                </Button>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-8 text-center">
                <p className="text-slate-500">
                  Click the eye icon to reveal your seed phrase
                </p>
              </div>
            )}
          </div>

          {/* Vault Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Vault</h2>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddWallet}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Wallet
                </Button>
                <Button
                  onClick={handleClearVault}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Vault
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {wallets.map((wallet) => (
                <WalletDisplay
                  key={wallet.id}
                  wallet={wallet}
                  onDelete={handleDeleteWallet}
                  canDelete={wallets.length > 1}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
