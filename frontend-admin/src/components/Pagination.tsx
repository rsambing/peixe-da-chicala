import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}

export function Pagination({ page, total, pageSize, onChange }: Props) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between gap-4 px-1 py-2">
      <p className="text-xs text-gray-400">
        {from}–{to} de {total}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none text-gray-500 transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | "…")[]>((acc, p, i, arr) => {
            if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="px-1 text-xs text-gray-300">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onChange(p as number)}
                className={[
                  "min-w-[28px] h-7 rounded-lg text-xs font-semibold transition-colors",
                  p === page
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500",
                ].join(" ")}
              >
                {p}
              </button>
            )
          )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none text-gray-500 transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
