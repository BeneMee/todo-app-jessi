import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'

export function TaskList({ tasks, states, onSetState, onEdit, onDelete, onAdd }) {
  const doneCount = tasks.filter(t => states[t.id] === 'done').length
  const total = tasks.length
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0

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

      {tasks.length === 0 ? (
        <EmptyState onAdd={onAdd} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              status={states[task.id] || 'uncompleted'}
              onSetState={onSetState}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}
