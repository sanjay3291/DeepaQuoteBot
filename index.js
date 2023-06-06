const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const { createCanvas, loadImage, registerFont } = require('canvas');
const CanvasTextWrapper = require('canvas-text-wrapper').CanvasTextWrapper;
const request = require('request-promise');
const express = require("express");
const cron = require("node-cron");

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('I\'m running');
});

// grabs the environment variable
const token = process.env.TELEGRAM_BOT_KEY;

// starts a new Telegram bot instance that "polls" for updates
const bot = new TelegramBot(token, { polling: true });


// send the following text on starting the bot
bot.onText(/\/start/, (msg) => {
  // listens for "/start" and responds with the greeting below.
  bot.sendMessage(msg.chat.id,
    "Hey, I'm the Deepa Quote Bot, I send motivational quotes similar to the ones Deepa uses in her life !!\n In order to see me in action please click the following link, \"/deepa_motivate_me\"");
});

app.get('/generate', async function(req, res) {

  let quote = await request('https://api.quotable.io/random?tags=inspirational', { json: true });

  let resolutions = [[1080, 1080], [1080, 608], [1920, 1080]];
  let pair = req.query.width && req.query.height ? [Number.parseInt(req.query.width), Number.parseInt(req.query.height)] : resolutions[Math.floor(Math.random() * resolutions.length)];

  let fonts = ['Arial', 'Times New Roman', 'Courier New', 'Courier', 'Verdana', 'Georgia', 'Trebuchet MS', 'Arial Black', 'Impact'];

  const canvas = createCanvas(pair[0], pair[1], 'jpg');
  const ctx = canvas.getContext('2d');

  loadImage(`https://picsum.photos/${pair[0]}/${pair[1]}`).then((image) => {
    let font = fonts[Math.floor(Math.random() * fonts.length) + 1];
    ctx.drawImage(image, 0, 0, pair[0], pair[1]);
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#ffffff';

    ctx.globalCompositeOperation = req.query.invert && Boolean.valueOf(req.query.invert) ? 'difference' : 'normal';

    CanvasTextWrapper(canvas, quote.content + "\n - Deepa Paul", { font: `60px ${font}`, textAlign: 'center', verticalAlign: 'middle', strokeText: true, paddingX: 100 });

    let stream = canvas.createJPEGStream({ quality: 0.95, chromaSubsampling: false });

    stream.pipe(res);
  });
});

// Listener (handler) for telegram's /motivate_me event
bot.onText(/\/deepa_motivate_me/, (msg, match) => {
  const chatId = msg.chat.id;

  var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

  download(process.env.SERVER_URL, 'generate.png', function() {

    bot.sendPhoto(chatId, 'generate.png', { caption: "If you need more motivation, please click the following link \"/deepa_motivate_me\"" })
  });

});

bot.onText(/^(.*?(\bage\b)[^$]*)$/, async (msg) => {

  const randAge = Math.floor(Math.random() * 60) + 2;

  bot.sendMessage(msg.chat.id,`Age is just a number, but today I feel ${randAge} years old`,{reply_to_message_id: msg.message_id})

  
})

bot.onText(/^(.*?(\bAge\b)[^$]*)$/, async (msg) => {

  const randAge = Math.floor(Math.random() * 60) + 2;

  bot.sendMessage(msg.chat.id,`Age is just a number, but today I feel ${randAge} years old`,{reply_to_message_id: msg.message_id})

  
})

bot.onText(/^(.*?(\bDiet\b)[^$]*)$/, async (msg) => {

  items = ['cookie', 'ice cream', 'milk shake', 'brownie'];

  var item = items[Math.floor(Math.random()*items.length)];

  bot.sendMessage(msg.chat.id,`A balanced diet is a ${item} in each hand.\n -Deepa Paul`,{reply_to_message_id: msg.message_id})
  
})

bot.onText(/^(.*?(\bdiet\b)[^$]*)$/, async (msg) => {

  items = ['cookie', 'ice cream', 'milk shake', 'brownie'];

  var item = items[Math.floor(Math.random()*items.length)];

  bot.sendMessage(msg.chat.id,`A balanced diet is a ${item} in each hand.\n -Deepa Paul`,{reply_to_message_id: msg.message_id})
  
})

bot.onText(/^(.*?(\btruth\b)[^$]*)$/, async (msg) => {

  bot.sendMessage(msg.chat.id,`Sach tho kadva hi hotha hai lekin bolna tho padtha hai.`,{reply_to_message_id: msg.message_id})
  
})

bot.onText(/^(.*?(\bTruth\b)[^$]*)$/, async (msg) => {

  bot.sendMessage(msg.chat.id,`Sach tho kadva hi hotha hai lekin bolna tho padtha hai.`,{reply_to_message_id: msg.message_id})
  
})

// Creating a cron job which runs on every 1 minute (*/1 * * * *)
cron.schedule("0 9 * * *", function() {
  const chatId = process.env.GROUP_CHAT_ID;

  var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

  download(process.env.SERVER_URL, 'generate.png', function() {

    bot.sendPhoto(chatId, 'generate.png', { caption: "Good Morning folks, Here's your daily morning motivation. If you need more motivation today, please click the following link \"/deepa_motivate_me\"" })
  });
},
  {
    scheduled: true,
    timezone: "America/Los_Angeles"
  });


app.listen(PORT, () => {
  console.log('Listening on port 3000');
});