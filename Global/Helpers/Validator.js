/**
 * Validate a command module.
 * @param {Object} module - The command module to validate.
 * @returns {boolean} Returns true if the module is valid, otherwise false.
 */
function validateCommand(module) {
    if (!module || typeof module !== 'object') {
        throw new Error('Module must be an object.');
    }

    if (!module.Name || typeof module.Name !== 'string' || module.Name.trim() === '') {
        throw new Error('Name is required and must be a non-empty string.');
    }

    if (module.Aliases && !Array.isArray(module.Aliases)) {
        throw new Error('Aliases must be an array if specified.');
    }

    if (module.Description && typeof module.Description !== 'string') {
        throw new Error('Description must be a string if specified.');
    }

    if (module.Usage && typeof module.Usage !== 'string') {
        throw new Error('Usage must be a string if specified.');
    }

    if (module.Category && typeof module.Category !== 'string') {
        throw new Error('Category must be a string if specified.');
    }

    if (typeof module.Cooldown !== 'number') {
        throw new Error('Cooldown must be a number.');
    }

    if (!module.Permissions || typeof module.Permissions !== 'object') {
        throw new Error('Permissions must be an object.');
    }

    if (!module.Command || typeof module.Command !== 'object') {
        throw new Error('Command must be an object.');
    }

    if (typeof module.onLoad !== 'function') {
        throw new Error('onLoad must be a function.');
    }

    if (typeof module.messageRun !== 'function') {
        throw new Error('messageRun must be a function.');
    }

    if (typeof module.interactionRun !== 'function') {
        throw new Error('interactionRun must be a function.');
    }
    
    return true
}


/**
 * Validate a context command module.
 * @param {Object} module - The context ommand module to validate.
 * @returns {boolean} Returns true if the module is valid, otherwise false.
 */
function validateContext(module) {
    const schema = {
        Name: 'string',
        Description: 'string',
        Type: 'number',
        Cooldown: 'number',
        Enabled: 'boolean',
        Ephemeral: 'boolean',
        Permissions: 'object',
        run: 'function',
    };

    for (const key in schema) {
        if (!module.hasOwnProperty(key) || typeof module[key] !== schema[key]) {
            console.log(typeof module[key])
            console.log(schema[key])
            return false;
        }
    }

    return true;
};

module.exports = {
    validateCommand,
    validateContext
}
