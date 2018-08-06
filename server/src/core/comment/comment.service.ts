import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '../../../../node_modules/@nestjs/typeorm';
import {ConventionService} from '../convention';
import {Comment} from './comment.entity';

const COMMENT_PAGE_SIZE = 10;

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async listComment(filePath: string, page: number) {
    return this.commentRepository
      .createQueryBuilder()
      .where('file_path = :filePath', {filePath})
      .skip((page - 1) * COMMENT_PAGE_SIZE)
      .take(COMMENT_PAGE_SIZE)
      .getMany();
  }

  async saveComment(comment: Comment) {
    await this.commentRepository.save(comment);
  }
}
