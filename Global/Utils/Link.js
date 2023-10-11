const axios = require("axios").default;
const sourcebin = require("sourcebin_js");

async function getResponse(url) {
  try {
    const res = await axios.get(url);
    return {
      success: true,
      status: res.status,
      data: res.data,
    };
  } catch (error) {
    if (error.response?.status !== 404) {
      console.log(`[AXIOS ERROR]\nURL: ${url}\n${error}\n`);
    }
    return {
      success: false,
      status: error.response?.status,
      data: error.response?.data,
    };
  }
}

async function downloadImage(url) {
  try {
    const res = await axios.get(url, {
      responseType: "stream",
    });
    return res.data;
  } catch (error) {
    console.log(`[AXIOS ERROR]\nURL: ${url}\n${error}\n`);
  }
}

async function postToBin(content, title) {
  try {
    const response = await sourcebin.create(
      [
        {
          name: " ",
          content,
          languageId: "text",
        },
      ],
      {
        title,
        description: " ",
      }
    );
    return {
      url: response.url,
      short: response.short,
      raw: `https://cdn.sourceb.in/bins/${response.key}/0`,
    };
  } catch (ex) {
    console.log(`postToBin`, ex);
  }
}

module.exports = {
  getResponse,
  downloadImage,
  postToBin,
};