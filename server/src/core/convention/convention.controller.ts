import {Controller, Get} from '@nestjs/common';

import {ConventionService} from './convention.service';

@Controller('convention')
export class ConventionController {
  constructor(private readonly conventionService: ConventionService) {}

  @Get('index')
  async index() {
    return this.conventionService.getIndex();
  }
}
