const EditIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const TrashIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const DragHandleIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="9" cy="6" r="1.6" />
    <circle cx="15" cy="6" r="1.6" />
    <circle cx="9" cy="12" r="1.6" />
    <circle cx="15" cy="12" r="1.6" />
    <circle cx="9" cy="18" r="1.6" />
    <circle cx="15" cy="18" r="1.6" />
  </svg>
)

const WEEKDAY_SHORT = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }

export function TaskCard({ task, status, onSetState, onEdit, onDelete, isDragging, innerRef, onDragHandlePointerDown }) {
  const isDone = status === 'done'
  const isIgnored = status === 'ignored'
  const isPending = !isDone && !isIgnored

  const cardStyle = {
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '0',
    transition: 'all 0.2s ease',
    opacity: isDragging ? 0.5 : 1,
    boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.12)' : undefined,
    ...(isDone
      ? { background: '#ecfdf5', borderLeft: '4px solid #34d399' }
      : isIgnored
      ? { background: '#f9fafb', borderLeft: '4px solid #d1d5db' }
      : { background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }),
  }

  const statusBubbleStyle = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
    fontSize: '11px',
    fontWeight: 700,
    ...(isDone
      ? { background: '#10b981', color: '#fff' }
      : isIgnored
      ? { background: '#9ca3af', color: '#fff' }
      : { border: '2px solid #d1d5db' }),
  }

  return (
    <div ref={innerRef} className="task-card-enter" style={cardStyle}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div
          title="Drag to reorder"
          onPointerDown={onDragHandlePointerDown}
          style={{
            display: 'flex',
            alignItems: 'center',
            color: isDragging ? '#6366f1' : '#d1d5db',
            cursor: isDragging ? 'grabbing' : 'grab',
            flexShrink: 0,
            marginTop: '4px',
            // Stops the browser from scrolling/selecting when a touch drag
            // begins on the handle (required for iOS Safari).
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          onMouseOver={e => { if (!isDragging) e.currentTarget.style.color = '#9ca3af' }}
          onMouseOut={e => { if (!isDragging) e.currentTarget.style.color = '#d1d5db' }}
        >
          <DragHandleIcon />
        </div>
        <div style={statusBubbleStyle}>
          {isDone && '✓'}
          {isIgnored && '–'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: 600,
                color: (isDone || isIgnored) ? '#9ca3af' : '#111827',
                textDecoration: (isDone || isIgnored) ? 'line-through' : 'none',
                wordBreak: 'break-word',
              }}>
                {task.name}
              </h3>
              {task.description && (
                <p style={{
                  margin: '3px 0 0',
                  fontSize: '13px',
                  color: (isDone || isIgnored) ? '#c4b5fd' : '#6b7280',
                  textDecoration: (isDone || isIgnored) ? 'line-through' : 'none',
                  color: (isDone || isIgnored) ? '#9ca3af' : '#6b7280',
                  wordBreak: 'break-word',
                }}>
                  {task.description}
                </p>
              )}
              {task.days !== 'all' && (
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#a78bfa', fontWeight: 500 }}>
                  {task.days.map(d => WEEKDAY_SHORT[d] || d).join(' · ')}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
              <button
                onClick={() => onEdit(task)}
                title="Edit"
                style={{ color: '#d1d5db', padding: '4px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                onMouseOver={e => e.currentTarget.style.color = '#6b7280'}
                onMouseOut={e => e.currentTarget.style.color = '#d1d5db'}
              >
                <EditIcon />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                title="Delete"
                style={{ color: '#d1d5db', padding: '4px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                onMouseOut={e => e.currentTarget.style.color = '#d1d5db'}
              >
                <TrashIcon />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            {isPending && (
              <>
                <button
                  onClick={() => onSetState(task.id, 'done')}
                  style={{
                    flex: 1,
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '13px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#059669'}
                  onMouseOut={e => e.currentTarget.style.background = '#10b981'}
                >
                  ✓ Done
                </button>
                <button
                  onClick={() => onSetState(task.id, 'ignored')}
                  style={{
                    flex: 1,
                    background: '#f3f4f6',
                    color: '#6b7280',
                    fontWeight: 600,
                    fontSize: '13px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
                  onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
                >
                  – Ignore
                </button>
              </>
            )}
            {(isDone || isIgnored) && (
              <button
                onClick={() => onSetState(task.id, 'uncompleted')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: '4px 0',
                }}
                onMouseOver={e => e.currentTarget.style.color = '#4b5563'}
                onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
              >
                ↩ Undo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
