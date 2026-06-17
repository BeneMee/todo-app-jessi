import { Fragment, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg'
import { getLast7Days, getCurrentMonthDays, shortDayLabel } from '../lib/dateUtils'

const CHART_HEIGHT = 150
const PAD_LEFT = 30
const PAD_BOTTOM = 20
const PAD_TOP = 8

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

function CompletionChart({ title, data, showAllLabels }) {
  const [width, setWidth] = useState(0)
  const [selected, setSelected] = useState(null)

  const hasData = data.some(d => d.value != null && d.value > 0)
  const plotW = Math.max(0, width - PAD_LEFT)
  const plotH = CHART_HEIGHT - PAD_BOTTOM - PAD_TOP
  const n = data.length
  const slot = n > 0 ? plotW / n : 0
  const barW = Math.min(36, slot * 0.6)
  const labelStep = showAllLabels ? 1 : Math.ceil(n / 8)

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>

      {!hasData ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Complete tasks to see your stats here</Text>
        </View>
      ) : (
        <View onLayout={e => setWidth(e.nativeEvent.layout.width)}>
          {width > 0 && (
            <Svg width={width} height={CHART_HEIGHT}>
              {[0, 25, 50, 75, 100].map(tick => {
                const y = PAD_TOP + plotH * (1 - tick / 100)
                return (
                  <Fragment key={`grid-${tick}`}>
                    <Line
                      x1={PAD_LEFT}
                      y1={y}
                      x2={width}
                      y2={y}
                      stroke="#f3f4f6"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    <SvgText x={PAD_LEFT - 6} y={y + 3} fontSize={9} fill="#9ca3af" textAnchor="end">
                      {`${tick}%`}
                    </SvgText>
                  </Fragment>
                )
              })}

              {data.map((d, i) => {
                const cx = PAD_LEFT + slot * i + slot / 2
                const v = d.value
                const h = v != null ? plotH * (v / 100) : 0
                const y = PAD_TOP + plotH - h
                return (
                  <Fragment key={`bar-${i}`}>
                    {v != null && v > 0 && (
                      <Rect
                        x={cx - barW / 2}
                        y={y}
                        width={barW}
                        height={h}
                        rx={4}
                        fill={getBarColor(v)}
                        onPress={() => setSelected(i)}
                      />
                    )}
                    {i % labelStep === 0 && (
                      <SvgText x={cx} y={CHART_HEIGHT - 6} fontSize={9} fill="#9ca3af" textAnchor="middle">
                        {d.label}
                      </SvgText>
                    )}
                  </Fragment>
                )
              })}
            </Svg>
          )}

          {selected != null && data[selected] && (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipLabel}>{data[selected].label}</Text>
              <Text style={styles.tooltipValue}>
                {data[selected].value != null && data[selected].value > 0
                  ? `${data[selected].value}%`
                  : 'No data'}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
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

  const legend = [
    { color: '#10b981', label: '≥ 80%' },
    { color: '#6366f1', label: '50–79%' },
    { color: '#f59e0b', label: '< 50%' },
    { color: '#e5e7eb', label: 'No data' },
  ]

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 32 }}>
      <Text style={styles.h2}>Statistics</Text>
      <View style={{ gap: 12 }}>
        <CompletionChart title="Last 7 Days" data={weekData} showAllLabels />
        <CompletionChart title="This Month" data={monthData} />
      </View>

      <View style={styles.legendRow}>
        {legend.map(({ color, label }) => (
          <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color }} />
            <Text style={{ fontSize: 11, color: '#9ca3af' }}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  h2: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 16 },
  placeholder: { height: 140, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: '#d1d5db', fontSize: 13 },
  tooltip: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tooltipLabel: { fontWeight: '600', color: '#374151', fontSize: 13 },
  tooltipValue: { color: '#6366f1', fontWeight: '700', fontSize: 13, marginTop: 2 },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
})
