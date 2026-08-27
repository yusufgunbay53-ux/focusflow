"use client";

import { useMemo } from "react";
import { Bot, Zap, Target, TrendingUp, Coffee } from "lucide-react";
import { Task, PomodoroStats } from "@/lib/types";
import { generateInsights, CoachInsight } from "@/lib/ai-coach";

interface Props {
  tasks: Task[];
  stats: PomodoroStats;
}

function iconFor(insight: CoachInsight) {
  switch (insight.kind) {
    case "completion":
    case "pomodoro":
      return <Zap className="w-4 h-4" />;
    case "pace":
      return insight.tone === "nudge" ? (
        <Coffee className="w-4 h-4" />
      ) : (
        <TrendingUp className="w-4 h-4" />
      );
    case "focus":
      return <Coffee className="w-4 h-4" />;
    default:
      return <Target className="w-4 h-4" />;
  }
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
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`flex items-start gap-3 p-3 rounded-xl border ${toneStyles[insight.tone]} transition-all`}
          >
            <div className={`mt-0.5 ${toneIcon[insight.tone]}`}>{iconFor(insight)}</div>
            <p className="text-sm text-sky-100/90 leading-relaxed">{insight.message}</p>
          </div>
        ))}
      </div>

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
