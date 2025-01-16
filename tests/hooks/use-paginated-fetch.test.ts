import { renderHook, act } from "@testing-library/react";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { useFetch } from "@/hooks/use-fetch";

jest.mock("@/hooks/use-fetch");

describe("usePaginatedFetch hook", () => {
  const mockUrl = "https://api.example.com/data";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch data successfully", async () => {
    const mockData = { data: [{ id: 1, name: "Item 1" }], total: 100 };

    (useFetch as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() =>
      usePaginatedFetch(mockUrl, { page: 1, pageSize: 10 })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockData.data);
    expect(result.current.total).toBe(mockData.total);
  });

  it("should set page correctly", () => {
    const { result } = renderHook(() =>
      usePaginatedFetch(mockUrl, { page: 1, pageSize: 10 })
    );

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.params.page).toBe(2);
  });

  it("should handle nextPage correctly", () => {
    const { result } = renderHook(() =>
      usePaginatedFetch(mockUrl, { page: 1, pageSize: 10 })
    );

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.params.page).toBe(2);
  });

  it("should handle previousPage correctly", () => {
    const { result } = renderHook(() =>
      usePaginatedFetch(mockUrl, { page: 2, pageSize: 10 })
    );

    act(() => {
      result.current.previousPage();
    });

    expect(result.current.params.page).toBe(1);
  });

  it("should set filters correctly", () => {
    const { result } = renderHook(() =>
      usePaginatedFetch(mockUrl, { page: 1, pageSize: 10 })
    );

    const newFilters = { name: "Item 1" };

    act(() => {
      result.current.setFilters(newFilters);
    });

    expect(result.current.params.filters).toEqual(newFilters);
    expect(result.current.params.page).toBe(1);
  });

  it("should set sort correctly", () => {
    const { result } = renderHook(() =>
      usePaginatedFetch(mockUrl, { page: 1, pageSize: 10 })
    );

    act(() => {
      result.current.setSort("name", "asc");
    });

    expect(result.current.params.sort).toEqual({ field: "name", order: "asc" });
  });

  it("should handle fetch error", async () => {
    const mockError = new Error("Fetch error");

    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError.message,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() =>
      usePaginatedFetch(mockUrl, { page: 1, pageSize: 10 })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(mockError.message);
  });

  it("should refetch data when refetch is called", async () => {
    const mockData = { data: [{ id: 1, name: "Item 1" }], total: 100 };

    (useFetch as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() =>
      usePaginatedFetch(mockUrl, { page: 1, pageSize: 10 })
    );

    act(() => {
      result.current.refetch();
    });

    expect(result.current.refetch).toHaveBeenCalled();
  });
});
