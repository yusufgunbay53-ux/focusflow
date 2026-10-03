import { Task } from "./types";

export const SAMPLE_TASKS: Task[] = [
  {
    id: "sample-1",
    title: "Günün en önemli işini seç",
    priority: "high",
    status: "todo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    title: "25 dakikalık ilk Pomodoro'yu başlat",
    priority: "medium",
    status: "in_progress",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-3",
    title: "Masaüstünü 2 dakikada toparla",
    priority: "low",
    status: "done",
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
];
