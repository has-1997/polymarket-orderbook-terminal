"use client";

type Outcome = "YES" | "NO";

type OutcomeSelectorProps = {
  selectedOutcome: Outcome;
  onChange: (outcome: Outcome) => void;
  yesTokenId?: string;
  noTokenId?: string;
};

export function OutcomeSelector({
  selectedOutcome,
  onChange,
  yesTokenId,
  noTokenId,
}: OutcomeSelectorProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Outcome</h2>
          <p className="mt-1 text-sm text-slate-400">
            Choose which outcome token to analyze.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:w-72">
          <button
            type="button"
            onClick={() => onChange("YES")}
            disabled={!yesTokenId}
            className={
              selectedOutcome === "YES"
                ? "rounded-2xl border border-emerald-300 bg-emerald-400/15 px-4 py-3 text-sm font-semibold text-emerald-100"
                : "rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-300/60"
            }
          >
            YES
          </button>

          <button
            type="button"
            onClick={() => onChange("NO")}
            disabled={!noTokenId}
            className={
              selectedOutcome === "NO"
                ? "rounded-2xl border border-rose-300 bg-rose-400/15 px-4 py-3 text-sm font-semibold text-rose-100"
                : "rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-rose-300/60"
            }
          >
            NO
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs text-slate-500">
        <p>Selected: {selectedOutcome}</p>
        <p className="mt-1 break-all">
          Token ID: {selectedOutcome === "YES" ? yesTokenId ?? "missing" : noTokenId ?? "missing"}
        </p>
      </div>
    </section>
  );
}
