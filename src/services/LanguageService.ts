import LanguageIdentification from '@react-native-ml-kit/identify-languages';

import { logError } from '@/services/LoggerService';

type SpeechConfig = {
  language: 'ru-RU' | 'uk-UA';
  voice: string;
};

const UKRAINIAN_CONFIG: SpeechConfig = {
  language: 'uk-UA',
  voice: 'uk-ua-x-hfd-local',
};

const RUSSIAN_CONFIG: SpeechConfig = {
  language: 'ru-RU',
  voice: 'ru-ru-x-ruf-local',
};

const UKRAINIAN_LETTERS_REGEX = /[іїєґ]/i;
const RUSSIAN_LETTERS_REGEX = /[ыэъё]/i;

const getSpeechConfigByText = async (text: string): Promise<SpeechConfig> => {
  const hasUkrainianLetters = UKRAINIAN_LETTERS_REGEX.test(text);
  const hasRussianLetters = RUSSIAN_LETTERS_REGEX.test(text);

  if (hasUkrainianLetters && !hasRussianLetters) {
    return UKRAINIAN_CONFIG;
  }

  if (hasRussianLetters && !hasUkrainianLetters) {
    return RUSSIAN_CONFIG;
  }

  try {
    const possibleLanguages =
      await LanguageIdentification.identifyPossible(text);

    const targetLanguage = possibleLanguages.find(
      (item) =>
        item.language.startsWith('ru') || item.language.startsWith('uk'),
    );

    if (targetLanguage?.language.startsWith('ru')) {
      return RUSSIAN_CONFIG;
    }

    if (targetLanguage?.language.startsWith('uk')) {
      return UKRAINIAN_CONFIG;
    }
  } catch (error) {
    void logError('getSpeechConfigByText', error);
  }

  return UKRAINIAN_CONFIG;
};

export { getSpeechConfigByText };
