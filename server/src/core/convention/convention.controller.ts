import {All, Controller, Get} from '@nestjs/common';

import {ConventionService} from './convention.service';

@Controller('convention')
export class ConventionController {
  constructor(private conventionService: ConventionService) {}

  @Get('index')
  async index() {
    return this.conventionService.getIndex();
  }

  @All('sync')
  async sync() {
    await this.conventionService.pull();
  }
}
