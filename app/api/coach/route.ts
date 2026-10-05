import { NextResponse } from "next/server";
import { generateInsights } from "@/lib/ai-coach";
import { PomodoroStats, Task } from "@/lib/types";

/**
 * AI koçu için hazır uç nokta.
 * Şu an mock generateInsights kullanır.
 * Gerçek modele geçmek için OPENAI_API_KEY / XAI_API_KEY ile buradan çağrı yapılabilir.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { tasks?: Task[]; stats?: PomodoroStats }
    | null;

  const tasks = Array.isArray(body?.tasks) ? body!.tasks : [];
  const stats: PomodoroStats = body?.stats ?? {
    completedPomodoros: 0,
    totalFocusMinutes: 0,
    todayCompletedTasks: 0,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };

  return NextResponse.json({
    provider: process.env.AI_PROVIDER ?? "mock",
    insights: generateInsights(tasks, stats),
  });
}
