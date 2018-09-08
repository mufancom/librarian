import * as URL from 'url';

import {Inject, Injectable} from '@nestjs/common';

import {Config} from '../../utils/config';
import {diffMarkdown} from '../../utils/diff';
import {highlight} from '../../utils/highlight';
import {renderMailTemplate, sendMail} from '../../utils/mail';
import {getMarkdownTitle} from '../../utils/regex';
import {Convention, Item} from '../convention';
import {UserService} from '../user';

interface ConventionItemMailTimerDict {
  [key: number]: NodeJS.Timer | undefined;
}

interface ConventionItemLastMailSentChangeDict {
  [key: number]: string;
}

@Injectable()
export class NotificationService {
  private mailChangesNotifyTimers: ConventionItemMailTimerDict = {};

  private mailSentChangedContentDict: ConventionItemLastMailSentChangeDict = {};

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
    let clientURL = Config.server.get('clientURL', 'http://localhost:3002');

    let {id: conventionId} = convention;

    let link = URL.resolve(
      clientURL,
      `convention/${conventionId}/-/-/-/#convention-item-${newItem.id}`,
    );

    let itemTitle = getMarkdownTitle(newItem.content, `#${newItem.id}`);

    let mailConfig = Config.notification.get('email');

    if (mailConfig && mailConfig.enable) {
      let send = async (): Promise<void> => {
        let oldItemContent = oldItem.content;

        let {id} = newItem;

        if (id in this.mailSentChangedContentDict) {
          oldItemContent = this.mailSentChangedContentDict[id];
        }

        let diffGroups = diffMarkdown(oldItemContent, newItem.content);

        let html = await renderMailTemplate('convention-change-notification', {
          diffGroups,
          link,
          convention: convention.title,
          item: itemTitle,
        });

        let subject = `${
          convention.title
        } 下 ${itemTitle} 条目内容变动，请留意！`;

        await this.sendMailToAllUsers({
          subject,
          html,
        });

        this.mailSentChangedContentDict[id] = newItem.content;
      };

      if (mailConfig.delay) {
        let {id} = newItem;

        if (
          id in this.mailChangesNotifyTimers &&
          this.mailChangesNotifyTimers[id]
        ) {
          clearTimeout(this.mailChangesNotifyTimers[id]!);
        }

        this.mailChangesNotifyTimers[id] = setTimeout(async () => {
          this.mailChangesNotifyTimers[id] = undefined;

          await send();
        }, mailConfig.delay * 1000);
      } else {
        await send();
      }
    }
  }

  async notifyCreationOfNewConventionItem(
    convention: Convention,
    item: Item,
  ): Promise<void> {
    let clientURL = Config.server.get('clientURL', 'http://localhost:3002');

    let link = URL.resolve(
      clientURL,
      `convention/${convention.id}/-/-/-/#convention-item-${item.id}`,
    );

    let itemTitle = getMarkdownTitle(item.content, `#${item.id}`);

    let html = await renderMailTemplate('convention-create-notification', {
      link,
      convention: convention.title,
      item: itemTitle,
      highlightedContent: highlight(item.content),
    });

    let subject = `${convention.title} 新增条目：${itemTitle} ，请留意！`;

    if (Config.notification.get('email')) {
      await this.sendMailToAllUsers({
        subject,
        html,
      });
    }
  }
}
