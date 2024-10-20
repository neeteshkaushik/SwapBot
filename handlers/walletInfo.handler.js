import { createBot } from "../configs/bot.config.js";
import { getNextMessage } from "../utils/utils.js";
import { getSolBalance, getWallet } from "../utils/wallet.js";
const bot = createBot();

export const walletInfoHandler = async (msg,userId) => {
    const wallet = getWallet(userId);
    const balance = await getSolBalance(userId);
    let message = `**Wallet: \n\nAddress: \`${wallet.publicKey.toString()}\`\nBalance: ${balance}\n\nTap to copy the address and send SOL to deposit.`;
    bot.sendMessage(msg.chat.id, message, {parse_mode: "Markdown"});
}