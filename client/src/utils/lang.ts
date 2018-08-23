import {I18nResolver} from 'i18n-ts';
import * as languages from 'shared/languages';
import {Translation} from 'shared/translation';

const DEFAULT_LANG = languages.en;

export const i18nLanguages = {
  default: DEFAULT_LANG,
  ...languages,
};

function getAcceptableLang(langs: ReadonlyArray<string>): string {
  for (let lang of langs) {
    lang = lang.replace(/-(\w)/g, (_all, letter) => letter.toUpperCase());

    if (i18nLanguages.hasOwnProperty(lang)) {
      return lang;
    }
  }

  return 'default';
}

export const CURRENT_LANG = getAcceptableLang(navigator.languages);

export const i18n: Translation = new I18nResolver(i18nLanguages, CURRENT_LANG)
  .translation;
