import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'

// A single DraggableFlatList drives the whole screen so the drag gesture
// works smoothly (a FlatList must not be nested inside a ScrollView). The
// app header is rendered above the list and the charts below it.
export function TaskList({
  tasks,
  states,
  onSetState,
  onEdit,
  onDelete,
  onAdd,
  onReorder,
  topComponent,
  bottomComponent,
}) {
  const [order, setOrder] = useState(tasks)

  // Keep the local order in sync when tasks change (add / edit / delete).
  useEffect(() => {
    setOrder(tasks)
  }, [tasks])

  const doneCount = order.filter(t => states[t.id] === 'done').length
  const total = order.length
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const renderItem = ({ item, drag, isActive }) => (
    <ScaleDecorator>
      <View style={{ marginHorizontal: 16, marginBottom: 10 }}>
        <TaskCard
          task={item}
          status={states[item.id] || 'uncompleted'}
          onSetState={onSetState}
          onEdit={onEdit}
          onDelete={onDelete}
          drag={drag}
          isActive={isActive}
        />
      </View>
    </ScaleDecorator>
  )

  const listHeader = (
    <View>
      {topComponent}
      <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
        <View style={styles.titleRow}>
          <Text style={styles.h2}>Today's Tasks</Text>
          {total > 0 && <Text style={styles.count}>{doneCount}/{total} done</Text>}
        </View>
        {total > 0 && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        )}
      </View>
    </View>
  )

  return (
    <DraggableFlatList
      data={order}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      onDragEnd={({ data }) => {
        setOrder(data)
        onReorder(data.map(t => t.id))
      }}
      activationDistance={12}
      ListHeaderComponent={listHeader}
      ListFooterComponent={<View>{bottomComponent}</View>}
      ListEmptyComponent={
        <View style={{ paddingHorizontal: 16 }}>
          <EmptyState onAdd={onAdd} />
        </View>
      }
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  h2: { fontSize: 17, fontWeight: '700', color: '#111827' },
  count: { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
  progressTrack: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: { height: '100%', backgroundColor: '#6366f1', borderRadius: 999 },
})
