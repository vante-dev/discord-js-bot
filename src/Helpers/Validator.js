const Config = require("@root/System"), mongoose = require('mongoose'), { ApplicationCommandType, Client, GatewayIntentBits: FLAGS } = require("discord.js");
const { debug, error, log} = require("@utils/Logger");

module.exports = class ErtununAnnesiCheckleBabba {
    static validateCommand(cmd) {
        if (typeof cmd !== "object") {
            throw new TypeError("Command data must be an Object.");
        }

        if (typeof cmd.Name !== "string" || cmd.Name !== cmd.Name.toLowerCase()) {
            throw new Error("Command Name must be a lowercase string.");
        }

        if (cmd.Aliases && (!Array.isArray(cmd.Aliases) || cmd.Aliases.some((Vante) => typeof Vante !== "string" || Vante !== Vante.toLowerCase()))) {
            throw new TypeError("Command Aliases must be an Array of lowercase strings.");
        }

        if (typeof cmd.Description !== "string") {
            throw new TypeError("Command Description must be a string.");
        }

        if (cmd.Usage && typeof cmd.Usage !== "string") {
            throw new TypeError("Command Usage must be a string");
        }

        if (cmd.Cooldown && typeof cmd.Cooldown !== "number") {
            throw new TypeError("Command Cooldown must be a number");
        }

        if (cmd.Permissions) {
            if (!Array.isArray(cmd.Permissions)) {
              throw new TypeError("Command userPermissions must be an Array of permission key strings.");
            }
            for (const perm of cmd.Permissions) {
              if (!permissions[perm]) throw new RangeError(`Invalid command userPermission: ${perm}`);
            }
        }

        if (cmd.Command) {
            if (typeof cmd.Command !== "object") {
                throw new TypeError("Command.Command must be an object");
            }

            if (Object.prototype.hasOwnProperty.call(cmd.Command, "Prefix") && typeof cmd.Command.Prefix !== "boolean") {
                throw new TypeError("Command.Command Prefix must be a boolean value");
            }

            if (Object.prototype.hasOwnProperty.call(cmd.Command, "Slash") && typeof cmd.Command.Slash !== "boolean") {
                throw new TypeError("Command.Command Slash must be a boolean value");
            }

            if (Object.prototype.hasOwnProperty.call(cmd.Command, "Ephemeral") && typeof cmd.Command.Ephemeral !== "boolean") {
                throw new TypeError("Command.Command Ephemeral must be a boolean value");
            }

            if (cmd.Command.Options && !Array.isArray(cmd.Command.Options)) {
                throw new TypeError("Command.Command Options must be a array");
            }

            if (cmd.Command.Prefix && typeof cmd.messageRun !== "function") {
                throw new TypeError("Missing 'messageRun' function");
            }

            if (cmd.Command.Slash && typeof cmd.interactionRun !== "function") {
                throw new TypeError("Missing 'interactionRun' function");
            }
        }
    }

    static validateContext(context) {
        if (typeof context !== "object") {
            throw new TypeError("Context must be an object");
        }

        if (typeof context.Name !== "string" || context.Name !== context.Name.toLowerCase()) {
            throw new Error("Context name must be a lowercase string.");
        }

        if (typeof context.Description !== "string") {
            throw new TypeError("Context description must be a string.");
        }

        if (context.Type !== ApplicationCommandType.User && context.Type !== ApplicationCommandType.Message) {
            throw new TypeError("Context type must be a either User/Message.");
        }

        if (Object.prototype.hasOwnProperty.call(context, "Enabled") && typeof context.Enabled !== "boolean") {
            throw new TypeError("Context enabled must be a boolean value");
        }
             
        if (Object.prototype.hasOwnProperty.call(context, "Ephemeral") && typeof context.Ephemeral !== "boolean") {
            throw new TypeError("Context ephemeral must be a boolean value");
        }
    }
}