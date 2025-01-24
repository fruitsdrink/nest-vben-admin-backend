import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { keyword, page, pageSize, sortBy, sortOrder, ...rest } =
      request.query;

    const _page = page ? parseInt(page as string) : 1;
    const _pageSize = pageSize ? parseInt(pageSize as string) : 20;
    const _keyword = keyword ? (keyword as string).trim() : '';
    const _sortBy = sortBy ? (sortBy as string).trim() : 'id';
    let _sortOrder = sortOrder ? (sortOrder as string).trim() : 'asc';
    _sortOrder = _sortOrder === 'desc' ? 'desc' : 'asc';

    return {
      data: rest,
      keyword: _keyword,
      page: _page,
      pageSize: _pageSize,
      sortBy: _sortBy,
      sortOrder: _sortOrder,
    };
  },
);
