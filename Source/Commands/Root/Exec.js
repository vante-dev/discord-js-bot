const { exec } = require('child_process');
 
module.exports = {
    Name: 'exec',
    Aliases: ['terminal'],
    Description: 'Execute a terminal code',
    Usage: 'exec pm2 kill',
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
        if (args.length < 1) return message.channel.send('You have to give me some text to run!')

        exec(args.join(' '), (error, stdout) => {
            const response = stdout || error;
            message.channel.send({ content: `\`\`\`bash\n${response}\`\`\`` });
        });
    },

    interactionRun: async (client, interaction, settings) => {},
};