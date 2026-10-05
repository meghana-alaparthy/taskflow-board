import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import Column from './Column'
import { CardView } from './TaskCard'
import { COLUMNS } from '../data/seed'

export default function Board({
  tasks,
  activeId,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragCancel,
  onAdd,
  onEdit,
  onDelete,
}) {
  const activeTask = tasks.find((t) => t.id === activeId) ?? null

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="board">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={tasks.filter((t) => t.column === col.id)}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTask ? <CardView task={activeTask} overlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
