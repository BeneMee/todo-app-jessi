import AsyncStorage from '@react-native-async-storage/async-storage'

const KEYS = {
  TASKS: 'tasks',
  DAILY_LOG: 'daily_log',
  STREAK: 'streak',
  TASK_STATES: 'task_states',
}

const load = async (key, fallback) => {
  try {
    const raw = await AsyncStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const save = (key, v) => AsyncStorage.setItem(key, JSON.stringify(v))

export const loadTasks = () => load(KEYS.TASKS, [])
export const saveTasks = (v) => save(KEYS.TASKS, v)

export const loadStreak = () => load(KEYS.STREAK, { count: 0, lastOpenDate: null })
export const saveStreak = (v) => save(KEYS.STREAK, v)

export const loadDailyLog = () => load(KEYS.DAILY_LOG, {})
export const saveDailyLog = (v) => save(KEYS.DAILY_LOG, v)

export const loadTaskStates = () => load(KEYS.TASK_STATES, {})
export const saveTaskStates = (v) => save(KEYS.TASK_STATES, v)
