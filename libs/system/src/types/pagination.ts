export class PaginationParams<T> {
  keyword?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  data?: Omit<T, 'page' | 'pageSize' | 'sortBy' | 'sortOrder' | 'keyword'>;

  static orderBy(options: { sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
    const { sortBy, sortOrder } = options;
    const result = sortBy
      ? {
          [sortBy]: sortOrder || 'asc',
        }
      : undefined;
    return result;
  }

  static skip(page: number, pageSize: number) {
    return (page - 1) * pageSize;
  }

  static pagination(options: {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page, pageSize, sortBy, sortOrder } = options;

    return {
      skip: PaginationParams.skip(page, pageSize),
      take: pageSize,
      orderBy: PaginationParams.orderBy({ sortBy, sortOrder }),
    };
  }
}

export class PaginationResult<T> {
  items: T[];
  total: number;

  static from<T>(items: T[], total: number) {
    return {
      items,
      total,
    };
  }
}
