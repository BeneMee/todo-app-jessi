const KEYS = {
  TASKS: 'tasks',
  DAILY_LOG: 'daily_log',
  STREAK: 'streak',
  TASK_STATES: 'task_states',
}

const parse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const loadTasks = () => parse(KEYS.TASKS, [])
export const saveTasks = (v) => localStorage.setItem(KEYS.TASKS, JSON.stringify(v))

export const loadStreak = () => parse(KEYS.STREAK, { count: 0, lastOpenDate: null })
export const saveStreak = (v) => localStorage.setItem(KEYS.STREAK, JSON.stringify(v))

export const loadDailyLog = () => parse(KEYS.DAILY_LOG, {})
export const saveDailyLog = (v) => localStorage.setItem(KEYS.DAILY_LOG, JSON.stringify(v))

export const loadTaskStates = () => parse(KEYS.TASK_STATES, {})
export const saveTaskStates = (v) => localStorage.setItem(KEYS.TASK_STATES, JSON.stringify(v))
