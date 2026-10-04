import { Task, PomodoroStats } from "./types";
import { loadTasks, saveTasks, loadStats, saveStats } from "./storage";

/**
 * Veri katmanı sözleşmesi.
 * Şu an LocalRepository localStorage kullanır.
 * Supabase/Firebase geçişi için aynı arayüzü uygulayan bir sınıf yazıp
 * getRepository() içinde NEXT_PUBLIC_DATA_PROVIDER ile seçmek yeterli.
 */
export interface FocusRepository {
  loadTasks(): Promise<Task[]> | Task[];
  saveTasks(tasks: Task[]): Promise<void> | void;
  loadStats(): Promise<PomodoroStats> | PomodoroStats;
  saveStats(stats: PomodoroStats): Promise<void> | void;
}

export class LocalRepository implements FocusRepository {
  loadTasks() {
    return loadTasks();
  }
  saveTasks(tasks: Task[]) {
    saveTasks(tasks);
  }
  loadStats() {
    return loadStats();
  }
  saveStats(stats: PomodoroStats) {
    saveStats(stats);
  }
}

export function getRepository(): FocusRepository {
  const provider = process.env.NEXT_PUBLIC_DATA_PROVIDER ?? "local";
  if (provider === "supabase") {
    // Örnek: return new SupabaseRepository(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    console.warn("Supabase provider henüz bağlı değil, localStorage kullanılıyor.");
  }
  return new LocalRepository();
}
