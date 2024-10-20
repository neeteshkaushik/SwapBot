import { createBot } from './configs/bot.config.js';
import { startHandler, homeHandler, timeHandler, addHandler, quoteHandler, swapHandler, positionsHandler, walletInfoHandler, sellHandler, withdrawSolHandler } from './handlers/index.js';

const bot = createBot();

bot.onText(/\/start/, startHandler);
bot.onText(/\/home/, homeHandler);
bot.onText(/time/, timeHandler);
bot.onText(/add/, addHandler);
bot.onText(/\/quote/, quoteHandler);
bot.onText(/\/buy/, swapHandler);
bot.onText(/\/positions/, positionsHandler);
bot.onText(/\/wallet-info/, walletInfoHandler);


const callbackMap = {
    '/start': startHandler,
    '/home': homeHandler,
    '/time': timeHandler,
    '/add': addHandler,
    '/quote': quoteHandler,
    '/buy': swapHandler,
    '/positions': positionsHandler,
    '/wallet-info': walletInfoHandler,
    '/sell': sellHandler,
    '/withdraw': withdrawSolHandler
};

bot.on('callback_query', async(query) => {
    console.log('query from', query);
    const chatId = query.message.chat.id;
    const callback = callbackMap[query.data];
    if (callback) {
        await callback(query.message, query.from.id);
        bot.answerCallbackQuery(query.id);
    } else {
        bot.sendMessage(chatId, 'Invalid Input');
    }
});

