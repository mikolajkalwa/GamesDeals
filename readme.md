
# GamesDeals - [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/MikolajKalwa/GamesDeals/blob/master/LICENSE)

## Description

A bot which informs about free (discounted) games.
Add it to your server, set up a channel with `_sendHere` command and never miss any sale again!

As a source, it uses `/r/GameDeals`.
It tries to search for games which price were reduced by 100% or free weekend games on steam.

For more information use `_help` command.

Feel free to ask me any questions about this bot.

**This bot is still under active development and sometimes may break due to my coding skills.**

## How do I run own instance of the bot?

1. Setup [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community) (Community Server Edition).
2. Clone this repo.
3. Fill `config.example.js` and rename it to `config.js`.
4. Run `npm install`.
5. Run `npm start` to start the bot.