import * as bip39 from "bip39";
import { ethers } from "ethers";
import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
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

export const generateSeedPhrase = (): string => {
  return bip39.generateMnemonic();
};

export const deriveWallet = (
  seedPhrase: string,
  accountIndex: number
): WalletData => {
  const ethPath = `m/44'/60'/0'/0/${accountIndex}`;
  const ethHdNode = ethers.HDNodeWallet.fromPhrase(
    seedPhrase,
    undefined,
    ethPath
  );

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
};

// --- SOLANA DEVNET BALANCE LOGIC ONLY ---

const SOL_DEVNET_RPC = "https://api.devnet.solana.com";

export const getSolBalance = async (address: string): Promise<string> => {
  try {
    const connection = new Connection(SOL_DEVNET_RPC);
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return (balance / LAMPORTS_PER_SOL).toFixed(4);
  } catch (error) {
    console.error("Error fetching SOL Devnet balance:", error);
    throw error;
  }
};
