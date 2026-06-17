import { useState, useEffect, useCallback } from 'react'
import * as storage from '../lib/storage'
import { todayStr, isTaskDueToday, daysBetween } from '../lib/dateUtils'

// AsyncStorage has no crypto, so we generate ids without the uuid polyfill.
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
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
  const [tasks, setTasksState] = useState([])
  const [taskStates, setTaskStatesState] = useState({})
  const [dailyLog, setDailyLogState] = useState({})
  const [streak, setStreak] = useState({ count: 0, lastOpenDate: null })
  const [loaded, setLoaded] = useState(false)

  // Initial load from AsyncStorage + streak roll-over.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [t, ts, dl, s] = await Promise.all([
        storage.loadTasks(),
        storage.loadTaskStates(),
        storage.loadDailyLog(),
        storage.loadStreak(),
      ])
      if (cancelled) return

      const today = todayStr()
      let newStreak = s
      if (s.lastOpenDate !== today) {
        let newCount
        if (!s.lastOpenDate) {
          newCount = 1
        } else {
          const diff = daysBetween(s.lastOpenDate, today)
          newCount = diff === 1 ? s.count + 1 : 1
        }
        newStreak = { count: newCount, lastOpenDate: today }
        storage.saveStreak(newStreak)
      }

      setTasksState(t)
      setTaskStatesState(ts)
      setDailyLogState(dl)
      setStreak(newStreak)
      setLoaded(true)
    })()
    return () => { cancelled = true }
  }, [])

  // Keep today's aggregate log in sync once data has loaded.
  useEffect(() => {
    if (!loaded) return
    const today = todayStr()
    const entry = computeTodayEntry(tasks, taskStates)
    setDailyLogState(prev => {
      const updated = { ...prev, [today]: entry }
      storage.saveDailyLog(updated)
      return updated
    })
  }, [taskStates, tasks, loaded])

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
    const newTask = { id: genId(), ...taskData }
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
  // (today) task ids, keeping non-visible tasks in their original slots.
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
    loaded,
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
