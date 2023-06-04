// imports the node package for us
const TelegramBot = require('node-telegram-bot-api');

// grabs the environment variable
const token = process.env.TELEGRAM_BOT_KEY;

// starts a new Telegram bot instance that "polls" for updates
const bot = new TelegramBot(token, {polling: true});

// send the following text on starting the bot
bot.onText(/\/start/, (msg) => {
// listens for "/start" and responds with the greeting below.
bot.sendMessage(msg.chat.id,
"Hey, I'm the Deepa Quote Bot, I send motivational quotes similar to what Deepa says in real life !!");
});