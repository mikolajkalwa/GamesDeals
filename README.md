# GamesDeals Bot

Discord bot which informs about free games.

## Description

GamesDeals is Discord bot build with discord.js. GamesDeals informs about games which price was reduced to 0. It uses https://www.reddit.com/r/GameDeals as a source.

## Command list 

Command list can be accessed via help command. Mention bot user to get the prefix.

## How to run own instance of the bot

1. Configure [GamesDealsAPI](https://github.com/mikolajkalwa/GamesDealsAPI).
2. Clone this repo,
3. Run `npm install`.
4. Configure the required environment variables (`.env` file can be used).
5. Run `npm run start-pretty`.
6. If you want to get notifications about free games, configure [GamesDealsNotifier](https://github.com/mikolajkalwa/GamesDealsNotifier).

### Required enverioment variables

1. `BOT_TOKEN` generated on https://discordapp.com/developers/applications
2. `API_URL` for example http://localhost:8080

### Optional enverioment variables

1. `COMMAND_PREXIF`
2. `LOG_LEVEL`

## Licence 

This project is licensed under the GNU GPLv3 License - see the [LICENSE](LICENSE) file for details.