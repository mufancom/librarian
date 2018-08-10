import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

import {Convention} from './convention.entity';

export interface IndexTree {
  title: string;
  path?: string;
  children?: IndexTree[];
}

export interface IndexJSON {
  [key: string]: string | IndexJSON;
}

@Injectable()
export class ConventionService {
  constructor(
    @InjectRepository(Convention)
    private conventionRepository: Repository<Convention>,
  ) {}

  async getConventions(): Promise<Convention[]> {
    return this.conventionRepository.find();
  }

  async create(convention: DeepPartial<Convention>): Promise<Convention> {
    return this.conventionRepository.create(convention);
  }

  async save(convention: Convention): Promise<Convention> {
    return this.conventionRepository.save(convention);
  }
}
