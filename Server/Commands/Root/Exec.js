const { exec } = require('child_process');

module.exports = {
    Name: 'exec',
    Aliases: ['terminal'],
    Description: 'Eval a JS code.',
    Example: 'exec pm2 start',
    Category: 'Root',
    Cooldown: 0,

    Command: {
        Prefix: true,
        Slash: false,
        Ephemeral: false,
        Options: []
    },

    onLoad: async (client) => {},

    messageRun: async (client, message, args) => {
        if (args.length < 1) return message.channel.send('You have to give me some text to run!')

        exec(args.join(' '), (error, stdout) => {
            const response = stdout || error;
            message.channel.send({ content: `\`\`\`bash\n${response}\`\`\`` });
        });
    },

    interactionRun: async (client, interaction) => {},
};
