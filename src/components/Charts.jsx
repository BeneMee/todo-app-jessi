import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { getLast7Days, getCurrentMonthDays, shortDayLabel } from '../lib/dateUtils'

function computeCompletion(entry) {
  if (!entry) return null
  const total = entry.done + entry.uncompleted
  if (total === 0) return null
  return Math.round((entry.done / total) * 100)
}

function getBarColor(value) {
  if (value == null) return '#e5e7eb'
  if (value >= 80) return '#10b981'
  if (value >= 50) return '#6366f1'
  return '#f59e0b'
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      padding: '8px 12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      fontSize: '13px',
    }}>
      <p style={{ margin: 0, fontWeight: 600, color: '#374151' }}>{label}</p>
      <p style={{ margin: '2px 0 0', color: '#6366f1', fontWeight: 700 }}>
        {val != null && val > 0 ? `${val}%` : 'No data'}
      </p>
    </div>
  )
}

function CompletionChart({ title, data }) {
  const hasData = data.some(d => d.value != null && d.value > 0)

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #f3f4f6',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#111827' }}>
        {title}
      </h3>
      {!hasData ? (
        <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db', fontSize: '13px' }}>
          Complete tasks to see your stats here
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${v}%`}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
            <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={36}>
              {data.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export function Charts({ dailyLog }) {
  const weekData = getLast7Days().map(date => ({
    label: shortDayLabel(date),
    value: computeCompletion(dailyLog[date]),
    date,
  }))

  const monthData = getCurrentMonthDays().map(date => ({
    label: String(parseInt(date.split('-')[2], 10)),
    value: computeCompletion(dailyLog[date]),
    date,
  }))

  return (
    <section>
      <h2 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 700, color: '#111827' }}>
        Statistics
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <CompletionChart title="Last 7 Days" data={weekData} />
        <CompletionChart title="This Month" data={monthData} />
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', padding: '12px 16px', background: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
        {[
          { color: '#10b981', label: '≥ 80%' },
          { color: '#6366f1', label: '50–79%' },
          { color: '#f59e0b', label: '< 50%' },
          { color: '#e5e7eb', label: 'No data' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
