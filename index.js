const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL; // e.g. https://your-app.onrender.com

if (!TOKEN) {
  console.error("BOT_TOKEN env var is required");
  process.exit(1);
}

// stage code -> hint text for the NEXT clue
const STAGES = {
  "#4653980134": [
    "Те що ти шукаєш, схоже на телефон, але не телефон.",
    "В середині захований вогонь. Підігрій біле поле, щоб побачити приховане.",
    "Підказка: Нагорі у лузі.",
  ].join("\n"),
};

const CODE_FORMAT = /^#\d{10}$/;
const CODE_FORMAT_ERROR = "Введіть код у форматі #xxxxxxxxxx - 10 чисел";

const WELCOME = [
  "Привіт. Я квест бот, і радо допоможу тобі знайти наступну підказку.",
  "",
  "Але лютий айтішнік зашифрував мене. Це простий код у форматі #XXXXXXXXXX (решітка + 10 цифр).",
  "",
  "Все що я знаю підслухавши своїм цифровим слухом, це те, що код зберігається у чорному кейсі. А той захований десь на полиці з дитячими книгами.",
  "",
  "Як будеш готовий, відправ повідомлення у форматі: /code: #<your-code-here>",
].join("\n");

const bot = new TelegramBot(TOKEN);

bot.on("message", (msg) => {
  const text = (msg.text || "").trim();

  if (text === "/start") {
    bot.sendMessage(msg.chat.id, WELCOME);
    return;
  }

  // accept "/code: #123...", "/code #123...", or just "#123..." on its own
  const codeMatch = text.match(/#\s*\d+/);
  if (!codeMatch) {
    bot.sendMessage(msg.chat.id, CODE_FORMAT_ERROR);
    return;
  }

  const normalized = "#" + codeMatch[0].replace(/\D/g, "");
  if (!CODE_FORMAT.test(normalized)) {
    bot.sendMessage(msg.chat.id, CODE_FORMAT_ERROR);
    return;
  }

  const hint = STAGES[normalized];
  bot.sendMessage(msg.chat.id, hint || CODE_FORMAT_ERROR);
});

const app = express();
app.use(express.json());

app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get("/", (req, res) => res.sendStatus(200));

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  if (WEBHOOK_URL) {
    await bot.setWebHook(`${WEBHOOK_URL}/bot${TOKEN}`);
    console.log("Webhook registered");
  } else {
    console.warn("WEBHOOK_URL not set — webhook was not registered with Telegram");
  }
});
