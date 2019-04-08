# GamesDeals Bot

![GitHub](https://img.shields.io/github/license/mikolajkalwa/GamesDealsBot.svg)
[![Discord Bots](https://discordbots.org/api/widget/status/396466836331429889.svg?noavatar=true)](https://discordbots.org/bot/396466836331429889)
[![Discord Bots](https://discordbots.org/api/widget/servers/396466836331429889.svg?noavatar=true)](https://discordbots.org/bot/396466836331429889)

## Description

GamesDeals is Discord bot build with discord.js. GamesDeals informs about games which price was reduced to 0. It uses https://www.reddit.com/r/GameDeals as a source.

## Command list 

|                 | Command       | Aliases     | Description                                                                                                      | Required permissions |
| --------------- | ------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- | -------------------- |
| Set-up commands |               |             |                                                                                                                  |                      |
|                 | sendhere      | sh          | Bot will send notifications about free games in the channel this command was issued.                             | Manage Webhooks      |
|                 | forgetserver  | fs          | Makes bot forget the server. Removes related webhook. Bot won't send any notifications about free games anymore. | Manage Webhooks      |
|                 | setmention    | sm          | Set (update) role to mention when new game is found.                                                             | Manage Webhooks      |
|                 | removemention | rm          | Makes bot stop mentioning a role when a new game is found.                                                       | Manage Webhooks      |
| Utility         |               |             |                                                                                                                  |                      |
|                 | invite        | inv         | Sends bot invitation URL.                                                                                        |                      |
|                 | lastdeal      | ld          | Sends information about last found game.                                                                         |                      |
|                 | statistics    | stat, stats | Sends basic statistics about the bot.                                                                            |                      |
|                 | support       | supp        | Sends support server invitation URL.                                                                             |                      |

Command list can be accessed via `help` command.

## How to run own instance of the bot

1. Configure [GamesDealsAPI](https://github.com/mikolajkalwa/GamesDealsAPI).
2. Clone this repo,
3. Run `npm install`.
4. Configure the required environment variables (`.env` file can be used).
5. Run `npm run start-pretty`.
6. If you want to get notifications about free games, configure [GamesDealsNotifier](https://github.com/mikolajkalwa/GamesDealsNotifier).

### Required environment variables

1. `BOT_TOKEN` generated on https://discordapp.com/developers/applications
2. `API_URL` for example http://localhost:8080

### Optional environment variables

1. `COMMAND_PREXIF`
2. `LOG_LEVEL`

## Licence 

This project is licensed under the GNU GPLv3 License - see the [LICENSE](LICENSE) file for details.