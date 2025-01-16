import { useFetch } from "@/hooks/use-fetch";
import { renderHook, act } from "@testing-library/react";

jest.mock("@/lib/utils", () => ({
  handleError: jest.fn().mockImplementation((response) => {
    throw new Error(`Error: ${response.status}`);
  }),
}));

describe("useFetch hook", () => {
  const mockUrl = "https://api.example.com/data";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch data successfully", async () => {
    const mockData = { message: "Success" };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
        headers: new Headers({ "Content-Type": "application/json" }),
        status: 200,
        statusText: "OK",
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useFetch<typeof mockData>(mockUrl));

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(result.current.originalRequest).toEqual({
      headers: expect.any(Headers),
      status: 200,
      statusText: "OK",
    });
  });

  it("should handle fetch error", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Not Found" }),
        headers: new Headers({ "Content-Type": "application/json" }),
        status: 404,
        statusText: "Not Found",
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useFetch(mockUrl));

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Error: 404");
    expect(result.current.originalRequest).toEqual(null);
  });

  it("should abort fetch request", async () => {
    const abortError = new DOMException("Aborted", "AbortError");

    global.fetch = jest.fn(
      () =>
        new Promise((_, reject) => {
          setTimeout(() => reject(abortError), 100);
        })
    ) as jest.Mock;

    const { result, unmount } = renderHook(() => useFetch(mockUrl));

    unmount();

    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
  });
});
