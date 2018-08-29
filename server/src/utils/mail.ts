import * as FS from 'fs';
import * as Path from 'path';

import nodemailer, {getTestMessageUrl} from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import {ASSETS_DIR} from 'paths';

import {Config} from './config';

const MAIL_TAMPLATE_PATH = Path.join(ASSETS_DIR, 'mail-templates');

const TEMPLATE_SUFFIX = '.tpl';

const defaultSendMailOptions = {
  from: Config.mail.get('from'),
};

let transport = nodemailer.createTransport(Config.mail.get());

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

export type MailTemplate = RegisterInvitationMailTemplate;

interface MailTemplateCacheDict {
  [key: string]: string;
}

class MailTemplateService {
  private cache: MailTemplateCacheDict;

  constructor() {
    this.cache = {};
  }

  async get(filename: string): Promise<string | undefined> {
    if (filename in this.cache) {
      return this.cache[filename];
    }

    let file = await this.read(filename);

    if (!file) {
      return undefined;
    }

    this.cache[filename] = file;
    return file;
  }

  private async read(filename: string): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve, reject) => {
      let filepath = Path.join(MAIL_TAMPLATE_PATH, filename);
      FS.readFile(filepath, (error, data) => {
        if (error) {
          reject(error);
        }

        resolve(data.toLocaleString());
      });
    });
  }
}

const mailTemplateService = new MailTemplateService();

function renderTemplate(
  template: string,
  _parameters: {[key: string]: string},
): string {
  return template;
}

export async function getMailTemplate<
  T extends MailTemplate,
  K extends T['type'],
  P extends T['parameters']
>(type: K, parameters: P): Promise<string> {
  let template = await mailTemplateService.get(type + TEMPLATE_SUFFIX);

  if (template) {
    return renderTemplate(template, parameters);
  }

  throw new Error('Template not found');
}
