"use client";

import { useState } from "react";
import { generateSeedPhrase, deriveWallet, WalletData } from "@/lib/wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WalletDisplay from "./WalletDisplay";
import { Wallet, Plus, Eye, EyeOff, Copy, Trash2 } from "lucide-react";

export default function WalletGenerator() {
  const [seedPhrase, setSeedPhrase] = useState<string>("");
  // Once the seed phrase is generated (or imported), we store it in state
  // so that all new wallets are derived from the same seed instead of
  // generating a new seed phrase each time.
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [customSeedInput, setCustomSeedInput] = useState("");
  //if we want to give customseedinput we can do that and all new wallets are created using it cause we store it in state
  const [showSeed, setShowSeed] = useState(false);
  const [hasGeneratedVault, setHasGeneratedVault] = useState(false);
  //This line creates a piece of React state that tracks whether a vault has been created or not.
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
    //revents wallet creation unless a valid seed phrase exists
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
    // Main Wrapper - Sets the dark theme and ambient background lighting
    <div className="min-h-screen w-full bg-[#030712] text-slate-200 relative overflow-hidden selection:bg-purple-500/30 selection:text-white">
      {/* Ambient Background Glows (The "Crazy" Part) */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay"></div>

      <div className="container mx-auto px-4 py-16 max-w-5xl relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center p-1 rounded-2xl bg-linear-to-b from-white/10 to-transparent border border-white/10 mb-6 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]">
            <div className="w-16 h-16 bg-[#0a0a0a] rounded-xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-tr from-purple-500 via-fuchsia-500 to-pink-500 opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <Wallet className="w-8 h-8 text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </div>
          </div>

          <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/40 tracking-tighter mb-4">
            Zent.
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed font-light">
            Your portal to the decentralized web. <br />
            <span className="text-purple-400 font-normal">
              Secure. Private. Ethereal.
            </span>
          </p>
        </div>

        {/* Vault Creation Section */}
        {!hasGeneratedVault ? (
          <div className="max-w-xl mx-auto">
            <div className="relative group">
              {/* Glowing border effect behind the card */}
              <div className="absolute -inset-0.5 bg-linear-to-r from-purple-500 to-pink-500 rounded-3xl opacity-30 blur group-hover:opacity-60 transition duration-500"></div>

              <div className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-6">
                  <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Initialize Vault
                  </h2>
                </div>

                <p className="text-slate-400 mb-8 leading-relaxed font-light">
                  Generate a new cryptographic seed phrase or import an existing
                  one. This key will derive your entire digital identity.
                </p>

                <div className="space-y-6">
                  <div className="group/input">
                    <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3 block ml-1">
                      Secret Phrase
                    </label>
                    <Input
                      type="text"
                      value={customSeedInput}
                      onChange={(e) => setCustomSeedInput(e.target.value)}
                      placeholder="Enter 12 or 24 word seed phrase..."
                      className="bg-black/50 border-white/10 text-white placeholder:text-slate-600 h-14 rounded-xl focus:border-purple-500/50 focus:ring-purple-500/20 transition-all hover:border-white/20"
                    />
                  </div>

                  <Button
                    onClick={handleCreateVault}
                    className="w-full h-14 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg font-medium rounded-xl shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.5)] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Create Vault
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Seed Phrase Display */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
              {/* Decorative shine */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  <span className="text-purple-400">#</span> Secret Phrase
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSeed(!showSeed)}
                    className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
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
                        className="group bg-black/40 border border-white/5 hover:border-purple-500/30 rounded-xl px-4 py-3 flex items-center transition-all duration-300 hover:bg-purple-500/10"
                      >
                        <span className="text-xs text-slate-600 font-mono mr-3 group-hover:text-purple-400 transition-colors">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm text-slate-200 font-medium tracking-wide group-hover:text-white">
                          {word}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(seedPhrase, "Seed phrase")}
                    className="w-full bg-transparent border-white/10 text-slate-300 hover:bg-white/5 hover:text-white h-12 rounded-xl group"
                  >
                    <Copy className="w-4 h-4 mr-2 group-hover:text-purple-400 transition-colors" />
                    Copy to Clipboard
                  </Button>
                </div>
              ) : (
                <div
                  className="bg-black/40 border border-dashed border-white/10 rounded-2xl h-48 flex flex-col items-center justify-center text-center relative z-10 group cursor-pointer"
                  onClick={() => setShowSeed(true)}
                >
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-slate-500 group-hover:text-slate-300 transition-colors">
                    Security Layer Active <br />
                    <span className="text-xs opacity-50">Click to reveal</span>
                  </p>
                </div>
              )}
            </div>

            {/* Vault Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  Your Wallets
                </h2>
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddWallet}
                    className="bg-white text-black hover:bg-slate-200 font-bold rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                  <Button
                    onClick={handleClearVault}
                    variant="destructive"
                    size="icon"
                    className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {wallets.map((wallet) => (
                  // Assuming WalletDisplay accepts className, otherwise wrap it
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
