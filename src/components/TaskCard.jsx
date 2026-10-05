import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const LABEL_TITLES = { bug: 'Bug', feature: 'Feature', docs: 'Docs', chore: 'Chore' }
const PRIORITY_TITLES = { low: 'Low', medium: 'Medium', high: 'High' }

// "2026-10-05" -> "Oct 5". Kept local (no date lib) since we only ever
// display the calendar date the user picked.
function formatDue(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isOverdue(task) {
  if (!task.dueDate || task.column === 'done') return false
  return task.dueDate < new Date().toISOString().slice(0, 10)
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M9.5 2.5l2 2L5 11H3V9l6.5-6.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 3.5h9M5.5 3V2h3v1M4 3.5l.7 8.2a1 1 0 001 .9h2.6a1 1 0 001-.9l.7-8.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Pure markup shared by the board card and the drag overlay ghost.
export function CardView({ task, onEdit, onDelete, overlay = false }) {
  const overdue = isOverdue(task)

  return (
    <div className={`card-inner${overlay ? ' card-overlay' : ''}`}>
      <div className="card-top">
        <span className={`badge badge-${task.label}`}>{LABEL_TITLES[task.label]}</span>
        <span className={`priority priority-${task.priority}`}>
          <span className="priority-dot" aria-hidden="true" />
          {PRIORITY_TITLES[task.priority]}
        </span>
      </div>

      <h3 className="card-title">{task.title}</h3>
      {task.description && <p className="card-desc">{task.description}</p>}

      <div className="card-foot">
        {task.dueDate ? (
          <span className={`due${overdue ? ' due-overdue' : ''}`} title={overdue ? 'Overdue' : 'Due date'}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <rect x="1.5" y="2.5" width="9" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M1.5 5h9M4 1v2.5M8 1v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {formatDue(task.dueDate)}
          </span>
        ) : (
          <span />
        )}
        {!overlay && (
          <span className="card-actions">
            <button
              className="icon-btn"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
              title="Edit"
            >
              <EditIcon />
            </button>
            <button
              className="icon-btn icon-btn-danger"
              onClick={() => onDelete(task)}
              aria-label={`Delete ${task.title}`}
              title="Delete"
            >
              <TrashIcon />
            </button>
          </span>
        )}
      </div>
    </div>
  )
}

export default function TaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  }

  return (
    <article ref={setNodeRef} style={style} className="card" {...attributes} {...listeners}>
      <CardView task={task} onEdit={onEdit} onDelete={onDelete} />
    </article>
  )
}
