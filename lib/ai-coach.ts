import { Task, PomodoroStats } from "./types";

export type InsightTone = "positive" | "neutral" | "nudge";

export interface CoachInsight {
  id: string;
  message: string;
  tone: InsightTone;
  kind: "welcome" | "completion" | "pace" | "pomodoro" | "priority" | "focus";
}

/**
 * Mock AI koçu — görev + Pomodoro verisinden içgörü üretir.
 * Gerçek API için generateInsights imzası aynı kalabilir;
 * içeride fetch("/api/coach") çağrısına geçilebilir.
 */
export function generateInsights(
  tasks: Task[],
  stats: PomodoroStats
): CoachInsight[] {
  const insights: CoachInsight[] = [];
  const done = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const highPriorityOpen = tasks.filter(
    (t) => t.priority === "high" && t.status !== "done"
  ).length;
  const ratio = total === 0 ? 0 : done / total;

  if (total === 0) {
    insights.push({
      id: "welcome",
      kind: "welcome",
      tone: "neutral",
      message: "Henüz görev eklenmemiş. İlk görevini ekleyerek başla!",
    });
  } else if (done === total) {
    insights.push({
      id: "all-done",
      kind: "completion",
      tone: "positive",
      message: "Tüm görevler tamamlandı! Bugün efsane bir gün 🌟",
    });
  } else if (ratio >= 0.7) {
    insights.push({
      id: "great-pace",
      kind: "pace",
      tone: "positive",
      message: `Bugün harika gidiyorsun! Görevlerin %${Math.round(ratio * 100)}'i tamamlandı.`,
    });
  } else if (ratio < 0.3 && total > 2) {
    insights.push({
      id: "slow-pace",
      kind: "pace",
      tone: "nudge",
      message:
        "Biraz yavaşladın, 5 dakika mola vermek ister misin? Sonra yeniden odaklan.",
    });
  }

  if (stats.completedPomodoros >= 4) {
    insights.push({
      id: "pomo-streak",
      kind: "pomodoro",
      tone: "positive",
      message: `Bugün ${stats.completedPomodoros} Pomodoro tamamladın — toplam ${stats.totalFocusMinutes} dakika odak!`,
    });
  } else if (stats.completedPomodoros === 0 && total > 0) {
    insights.push({
      id: "start-pomo",
      kind: "pomodoro",
      tone: "nudge",
      message:
        "Henüz Pomodoro başlatmadın. Zamanlayıcıyı açıp derin odak moduna geç!",
    });
  }

  if (highPriorityOpen > 0) {
    insights.push({
      id: "high-priority",
      kind: "priority",
      tone: "nudge",
      message: `${highPriorityOpen} yüksek öncelikli görev bekliyor. Önce onlara odaklan.`,
    });
  }

  if (inProgress > 2) {
    insights.push({
      id: "too-many",
      kind: "focus",
      tone: "nudge",
      message:
        "Aynı anda çok fazla görev açık. Tek birine odaklanmak daha verimli olabilir.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "steady",
      kind: "pace",
      tone: "positive",
      message: "Her şey yolunda görünüyor. Odaklanmaya devam et!",
    });
  }

  return insights.slice(0, 3);
}
