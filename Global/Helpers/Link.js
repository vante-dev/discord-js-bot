const axios = require('axios').default;
const sourcebin = require('sourcebin_js');

async function getResponse(url) {
  try {
    const response = await axios.get(url);
    return {
      success: true,
      status: response.status,
      data: response.data || null,
    };
  } catch (error) {
    if (error.response?.status !== 404) {
      logAxiosError(url, error);
    }
    return {
      success: false,
      status: error.response?.status,
      data: error.response?.data || null,
    };
  }
}

async function downloadImage(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'stream',
    });
    return response.data;
  } catch (error) {
    logAxiosError(url, error);
  }
}

async function postToBin(content, title) {
  try {
    const response = await sourcebin.create(
      [
        {
          name: ' ',
          content,
          languageId: 'text',
        },
      ],
      {
        title,
        description: ' ',
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

function logAxiosError(url, error) {
  console.log(`[AXIOS ERROR]\nURL: ${url}\n${error}\n`);
}

module.exports = {
  getResponse,
  downloadImage,
  postToBin,
};
