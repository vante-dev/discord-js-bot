const { GuildMember, User } = require("discord.js");
const axios = require("axios")

module.exports = Object.defineProperties(GuildMember.prototype, {
    /**
     * Fetches a user's banner image URL based on provided options.
     *
     * @param {string} userId - The ID of the Discord user.
     * @param {Object} options - Options for banner retrieval.
     * @param {string} options.format - The desired image format.
     * @param {number|string} options.size - The desired image size.
     * @param {boolean} options.dynamic - Whether to dynamically adjust format for GIFs.
     * @returns {Promise<string|null>} A promise resolving to the banner image URL, or null if not found.
     * @throws {SyntaxError} When invalid options are provided.
     * @throws {Error} When an unexpected error occurs.
     */
    bannerURL: {
        value: async function ({ format = "png", size = 1024, dynamic } = {}) {
            if (format && !["png", "jpeg", "webp", "gif"].includes(format)) throw new SyntaxError("Please specify an available format.");
            if (size && ![512, 1024, 2048, 4096].includes(parseInt(size) || isNaN(parseInt(size)))) throw new SyntaxError("Please specify an avaible size.");
            if (dynamic && typeof dynamic !== "boolean") throw new SyntaxError("Dynamic option must be Boolean.")

            const response = await axios.get(`https://discord.com/api/v10/users/${this.id}`, { headers: { 'Authorization': `Bot ${client.token}` } });
            if (!response.data.banner) return `${response.data.banner_color !== null ? `https://singlecolorimage.com/get//${response.data.banner_color.replace("#", "")}/512x254` : `https://vante.dev/img/512x254.png`}`
            if (format == "gif" || dynamic == true && response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif${parseInt(size) ? `?size=${parseInt(size)}` : ''}`
            else return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.${format}${parseInt(size) ? `?size=${parseInt(size)}` : ''}`
        }
    },
});


module.exports = Object.defineProperties(User.prototype, {
    /**
     * Fetches a user's banner image URL based on provided options.
     *
     * @param {string} userId - The ID of the Discord user.
     * @param {Object} options - Options for banner retrieval.
     * @param {string} options.format - The desired image format.
     * @param {number|string} options.size - The desired image size.
     * @param {boolean} options.dynamic - Whether to dynamically adjust format for GIFs.
     * @returns {Promise<string|null>} A promise resolving to the banner image URL, or null if not found.
     * @throws {SyntaxError} When invalid options are provided.
     * @throws {Error} When an unexpected error occurs.
     */
    bannerURL: {
        value: async function ({ format = "png", size = 1024, dynamic } = {}) {
            if (format && !["png", "jpeg", "webp", "gif"].includes(format)) throw new SyntaxError("Please specify an available format.");
            if (size && ![512, 1024, 2048, 4096].includes(parseInt(size) || isNaN(parseInt(size)))) throw new SyntaxError("Please specify an avaible size.");
            if (dynamic && typeof dynamic !== "boolean") throw new SyntaxError("Dynamic option must be Boolean.")

            const response = await axios.get(`https://discord.com/api/v10/users/${this.id}`, { headers: { 'Authorization': `Bot ${client.token}` } });
            if (!response.data.banner) return `${response.data.banner_color !== null ? `https://singlecolorimage.com/get//${response.data.banner_color.replace("#", "")}/512x254` : `https://vante.dev/img/512x254.png`}`
            if (format == "gif" || dynamic == true && response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif${parseInt(size) ? `?size=${parseInt(size)}` : ''}`
            else return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.${format}${parseInt(size) ? `?size=${parseInt(size)}` : ''}`
        }
    },
});