Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.listArray = function (interaction) {
    return this.length > 1 ? this.slice(0, -1).map((x) => `${x}`).join(", ") + ` ${interaction.translate("common:AND").toLowerCase()} ` + this.map((x) => `${x}`).slice(-1) : this.map((x) => `${x}`).join("");
};