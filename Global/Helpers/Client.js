const { readdirSync, lstatSync } = require(`fs`);
const { join, extname } = require(`path`);
const { WebHooks } = require(`../System`);
const { ApplicationCommandType, WebhookClient  } = require(`discord.js`);
const { cyan, red } = require("chalk"), moment = require('moment');
const { GuildSchema } = require('../Database/Models/');

/**
 * Retrieves a webhook by its ID and returns a WebhookClient object if found.
 *
 * @param {string} id - The ID of the webhook to retrieve.
 * @returns {WebhookClient|null} A WebhookClient object if a matching webhook is found, or null if not found.
 */
async function getWebHook(id) {
  const webhookURL = WebHooks.find(hook => hook.ID === id) ? WebHooks.find(hook => hook.ID === id).URL : null

  if (webhookURL) {
    return new WebhookClient({ url: webhookURL }) ? new WebhookClient({ url: webhookURL }) : null
  } else return null
}

/**
 * Recursively reads files with specified extensions in a directory and its subdirectories.
 *
 * @param {string} dir - The directory to start reading from.
 * @param {string[]} allowedExtensions - An array of allowed file extensions (default is ['.js']).
 * @returns {string[]} An array containing the paths of files with allowed extensions.
 */
function fileLoader(dir, allowedExtensions = [`.js`]) {
    const filePaths = [];
    const readCommands = (dir) => {
      const files = readdirSync(join(process.cwd(), dir));
      files.forEach((file) => {
        const stat = lstatSync(join(process.cwd(), dir, file));
        if (stat.isDirectory()) {
          readCommands(join(dir, file));
        } else {
          const extension = extname(file);
          if (!allowedExtensions.includes(extension)) return;
          const filePath = join(process.cwd(), dir, file);
          filePaths.push(filePath);
        }
      });
    };
    readCommands(dir);
    return filePaths;
}

async function validateCommand(cmd) {
  if (typeof cmd !== `object`) {
    console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Command data must be an Object.`)}`);
  }

  if (typeof cmd.Name !== `string` || cmd.Name !== cmd.Name.toLowerCase()) {
    console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Command Name must be a lowercase string.`)}`);
  }

  if (cmd.Aliases && (!Array.isArray(cmd.Aliases) || cmd.Aliases.some((Vante) => typeof Vante !== `string` || Vante !== Vante.toLowerCase()))) {
    console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Command Aliases must be an Array of lowercase strings.`)}`);
  }

  if (typeof cmd.Description !== `string`) {
    console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Command Description must be a string.`)}`);
  }

  if (cmd.Usage && typeof cmd.Usage !== `string`) {
    console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Command Usage must be a string`)}`);
  }

  if (cmd.Cooldown && typeof cmd.Cooldown !== `number`) {
    console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Command Cooldown must be a number`)}`);
  }

  if (cmd.Command) {
    if (typeof cmd.Command !== `object`) {
      console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Command.Command must be an object`)}`);
    }

    if (Object.prototype.hasOwnProperty.call(cmd.Command, `Prefix`) && typeof cmd.Command.Prefix !== `boolean`) {
      console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Command.Command Prefix must be a boolean value`)}`);
    }

    if (Object.prototype.hasOwnProperty.call(cmd.Command, `Slash`) && typeof cmd.Command.Slash !== `boolean`) {
      console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Command.Command Slash must be a boolean value`)}`);
    }

    if (Object.prototype.hasOwnProperty.call(cmd.Command, `Ephemeral`) && typeof cmd.Command.Ephemeral !== `boolean`) {
      console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Command.Command Ephemeral must be a boolean value`)}`);
    }

    if (cmd.Command.Options && !Array.isArray(cmd.Command.Options)) {
      console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Command.Command Options must be a array`)}`);
    }

    if (cmd.Command.Prefix && typeof cmd.messageRun !== `function`) {
      console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Missing 'messageRun' function`)}`);
    }

    if (cmd.Command.Slash && typeof cmd.interactionRun !== `function`) {
      console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Missing 'interactionRun' function`)}`);
    }
  }
}

async function validateContext(cmd) {
  if (typeof cmd !== `object`) {
    console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Context must be an object`)}`);
}

if (typeof cmd.Name !== `string`) {
  console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Context name must be a string.`)}`);
}

if (typeof cmd.Description !== `string`) {
  console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Context description must be a string.`)}`);
}

if (cmd.Type !== ApplicationCommandType.User && cmd.Type !== ApplicationCommandType.Message) {
  console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Context type must be a either User/Message.`)}`);
}

if (Object.prototype.hasOwnProperty.call(cmd, `Enabled`) && typeof cmd.Enabled !== `boolean`) {
  console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Context enabled must be a boolean value`)}`);
}
     
if (Object.prototype.hasOwnProperty.call(cmd, `Ephemeral`) && typeof cmd.Ephemeral !== `boolean`) {
  console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( ${cmd.Name} ) Context ephemeral must be a boolean value`)}`);
}
}

async function createDB(guild, client) {
  try {
    await guild.fetchSettings();
  } catch (err) {
    console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( @createDB ) has error: \n${err.message}.`)}`);
  }
}

async function deleteDB(guild) {
  try {
    await GuildSchema.findOneAndRemove({ guildID: guild.id });
    return true;
  } catch (err) {
    return false;
  }
}



module.exports = {
    getWebHook,
    fileLoader,
    createDB,
    deleteDB,
    validateCommand,
    validateContext,
}
