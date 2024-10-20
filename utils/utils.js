import { createBot } from "../configs/bot.config.js";
const bot = createBot();

export const getNextMessage = (chatId) => {
    return new Promise((resolve) => {
        bot.once('message', (msg) => {
            if(msg.chat.id === chatId){
                resolve(msg);
            }
        })
    })
}
