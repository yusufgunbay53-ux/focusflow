export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface PomodoroStats {
  completedPomodoros: number;
  totalFocusMinutes: number;
  todayCompletedTasks: number;
  lastUpdated: string; // YYYY-MM-DD
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Yapılacaklar",
  in_progress: "Yapılıyor",
  done: "Tamamlandı",
};