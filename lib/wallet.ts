import * as bip39 from "bip39";
import { ethers } from "ethers";
import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";

export interface WalletData {
  id: string;
  accountIndex: number;
  ethereum: {
    address: string;
    privateKey: string;
  };
  solana: {
    address: string;
    privateKey: string;
  };
}

export interface WalletVault {
  seedPhrase: string;
  wallets: WalletData[];
}

export function generateSeedPhrase(): string {
  return bip39.generateMnemonic();
}

export function deriveWallet(
  seedPhrase: string,
  accountIndex: number
): WalletData {
  // Derive Ethereum wallet using BIP44 path: m/44'/60'/0'/0/{accountIndex}
  const ethPath = `m/44'/60'/0'/0/${accountIndex}`;
  const ethHdNode = ethers.HDNodeWallet.fromPhrase(
    seedPhrase,
    undefined,
    ethPath
  );

  // Derive Solana wallet using BIP44 path: m/44'/501'/{accountIndex}'/0'
  const solPath = `m/44'/501'/${accountIndex}'/0'`;
  const seed = bip39.mnemonicToSeedSync(seedPhrase);
  const derivedSeed = derivePath(solPath, seed.toString("hex")).key;
  const solanaKeypair = Keypair.fromSeed(derivedSeed);

  return {
    id: `wallet_${accountIndex}_${Date.now()}`,
    accountIndex,
    ethereum: {
      address: ethHdNode.address,
      privateKey: ethHdNode.privateKey,
    },
    solana: {
      address: solanaKeypair.publicKey.toString(),
      privateKey: bs58.encode(solanaKeypair.secretKey),
    },
  };
}
