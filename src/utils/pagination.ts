export interface PaginationParams {
  page?: string | number;
  limit?: string | number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

export const getPagination = ({
  page = 1,
  limit = 10,
}: PaginationParams): PaginationResult => {
  const parsedPage = Math.max(parseInt(page as string, 10) || 1, 1);
  const parsedLimit = Math.max(parseInt(limit as string, 10) || 10, 1);
  const offset = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    offset,
  };
};
