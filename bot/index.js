
const TelegramBot = require('node-telegram-bot-api');
const _ = require('lodash')

const files = require('./files')
const IMDB = require('./imdb')
const CallbackService = require('./services/callback_service')

const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const imdbService = new IMDB()


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
        callback_data: 'imdb '+ title.tconst
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

  // Create event emitter with callbacks
  const callbackService = new CallbackService();


  // On download display message 
  callbackService.on('downsub', url => {
    console.log('downloading ...',url)
    const stream = files.downloadFile(url)
    bot.sendDocument(msg.message.chat.id, stream);
  });

  // On imdb event show subtitles from opensubtitles
  callbackService.on('imdb', subtitles =>{
    const buttons = _.map(subtitles, subtitle=>{
      return [{
        text: subtitle.filename, 
        callback_data: subtitle.url
      }] 
    })

    bot.sendMessage(msg.from.id, 'Subtitles:', {
      reply_markup:{
        inline_keyboard: buttons
      }
    });
  });

    // On download display message 
  callbackService.on('test', url => {
    console.log('test ...',url)
  });

  callbackService.on('error', err=>{
    console.log(err)
  });

  callbackService.run(data);


})

//https://dl.opensubtitles.org/en/download/src-api/vrf-19a60c4f/sid-ULFWKnCi3mNPgChBWlbEEXnAJFd/filead/
bot.onText(/\/doc.*/, (msg) => {
  const url = 'https://dl.opensubtitles.org/en/download/src-api/vrf-19e20c62/sid-LUrC,E4i2nFlPtlmJ-kzFUU1Ox3/filead/1955760897'
  const stream = files.downloadFile(url)
  bot.sendDocument(msg.chat.id, stream);
});
