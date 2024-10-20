import { createBot } from "../configs/bot.config.js";
import { getNextMessage } from "../utils/utils.js";
import { getSplTokensInfo } from "../utils/wallet.js";
const bot = createBot();

export const positionsHandler = async (msg,userId) => {
    const tokens = await getSplTokensInfo(userId);
    if (tokens.length === 0) {
        bot.sendMessage(msg.chat.id, "No positions found");
        return;
    }
    let message = "Your positions:\n";
    tokens.forEach(token => {
        message += `${token.name}: ${token.tokenUIAmount}\n`;
    });
    bot.sendMessage(msg.chat.id, message);
}