import {Injectable, MiddlewareFunction, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import {I18nResolver} from 'i18n-ts';

import {Translation, i18n} from 'utils/lang';

declare global {
  namespace Express {
    interface Request {
      lang: Translation;
    }
  }
}

function getAcceptableLang(langs: string[]) {
  for (let lang of langs) {
    lang = lang.replace(/-(\w)/g, (_all, letter) => letter.toUpperCase());
    if (i18n.hasOwnProperty(lang)) {
      return lang;
    }
  }
  return 'default';
}

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  resolve(...args: any[]): MiddlewareFunction {
    return (req: Request, _res: Response, next: any) => {
      const lang = getAcceptableLang(req.acceptsLanguages());
      req.lang = new I18nResolver(i18n, lang).translation;
      next();
    };
  }
}
