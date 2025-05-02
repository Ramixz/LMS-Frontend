export interface GenericPaginatedResponse<T> {
  data: T[];
  total_items: number;
  page: number;
  per_page: number;
}
