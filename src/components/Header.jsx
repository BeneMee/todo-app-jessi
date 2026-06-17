import { todayStr, formatFullDate } from '../lib/dateUtils'

export function Header({ streak, onAddTask }) {
  const today = formatFullDate(todayStr())

  return (
    <header style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)' }}>
      <div style={{ maxWidth: '672px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <p style={{ color: '#c4b5fd', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
              Daily Tracker
            </p>
            <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '4px 0 0' }}>
              {today}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '999px', padding: '8px 16px', flexShrink: 0 }}>
            <span style={{ fontSize: '20px' }}>🔥</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>{streak.count}</span>
            <span style={{ color: '#c4b5fd', fontSize: '13px' }}>day{streak.count !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <button
          onClick={onAddTask}
          style={{
            marginTop: '16px',
            width: '100%',
            background: '#fff',
            color: '#4f46e5',
            fontWeight: 600,
            fontSize: '15px',
            padding: '12px',
            borderRadius: '14px',
            cursor: 'pointer',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'background 0.15s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#ede9fe'}
          onMouseOut={e => e.currentTarget.style.background = '#fff'}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Task
        </button>
      </div>
    </header>
  )
}
