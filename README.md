# Games Deals Notifier
[![GitHub](https://img.shields.io/github/license/mikolajkalwa/GamesDealsBot?style=for-the-badge)](LICENSE)
[![Discord](https://img.shields.io/discord/731855809818132480?style=for-the-badge&logo=discord)](https://discord.gg/ZkjqCmM)
[![BotInvite](https://img.shields.io/badge/Discord-Add%20bot%20to%20your%20server!-blue?style=for-the-badge&logo=discord)](https://discord.com/oauth2/authorize?client_id=396466836331429889&scope=bot&permissions=536890368)
[![Liberapay](https://img.shields.io/liberapay/goal/hi_im_miki?style=for-the-badge&logo=liberapay)](https://liberapay.com/hi_im_miki/)


## Description

GamesDeals is a Discord bot built with [eris](https://github.com/abalabahaha/eris). GamesDeals informs about games on -100% sale. The data comes from [GameDeals subreddit](https://www.reddit.com/r/GameDeals).

## Installation

Recommended approach to run this project is to use available docker image.

1. Configure [GamesDealsAPI](https://github.com/mikolajkalwa/GamesDealsAPI).
2. Pull the docker image. 
3. Configure the environment variables.
4. Configure your system scheduler to run the container every 15 minutes. `docker run --rm mikolajkalwa/gamesdealsnotifier`
### Environment variables

- `API_URL` - Games Deals API url, default: `http://localhost:3000`,
- `WEBHOOK_URL` - optional, report exections statistics to provided discord webhook.

## Licence 

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.