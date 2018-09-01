import * as FS from 'fs';
import * as Path from 'path';

import Dot from 'dot';
import Nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import {ASSETS_DIR} from '../paths';

import {Config} from './config';
import {DiffGroup} from './diff';

const MAIL_TEMPLATE_PATH = Path.join(ASSETS_DIR, 'mail-templates');

const TEMPLATE_SUFFIX = '.html';

const defaultSendMailOptions = {
  from: Config.mail.get('from'),
};

let transport = Nodemailer.createTransport(Config.mail.get());

export function sendMail(options: Mail.Options) {
  options = {...defaultSendMailOptions, ...options};

  return new Promise<any>((resolve, reject) => {
    transport.sendMail(options, (error, info) => {
      if (error) {
        reject(error);
      }

      resolve(info);
    });
  });
}

export interface RegisterInvitationMailTemplate {
  type: 'register-invitation';
  parameters: {
    inviter: string;
    link: string;
    expiredAt: string;
  };
}

export interface ConventionChangeMailTemplate {
  type: 'convention-change-notification';
  parameters: {
    diffGroups: DiffGroup[];
    link: string;
    convention: string;
    item: string;
  };
}

export interface ConventionCreateMailTemplate {
  type: 'convention-create-notification';
  parameters: {
    link: string;
    convention: string;
    item: string;
    highlightedContent: string;
  };
}

export type MailTemplate =
  | RegisterInvitationMailTemplate
  | ConventionChangeMailTemplate
  | ConventionCreateMailTemplate;

interface MailTemplateCacheDict {
  [key: string]: Dot.RenderFunction;
}

class MailTemplateService {
  private cache: MailTemplateCacheDict;

  constructor() {
    this.cache = {};
  }

  async get(filename: string): Promise<Dot.RenderFunction | undefined> {
    if (filename in this.cache) {
      return this.cache[filename];
    }

    let file = await this.read(filename);

    if (!file) {
      return undefined;
    }

    let renderFunc = Dot.compile(file);

    this.cache[filename] = renderFunc;
    return renderFunc;
  }

  private async read(filename: string): Promise<string | undefined> {
    let filePath = Path.join(MAIL_TEMPLATE_PATH, filename);

    return new Promise<string | undefined>((resolve, reject) => {
      FS.readFile(filePath, (error, data) => {
        if (error) {
          reject(error);
        }

        resolve(data.toLocaleString());
      });
    });
  }
}

const mailTemplateService = new MailTemplateService();

export async function renderMailTemplate<
  T extends MailTemplate,
  K extends T['type'],
  P extends T['parameters']
>(type: K, parameters: P): Promise<string> {
  let template = await mailTemplateService.get(type + TEMPLATE_SUFFIX);

  let variables = {
    global: Config.mail.get('global'),
    ...(parameters as object),
  };

  if (template) {
    return template(variables);
  }

  throw new Error('Template not found');
}
