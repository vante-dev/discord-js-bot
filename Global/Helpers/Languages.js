const translate = require('node-google-translate-skidz');

module.exports.run = async (client, text, run = false) => {
    const supportedLanguages = [
        'id', 'da', 'de', 'en-GB', 'en-US', 'es-ES', 'fr', 'hr',
        'it', 'lt', 'hu', 'nl', 'no', 'pl', 'pt-BR', 'ro',
        'fi', 'sv-SE', 'vi', 'tr', 'cs', 'el', 'bg', 'ru',
        'uk', 'hi', 'th', 'zh-CN', 'ja', 'zh-TW', 'ko'
    ];

    async function translateText(text, targetLanguages) {
        const translations = {};

        for (const lang of targetLanguages) {
            try {
                const translationResult = await translate({ text: text, source: client.Vante.Language, target: lang });
                translations[lang] = run ? translationResult.translation.charAt(0).toUpperCase() + translationResult.translation.slice(1) : translationResult.translation.replace(/\s/g, '-').toLowerCase();
            } catch (error) {
                client.logger.error(`Error translating to ${lang}: ${error}`);
                translations[lang] = text;
            }
        }

        return translations;
    }

    const translatedTexts = await translateText(text, supportedLanguages);

    const formattedTranslations = {};
    for (const lang in translatedTexts) {
        formattedTranslations[lang] = translatedTexts[lang];
    }
    
    return formattedTranslations;
};
