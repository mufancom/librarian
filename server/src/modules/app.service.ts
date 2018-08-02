import {Injectable} from '@nestjs/common';

@Injectable()
export class AppService {
  async hello(): Promise<string> {
    return 'hello';
  }
}
