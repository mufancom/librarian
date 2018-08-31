import * as URL from 'url';

import {Inject, Injectable} from '@nestjs/common';

import {Config} from 'utils/config';
import {diffMarkdown} from 'utils/diff';
import {renderMailTemplate, sendMail} from 'utils/mail';
import {getMarkdownTitle} from 'utils/regex';

import {Convention, Item} from '../convention';
import {UserService} from '../user';

@Injectable()
export class NotificationService {
  constructor(@Inject(UserService) private userService: UserService) {}

  async sendMailToAllUsers(mailContent: {
    subject: string;
    html: string;
  }): Promise<void> {
    let users = await this.userService.getAllUsers();

    let addresses: string[] = [];

    for (let user of users) {
      addresses.push(user.email);
    }

    await sendMail({to: addresses, ...mailContent});
  }

  async notifyChangesFromConvention(
    convention: Convention,
    oldItem: Item,
    newItem: Item,
  ): Promise<void> {
    let diffGroups = diffMarkdown(oldItem.content, newItem.content);

    let clientURL = Config.server.get('clientURL', 'http://localhost:3002');

    let link = URL.resolve(
      clientURL,
      `convention/${convention.id}/-/-/-#convention-item-${newItem.id}`,
    );

    let itemTitle = getMarkdownTitle(newItem.content, `#${newItem.id}`);

    let html = await renderMailTemplate('convention-change-notification', {
      diffGroups,
      link,
      convention: convention.title,
      item: itemTitle,
    });

    let subject = `${convention.title} - ${itemTitle} 条目内容变动，请留意！`;

    await this.sendMailToAllUsers({
      subject,
      html,
    });
  }
}
