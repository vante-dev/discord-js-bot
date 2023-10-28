module.exports = Object.defineProperties(Array.prototype, {
    last: {
        value: function () {
            return this[this.length - 1];
        }
    },

    listArray: {
        value: function () {
            if (this.length === 0) {
                return '';
            } else if (this.length === 1) {
                return String(this[0]);
            } else if (this.length === 2) {
                return `${this[0]} ve ${this[1]}`;
            } else {
                const lastIndex = this.length - 1;
                const firstPart = this.slice(0, lastIndex).join(', ');
                const lastPart = this[lastIndex];
                return `${firstPart}, ve ${lastPart}`;
            }
        }
    },

    random: {
        value: function() {
            return this[Math.floor(Math.random() * this.length)];
        }
    }
});