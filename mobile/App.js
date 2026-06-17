import { useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useAppState } from './src/hooks/useAppState'
import { Header } from './src/components/Header'
import { TaskList } from './src/components/TaskList'
import { TaskModal } from './src/components/TaskModal'
import { Charts } from './src/components/Charts'

export default function App() {
  const {
    loaded,
    todayTasks,
    todayStates,
    dailyLog,
    streak,
    addTask,
    updateTask,
    deleteTask,
    setTaskState,
    reorderTasks,
  } = useAppState()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const openAdd = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingTask(null)
  }

  const handleSave = (data) => {
    if (editingTask) updateTask(editingTask.id, data)
    else addTask(data)
    closeModal()
  }

  const handleDelete = (id) => {
    deleteTask(id)
    closeModal()
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={styles.root}>
          {!loaded ? (
            <View style={styles.loading}>
              <ActivityIndicator color="#6366f1" />
            </View>
          ) : (
            <TaskList
              tasks={todayTasks}
              states={todayStates}
              onSetState={setTaskState}
              onEdit={openEdit}
              onDelete={deleteTask}
              onAdd={openAdd}
              onReorder={reorderTasks}
              topComponent={<Header streak={streak} onAddTask={openAdd} />}
              bottomComponent={<Charts dailyLog={dailyLog} />}
            />
          )}
        </View>

        {modalOpen && (
          <TaskModal
            task={editingTask}
            onSave={handleSave}
            onClose={closeModal}
            onDelete={handleDelete}
          />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
