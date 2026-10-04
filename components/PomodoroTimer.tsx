"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

interface Props {
  onComplete: () => void;
}

export default function PomodoroTimer({ onComplete }: Props) {
  const [mode, setMode] = useState<"work" | "break">("work");
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = mode === "work" ? WORK_SECONDS : BREAK_SECONDS;
  const progress = 1 - secondsLeft / total;

  const notify = useCallback(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(mode === "work" ? "Pomodoro bitti!" : "Mola bitti!", {
        body:
          mode === "work"
            ? "Harika iş! 5 dakikalık mola zamanı."
            : "Mola bitti, odaklanmaya devam edelim.",
        icon: "/icon.svg",
      });
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = mode === "work" ? 523.25 : 659.25;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.9);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = mode === "work" ? 784 : 523.25;
      osc2.type = "sine";
      gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);
      osc2.start(ctx.currentTime + 0.18);
      osc2.stop(ctx.currentTime + 1.1);
    } catch {
      /* ses engellenirse sessiz geç */
    }
  }, [mode]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsRunning(false);
          notify();
          if (mode === "work") {
            onComplete();
            setMode("break");
            return BREAK_SECONDS;
          }
          setMode("work");
          return WORK_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, notify, onComplete]);

  const toggle = () => setIsRunning((v) => !v);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(mode === "work" ? WORK_SECONDS : BREAK_SECONDS);
  };

  const switchMode = (m: "work" | "break") => {
    setIsRunning(false);
    setMode(m);
    setSecondsLeft(m === "work" ? WORK_SECONDS : BREAK_SECONDS);
  };

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const secs = (secondsLeft % 60).toString().padStart(2, "0");
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="glass rounded-2xl p-6 flex flex-col items-center gap-5 h-full">
      <div className="flex gap-2">
        <button
          onClick={() => switchMode("work")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === "work"
              ? "bg-neon/15 text-neon border border-neon/30"
              : "text-sky-400/50 hover:text-sky-300"
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          Çalışma 25 dk
        </button>
        <button
          onClick={() => switchMode("break")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === "break"
              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
              : "text-sky-400/50 hover:text-sky-300"
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          Mola 5 dk
        </button>
      </div>

      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(0,210,255,0.08)" strokeWidth="6" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={mode === "work" ? "#00d2ff" : "#34d399"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="timer-ring"
            style={{ filter: `drop-shadow(0 0 6px ${mode === "work" ? "#00d2ff" : "#34d399"})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tracking-tighter tabular-nums text-sky-50">
            {mins}:{secs}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-sky-400/50 mt-1">
            {mode === "work" ? "Odak" : "Mola"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="p-2.5 rounded-xl glass border border-neon/10 text-sky-400/60 hover:text-neon hover:border-neon/30 transition-all"
          title="Sıfırla"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={toggle}
          className="p-4 rounded-2xl bg-neon text-night shadow-neon hover:bg-neon-dim transition-all active:scale-95"
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>
        <div className="w-10" />
      </div>
    </div>
  );
}
