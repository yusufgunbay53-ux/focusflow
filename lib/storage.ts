import { Task, PomodoroStats } from "./types";

const TASKS_KEY = "focusflow_tasks";
const STATS_KEY = "focusflow_stats";

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadStats(): PomodoroStats {
  if (typeof window === "undefined") {
    return {
      completedPomodoros: 0,
      totalFocusMinutes: 0,
      todayCompletedTasks: 0,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
  }
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      return {
        completedPomodoros: 0,
        totalFocusMinutes: 0,
        todayCompletedTasks: 0,
        lastUpdated: new Date().toISOString().slice(0, 10),
      };
    }
    const stats: PomodoroStats = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    // Reset daily task count if day changed
    if (stats.lastUpdated !== today) {
      return {
        ...stats,
        todayCompletedTasks: 0,
        lastUpdated: today,
      };
    }
    return stats;
  } catch {
    return {
      completedPomodoros: 0,
      totalFocusMinutes: 0,
      todayCompletedTasks: 0,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
  }
}

export function saveStats(stats: PomodoroStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}