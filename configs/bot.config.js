import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();
const token = process.env.TELEGRAM_BOT_TOKEN;
let bot = null;

export const createBot = () => {
    if(bot) {
        return bot;
    }
    bot = new TelegramBot(token, { polling: true });
    return bot;
}