
const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const TelegramBot = require('node-telegram-bot-api');
const opensubtitle = require('./opensubtitle')
const _ = require('lodash')
const axios = require('axios')

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
  	const buttons = _.map(subtitles.es, (subtitle)=>{
  		return [{
  			text:subtitle.filename, 
  			callback_data: subtitle.id
  		}] 
  	})

	  bot.sendMessage(chatId, 'Subtitulos:', {
	  	reply_markup:{
	  		inline_keyboard: buttons
	  	}
	  });
  })
});

bot.onText(/\/help.*/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Commands /help /echo arguments');
});

bot.on('callback_query', (msg)=>{
	console.log(msg)
	bot.sendMessage(msg.id, JSON.stringify(msg))
})

/*
axios({
  method:'get',
  url:'http://bit.ly/2mTM3nY',
  responseType:'stream'
})*/