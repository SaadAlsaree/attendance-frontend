export interface IResponse<T> {
    isSuccess: boolean;
    message: string;
    data: T | null;
}

export interface IResponseList<T> {
    isSuccess: boolean;
    message: string;
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
    isSuccess: boolean;
    message: string;
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data: T | null;
} 