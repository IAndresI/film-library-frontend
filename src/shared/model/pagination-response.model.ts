export interface IPagination {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginationResponse<T> {
  data: T[];
  pagination: IPagination;
}
