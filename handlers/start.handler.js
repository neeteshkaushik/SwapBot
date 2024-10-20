import { createBot } from "../configs/bot.config.js";
const bot = createBot();
import { getPublicKey, getSolBalance,getSplTokensInfo } from "../utils/wallet.js";

export const startHandler = async (msg) => {
    console.log("start")
    getSplTokensInfo(msg.from.id)
    const chatId = msg.chat.id;
    const publicKey = getPublicKey(msg.from.id);
    console.log(publicKey)
    const balance = await getSolBalance(msg.from.id);
    console.log(balance)
    bot.sendMessage(chatId, `Welcome to the Swap Bot, One stop solution for trading spl tokens\n\nYour Public Key is:\n\n\`${publicKey}\` (tap to copy)\nbalance ${balance}` , {parse_mode: "Markdown"});
  };