import { useState } from "react";
import { useFetch } from "./use-fetch";

interface FetchParams {
  page: number;
  pageSize: number;
  filters?: Record<string, string | number>;
  sort?: { field: string; order: "asc" | "desc" };
}

interface PaginatedFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  params: FetchParams;
}

export function usePaginatedFetch<T>(
  url: string,
  initialParams: FetchParams
): PaginatedFetchState<T> & {
  setPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setFilters: (filters: Record<string, string | number>) => void;
  setSort: (field: string, order: "asc" | "desc") => void;
  refetch: () => void;
} {
  const [params, setParams] = useState<FetchParams>(initialParams);

  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
    ...(params.filters || {}),
    ...(params.sort
      ? { sortField: params.sort.field, sortOrder: params.sort.order }
      : {}),
  });

  const { data, isLoading, error, refetch } = useFetch<{
    data: T;
    total: number;
  }>(`${url}?${queryParams.toString()}`);

  const total = data?.total || 0;

  const setPage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const nextPage = () => {
    setParams((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const previousPage = () => {
    setParams((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  };

  const setFilters = (filters: Record<string, string | number>) => {
    setParams((prev) => ({ ...prev, filters, page: 1 }));
  };

  const setSort = (field: string, order: "asc" | "desc") => {
    setParams((prev) => ({ ...prev, sort: { field, order } }));
  };

  return {
    data: data?.data || null,
    isLoading,
    error,
    total,
    params,
    setPage,
    nextPage,
    previousPage,
    setFilters,
    setSort,
    refetch,
  };
}
