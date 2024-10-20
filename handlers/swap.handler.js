import { createBot } from "../configs/bot.config.js";
import { swap } from "../utils/swap.js";
import { getNextMessage } from "../utils/utils.js";
import {getSolBalance} from "../utils/wallet.js";
const bot = createBot();

export const swapHandler = async (msg,userId) => {
    try {
        bot.sendMessage(msg.chat.id, "Enter the amount you want to swap");
        let {text: amount} = await getNextMessage(msg.chat.id);
        amount = Number(amount);
        const balance = await getSolBalance(userId);
        console.log(`balance: ${balance}, amount: ${amount}`);
        if (balance < amount) {
            bot.sendMessage(msg.chat.id, "Insufficient balance");
            return;
        }
        bot.sendMessage(msg.chat.id, "Enter the mint address of the token you want to swap to");
        let {text: mintAddress} = await getNextMessage(msg.chat.id);
        const response = await swap(userId, amount, mintAddress);
        let responseMessage = response ? "Swap successful" : "Failed to swap. Please try again later.";
        bot.sendMessage(msg.chat.id, responseMessage);
    } catch (error) {
        bot.sendMessage(msg.chat.id, "Failed to swap. Please try again later.");
    }
}