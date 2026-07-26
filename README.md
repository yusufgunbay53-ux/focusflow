# FocusFlow — AI Destekli Görev & Odaklanma Asistanı

Modern, karanlık tema odaklı, glassmorphism tasarımlı bir productivity web uygulaması.

![FocusFlow](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)

## 🎯 Özellikler

### Akıllı Görev Yönetimi (Kanban)
- Sürükle-bırak (Drag & Drop) destekli 3 sütunlu board
- Öncelik etiketleri: Düşük / Orta / Yüksek
- Görev ekleme, düzenleme, silme
- localStorage ile kalıcı saklama

### Gelişmiş Pomodoro Sayacı
- 25 dk çalışma + 5 dk mola
- Animasyonlu SVG progress ring
- Süre bitince tarayıcı bildirimi + yumuşak ses uyarısı
- Çalışma / Mola modu geçişi

### AI Performans Koçu
- Görev tamamlanma oranı ve Pomodoro verilerine göre akıllı geri bildirim
- Mock AI yapısı — ileride gerçek API'ye kolayca bağlanabilir

### Ambient Ses Çalar
- Yağmur sesi (Web Audio brown noise)
- Yumuşak Lo-Fi pad
- Ses seviyesi kontrolü

### Tasarım
- Tamamen Dark Mode
- Neon mavi (`#00d2ff`) + derin gece mavisi (`#0b111e`)
- Glassmorphism kartlar
- Mobil uyumlu (PWA-ready)

## 🚀 Kurulum

```bash
git clone https://github.com/yusufgunbay53-ux/FocusFlow.git
cd FocusFlow
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

## 📦 Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS |
| İkonlar | Lucide React |
| Drag & Drop | @dnd-kit |
| State | localStorage (modüler) |
| Ses | Web Audio API |

## 📁 Proje Yapısı

```
FocusFlow/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── KanbanBoard.tsx
│   ├── PomodoroTimer.tsx
│   ├── AICoach.tsx
│   └── AmbientPlayer.tsx
├── lib/
│   ├── types.ts
│   └── storage.ts
├── public/
│   └── manifest.json
└── package.json
```

## 🔄 Gelecek İyileştirmeler

- Supabase / Firebase entegrasyonu (veri modelleri hazır)
- Gerçek AI API bağlantısı (OpenAI / Grok)
- Kullanıcı hesapları
- Haftalık istatistik grafikleri

---

Made with ❤️ for deep focus.
