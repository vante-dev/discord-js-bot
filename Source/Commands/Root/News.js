const { Guild } = require("../../../Global/Settings/Models");

module.exports = {
    Name: 'setnews',
    Aliases: [],
    Description: 'This is for the developers.',
    Usage: 'setnews <text>',
    Category: 'Root',
    Cooldown: 0,
    
    Permissions: {
        User: [],
        Bot: [],
        Role: []
    },

    Command: {
        Prefix: true,
        Slash: false,
        Ephemeral: false,
        
        Options: [],
    },
    
    messageRun: async (client, message, args, settings) => {
        let news = args.join(" ").split("").join("");
        if (!news) return message.channel.send("Please enter news.");

        console.log(news)
        await Guild.updateMany({},
            { $set: { 
                "News": news,
                "NewsTime": Date.now(),
            } }
          );
        
        return message.channel.send("News setted.");
    },

    interactionRun: async (client, interaction, settings) => {},
};