import { View, Text, Pressable } from 'react-native'

export function EmptyState({ onAdd }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 64, paddingBottom: 48, paddingHorizontal: 24 }}>
      <Text style={{ fontSize: 56, marginBottom: 16 }}>📋</Text>
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
        No tasks for today
      </Text>
      <Text style={{ color: '#9ca3af', marginBottom: 24, fontSize: 14, textAlign: 'center' }}>
        Add your first task to start building daily habits.
      </Text>
      <Pressable
        onPress={onAdd}
        style={({ pressed }) => [
          { backgroundColor: '#4f46e5', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14 },
          pressed && { backgroundColor: '#4338ca' },
        ]}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Add your first task</Text>
      </Pressable>
    </View>
  )
}
