import {Module} from '@nestjs/common';

import {CoreUserModule} from '../user';

import {NotificationService} from './notification.service';

@Module({
  imports: [CoreUserModule],
  controllers: [],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class CoreNotificationModule {}
