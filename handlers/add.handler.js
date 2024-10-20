import { createBot } from "../configs/bot.config.js";
import { getNextMessage } from "../utils/utils.js";
const bot = createBot();

export const addHandler = async (msg,userId) => {
    bot.sendMessage(msg.chat.id, "Enter the first number");
    let num1 = await getNextMessage(msg.chat.id);
    bot.sendMessage(msg.chat.id, "Enter the second number");
    let num2 = await getNextMessage(msg.chat.id);
    let sum = Number(num1.text) + Number(num2.text);
    bot.sendMessage(msg.chat.id, `The sum is ${sum}`);
  };