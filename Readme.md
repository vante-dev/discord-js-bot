<h1 align="center">
   Discord.js (v14) Bot Example
</h1>
<h4 align="center">Commands, Events, Permissions and Cooldown Handlers for Discord.js v14 bot ~ Made by Vante</h4>

<p align="center">
<a href="https://nodejs.org/en/download/">
   <img src="https://img.shields.io/badge/node-16.9.x-brightgreen?style=for-the-badge" alt="node.js">
</a>

<a href="https://github.com/discordjs/discord.js/">
   <img src="https://img.shields.io/badge/discord.js-v14-blue?style=for-the-badge" alt="discord.js">
</a>

<a href="https://github.com/vante-dev/discord-js-bot">
   <img src="https://img.shields.io/badge/version-latest-red?style=for-the-badge" alt="node.js">
</a>

</p>


<p align="center">
   
<a href="https://github.com/vante-dev/discord-js-bot/fork">
   <img src="https://img.shields.io/badge/Fork-github-blueviolet?logo=githubactions&logoColor=white&style=for-the-badge" alt="github-fork">
</a>
</p>    


<p align="center">

<a href="https://github.com/vante-dev/discord-js-bot">
   <img src="https://img.shields.io/github/forks/vante-dev/discord-js-bot?logo=githubactions&logoColor=success&style=social" alt="github-fork">
</a>

<a href="https://github.com/vante-dev/discord-js-bot">
   <img src="https://img.shields.io/github/stars/vante-dev/discord-js-bot?label=Stars&logo=ReverbNation&&logoColor=yellow&style=social" alt="github-repo-stars">
</a>

<a href="https://github.com/vante-dev">
   <img src="https://img.shields.io/github/followers/vante-dev?label=Follow&logo=github&style=social" alt="github-follow">
</a>
  
</p>

<br>

# Features
- Command handling
- Slash command support
- Context menu support
- Multi-language support
- Webhook logs
- Shard support
- Custom database support
- Giveaways with buttons

## Directory Structure
- Database (Dont Touch it its your local database)
- Assets (Fonts for canvas & images)
- Global (Base, Handlers, Helpers, Languages, Settings, Structures)
- Server (Commands, Contexts, Events, index.js, manager.js (sharding manager))

<br>

## Starting the project

### Configuration

The configuration file named **./Global/Settings/Emoji.json** & **./Global/Settings/Config.js** and the configuration object allows you to customize various aspects of your Discord bot.

### Installation
```sh
$ npm install
```

### Starts your Discord bot in development mode
```sh
$ npm run dev
```

### Starts the bot in normal mode
```sh
$ npm run start
```

### Starts the bot with shards 
```sh
$ npm run sharded
```