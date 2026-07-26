"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import KanbanBoard from "@/components/KanbanBoard";
import PomodoroTimer from "@/components/PomodoroTimer";
import AICoach from "@/components/AICoach";
import AmbientPlayer from "@/components/AmbientPlayer";
import { Task, TaskStatus, Priority, PomodoroStats } from "@/lib/types";
import { loadTasks, saveTasks, loadStats, saveStats } from "@/lib/storage";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<PomodoroStats>({
    completedPomodoros: 0,
    totalFocusMinutes: 0,
    todayCompletedTasks: 0,
    lastUpdated: new Date().toISOString().slice(0, 10),
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setStats(loadStats());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveTasks(tasks);
  }, [tasks, mounted]);

  useEffect(() => {
    if (mounted) saveStats(stats);
  }, [stats, mounted]);

  const addTask = (title: string, priority: Priority) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      priority,
      status: "todo",
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const moveTask = (id: string, status: TaskStatus) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              completedAt:
                status === "done" ? new Date().toISOString() : undefined,
            }
          : t
      );
      if (status === "done") {
        setStats((s) => ({
          ...s,
          todayCompletedTasks: s.todayCompletedTasks + 1,
        }));
      }
      return updated;
    });
  };

  const onPomodoroComplete = () => {
    setStats((s) => ({
      ...s,
      completedPomodoros: s.completedPomodoros + 1,
      totalFocusMinutes: s.totalFocusMinutes + 25,
    }));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top row: Timer + AI Coach */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PomodoroTimer onComplete={onPomodoroComplete} />
          </div>
          <div className="lg:col-span-2">
            <AICoach tasks={tasks} stats={stats} />
          </div>
        </div>

        {/* Kanban */}
        <KanbanBoard
          tasks={tasks}
          onAdd={addTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onMove={moveTask}
        />
      </main>

      <AmbientPlayer />
    </div>
  );
}