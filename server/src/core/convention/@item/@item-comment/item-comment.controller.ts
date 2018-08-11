import {Controller, Get} from '@nestjs/common';

import {ItemCommentService} from './item-comment.service';

@Controller('convention/item/comment')
export class ItemCommentController {
  constructor(private itemCommentService: ItemCommentService) {}

  @Get('index')
  async index() {
    return 'hello';
  }
}
