# kvest-bot

Telegram bot for the Christmas quest. Answers `/code: #XXXXXXXXXX` with the next clue if the code matches a known stage.

## Deploy on Render (free)

1. Create a bot with [@BotFather](https://t.me/BotFather), get the bot token.
2. Push this folder to a GitHub repo.
3. On [render.com](https://render.com): New -> Web Service -> connect the repo.
   - Build command: `npm install`
   - Start command: `npm start`
   - Instance type: Free
4. Add environment variables in Render:
   - `BOT_TOKEN` = token from BotFather
   - `WEBHOOK_URL` = the Render service URL, e.g. `https://kvest-bot.onrender.com` (no trailing slash)
5. Deploy. On boot the bot registers its webhook with Telegram automatically.
6. Generate the bot's QR code from its `t.me/<bot_username>` link (any QR generator).

Render's free plan spins the service down after ~15 min of no traffic and takes a few seconds to wake up on the next request — fine for a quest bot used a few times a day.

## Adding more stages

Edit the `STAGES` object in `index.js`: add `"#XXXXXXXXXX": "hint text"` for each new code, commit, push — Render redeploys automatically.
