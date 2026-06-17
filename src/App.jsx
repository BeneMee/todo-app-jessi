import { useState } from 'react'
import { useAppState } from './hooks/useAppState'
import { Header } from './components/Header'
import { TaskList } from './components/TaskList'
import { TaskModal } from './components/TaskModal'
import { Charts } from './components/Charts'

export default function App() {
  const {
    todayTasks,
    todayStates,
    dailyLog,
    streak,
    addTask,
    updateTask,
    deleteTask,
    setTaskState,
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
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header streak={streak} onAddTask={openAdd} />
      <main style={{
        maxWidth: '672px',
        margin: '0 auto',
        padding: '24px 16px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}>
        <TaskList
          tasks={todayTasks}
          states={todayStates}
          onSetState={setTaskState}
          onEdit={openEdit}
          onDelete={deleteTask}
          onAdd={openAdd}
        />
        <Charts dailyLog={dailyLog} />
      </main>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={closeModal}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
