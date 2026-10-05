import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

export default function Column({ column, tasks, onAdd, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <section ref={setNodeRef} className={`column${isOver ? ' column-over' : ''}`}>
      <header className="column-header">
        <h2>{column.title}</h2>
        <span className="column-count" aria-label={`${tasks.length} tasks`}>
          {tasks.length}
        </span>
        <button
          className="icon-btn column-add"
          onClick={() => onAdd(column.id)}
          aria-label={`Add task to ${column.title}`}
          title={`Add task to ${column.title}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="column-body">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {tasks.length === 0 && <div className="column-empty">Drop tasks here</div>}
        </div>
      </SortableContext>
    </section>
  )
}
