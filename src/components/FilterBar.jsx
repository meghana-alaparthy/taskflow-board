import { LABELS } from '../data/seed'

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export default function FilterBar({
  search,
  onSearch,
  labelFilter,
  onLabelFilter,
  visibleCount,
  totalCount,
  filtersActive,
  onClear,
}) {
  return (
    <div className="filter-bar">
      <div className="search-wrap">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />
      </div>

      <select value={labelFilter} onChange={(e) => onLabelFilter(e.target.value)} aria-label="Filter by label">
        <option value="all">All labels</option>
        {LABELS.map((l) => (
          <option key={l} value={l}>
            {cap(l)}
          </option>
        ))}
      </select>

      <span className="filter-count">
        {visibleCount} of {totalCount}
      </span>

      {filtersActive && (
        <button className="btn btn-ghost" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  )
}
