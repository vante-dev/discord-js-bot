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
            if (this.length === 0) {
                return '';
            } else if (this.length === 1) {
                return String(this[0]);
            } else if (this.length === 2) {
                return `${this[0]} and ${this[1]}`;
            } else {
                const lastIndex = this.length - 1;
                const firstPart = this.slice(0, lastIndex).join(', ');
                const lastPart = this[lastIndex];
                return `${firstPart}, and ${lastPart}`;
            }
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