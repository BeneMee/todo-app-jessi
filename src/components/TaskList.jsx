import { useState, useEffect, useRef } from 'react'
import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'

export function TaskList({ tasks, states, onSetState, onEdit, onDelete, onAdd, onReorder }) {
  // Local copy so the list can reorder live while dragging. It is kept in
  // sync whenever the tasks prop changes (add / edit / delete).
  const [order, setOrder] = useState(tasks)
  const dragId = useRef(null)
  const [draggingId, setDraggingId] = useState(null)

  useEffect(() => {
    setOrder(tasks)
  }, [tasks])

  const doneCount = order.filter(t => states[t.id] === 'done').length
  const total = order.length
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const handleDragStart = (id) => {
    dragId.current = id
    setDraggingId(id)
  }

  const handleDragEnter = (overId) => {
    if (dragId.current == null || dragId.current === overId) return
    setOrder(prev => {
      const from = prev.findIndex(t => t.id === dragId.current)
      const to = prev.findIndex(t => t.id === overId)
      if (from === -1 || to === -1) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  const handleDragEnd = () => {
    if (dragId.current != null) {
      onReorder(order.map(t => t.id))
    }
    dragId.current = null
    setDraggingId(null)
  }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#111827' }}>
          Today's Tasks
        </h2>
        {total > 0 && (
          <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>
            {doneCount}/{total} done
          </span>
        )}
      </div>

      {total > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #6366f1, #10b981)',
                borderRadius: '999px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      )}

      {order.length === 0 ? (
        <EmptyState onAdd={onAdd} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {order.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              status={states[task.id] || 'uncompleted'}
              onSetState={onSetState}
              onEdit={onEdit}
              onDelete={onDelete}
              isDragging={draggingId === task.id}
              onDragStart={() => handleDragStart(task.id)}
              onDragEnter={() => handleDragEnter(task.id)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      )}
    </section>
  )
}
