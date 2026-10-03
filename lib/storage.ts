import { Task, PomodoroStats } from "./types";
import { SAMPLE_TASKS } from "./seed";

const TASKS_KEY = "focusflow_tasks";
const STATS_KEY = "focusflow_stats";

function emptyStats(): PomodoroStats {
  return {
    completedPomodoros: 0,
    totalFocusMinutes: 0,
    todayCompletedTasks: 0,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return SAMPLE_TASKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SAMPLE_TASKS;
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadStats(): PomodoroStats {
  if (typeof window === "undefined") return emptyStats();
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return emptyStats();
    const stats: PomodoroStats = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    if (stats.lastUpdated !== today) {
      return { ...stats, todayCompletedTasks: 0, lastUpdated: today };
    }
    return stats;
  } catch {
    return emptyStats();
  }
}

export function saveStats(stats: PomodoroStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}
