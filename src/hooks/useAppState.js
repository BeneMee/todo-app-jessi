import { useState, useEffect, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import * as storage from '../lib/storage'
import { todayStr, isTaskDueToday, daysBetween } from '../lib/dateUtils'

function initStreak() {
  const today = todayStr()
  const s = storage.loadStreak()
  if (s.lastOpenDate === today) return s

  let newCount
  if (!s.lastOpenDate) {
    newCount = 1
  } else {
    const diff = daysBetween(s.lastOpenDate, today)
    newCount = diff === 1 ? s.count + 1 : 1
  }

  const newStreak = { count: newCount, lastOpenDate: today }
  storage.saveStreak(newStreak)
  return newStreak
}

function computeTodayEntry(tasks, taskStates) {
  const today = todayStr()
  const todayTasks = tasks.filter(isTaskDueToday)
  const states = taskStates[today] || {}

  let done = 0, uncompleted = 0, ignored = 0
  for (const task of todayTasks) {
    const s = states[task.id] || 'uncompleted'
    if (s === 'done') done++
    else if (s === 'ignored') ignored++
    else uncompleted++
  }
  return { done, uncompleted, ignored }
}

export function useAppState() {
  const [tasks, setTasksState] = useState(storage.loadTasks)
  const [taskStates, setTaskStatesState] = useState(storage.loadTaskStates)
  const [dailyLog, setDailyLogState] = useState(storage.loadDailyLog)
  const [streak] = useState(initStreak)

  useEffect(() => {
    const today = todayStr()
    const entry = computeTodayEntry(tasks, taskStates)
    setDailyLogState(prev => {
      const updated = { ...prev, [today]: entry }
      storage.saveDailyLog(updated)
      return updated
    })
  }, [taskStates, tasks])

  const setTaskState = useCallback((taskId, status) => {
    const today = todayStr()
    setTaskStatesState(prev => {
      const updated = {
        ...prev,
        [today]: { ...(prev[today] || {}), [taskId]: status },
      }
      storage.saveTaskStates(updated)
      return updated
    })
  }, [])

  const addTask = useCallback((taskData) => {
    const newTask = { id: uuid(), ...taskData }
    setTasksState(prev => {
      const updated = [...prev, newTask]
      storage.saveTasks(updated)
      return updated
    })
  }, [])

  const updateTask = useCallback((id, updates) => {
    setTasksState(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t)
      storage.saveTasks(updated)
      return updated
    })
  }, [])

  const deleteTask = useCallback((id) => {
    setTasksState(prev => {
      const updated = prev.filter(t => t.id !== id)
      storage.saveTasks(updated)
      return updated
    })
  }, [])

  // Reorders the full tasks list based on the new order of the visible
  // (today) task ids. Tasks that are not part of the visible list keep
  // their original positions, so reordering today's view never disturbs
  // tasks scheduled for other days.
  const reorderTasks = useCallback((orderedVisibleIds) => {
    setTasksState(prev => {
      const visible = new Set(orderedVisibleIds)
      const byId = new Map(prev.map(t => [t.id, t]))
      let i = 0
      const updated = prev.map(t => {
        if (!visible.has(t.id)) return t
        return byId.get(orderedVisibleIds[i++]) || t
      })
      storage.saveTasks(updated)
      return updated
    })
  }, [])

  const today = todayStr()
  const todayStates = taskStates[today] || {}
  const todayTasks = tasks.filter(isTaskDueToday)

  return {
    tasks,
    todayTasks,
    todayStates,
    dailyLog,
    streak,
    addTask,
    updateTask,
    deleteTask,
    setTaskState,
    reorderTasks,
  }
}
