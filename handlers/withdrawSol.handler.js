import { createBot } from "../configs/bot.config.js";
import { getNextMessage } from "../utils/utils.js";
import { getSolBalance, getWallet, withdrawSol } from "../utils/wallet.js";
const bot = createBot();

export const withdrawSolHandler = async (msg,userId) => {
    try {
        let balance = await getSolBalance(userId);
        let message = `Enter the amount you want to withdraw. Your balance is ${balance}:`;
        bot.sendMessage(msg.chat.id, message);
        let {text: amount} = await getNextMessage(msg.chat.id,message);
        amount = Number(amount);
        if (balance < amount) {
            bot.sendMessage(msg.chat.id, "Insufficient balance");
            return;
        }
        bot.sendMessage(msg.chat.id, "Enter the destination address");
        const {text: destination} = await getNextMessage(msg.chat.id);
        console.log(`amount: ${amount}, destination: ${destination}`);
        let response = await withdrawSol(userId, amount, destination);
        let responeMessage =  response ? "Withdraw successful" : "Failed to withdraw. Please try again later.";
        bot.sendMessage(msg.chat.id, responeMessage);
    } catch (error) {
        bot.sendMessage(msg.chat.id, "Failed to withdraw. Please try again later.");
    }
}