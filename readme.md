# GamesDeals Bot

[![GitHub](https://img.shields.io/github/license/mikolajkalwa/GamesDealsBot?style=for-the-badge)](LICENSE)
[![Discord](https://img.shields.io/discord/731855809818132480?style=for-the-badge&logo=discord)](https://discord.gg/ZkjqCmM)
[![BotInvite](https://img.shields.io/badge/Discord-Add%20bot%20to%20your%20server!-blue?style=for-the-badge&logo=discord)](https://discord.com/api/oauth2/authorize?client_id=396466836331429889&permissions=536870912&scope=bot%20applications.commands)
[![Liberapay](https://img.shields.io/liberapay/goal/mikolajkalwa?style=for-the-badge&logo=liberapay)](https://liberapay.com/mikolajkalwa/)

## Description

GamesDeals is a Discord bot built with [Discord.js](https://github.com/discordjs/discord.js/). GamesDeals sends notifications about games on -100% sale. The data comes from [GameDeals subreddit](https://www.reddit.com/r/GameDeals). (*Please note that this project is not associated with given subreddit in any way, except the data source*).

If you have trouble setting up the bot or have some questions join [Support Server](https://discord.gg/ZkjqCmM).

This project is hosted on and supported by [MIKR.US](https://mikr.us/) - Polish VPS provider. 

## ⚠️ If you don't have access to the slash commands please reinvite the bot!

## Command list

| Command             | Required permissions | Description                                                                                                                                                                                                                                                                                                                             |
| ------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /webhook create     | Manage Webhooks      | Set up notifications channel. You can set up as many webhooks as you want. If you want a specific role to get mentioned when a new game is found specify the `role` parameter. If you want to receive notification only on particular deals use `keywords` parameter. You can block particular notifications with `blacklist` parameter |
| /webhook info       |                      | Retrieve details about configured webhooks in the guild.                                                                                                                                                                                                                                                                                |
| /webhook edit set   | Manage Webhooks      | Add/edit `role` to mention, `keywords` or `blacklist` to previously configured webhook.                                                                                                                                                                                                                                                 |
| /webhook edit clear | Manage Webhooks      | Remove `role` to mention, `keywords`, or `blacklist` of previously configured webhook.                                                                                                                                                                                                                                                  |
| /webhook delete     | Manage Webhooks      | Delete previously configured webhook.                                                                                                                                                                                                                                                                                                   |
| /ping               |                      | Pong! 🏓                                                                                                                                                                                                                                                                                                                                |
| /latest             |                      | Sends latest found game                                                                                                                                                                                                                                                                                                                 |

## How to set up the bot

1. Invite bot to your server.
2. Use `/webhook create` command
3. 🎉 Done! 🎉

## Examples

- Notify only about euro truck simulator 2 deals on steam:
  - /webhook create `channel:`#cool-channel `keywords:` euro truck simulator 2,steam
- Notify only about games from steam and gog:
  - /webhook create `channel:`#cool-channel `keywords:` steam,gog
- Mention a role when a game is found:
  - /webhook create `role:`@coolPeople
- Both: 
  - /webhook create `channel:`#cool-channel `role:`@coolPeople `keywords:` steam,gog

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
