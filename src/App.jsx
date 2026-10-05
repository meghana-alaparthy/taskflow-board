import { useMemo, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Board from './components/Board'
import TaskModal from './components/TaskModal'
import FilterBar from './components/FilterBar'
import { useLocalStorage } from './hooks/useLocalStorage'
import { COLUMNS, seedTasks } from './data/seed'

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

const isColumnId = (id) => COLUMNS.some((c) => c.id === id)

export default function App() {
  const [tasks, setTasks] = useLocalStorage('taskflow:tasks:v1', seedTasks)
  const [search, setSearch] = useState('')
  const [labelFilter, setLabelFilter] = useState('all')
  const [activeId, setActiveId] = useState(null)
  const [modal, setModal] = useState(null) // { mode: 'add', column } | { mode: 'edit', task }

  const visibleTasks = useMemo(() => {
    const q = search.trim().toLowerCase()
    return tasks.filter((t) => {
      const inText =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q)
      const inLabel = labelFilter === 'all' || t.label === labelFilter
      return inText && inLabel
    })
  }, [tasks, search, labelFilter])

  // A drag target can be a column container or another card; resolve both to a column id.
  const columnOf = (id) => {
    if (isColumnId(id)) return id
    return tasks.find((t) => t.id === id)?.column ?? null
  }

  const handleDragStart = (e) => setActiveId(e.active.id)
  const handleDragCancel = () => setActiveId(null)

  // Moving across columns happens live while hovering, so the card visibly
  // lands in the new column before the pointer is released.
  const handleDragOver = (e) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const fromCol = columnOf(active.id)
    const toCol = columnOf(over.id)
    if (!fromCol || !toCol || fromCol === toCol) return

    setTasks((prev) => {
      const moving = prev.find((t) => t.id === active.id)
      if (!moving) return prev
      const rest = prev.filter((t) => t.id !== active.id)
      const moved = { ...moving, column: toCol }

      let at = rest.length
      const overTaskIdx = rest.findIndex((t) => t.id === over.id)
      if (overTaskIdx >= 0) {
        at = overTaskIdx
      } else {
        // Dropped on the column itself: append after its last card.
        let last = -1
        rest.forEach((t, i) => {
          if (t.column === toCol) last = i
        })
        at = last + 1
      }
      rest.splice(at, 0, moved)
      return rest
    })
  }

  // Within one column this just reorders; cross-column moves were already
  // applied by handleDragOver, so there is nothing left to do for them here.
  const handleDragEnd = (e) => {
    const { active, over } = e
    setActiveId(null)
    if (!over || active.id === over.id) return
    if (columnOf(active.id) !== columnOf(over.id)) return
    setTasks((prev) =>
      arrayMove(
        prev,
        prev.findIndex((t) => t.id === active.id),
        prev.findIndex((t) => t.id === over.id)
      )
    )
  }

  const openAdd = (column = 'backlog') => setModal({ mode: 'add', column })
  const openEdit = (task) => setModal({ mode: 'edit', task })
  const closeModal = () => setModal(null)

  const saveTask = (data) => {
    if (modal.mode === 'add') {
      setTasks((prev) => [...prev, { ...data, id: newId(), createdAt: Date.now() }])
    } else {
      setTasks((prev) => prev.map((t) => (t.id === modal.task.id ? { ...t, ...data } : t)))
    }
    closeModal()
  }

  const deleteTask = (task) => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    }
  }

  const filtersActive = search.trim() !== '' || labelFilter !== 'all'

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Taskflow Board</h1>
          <p className="app-sub">Drag cards between columns. Everything is saved in your browser.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openAdd()}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          New task
        </button>
      </header>

      <FilterBar
        search={search}
        onSearch={setSearch}
        labelFilter={labelFilter}
        onLabelFilter={setLabelFilter}
        visibleCount={visibleTasks.length}
        totalCount={tasks.length}
        filtersActive={filtersActive}
        onClear={() => {
          setSearch('')
          setLabelFilter('all')
        }}
      />

      <Board
        tasks={visibleTasks}
        activeId={activeId}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={deleteTask}
      />

      {modal && (
        <TaskModal
          mode={modal.mode}
          initialTask={modal.task}
          defaultColumn={modal.column}
          onSave={saveTask}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
