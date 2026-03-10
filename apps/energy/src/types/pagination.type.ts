interface Pagination {
  total_rows: number;
  total_pages: number;
  limit: number;
  page: number;
  sort: Record<string, never>;
}

export { type Pagination };
