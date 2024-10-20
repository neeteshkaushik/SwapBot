import { createBot } from "../configs/bot.config.js";
import { sell, swap } from "../utils/swap.js";
import { getNextMessage } from "../utils/utils.js";
import { getSolBalance, getSplTokensInfo } from "../utils/wallet.js";
const bot = createBot();

export const sellHandler = async (msg, userId) => {
  try {
    const tokens = await getSplTokensInfo(userId);
    if (tokens.length === 0) {
      bot.sendMessage(msg.chat.id, "No positions found");
      return;
    }
    let message = "Tokens (tap to copy address):\n";
    for (let i = 0; i < tokens.length; i++) {
      message += `\n${i + 1}. ${tokens[i].name}:\namount: ${tokens[i].tokenUIAmount}\naddress: \`${tokens[i].mintAddress}\`\n`;
    }
    message += "\n\nEnter the mint address of the token you want to sell";

    bot.sendMessage(msg.chat.id, message, { parse_mode: "Markdown" });
    let { text: mintAddress } = await getNextMessage(msg.chat.id);
    mintAddress = mintAddress.trim();
    console.log(mintAddress);
    bot.sendMessage(msg.chat.id, "Enter the % you want to sell");
    let { text: percentage } = await getNextMessage(msg.chat.id);
    percentage = Number(percentage);
    console.log(percentage);
    if (percentage < 0 || percentage > 100) {
      bot.sendMessage(msg.chat.id, "Invalid percentage");
      return;
    }
    let success = await sell(userId, percentage, mintAddress);
    let response = success ? "Sell successful" : "Failed to sell. Please try again later.";
    bot.sendMessage(msg.chat.id, response);
  } catch (error) {
    bot.sendMessage(msg.chat.id, "Failed to sell. Please try again later.");
  }
};
