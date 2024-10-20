import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import fs from "fs";
import { Metaplex } from "@metaplex-foundation/js";
import { createUmi } from "@metaplex-foundation/umi";
import { defaultPlugins } from "@metaplex-foundation/umi-bundle-defaults";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { fetchAllDigitalAssetWithTokenByMint } from "@metaplex-foundation/mpl-token-metadata";
const WALLET_FILE = "./wallet.json";
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
const metaplex = new Metaplex(connection);
const umi = createUmi().use(defaultPlugins(connection));
const walletExists = () => {
  return fs.existsSync(WALLET_FILE);
};

const getAllWallets = () => {
  let wallets = {};
  if (walletExists()) {
    wallets = JSON.parse(fs.readFileSync(WALLET_FILE));
  }
  return wallets;
};
const createWallet = (id) => {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = keypair.secretKey;
  let wallets = getAllWallets();
  wallets[id] = { publicKey, secretKey };
  fs.writeFileSync(WALLET_FILE, JSON.stringify(wallets));
  return keypair;
};

const getWallet = (id) => {
  let wallets = getAllWallets();
  let keypair;
  if (wallets[id]) {
    let secretKey = new Uint8Array(Object.values(wallets[id].secretKey));
    keypair = Keypair.fromSecretKey(secretKey);
  } else {
    keypair = createWallet(id);
  }
  const wallet = new Wallet(keypair);
  return wallet;
};

const getPublicKey = (id) => {
  let wallet = getWallet(id);
  return wallet.publicKey.toString();
};

const getSolBalance = async (id) => {
  try {
    console.log("getSolBalance id", id);
    const wallets = getAllWallets();
    const publicKey = wallets[id]?.publicKey;
    console.log(publicKey);
    if (!publicKey) {
      return 0;
    }
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance / 10 ** 9;
  } catch (error) {
    console.log(`Error getting balance: ${error?.message}`);
  }
};
const getTokenMetadata = async (tokenMint) => {
  const assets = await fetchAllDigitalAssetWithTokenByMint(umi, tokenMint);
  const { name, symbol, uri } = assets[0]["metadata"];
  return { name, symbol, uri };
};

const getSplTokensInfo = async (userId) => {
  try {
    console.log("getSplTokensInfo id", userId);
    const wallet = getWallet(userId);
    const publicKey = wallet?.publicKey;
    if (!publicKey) {
      return [];
    }
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      wallet.publicKey,
      { programId: TOKEN_PROGRAM_ID }
    );
    console.log(`SPL Tokens`, { tokenAccounts });
    const processedAccounts = tokenAccounts.value.map(async (account) => {
      const tokenAccountAddress = account.pubkey.toBase58();
      console.log(account.account.data.parsed.info)
      const tokenUIAmount = account.account.data.parsed.info.tokenAmount.uiAmount;
      const tokenAmount = Number(account.account.data.parsed.info.tokenAmount.amount);
      const decimals = account.account.data.parsed.info.tokenAmount.decimals;
      const mintAddress = account.account.data.parsed.info.mint;
      const {name,symbol,uri} = await getTokenMetadata(new PublicKey(mintAddress));
      // const tokenMetadata = await getTokenMetadata(
      //   connection,
      //   new PublicKey(mintAddress)
      // );
      // const uriDetails = await fetch(tokenMetadata.uri);
      // const metadata = await uriDetails.json();
      return {
        tokenAccountAddress,
        tokenUIAmount,
        mintAddress,
        name,
        symbol,
        uri,
        tokenAmount,
        decimals
      };
    });
    const tokens = await Promise.all(processedAccounts);
    console.log(`SPL Tokens`, { tokens });
    return tokens;
  } catch (error) {
    console.log(`Error getting balance: ${error?.message}`);
  }
};

const withdrawSol = async (id, amount, destination) => {
    try {
        console.log("withdrawSol Info", { id, amount, destination });
        let balance = await getSolBalance(id);
        if (balance < amount) {
            console.log("Insufficient balance");
            return false;
        }
        const wallet = getWallet(id);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: new PublicKey(destination),
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );
        await sendAndConfirmTransaction(connection, transaction, [wallet.payer]);
        console.log("Withdraw successful");
        return true;
    } catch (error) {
        console.log(`Error withdrawing SOL: ${error?.message}`);
        return false;
    }
}

export {
  createWallet,
  getSolBalance,
  getSplTokensInfo,
  getPublicKey,
  getWallet,
  withdrawSol,
  connection,
};
