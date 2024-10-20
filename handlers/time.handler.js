import { createBot } from "../configs/bot.config.js";
const bot = createBot();

export const timeHandler = (msg,userId) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, new Date().toLocaleTimeString());
  };