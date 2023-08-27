module.exports = Object.defineProperties(Array.prototype, {
    /**
    * Get the last element of the array.
    * @returns {*} The last element of the array.
    */
    last: {
        value: function () {
            return this[this.length - 1];
        }
    },

    /**
    * Joins an array of items using the Oxford comma format and appends "and" between the last two items.
    * @param {Array} array - The input array of items.
    * @returns {string} The joined string.
    */
    listArray: {
        value: function () {
            return list.format(this.map(x => String(x)));
        }
    },

    /**
    * Returns a random element from the array-like object.
    *
    * @method
    * @returns {*} A random element from the array-like object.
    * @this {Array} The array-like object from which to select a random element.
    */
    random: {
        value: function() {
            return this[Math.floor(Math.random() * this.length)];
        }
    }
});

module.exports = Object.defineProperties(String.prototype, {
    /**
    * Splits a string into smaller chunks of the specified size.
    *
    * @method
    * @param {number} size - The size of each chunk.
    * @returns {string[]} An array of string chunks.
    * @this {string} The original string to be split.
    */
    splitMessage: {
        value: function (size) {
            const xChunks = Math.ceil(this.length / size)
            const chunks = new Array(xChunks)
            for (let i = 0, c = 0; i < xChunks; ++i, c += size) {
                chunks[i] = this.substr(c, size)
            }
             
            return chunks
        }
    },
});