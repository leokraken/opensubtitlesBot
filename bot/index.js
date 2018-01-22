
const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const TelegramBot = require('node-telegram-bot-api');
const opensubtitle = require('./opensubtitle')
const files = require('./files')
const IMDB = require('./imdb')

const imdbService = new IMDB()

const _ = require('lodash')

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
  	console.log(subtitles)
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

bot.onText(/\/imdb (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const title = match[1];
  imdbService.search(title).then(titles=>{

    const buttons = _.map(titles, (title)=>{
      return [{
        text: title.original_title, 
        callback_data: 'imdb '+title.tconst
      }] 
    })

    bot.sendMessage(chatId, 'Peliculas:', {
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
  const {data} = msg

  // Give me imdb callback (select title) I should return subtitles
  // calling opensubtitles api
  console.log(data)
  if(opensubtitle.isIMDBCallback(data)){
      bot.answerCallbackQuery(msg.id, 'IMDB search!');

      opensubtitle.callbackQueryIMDB(data).then(subtitles=>{
        const buttons = _.map(subtitles, (subtitle)=>{
          return [{
            text: subtitle.filename, 
            callback_data: 'download '+subtitle.id
          }] 
        })

        bot.sendMessage(msg.from.id, JSON.stringify(msg))
      })


  } else if (opensubtitle.isDownloadCallback(data)){
      bot.answerCallbackQuery(msg.id, 'Downloading subtitle!');
  }

})

bot.onText(/\/doc.*/, (msg) => {
  const url = 'https://dl.opensubtitles.org/en/download/src-api/vrf-19e20c62/sid-LUrC,E4i2nFlPtlmJ-kzFUU1Ox3/filead/1955760897'
  const stream = files.downloadFile(url)
  bot.sendDocument(msg.chat.id, stream);
});
