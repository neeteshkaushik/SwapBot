import { createJupApiClient } from "../configs/jupiterApi.config.js"
import { LAMPORTS_PER_SOL, Connection, VersionedTransaction } from '@solana/web3.js'
import { getWallet, getPublicKey,connection, getSplTokensInfo } from "./wallet.js";
const jupApi = createJupApiClient();


const quoteAmount = async(outputMint,amount) => {
    try {
        const quoteResponse = await jupApi.quoteGet({
            inputMint: "So11111111111111111111111111111111111111112",
            outputMint: outputMint,
            amount: amount,
            slippageBps: 50
          })
        console.log(quoteResponse);
        const {swapTransaction} = await jupApi.swapPost({
            quoteResponse,
            userPublicKey: getPublicKey(userId),
            wrapAndUnwrapSol: true
        })
        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        let transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        transaction.sign([])
    } catch (error) {
        console.error("Error in quoteAmount:", error);
    }
}

const swapHelper = async(id,inputMintAmount,inputMintAddress,outputMintAddress) => {
    try {
      console.log(`swap  ${inputMintAmount} of ${inputMintAddress} to ${outputMintAddress} by ${id}`);
      const wallet = getWallet(id);
        const quoteResponse = await jupApi.quoteGet({
            inputMint: inputMintAddress,
            outputMint: outputMintAddress,
            amount: inputMintAmount,
            slippageBps: 50
          })
        console.log(quoteResponse);
        const {swapTransaction} = await jupApi.swapPost({swapRequest:{
            quoteResponse,
            userPublicKey: wallet.publicKey.toString(),
            wrapAndUnwrapSol: true
        }})
        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        let transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        transaction.sign([wallet.payer])
        const latestBlockHash = await connection.getLatestBlockhash();

        const rawTransaction = transaction.serialize()
        const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
        });
        await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
        });
        console.log(`https://solscan.io/tx/${txid}`);
    } catch (error) {
        console.error("Error in swapHelper:", error);
        throw error;
    }
}

const swap = async(id,sellAmount,buyMintAddress) => {
    try {
        await swapHelper(id,sellAmount*LAMPORTS_PER_SOL,"So11111111111111111111111111111111111111112",buyMintAddress);
        return true;
    } catch (error) {
        console.error("Error in swap:", error);
        return false;
    }
}

const sell = async(id,sellPercent,sellMintAddress) => {
    try {
        if (sellPercent < 0 || sellPercent > 100) {
            throw new Error("Invalid sell percent");
        }
        const tokens = await getSplTokensInfo(id);
        const token = tokens.find(token => token.mintAddress === sellMintAddress);
        let sellAmount = token.tokenAmount * sellPercent / 100;
        await swapHelper(id,sellAmount,sellMintAddress,"So11111111111111111111111111111111111111112",token.decimals);
        return true;
    } catch (error) {
        console.error("Error in sell:", error);
        return false;
    }
}

export {
    swap,
    sell,
}