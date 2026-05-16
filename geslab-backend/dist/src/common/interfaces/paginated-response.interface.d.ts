export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare function buildPaginatedResponse<T>(data: T[], total: number, page: number, limit: number): PaginatedResponse<T>;
