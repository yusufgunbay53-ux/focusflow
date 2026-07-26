"use client";

import { useMemo } from "react";
import { Bot, Zap, Target, TrendingUp, Coffee } from "lucide-react";
import { Task, PomodoroStats } from "@/lib/types";

interface Props {
  tasks: Task[];
  stats: PomodoroStats;
}

interface Insight {
  icon: React.ReactNode;
  message: string;
  tone: "positive" | "neutral" | "nudge";
}

function generateInsights(tasks: Task[], stats: PomodoroStats): Insight[] {
  const insights: Insight[] = [];
  const done = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const highPriorityOpen = tasks.filter(
    (t) => t.priority === "high" && t.status !== "done"
  ).length;

  // Completion rate
  if (total === 0) {
    insights.push({
      icon: <Target className="w-4 h-4" />,
      message: "Henüz görev eklenmemiş. İlk görevini ekleyerek başla!",
      tone: "neutral",
    });
  } else if (done === total) {
    insights.push({
      icon: <Zap className="w-4 h-4" />,
      message: "Tüm görevler tamamlandı! Bugün efsane bir gün 🌟",
      tone: "positive",
    });
  } else if (done / total >= 0.7) {
    insights.push({
      icon: <TrendingUp className="w-4 h-4" />,
      message: `Harika gidiyorsun! Görevlerin %${Math.round((done / total) * 100)}'i tamamlandı.`,
      tone: "positive",
    });
  } else if (done / total < 0.3 && total > 2) {
    insights.push({
      icon: <Coffee className="w-4 h-4" />,
      message: "Biraz yavaşladın gibi. 5 dakikalık bir mola verip yeniden başlamak ister misin?",
      tone: "nudge",
    });
  }

  // Pomodoro feedback
  if (stats.completedPomodoros >= 4) {
    insights.push({
      icon: <Zap className="w-4 h-4" />,
      message: `Bugün ${stats.completedPomodoros} Pomodoro tamamladın — toplam ${stats.totalFocusMinutes} dakika odak!`,
      tone: "positive",
    });
  } else if (stats.completedPomodoros === 0 && total > 0) {
    insights.push({
      icon: <Target className="w-4 h-4" />,
      message: "Henüz Pomodoro başlatmadın. Zamanlayıcıyı açıp derin odak moduna geç!",
      tone: "nudge",
    });
  }

  // High priority warning
  if (highPriorityOpen > 0) {
    insights.push({
      icon: <Target className="w-4 h-4" />,
      message: `${highPriorityOpen} yüksek öncelikli görev bekliyor. Önce onlara odaklan.`,
      tone: "nudge",
    });
  }

  // In progress
  if (inProgress > 2) {
    insights.push({
      icon: <Coffee className="w-4 h-4" />,
      message: "Aynı anda çok fazla görev üzerinde çalışıyorsun. Birine odaklanmak daha verimli olabilir.",
      tone: "nudge",
    });
  }

  if (insights.length === 0) {
    insights.push({
      icon: <Bot className="w-4 h-4" />,
      message: "Her şey yolunda görünüyor. Odaklanmaya devam et!",
      tone: "positive",
    });
  }

  return insights.slice(0, 3);
}

export default function AICoach({ tasks, stats }: Props) {
  const insights = useMemo(() => generateInsights(tasks, stats), [tasks, stats]);

  const toneStyles = {
    positive: "border-emerald-500/20 bg-emerald-500/5",
    neutral: "border-sky-500/20 bg-sky-500/5",
    nudge: "border-amber-500/20 bg-amber-500/5",
  };

  const toneIcon = {
    positive: "text-emerald-400",
    neutral: "text-sky-400",
    nudge: "text-amber-400",
  };

  return (
    <div className="glass rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/25 flex items-center justify-center">
          <Bot className="w-4 h-4 text-neon" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-sky-100">AI Performans Koçu</h2>
          <p className="text-[10px] text-sky-400/50">Görev & Pomodoro analizine göre öneriler</p>
        </div>
      </div>

      <div className="flex-1 space-y-2.5">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-xl border ${toneStyles[insight.tone]} transition-all`}
          >
            <div className={`mt-0.5 ${toneIcon[insight.tone]}`}>{insight.icon}</div>
            <p className="text-sm text-sky-100/90 leading-relaxed">{insight.message}</p>
          </div>
        ))}
      </div>

      {/* Quick stats bar */}
      <div className="mt-4 pt-3 border-t border-neon/10 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-neon">{stats.completedPomodoros}</p>
          <p className="text-[10px] text-sky-400/50">Pomodoro</p>
        </div>
        <div>
          <p className="text-lg font-bold text-neon">{stats.totalFocusMinutes}</p>
          <p className="text-[10px] text-sky-400/50">Dk. Odak</p>
        </div>
        <div>
          <p className="text-lg font-bold text-neon">{stats.todayCompletedTasks}</p>
          <p className="text-[10px] text-sky-400/50">Bugün Bitti</p>
        </div>
      </div>
    </div>
  );
}