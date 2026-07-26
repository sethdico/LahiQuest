# 🎮 LahiQuest — Learn Philippine History, But Make It Fun

A gamified WebAR learning platform for Philippine history, built for a Grade 10 MAPEH / Digital Interactive Media project.

## ⚠️ Security fix in this version

The previous version had an OpenRouter API key hardcoded directly in `index.html`, visible to anyone who viewed the page source — including on a public GitHub repo. **If you had a key in the old code, revoke/rotate it on OpenRouter now.**

This version moves all AI calls behind a serverless function (`/api/ai.js`) so the key lives only on the server:

1. Deploy this repo to **Vercel**.
2. In your Vercel project → **Settings → Environment Variables**, add:
   - `OPENROUTER_API_KEY` = your key
3. Redeploy. The front-end calls `/api/ai`, which never exposes the key to the browser.

If you just want to preview the site without deploying (e.g. `python -m http.server`), every AI feature automatically falls back to a built-in offline question bank — the site stays fully usable either way.

## ✨ What's new

- **Non-repetitive AI quizzes** — each assessment attempt sends the AI a rotating set of sub-topics plus a list of the student's last ~15 questions for that module, so re-attempts don't converge on the same set.
- **AI Tutor chat** — students can ask free-form questions ("bakit natalo ang Katipunan sa una?") and get a grounded, Grade-10-level answer.
- **Flashcard drill** — AI-generated deck with a simple spaced-repetition twist: cards marked "still learning" get requeued into the same session.
- **60-second Speed Round** — rapid-fire AI trivia against the clock.
- **Mystery Figure** — now avoids repeating the same historical figure across sessions (tracked per student).
- **Progress system** — per-module progress bars, a points total, a pass streak, and 7 unlockable badges.
- **Teacher dashboard** — score bars per student, badge count, and CSV export.
- **Dark mode**, keyboard-focus states, and `prefers-reduced-motion` support.
- **Two new modules** (5 total, matching the original proposal): American Era & WWII, Modern Filipino Culture.
- New visual identity: Fraunces (display) + Sora (body) + Space Mono (data), a warm "manuscript and gold" palette, and a woven "banig" motif as the page's signature detail.

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3, vanilla JavaScript
- **AR:** A-Frame + AR.js (WebAR)
- **AI:** OpenRouter, called via a Vercel serverless function (`/api/ai`)
- **Storage:** LocalStorage (offline-first, per-device progress)
- **Deployment:** Vercel

## 🚀 Run locally

```bash
git clone https://github.com/sethdico/LahiQuest.git
cd LahiQuest
npx http-server
# visit http://localhost:8080
```

AI features need `/api/ai` to be live, which only happens on Vercel (or `vercel dev` locally with `.env.local` set from `.env.example`). Without it, the site uses its offline question bank automatically.

## 🐛 Troubleshooting

**AI features not responding?** Check that `OPENROUTER_API_KEY` is set in Vercel and that you redeployed after adding it. The browser console will show `AI endpoint unavailable` if `/api/ai` can't be reached — the app will keep working with offline content either way.

**AR not working?** Allow camera permissions, use a printed or on-screen Hiro marker, and try landscape mode.

**404 on Vercel?** Make sure `index.html` is in the repo root and that `api/ai.js` is at `api/ai.js` (Vercel auto-detects it as a serverless function).

## 📄 License

MIT — feel free to use, modify, and share.

---

**Subject:** MAPEH (Music, Arts, Physical Education, Health) / Digital Interactive Media
