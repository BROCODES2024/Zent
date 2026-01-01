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
      confirm("Are you sure? This will delete all wallets and the seed phrase.")
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
    <div className="min-h-screen w-full relative overflow-hidden text-[#5e634e]">
      {/* Ambient Background Glows (Using Palette Colors) */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#E6E18F]/30 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[#FEFCAD]/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-4 py-16 max-w-5xl relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-[#FFFAE2] shadow-xl mb-6 border border-[#EADDA6]">
            <Wallet className="w-10 h-10 text-[#92977E]" />
          </div>

          <h1 className="text-7xl font-bold text-[#FFFAE2] tracking-tighter mb-4 drop-shadow-sm">
            Zent.
          </h1>
          <p className="text-[#E6E18F] text-lg max-w-md mx-auto font-medium">
            Secure. Private. Organic.
          </p>
        </div>

        {/* Vault Creation Section */}
        {!hasGeneratedVault ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-[#FFFAE2] rounded-[2rem] p-8 shadow-2xl border border-[#EADDA6]">
              <div className="flex items-center gap-3 mb-6 border-b border-[#EADDA6] pb-6">
                <div className="h-3 w-3 rounded-full bg-[#92977E] animate-pulse"></div>
                <h2 className="text-2xl font-bold text-[#92977E] tracking-tight">
                  Initialize Vault
                </h2>
              </div>

              <p className="text-[#92977E]/80 mb-8 font-medium">
                Generate a new cryptographic seed phrase or import an existing
                one.
              </p>

              <div className="space-y-6">
                <div className="group/input">
                  <label className="text-xs font-bold text-[#92977E]/60 uppercase tracking-wider mb-2 block ml-1">
                    Secret Phrase (Optional)
                  </label>
                  <Input
                    type="text"
                    value={customSeedInput}
                    onChange={(e) => setCustomSeedInput(e.target.value)}
                    placeholder="Enter seed phrase or leave empty to generate..."
                    className="bg-[#EADDA6]/30 border-[#92977E]/20 text-[#5e634e] placeholder:text-[#92977E]/40 h-14 rounded-xl focus:border-[#E6E18F] focus:ring-[#E6E18F]/50"
                  />
                </div>

                <Button
                  onClick={handleCreateVault}
                  className="w-full h-14 bg-[#E6E18F] hover:bg-[#FEFCAD] text-[#5e634e] hover:text-[#92977E] text-lg font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Create Vault
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Seed Phrase Display */}
            <div className="bg-[#FFFAE2] border border-[#EADDA6] rounded-[2rem] p-8 mb-12 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-[#92977E] tracking-tight flex items-center gap-3">
                  <span className="text-[#E6E18F]">#</span> Secret Phrase
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSeed(!showSeed)}
                    className="text-[#92977E]/60 hover:text-[#92977E] hover:bg-[#EADDA6]/30 rounded-xl"
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
                <div className="relative z-10">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                    {seedWords.map((word, i) => (
                      <div
                        key={i}
                        className="bg-[#FEFCAD] border border-[#EADDA6] rounded-xl px-4 py-3 flex items-center shadow-sm"
                      >
                        <span className="text-xs text-[#92977E]/50 font-bold mr-3">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm text-[#5e634e] font-bold">
                          {word}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(seedPhrase, "Seed phrase")}
                    className="w-full bg-white/50 border-[#EADDA6] text-[#92977E] hover:bg-[#E6E18F] h-12 rounded-xl"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>
              ) : (
                <div
                  className="bg-[#EADDA6]/20 border-2 border-dashed border-[#EADDA6] rounded-2xl h-48 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#EADDA6]/30 transition-colors"
                  onClick={() => setShowSeed(true)}
                >
                  <Eye className="w-8 h-8 text-[#92977E]/40 mb-2" />
                  <p className="text-[#92977E]/60 font-medium">
                    Click to reveal seed phrase
                  </p>
                </div>
              )}
            </div>

            {/* Vault Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-3xl font-bold text-[#FFFAE2] tracking-tight drop-shadow-sm">
                  Your Wallets
                </h2>
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddWallet}
                    className="bg-[#FEFCAD] text-[#92977E] hover:bg-[#E6E18F] font-bold rounded-xl shadow-lg transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                  <Button
                    onClick={handleClearVault}
                    variant="destructive"
                    size="icon"
                    className="bg-red-400/80 hover:bg-red-500 text-white rounded-xl shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="transform transition-all duration-300 hover:-translate-y-1"
                  >
                    <WalletDisplay
                      wallet={wallet}
                      onDelete={handleDeleteWallet}
                      canDelete={wallets.length > 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
