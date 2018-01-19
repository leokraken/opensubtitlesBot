
const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const TelegramBot = require('node-telegram-bot-api');
const opensubtitle = require('./opensubtitle')


const options = {
  webHook: {
    port: process.env.PORT
  }
};

const url = process.env.APP_URL || 'https://opensubtitlebot.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);


bot.setWebHook(`${url}/bot${TOKEN}`);


bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/search (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  opensubtitle.search().then(subtitles=>{
  	  bot.sendMessage(chatId, JSON.stringify(subtitles.es), {
  	  	reply_markup:[[{text:'some subtitle', url:subtitles.es[0].url}]]
  	  });
  })
});

bot.onText(/\/help.*/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Commands /help /echo arguments');
});


