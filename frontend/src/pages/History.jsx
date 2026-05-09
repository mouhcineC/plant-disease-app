import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteScan, fetchHistory } from "../api/axios";
import { formatDateTime, toPercent } from "../utils/formatters";
import TopNav from "../components/home/TopNav";

const backgroundImageUrl =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80";

const severityClasses = {
  low: "bg-emerald-100 text-emerald-700",
  moderate: "bg-amber-100 text-amber-700",
  high: "bg-rose-100 text-rose-700",
};

function History() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [expanded, setExpanded] = useState(() => new Set());
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchHistory();
      setItems(response?.data || []);
      setErrorMessage("");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404 || status === 204) {
        setItems([]);
        setErrorMessage("");
      } else {
        setErrorMessage(error?.response?.data?.message || "Unable to load history.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const toggleExpanded = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDelete = async () => {
    if (!confirmTarget?.id) {
      setErrorMessage("Unable to delete this scan. Please refresh and try again.");
      setConfirmTarget(null);
      return;
    }
    try {
      setIsDeleting(true);
      await deleteScan(confirmTarget.id);
      setItems((prev) => prev.filter((item) => item.id !== confirmTarget.id));
      setConfirmTarget(null);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Failed to delete scan.");
      setConfirmTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-emerald-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-emerald-950/80" aria-hidden="true" />

      <TopNav />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold text-white">Detection History</h1>
            <p className="mt-2 text-sm text-emerald-100/70">
              Review past AI scans with confidence metrics, severity, and recommended actions.
            </p>
          </div>
          <button
            type="button"
            onClick={loadHistory}
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/90 p-8 text-emerald-900 shadow-xl">
            Loading history...
          </div>
        ) : errorMessage ? (
          <div className="rounded-3xl border border-red-200/40 bg-red-500/10 p-6 text-red-100">
            {errorMessage}
          </div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                isExpanded={expanded.has(item.id)}
                onToggle={() => toggleExpanded(item.id)}
                onDelete={() => {
                  if (!item?.id) {
                    setErrorMessage("Unable to delete this scan. Please refresh and try again.");
                    return;
                  }
                  setConfirmTarget(item);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <ConfirmModal
        open={Boolean(confirmTarget)}
        isLoading={isDeleting}
        title="Delete this scan?"
        description="This action cannot be undone. The scan will be removed from your history."
        onCancel={() => setConfirmTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function HistoryCard({ item, isExpanded, onToggle, onDelete }) {
  const confidencePercent = useMemo(() => toPercent(item?.confidence), [item]);
  const formattedDate = formatDateTime(item?.createdAt) || "Unknown date";

  const derivedSeverity = useMemo(() => {
    if (confidencePercent >= 85) {
      return "high";
    }
    if (confidencePercent >= 65) {
      return "moderate";
    }
    return "low";
  }, [confidencePercent]);

  const severityLabel = item?.severity || derivedSeverity;
  const severityKey = severityLabel.toLowerCase();
  const severityClass = severityClasses[severityKey] || severityClasses[derivedSeverity];
  const solutions = item?.solutions || {};
  const topPredictions = item?.topPredictions || [];
  const hasSolutions = Boolean(solutions.chemical || solutions.organic || solutions.prevention);

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/90 text-emerald-950 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-40 w-full bg-emerald-50">
        {item?.imageUrl ? (
          <img src={item.imageUrl} alt="Scan" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-emerald-600">
            No image available
          </div>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-rose-600 shadow transition hover:scale-105"
          aria-label="Delete scan"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-emerald-700/70">Plant</p>
            <p className="text-base font-semibold">{item?.plant || "Unknown"}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityClass}`}>
            {severityLabel.charAt(0).toUpperCase() + severityLabel.slice(1)}
          </span>
        </div>
        <div>
          <p className="text-xs text-emerald-700/70">Disease</p>
          <p className="text-base font-semibold">{item?.disease || "Not detected"}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-emerald-700/70">
          <span>Confidence</span>
          <span className="font-semibold text-emerald-900">{confidencePercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-emerald-100">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
        <div className="text-xs text-emerald-700/60">{formattedDate}</div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
          <p className="text-xs font-semibold text-emerald-900">Overview</p>
          <p className="mt-1 text-sm text-emerald-700/70">
            {item?.explanation || "No AI explanation available for this scan."}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-600"
        >
          {isExpanded ? "Hide Details" : "View Details"}
          <ChevronIcon className={`h-4 w-4 transition ${isExpanded ? "rotate-180" : ""}`} />
        </button>

        {isExpanded && (
          <div className="space-y-4 rounded-2xl border border-emerald-100 bg-white/80 p-4">
            <div>
              <p className="text-xs font-semibold text-emerald-900">Solutions</p>
              <ul className="mt-2 space-y-2 text-sm text-emerald-700/70">
                {solutions.chemical && (
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    <span>
                      <span className="font-semibold text-emerald-900">Chemical:</span> {solutions.chemical}
                    </span>
                  </li>
                )}
                {solutions.organic && (
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    <span>
                      <span className="font-semibold text-emerald-900">Organic:</span> {solutions.organic}
                    </span>
                  </li>
                )}
                {solutions.prevention && (
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    <span>
                      <span className="font-semibold text-emerald-900">Prevention:</span> {solutions.prevention}
                    </span>
                  </li>
                )}
                {!hasSolutions && (
                  <li className="text-emerald-700/60">No AI solutions available for this scan.</li>
                )}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-900">Top predictions</p>
              {topPredictions.length ? (
                <ul className="mt-2 space-y-2 text-sm text-emerald-700/70">
                  {topPredictions.map((prediction) => (
                    <li key={`${prediction.disease}-${prediction.confidence}`} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                      <span>
                        {prediction.disease} ({toPercent(prediction.confidence)}%)
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-emerald-700/60">No alternative predictions available.</p>
              )}
            </div>
            <div className="rounded-2xl border border-amber-200/60 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              AI insight only. Always confirm with an agronomy expert for treatment decisions.
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/90 p-10 text-center text-emerald-900 shadow-xl">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <LeafIcon className="h-8 w-8" />
      </div>
      <div>
        <p className="text-lg font-semibold">No scans yet</p>
        <p className="mt-1 text-sm text-emerald-700/70">
          Upload a leaf image to start your first detection.
        </p>
      </div>
      <Link
        to="/"
        className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow transition hover:bg-emerald-500"
      >
        Start First Detection
      </Link>
    </div>
  );
}

function ConfirmModal({ open, title, description, onCancel, onConfirm, isLoading }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 text-emerald-950 shadow-2xl">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-emerald-700/70">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" strokeLinecap="round" />
      <path d="M8 6v12" strokeLinecap="round" />
      <path d="M16 6v12" strokeLinecap="round" />
      <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" strokeLinecap="round" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" />
    </svg>
  );
}

function LeafIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 13c6-7 13-8 18-7-1 6-5 12-13 15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 18c1.5-2.5 4-4.5 7-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default History;
