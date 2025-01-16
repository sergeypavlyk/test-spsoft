import { useCallback, useEffect, useState } from "react";

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  originalRequest: {
    headers: Headers | null;
    status: number | null;
    statusText: string | null;
  } | null;
}

export function useFetch<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
    originalRequest: null,
  });

  const fetchData = useCallback(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setState({
      data: null,
      isLoading: true,
      error: null,
      originalRequest: null,
    });

    const fetchWithAbort = async () => {
      try {
        const response = await fetch(url, { ...options, signal });

        const originalRequest = {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
        };

        let errorMessage = null;

        if (!response.ok) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || `HTTP error! Status: ${response.status}`;
          } catch {
            errorMessage = `HTTP error! Status: ${response.status}`;
          }
          throw new Error(errorMessage);
        }

        const contentType = response.headers.get("Content-Type");
        const data = contentType?.includes("application/json")
          ? ((await response.json()) as T)
          : (null as T);

        setState({
          data,
          isLoading: false,
          error: null,
          originalRequest,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setState({
            data: null,
            isLoading: false,
            error: err.message,
            originalRequest: null,
          });
        }
      }
    };

    fetchWithAbort();

    return () => {
      controller.abort();
    };
  }, [url, options]);

  useEffect(() => {
    const abortFetch = fetchData();

    return () => {
      abortFetch();
    };
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}
