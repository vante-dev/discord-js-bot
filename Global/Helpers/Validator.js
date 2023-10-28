const Debugger = false;

class Validator {
  static Command(commandData, { Logger }) {
    if (!commandData || typeof commandData !== 'object') {
      if (Debugger) Logger.error(`@${commandData?.Name ?? 'unknown'} Command data must be an object.`);
      return false;
    }

    if (typeof commandData.Name !== 'string' || commandData.Name.trim() === '') {
      if (Debugger) Logger.error(`@${commandData?.Name ?? 'unknown'} Command name must be a non-empty string.`);
      return false;
    }

    if (!Array.isArray(commandData.Aliases) || !commandData.Aliases.every(alias => typeof alias === 'string')) {
      if (Debugger) Logger.error(`@${commandData?.Name ?? 'unknown'} Aliases must be an array of strings.`);
      return false;
    }

    if (typeof commandData.Description !== 'string') {
      if (Debugger) Logger.error(`@${commandData?.Name ?? 'unknown'} Description must be a string.`);
      return false;
    }

    if (typeof commandData.Usage !== 'string') {
      if (Debugger) Logger.error(`@${commandData?.Name ?? 'unknown'} Usage must be a string.`);
      return false;
    }

    if (typeof commandData.Cooldown !== 'number') {
      if (Debugger) Logger.error(`@${commandData?.Name ?? 'unknown'} Cooldown must be a number.`);
      return false;
    }

    if (commandData.Command.Prefix && typeof commandData.messageRun !== 'function') {
      if (Debugger) Logger.error(`@${commandData?.Name ?? 'unknown'} messageRun must be a function.`);
      return false;
    }

    if (commandData.Command.Slash && typeof commandData.interactionRun !== 'function') {
      if (Debugger) Logger.error(`@${commandData?.Name ?? 'unknown'} interactionRun must be a function.`);
      return false;
    }

    return true;
  }

  static Context(contextData, { Logger }) {
    if (!contextData || typeof contextData !== 'object') {
      if (Debugger) Logger.error(`Context-Menu @${contextData?.Name ?? 'unknown'} data must be an object.`);
      return false;
    }

    if (typeof contextData.Name !== 'string') {
      if (Debugger) Logger.error(`Context-Menu @${contextData?.Name ?? 'unknown'} Name must be a string.`);
      return false;
    }

    if (typeof contextData.Description !== 'string') {
      if (Debugger) Logger.error(`Context-Menu @${contextData?.Name ?? 'unknown'} Description must be a string.`);
      return false;
    }

    if (typeof contextData.Type !== 'number') {
      if (Debugger) Logger.error(`Context-Menu @${contextData?.Name ?? 'unknown'} Type must be a number.`);
      return false;
    }

    if (typeof contextData.Cooldown !== 'number') {
      if (Debugger) Logger.error(`Context-Menu @${contextData?.Name ?? 'unknown'} Cooldown must be a number.`);
      return false;
    }

    if (contextData.Enabled && typeof contextData.interactionRun !== 'function') {
      if (Debugger) Logger.error(`Context-Menu @${contextData?.Name ?? 'unknown'} interactionRun must be a function.`);
      return false;
    }

    return true;
  }
}

module.exports = Validator;
