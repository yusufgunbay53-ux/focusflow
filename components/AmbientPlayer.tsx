"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, CloudRain, Music } from "lucide-react";

type AmbientType = "rain" | "lofi" | null;

export default function AmbientPlayer() {
  const [active, setActive] = useState<AmbientType>(null);
  const [volume, setVolume] = useState(0.35);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Soft ambient tones via Web Audio (no external files needed)
  const rainCtx = useRef<AudioContext | null>(null);
  const rainNodes = useRef<{ noise?: AudioBufferSourceNode; gain?: GainNode; filter?: BiquadFilterNode }>({});

  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (rainNodes.current.noise) {
      try {
        rainNodes.current.noise.stop();
      } catch {}
      rainNodes.current = {};
    }
    if (rainCtx.current) {
      rainCtx.current.close().catch(() => {});
      rainCtx.current = null;
    }
  };

  const startRain = async () => {
    stopAll();
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      rainCtx.current = ctx;

      // Brown noise for rain-like sound
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + 0.02 * white) / 1.02;
        last = data[i];
        data[i] *= 3.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 400;

      const gain = ctx.createGain();
      gain.gain.value = muted ? 0 : volume * 0.4;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      rainNodes.current = { noise, gain, filter };
    } catch (e) {
      console.warn("Audio context failed", e);
    }
  };

  const startLofi = async () => {
    stopAll();
    // Simple soft pad / lo-fi-ish drone with oscillators
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      rainCtx.current = ctx;

      const gain = ctx.createGain();
      gain.gain.value = muted ? 0 : volume * 0.12;

      // Two soft sine oscillators for a warm pad
      const freqs = [220, 277.18]; // A3 + C#4
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = f;
        const oGain = ctx.createGain();
        oGain.gain.value = 0.5;
        osc.connect(oGain);
        oGain.connect(gain);
        osc.start();
        // slight detune for warmth
        osc.detune.value = i * 4;
      });

      // gentle filter
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;
      gain.connect(filter);
      filter.connect(ctx.destination);

      rainNodes.current = { gain, filter };
    } catch (e) {
      console.warn("Lofi audio failed", e);
    }
  };

  useEffect(() => {
    if (active === "rain") startRain();
    else if (active === "lofi") startLofi();
    else stopAll();

    return () => stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (rainNodes.current.gain) {
      rainNodes.current.gain.gain.value = muted ? 0 : volume * (active === "rain" ? 0.4 : 0.12);
    }
  }, [volume, muted, active]);

  const toggle = (type: AmbientType) => {
    setActive((prev) => (prev === type ? null : type));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="glass-strong rounded-2xl p-3 shadow-neon-sm flex items-center gap-2">
        <button
          onClick={() => toggle("rain")}
          title="Yağmur Sesi"
          className={`p-2.5 rounded-xl transition-all ${
            active === "rain"
              ? "bg-sky-500/20 text-sky-300 border border-sky-400/30"
              : "text-sky-400/50 hover:text-sky-300 hover:bg-white/5"
          }`}
        >
          <CloudRain className="w-4 h-4" />
        </button>

        <button
          onClick={() => toggle("lofi")}
          title="Lo-Fi Pad"
          className={`p-2.5 rounded-xl transition-all ${
            active === "lofi"
              ? "bg-violet-500/20 text-violet-300 border border-violet-400/30"
              : "text-sky-400/50 hover:text-sky-300 hover:bg-white/5"
          }`}
        >
          <Music className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-neon/15" />

        <button
          onClick={() => setMuted((m) => !m)}
          className="p-2 rounded-lg text-sky-400/50 hover:text-neon transition-colors"
        >
          {muted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-16 accent-neon h-1 cursor-pointer"
        />
      </div>
    </div>
  );
}