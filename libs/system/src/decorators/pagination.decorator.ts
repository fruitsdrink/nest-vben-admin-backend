import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let { keyword, page, pageSize, sortBy, sortOrder } = request.query;

    page = page ? parseInt(page as string) : 1;
    pageSize = pageSize ? parseInt(pageSize as string) : 20;
    keyword = keyword ? (keyword as string).trim() : '';
    sortBy = sortBy ? (sortBy as string).trim() : 'id';
    sortOrder = sortOrder ? (sortOrder as string).trim() : 'asc';
    sortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    return {
      ...request.query,
      keyword,
      page,
      pageSize,
      sortBy,
      sortOrder,
    };
  },
);
