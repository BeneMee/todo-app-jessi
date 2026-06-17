export function EmptyState({ onAdd }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px 48px' }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>📋</div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>
        No tasks for today
      </h3>
      <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: '14px' }}>
        Add your first task to start building daily habits.
      </p>
      <button
        onClick={onAdd}
        style={{
          background: '#4f46e5',
          color: '#fff',
          fontWeight: 600,
          fontSize: '15px',
          padding: '12px 24px',
          borderRadius: '14px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Add your first task
      </button>
    </div>
  )
}
