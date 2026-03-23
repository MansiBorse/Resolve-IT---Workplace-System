import { useEffect, useState } from "react";

export default function ManageFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:8080/api/grievances")
      .then((res) => res.json())
      .then((data) => setGrievances(data))
      .catch((err) => console.error(err));
  }, []);

  const months = [
    ...new Set(
      feedbacks.map((f) => {
        const d = new Date(f.createdAt);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }),
    ),
  ]
    .sort()
    .reverse();

  const departments = [
    ...new Set(feedbacks.map((f) => f.department).filter(Boolean)),
  ].sort();

  const filtered = feedbacks.filter((f) => {
    if (search && !f.employeeName?.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (ratingFilter && Number(f.rating) !== Number(ratingFilter)) return false;
    if (deptFilter && f.department !== deptFilter) return false;
    if (monthFilter) {
      const d = new Date(f.createdAt);
      const fm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (fm !== monthFilter) return false;
    }
    return true;
  });

  const avgRating =
    filtered.length > 0
      ? (
          filtered.reduce((acc, f) => acc + Number(f.rating || 0), 0) /
          filtered.length
        ).toFixed(1)
      : "—";

  const ratingDist = [5, 4, 3, 2, 1].map(
    (r) => filtered.filter((f) => Number(f.rating) === r).length,
  );
  const topIdx = ratingDist.indexOf(Math.max(...ratingDist));
  const topRating = Math.max(...ratingDist) > 0 ? 5 - topIdx : null;
  const uniqueDepts = [
    ...new Set(filtered.map((f) => f.department).filter(Boolean)),
  ];

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const avatarColors = [
    { bg: "bg-blue-100", text: "text-blue-600" },
    { bg: "bg-green-100", text: "text-green-600" },
    { bg: "bg-amber-100", text: "text-amber-600" },
    { bg: "bg-rose-100", text: "text-rose-600" },
    { bg: "bg-purple-100", text: "text-purple-600" },
  ];
  const deptColorMap = {};
  departments.forEach((d, i) => {
    deptColorMap[d] = avatarColors[i % avatarColors.length];
  });

  const formatMonth = (ym) => {
    const [y, m] = ym.split("-");
    return new Date(y, m - 1, 1).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const starsDisplay = (rating) => {
    const r = Number(rating);
    return (
      <span className="text-sm">
        <span className="text-amber-400">{"★".repeat(r)}</span>
        <span className="text-gray-300">{"☆".repeat(5 - r)}</span>
      </span>
    );
  };

  // Match feedback to grievance by department + employeeName
  const getGrievanceForFeedback = (f) => {
    return (
      grievances.find(
        (g) => g.department === f.department && g.status === "Resolved",
      ) || null
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Employee Feedback</h1>
        <p className="text-sm text-gray-500 mt-1">
          Admin view — all submissions
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <div className="text-xs text-gray-500 mb-1">Total responses</div>
          <div className="text-2xl font-semibold">{filtered.length}</div>
          <div className="text-xs text-gray-400 mt-1">in current filter</div>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <div className="text-xs text-gray-500 mb-1">Average rating</div>
          <div className="text-2xl font-semibold">{avgRating}</div>
          <div className="text-xs text-gray-400 mt-1">out of 5</div>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <div className="text-xs text-gray-500 mb-1">Most common</div>
          <div className="text-2xl font-semibold">
            {topRating ? `${topRating}★` : "—"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {Math.max(...ratingDist) > 0
              ? `${Math.max(...ratingDist)} responses`
              : ""}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <div className="text-xs text-gray-500 mb-1">Departments</div>
          <div className="text-2xl font-semibold">{uniqueDepts.length}</div>
          <div className="text-xs text-gray-400 mt-1 truncate">
            {uniqueDepts.slice(0, 2).join(", ")}
            {uniqueDepts.length > 2 ? "…" : ""}
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm w-52"
        />
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">All months</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {formatMonth(m)}
            </option>
          ))}
        </select>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">All ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} stars
            </option>
          ))}
        </select>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-400 ml-auto">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* FEEDBACK LIST */}
      {filtered.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-10 text-center text-sm text-gray-400">
          No feedback matches your filters.
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((f) => {
            const color = deptColorMap[f.department] || avatarColors[0];
            const dateStr = new Date(f.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const grievance = getGrievanceForFeedback(f);

            return (
              <div
                key={f.id}
                className="bg-white border rounded-xl p-5 flex gap-4 hover:shadow-sm transition"
              >
                {/* Avatar */}
                <div
                  className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-sm ${color.bg} ${color.text}`}
                >
                  {getInitials(f.employeeName)}
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{f.employeeName}</div>

                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {f.department && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {f.department}
                      </span>
                    )}
                    {f.experience && (
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                        {f.experience}
                      </span>
                    )}
                    {/* Show linked grievance info if found */}
                    {grievance && (
                      <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                        {grievance.ticketId} · {grievance.title}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {f.message}
                  </p>
                </div>

                {/* Rating + date */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="text-base font-semibold">{f.rating}/5</div>
                  {starsDisplay(f.rating)}
                  <div className="text-xs text-gray-400 mt-1">{dateStr}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
