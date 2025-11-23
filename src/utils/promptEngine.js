import prompts from '../config/prompts.json';

export const getPromptConfig = (type) => {
    return prompts[type];
};

export const constructPrompt = (type, text, additionalParams = {}) => {
    const config = prompts[type];
    if (!config) {
        throw new Error(`Prompt type '${type}' not found in configuration.`);
    }

    let prompt = config.user;

    // Replace standard placeholders
    prompt = prompt.replace('{TEXT}', text);

    // Replace additional params
    Object.keys(additionalParams).forEach(key => {
        prompt = prompt.replace(`{${key}}`, additionalParams[key]);
    });

    return {
        system: config.system,
        user: prompt,
        temperature: config.temperature,
        max_tokens: config.max_tokens
    };
};

export const getUiLabels = () => {
    return prompts.ui_text_labels;
};
