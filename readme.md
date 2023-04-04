# GamesDeals
[![GitHub](https://img.shields.io/github/license/mikolajkalwa/GamesDealsBot?style=for-the-badge)](LICENSE)
[![Discord](https://img.shields.io/discord/731855809818132480?style=for-the-badge&logo=discord)](https://discord.gg/ZkjqCmM)
[![BotInvite](https://img.shields.io/badge/Discord-Add%20bot%20to%20your%20server!-blue?style=for-the-badge&logo=discord)](https://discord.com/api/oauth2/authorize?client_id=396466836331429889&permissions=536870912&scope=bot%20applications.commands)
[![Liberapay](https://img.shields.io/liberapay/goal/mikolajkalwa?style=for-the-badge&logo=liberapay)](https://liberapay.com/mikolajkalwa/)

## Overview
GamesDeals is a Discord bot that notifies users when games are briefly free or have a 100% discount. It gets its information from the [GameDeals subreddit](https://www.reddit.com/r/GameDeals). (Please keep in mind that, aside from the data source, this project has no affiliation with the given subreddit.)

Join the [support server](https://discord.gg/ZkjqCmM) if you're having trouble configuring the bot or if you have any questions.

## Command list

**If you don't have access to the slash commands, please reinvite the bot!**

| Command             | Required permissions | Description                                                                                                                                                                                                                                                                                                                      |
| ------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /webhook create     | Manage Webhooks      | Configure the notification channel. You can create an unlimited number of webhooks. If you want a specific role mentioned when a new game is found, use the `role` parameter. Use the `keywords` parameter to receive notifications only on specific deals. With the `ignore` parameter, you can disable specific notifications. |
| /webhook info       |                      | Get information about the guild's configured webhooks.                                                                                                                                                                                                                                                                           |
| /webhook edit set   | Manage Webhooks      | Add/edit `role` to mention, `keywords` or `ignore` to previously configured webhook.                                                                                                                                                                                                                                             |
| /webhook edit clear | Manage Webhooks      | Remove `role` to mention, `keywords`, or `ignore` of previously configured webhook.                                                                                                                                                                                                                                              |
| /webhook delete     | Manage Webhooks      | Delete previously configured webhook.                                                                                                                                                                                                                                                                                            |
| /latest             |                      | Get latest found game.                                                                                                                                                                                                                                                                                                           |

## How to set up the bot

1. Invite the bot to your server.
2. Use the `/webhook create` command
3. 🎉 Done! 🎉

### Examples

- Notify only about euro truck simulator 2 on steam:
  - /webhook create `channel:`#cool-channel `keywords:` euro truck simulator 2,steam
- Notify only about games from steam and gog:
  - /webhook create `channel:`#cool-channel `keywords:` steam,gog
- Mention a role when a game is found:
  - /webhook create `role:`@coolPeople
- Both:
  - /webhook create `channel:`#cool-channel `role:`@coolPeople `keywords:` steam,gog

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
