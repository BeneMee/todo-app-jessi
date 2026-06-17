import { useState, useEffect, useRef } from 'react'
import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'

export function TaskList({ tasks, states, onSetState, onEdit, onDelete, onAdd, onReorder }) {
  // Local copy so the list can reorder live while dragging. It is kept in
  // sync whenever the tasks prop changes (add / edit / delete).
  const [order, setOrder] = useState(tasks)
  const [draggingId, setDraggingId] = useState(null)

  const dragId = useRef(null)
  // Latest order, so the pointerup handler commits fresh data even though
  // its listener was registered with an earlier render's closure.
  const orderRef = useRef(order)
  // Map of task id -> card DOM node, used to hit-test the pointer position.
  const cardRefs = useRef(new Map())

  useEffect(() => {
    setOrder(tasks)
  }, [tasks])

  useEffect(() => {
    orderRef.current = order
  }, [order])

  const doneCount = order.filter(t => states[t.id] === 'done').length
  const total = order.length
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const setCardRef = (id) => (el) => {
    if (el) cardRefs.current.set(id, el)
    else cardRefs.current.delete(id)
  }

  // Reorders the live list so the dragged task sits where the pointer is.
  const moveToPointer = (clientY) => {
    const id = dragId.current
    if (id == null) return

    let overId = null
    for (const [cid, el] of cardRefs.current) {
      const rect = el.getBoundingClientRect()
      if (clientY >= rect.top && clientY <= rect.bottom) {
        overId = cid
        break
      }
    }
    if (overId == null || overId === id) return

    setOrder(prev => {
      const from = prev.findIndex(t => t.id === id)
      const to = prev.findIndex(t => t.id === overId)
      if (from === -1 || to === -1) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  const startDrag = (id) => {
    dragId.current = id
    setDraggingId(id)
  }

  // While a drag is active, listen on the window so the gesture keeps
  // working even when the pointer moves off the originating card. Pointer
  // events cover mouse, touch (iOS Safari) and pen with one code path.
  useEffect(() => {
    if (draggingId == null) return

    const handleMove = (e) => moveToPointer(e.clientY)
    const handleUp = () => {
      if (dragId.current != null) {
        onReorder(orderRef.current.map(t => t.id))
      }
      dragId.current = null
      setDraggingId(null)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
  }, [draggingId, onReorder])

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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            // Prevent text selection while dragging on desktop.
            userSelect: draggingId != null ? 'none' : undefined,
          }}
        >
          {order.map(task => (
            <TaskCard
              key={task.id}
              innerRef={setCardRef(task.id)}
              task={task}
              status={states[task.id] || 'uncompleted'}
              onSetState={onSetState}
              onEdit={onEdit}
              onDelete={onDelete}
              isDragging={draggingId === task.id}
              onDragHandlePointerDown={(e) => {
                e.preventDefault()
                startDrag(task.id)
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
