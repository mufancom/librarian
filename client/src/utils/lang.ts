import {I18nResolver} from 'i18n-ts';
import * as languages from 'languages';

const DEFAULT_LANG = languages.en;

type TranslationMethod = (...args: any[]) => string;

export type Translation = typeof DEFAULT_LANG & {
  [key: string]: string | TranslationMethod;
};

export const i18n = {
  default: DEFAULT_LANG,
  ...languages,
};

function getAcceptableLang(langs: ReadonlyArray<string>) {
  for (let lang of langs) {
    lang = lang.replace(/-(\w)/g, (_all, letter) => letter.toUpperCase());
    if (i18n.hasOwnProperty(lang)) {
      return lang;
    }
  }
  return 'default';
}

export const CURRENT_LANG = getAcceptableLang(navigator.languages);

export const translation = new I18nResolver<Translation>(i18n, CURRENT_LANG)
  .translation;
