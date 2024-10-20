import { createBot } from "../configs/bot.config.js";
import { getNextMessage } from "../utils/utils.js";
import { createJupApiClient } from "../configs/jupiterApi.config.js";
const bot = createBot();
const jupApi = createJupApiClient();

export const quoteHandler = async (msg,userId) => {
    try {
      bot.sendMessage(msg.chat.id, "Enter the input mint");
      let {text: inputMint} = await getNextMessage(msg.chat.id);
      console.log(inputMint);
      // const response = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}\
      //   &outputMint=So11111111111111111111111111111111111111112\
      //   &amount=100000000\
      //   &slippageBps=50`)
      const response = await jupApi.quoteGet({
        inputMint: inputMint,
        outputMint: "So11111111111111111111111111111111111111112",
        amount: '1000000000',
      })
      console.log(response);
      let price = Number(response.outAmount)/1000000000
      bot.sendMessage(msg.chat.id, price);
        
    } catch (error) {
      console.error("Error fetching data:", error);
      bot.sendMessage(
        msg.chat.id,
        "Failed to fetch data. Please try again later."
      );
    }
  }