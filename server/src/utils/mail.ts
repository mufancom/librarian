import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import {Config} from './config';

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
