import { createBot } from "../configs/bot.config.js";
import { getSolBalance, getWallet } from "../utils/wallet.js";
const bot = createBot();

export const homeHandler = async(msg) => {
    const chatId = msg.chat.id;
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
              { text: "Quote", callback_data: "/quote" },
              { text: "Buy", callback_data: "/buy" },
          ],
          [ { text: "Wallet", callback_data: "/wallet-info" },
            { text: "Positions", callback_data: "/positions" },
          ],
          [
            { text: "Sell", callback_data: "/sell" },
            { text: "Withdraw Sol", callback_data: "/withdraw" },
          ]
        ],
      },
      parse_mode: "Markdown",
    };
    let message = `Welcome to SwapBot!
Solana’s fastest bot to trade any coin (SPL token)`;
    let wallet = getWallet(msg.from.id);
    let balance = await getSolBalance(msg.from.id);
    if(balance === 0)
    message += `\nYou currently have no SOL in your wallet. To start trading, deposit SOL to your SwapBot wallet address`
    message += `\n\nYour wallet address: \`${wallet.publicKey.toString()}\`(tap to copy)`;
    bot.sendMessage(chatId, message, opts);
  }