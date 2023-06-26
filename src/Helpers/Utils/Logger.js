const config = require("@root/System"), { EmbedBuilder, WebhookClient } = require("discord.js"), { green, cyan, yellow, red } = require("chalk"), moment = require('moment');
const VanteCheck = "✓", VanteMark = "𐄂", VanteWarn = "⚠", cliSpinners = require('cli-spinners'), webhookLogger = config.Functions.Webhook.Logger && config.Functions.Webhook.Systems ? new WebhookClient({ url: config.Functions.Webhook.Systems }) : undefined;
const date = `[${moment().format("dd-mm - mm:ss")}]`;

module.exports = class Logger {
  static success(content) {
    console.log(`${date}: ( ${green(VanteCheck)} ) ${cyan(`${content}`)}`);
  };

  static log(content) {
    console.log(`${date}: ${cyan(`${content}`)}`);
  };

  static warn(content) {
    console.log(`${date}: ( ${yellow(VanteWarn)} ) ${cyan(`${content}`)}`);
  };

  static debug(content) {
    console.log(`${date}: ( ${green(VanteCheck)} ) ${cyan(`${content}`)}`);
  };

  static loading(content) {
    console.log(`${date}: ( ${cliSpinners.arc} ) ${cyan(`${content}`)}`);
  };

  static error(content, vante) {
    if (vante && vante.error) {
      console.log(`${date}: ( ${red(VanteMark)} ) ${cyan(`${content} - ${vante.error}`)}`); 
      if (webhookLogger) {
        if (vante.error) if (vante.error.length > 950) vante.error = vante.error.slice(0, 950) + '...';
        if (vante.error.stack) if (vante.error.stack.length > 950) vante.error.stack = vante.error.stack.slice(0, 950) + '...';

        const VanteEmbed = new EmbedBuilder().setAuthor({ name: `${vante.client.user.username} (${vante.client.user.id})`, iconURL: vante.client.user.displayAvatarURL() })
        .addFields(
          { name: '\u200B', value: vante.error ? `\`\`\`js\n` + vante.error + `\n\`\`\`` : "\u200B"},
          { name: '\u200B', value: vante.error.stack ? `\`\`\`js\n` + vante.error.stack.replace(new RegExp(`${__dirname}/`, "g"), "./") + `\n\`\`\`` : "\u200B"},
        )

        webhookLogger.send({ 
          username: vante.guild.name ? vante.guild.name : 'Discord Guild', 
          avatarURL: vante.guild.iconURL() ? vante.guild.iconURL() : "https://cdn.discordapp.com/embed/avatars/1.png", 
          embeds: [VanteEmbed] 
        }).catch((ex) => {});
      };
    } else {
      console.log(`${date}: ( ${red(VanteMark)} ) ${cyan(`${content}`)}`); 
    }
  };
};
