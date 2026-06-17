import { View, Text, Pressable, StyleSheet } from 'react-native'
import { EditIcon, TrashIcon, GripIcon } from './icons'

const WEEKDAY_SHORT = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }

export function TaskCard({ task, status, onSetState, onEdit, onDelete, drag, isActive }) {
  const isDone = status === 'done'
  const isIgnored = status === 'ignored'
  const isPending = !isDone && !isIgnored
  const muted = isDone || isIgnored

  return (
    <View
      style={[
        styles.card,
        isDone ? styles.cardDone : isIgnored ? styles.cardIgnored : styles.cardPending,
        isActive && styles.cardActive,
      ]}
    >
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <Pressable
          onLongPress={drag}
          delayLongPress={150}
          hitSlop={10}
          style={{ marginTop: 2, paddingVertical: 2 }}
        >
          <GripIcon color={isActive ? '#6366f1' : '#d1d5db'} />
        </Pressable>

        <View
          style={[
            styles.bubble,
            isDone ? styles.bubbleDone : isIgnored ? styles.bubbleIgnored : styles.bubblePending,
          ]}
        >
          {isDone && <Text style={styles.bubbleMark}>✓</Text>}
          {isIgnored && <Text style={styles.bubbleMark}>–</Text>}
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, muted && styles.titleMuted]}>{task.name}</Text>
              {!!task.description && (
                <Text style={[styles.desc, muted && styles.descMuted]}>{task.description}</Text>
              )}
              {task.days !== 'all' && (
                <Text style={styles.days}>
                  {task.days.map(d => WEEKDAY_SHORT[d] || d).join(' · ')}
                </Text>
              )}
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Pressable onPress={() => onEdit(task)} hitSlop={8} style={{ padding: 4 }}>
                <EditIcon color="#9ca3af" />
              </Pressable>
              <Pressable onPress={() => onDelete(task.id)} hitSlop={8} style={{ padding: 4 }}>
                <TrashIcon color="#9ca3af" />
              </Pressable>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            {isPending && (
              <>
                <Pressable
                  onPress={() => onSetState(task.id, 'done')}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    { backgroundColor: pressed ? '#059669' : '#10b981', flex: 1 },
                  ]}
                >
                  <Text style={styles.actionBtnText}>✓ Done</Text>
                </Pressable>
                <Pressable
                  onPress={() => onSetState(task.id, 'ignored')}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    { backgroundColor: pressed ? '#e5e7eb' : '#f3f4f6', flex: 1 },
                  ]}
                >
                  <Text style={[styles.actionBtnText, { color: '#6b7280' }]}>– Ignore</Text>
                </Pressable>
              </>
            )}
            {muted && (
              <Pressable onPress={() => onSetState(task.id, 'uncompleted')} hitSlop={8} style={{ paddingVertical: 4 }}>
                <Text style={{ color: '#9ca3af', fontSize: 13 }}>↩ Undo</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16 },
  cardPending: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardDone: { backgroundColor: '#ecfdf5', borderLeftWidth: 4, borderLeftColor: '#34d399' },
  cardIgnored: { backgroundColor: '#f9fafb', borderLeftWidth: 4, borderLeftColor: '#d1d5db' },
  cardActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  bubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubblePending: { borderWidth: 2, borderColor: '#d1d5db' },
  bubbleDone: { backgroundColor: '#10b981' },
  bubbleIgnored: { backgroundColor: '#9ca3af' },
  bubbleMark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  title: { fontSize: 15, fontWeight: '600', color: '#111827' },
  titleMuted: { color: '#9ca3af', textDecorationLine: 'line-through' },
  desc: { marginTop: 3, fontSize: 13, color: '#6b7280' },
  descMuted: { color: '#9ca3af', textDecorationLine: 'line-through' },
  days: { marginTop: 4, fontSize: 11, color: '#a78bfa', fontWeight: '500' },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
})
