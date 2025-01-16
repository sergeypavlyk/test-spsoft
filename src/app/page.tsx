import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] flex flex-col gap-4">
          <h1>
            Test Tasks <b>SPSoft</b>
          </h1>
          <h2>The project includes the following implemented features:</h2>
          <h3>Custom Hooks:</h3>
          <li className="mb-2">
            <b>use-fetch:</b> A custom hook for handling fetch operations.
          </li>
          <li>
            <b>use-paginated-fetch:</b> A custom hook for managing paginated
            data fetching.
          </li>
          <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
            Both hooks can be found in the src/hooks directory.
          </code>
          <h3>Reusable Dropdown Select Component:</h3>
          <li>
            <b>custom, reusable dropdown select</b> component is available in
            the{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/components/ui directory.
            </code>
          </li>
        </ol>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p className="text-xs text-gray-500">
          Thank you for visiting! If you have any questions, feel free to reach
          out.
        </p>
      </footer>
    </div>
  );
}
