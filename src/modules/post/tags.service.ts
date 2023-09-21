import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { IGetTags } from './post.type';

@Injectable()
export class TagsService {
  constructor(private data: IDataServices) {}

  cleanTagsQuery(data: IGetTags) {
    let key = {};

    if (data._id) key['_id'] = data._id;
    if (data.name) key['name'] = data.name;
    if (data.page) key['page'] = data.page;
    if (data.perpage) key['perpage'] = data.perpage;
    if (data.post) key['post'] = data.post;
    if (data.sort) key['sort'] = data.sort;

    return key;
  }

  async getTags(payload: IGetTags) {
    try {
      const filterQuery = this.cleanTagsQuery(payload);

      const { data, pagination } = await this.data.tags.findAllWithPagination(
        filterQuery,
      );

      return {
        message: 'Tags retrieved successfully',
        status: HttpStatus.OK,
        data,
        pagination,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }
}
