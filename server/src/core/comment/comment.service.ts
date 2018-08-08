import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

import {Comment} from './comment.entity';

const COMMENT_PAGE_SIZE = 10;

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async listComments(filePath: string, page: number) {
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

  async createComment(commentLike: DeepPartial<Comment>) {
    await this.commentRepository.create(commentLike);
  }
}
