# GamesDeals Bot

![GitHub](https://img.shields.io/github/license/mikolajkalwa/GamesDealsBot?style=for-the-badge)
![Discord](https://img.shields.io/discord/731855809818132480?style=for-the-badge)

## Description

GamesDeals is Discord bot built with [eris](https://github.com/abalabahaha/eris). GamesDeals informs about games which price was reduced by 100%. The data comes from [r/GameDeals](https://www.reddit.com/r/GameDeals).

## Command list 

| Command       | Alias            | Required permissions | Description                                                                          |
| ------------- | ---------------- | -------------------- | ------------------------------------------------------------------------------------ |
| createwebhook | cw, sendhere, sh | Manage Webhooks      | Bot will send notifications about free games in the channel this command was issued. |
| webhookinfo   | wi               |                      | Information about webhooks created by the bot.                                       |
| editwebhook   | ew               | Manage Webhooks      | Edits webhook parameters like role to mention or keywords.                           |
| removewebhook | rw               | Manage Webhooks      | Removes webhook with provided ID.                                                    |
| latestdeal    | lastdeal, ld     |                      | Latest found game.                                                                   |
| stats         | statistics, info |                      | Statistics like: uptime, memory usage, cached users, guilds, webhooks, found games.  |
| ping          | pong             |                      | Ping the bot to see if there are latency issues.                                     |
| support       | sup, supp        |                      | Support server invitation URL. **This command works only in Direct Messages**        |
| invite        | inv              |                      | Bot invitation URL. **This command works only in Direct Messages.**                  |

## Licence 

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.