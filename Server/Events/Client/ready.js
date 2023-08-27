const { Events , ActivityType } = require("discord.js");
const { GuildSchema } = require("../../../Global/Database/Models")
const fs = require('fs');

module.exports = async (client) => {

    for (const guild of [...client.guilds.cache.values()]) {
        await guild.fetchSettings();
        if (guild.settings == null) return client.emit('guildCreate', guild);
    }

    const data = await GuildSchema.find({});
    if (data.length > client.guilds.cache.size) {
        const guildCount = [];
        for (let i = 0; i < client.guilds.cache.size; i++) {
            guildCount.push([...client.guilds.cache.values()][i].id);
        }

        for (const guild of data) {
            if (!guildCount.includes(guild.guildID)) {
                client.emit('guildDelete', guild);
            }
        }
    }

    client.logger.debug('All guilds have been initialized.');

    setInterval(async () => {
        client.guilds.cache.forEach(async guild => {
            await guild.fetchSettings();
        });
    }, 60 * 1000);

    const getType = (type) => {
        switch (type) {
          case "COMPETING":
            return ActivityType.Competing;
    
          case "LISTENING":
            return ActivityType.Listening;
    
          case "PLAYING":
            return ActivityType.Playing;
    
          case "WATCHING":
            return ActivityType.Watching;

          case "STREAMING":
            return ActivityType.Streaming;
        }
    };

    setInterval(async () => {
        client.user.setPresence({
            status: client.system.Client.Presence.Status ? client.system.Client.Presence.Status : "online",
            activities: [
                {
                  name: client.system.Client.Presence.Message[0] ? client.system.Client.Presence.Message[Math.floor(Math.random() * client.system.Client.Presence.Message.length)] : "Developed By Vante",
                  type: client.system.Client.Presence.Type ? getType(client.system.Client.Presence.Type) : ActivityType.Playing,
                  url: "https://www.twitch.tv/vantexsrd"
                },
            ],
        });
    }, 10000);



    const content = [`# Commands  \nHere's the list of Vante Bots commands. This one contains more than **${client.commands.size + client.contextcommands.size} commands**\n\n#### Contents of the table  \n**Name**: The name of the command  \n**Description**: A brief explanation of the purpose of the command  \n**Usage**: The arguments/options that the command takes in parameters  \n**Cooldown**: The time that must elapse between each command so that it can be executed again by the user\n\n`];

    try {

        const categories = (client.commands.map(c => '## ' + c.Category).filter((v, i, a) => a.indexOf(v) === i));
        categories.sort((a, b) => a.Category - b.Category)
        .forEach(Category => {
            const co = client.commands
					.filter(c => c.Category === Category.slice(3))
					.sort((a, b) => a.Name - b.Name)
					.map(c => `| ${c.Name}	|	${c.Description}	|	\`\`\` ${c.Example} \`\`\`	|`).join('\n');
				content.push(Category, '|	Command	| Description	| Usage', '|---------------|--------------------|--------------|', co, '\n');
        });

        fs.writeFileSync(`${__dirname}/../../../Assets/Vante.md`, content.join('\n'));
    } catch (e) {};

};
  
module.exports.config = {
    Event: Events.ClientReady, System: true,
};