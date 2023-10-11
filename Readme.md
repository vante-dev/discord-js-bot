<h1 align="center">
   Discord.js v14 Handlers
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

## Directory Structure
- Assets (Fonts for canvas & images)
- Global (Base, Database, Helpers, Languages, Structures, Utils)
- Server (Commands, Contexts, Events, index.js, shard.js)

<br>

## Starting the project

### Configuration

The configuration file named **./Global/System.js** and the configuration object allows you to customize various aspects of your Discord bot, including:

- **Server Settings**: Configure the primary server's unique ID and an optional server link.

- **Owner ID**: Specify Discord User IDs for the bot's owners or administrators.

- **Debug Mode**: Toggle debugging mode on or off.

- **Client Settings**:
  - **Token**: Store your bot's authentication token securely.
  - **Command Prefixes**: Define command prefixes.
  - **Presence Settings**: Customize the bot's status, type, and dynamic presence messages.

- **Monitoring**:
  - Define monitoring categories with unique IDs and webhooks.

These settings allow you to tailor your bot's behavior and functionality to your needs.

### Installation
```sh
$ npm install
```

### Starts your Discord bot in development mode
```sh
$ npm run dev
```

### Starts the bot
```sh
$ npm run start
```

### Starts the bot with shards
```sh
$ npm run sharded
```