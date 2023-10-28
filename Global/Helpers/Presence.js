const { ActivityType } = require('discord.js');

function updatePresence(client) {
  let message = client.system.Bot.Presence.Message[0] ? client.system.Bot.Presence.Message[Math.floor(Math.random() * client.system.Bot.Presence.Message.length)] : 'Developed By Vante';

  if (message.includes('{servers}')) {
    message = message.replaceAll('{servers}', `${nFormatter(client.guilds.cache.size)} ${client.guilds.cache.size > 1 ? 'servers' : 'server'}`);
  }

  if (message.includes('{members}')) {
    const members = client.guilds.cache.map((g) => g.memberCount).reduce((partial_sum, a) => partial_sum + a, 0);
    message = message.replaceAll('{members}', `${nFormatter(members)} ${members > 1 ? 'members' : 'member'}`);
  }

  if (message.includes('{shards}')) {
    const shards = client.ws.shards.size;
    message = message.replaceAll('{shards}', `${nFormatter(shards)} ${shards > 1 ? 'shards' : 'shard'}`);
  }

  const getType = (type) => {
    switch (type) {
      case 'COMPETING':
        return ActivityType.Competing;

      case 'LISTENING':
        return ActivityType.Listening;

      case 'PLAYING':
        return ActivityType.Playing;

      case 'WATCHING':
        return ActivityType.Watching;

      case 'STREAMING':
        return ActivityType.Streaming;
    }
};
  client.user.setPresence({
    status: client.system.Bot.Presence.Status ? client.system.Bot.Presence.Status : 'online',
    activities: [
      {
        name: message,
        type: client.system.Bot.Presence.Type ? getType(client.system.Bot.Presence.Type) : ActivityType.Playing,
        url: 'https://www.twitch.tv/vantexsrd'
      },
    ],
  });
}

module.exports = function handlePresence(client) {
  updatePresence(client);
  setInterval(() => updatePresence(client), 10 * 1000);
};

function nFormatter(num, digits) {
    const lookup = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return num >= item.value;
        });
    return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}