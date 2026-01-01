import * as bip39 from "bip39";
import { ethers } from "ethers";
import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
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

// --- NEW BALANCE LOGIC ---

export type Network = "mainnet" | "devnet";

// Reliable public RPC endpoints
const ETH_RPC = {
  mainnet: "https://eth.llamarpc.com",
  devnet: "https://rpc.ankr.com/eth_sepolia", // Sepolia is the standard devnet now
};

export const getEthBalance = async (
  address: string,
  network: Network
): Promise<string> => {
  try {
    const provider = new ethers.JsonRpcProvider(ETH_RPC[network]);
    const balance = await provider.getBalance(address);
    // Format to 4 decimal places for cleaner UI
    const formatted = ethers.formatEther(balance);
    return parseFloat(formatted).toFixed(4);
  } catch (error) {
    console.error("Error fetching ETH balance:", error);
    return "0.0000";
  }
};

export const getSolBalance = async (
  address: string,
  network: Network
): Promise<string> => {
  try {
    const cluster = network === "mainnet" ? "mainnet-beta" : "devnet";
    const connection = new Connection(clusterApiUrl(cluster));
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return (balance / LAMPORTS_PER_SOL).toFixed(4);
  } catch (error) {
    console.error("Error fetching SOL balance:", error);
    return "0.0000";
  }
};
