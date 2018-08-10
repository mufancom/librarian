import {Controller} from '@nestjs/common';

import {ItemService} from './item.service';

@Controller('convention/item')
export class ItemController {
  constructor(private itemService: ItemService) {}
}
