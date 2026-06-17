import { View, Text, Pressable, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { todayStr, formatFullDate } from '../lib/dateUtils'

export function Header({ streak, onAddTask }) {
  const insets = useSafeAreaInsets()
  const today = formatFullDate(todayStr())

  return (
    <LinearGradient
      colors={['#6d28d9', '#4f46e5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + 20 }]}
    >
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>DAILY TRACKER</Text>
          <Text style={styles.date}>{today}</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={{ fontSize: 20 }}>🔥</Text>
          <Text style={styles.streakCount}>{streak.count}</Text>
          <Text style={styles.streakLabel}>{streak.count !== 1 ? 'days' : 'day'}</Text>
        </View>
      </View>

      <Pressable
        onPress={onAddTask}
        style={({ pressed }) => [styles.addButton, pressed && { backgroundColor: '#ede9fe' }]}
      >
        <Text style={styles.addPlus}>+</Text>
        <Text style={styles.addLabel}>Add Task</Text>
      </Pressable>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 24 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 },
  kicker: { color: '#c4b5fd', fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  date: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 4 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  streakCount: { color: '#fff', fontWeight: '700', fontSize: 18 },
  streakLabel: { color: '#c4b5fd', fontSize: 13 },
  addButton: {
    marginTop: 16,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addPlus: { color: '#4f46e5', fontSize: 18, fontWeight: '700', lineHeight: 20 },
  addLabel: { color: '#4f46e5', fontSize: 15, fontWeight: '600' },
})
