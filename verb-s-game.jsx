import React, { useState, useEffect } from "react";

// ---- Game data: organized by level of difficulty ----
const LEVELS = [
  {
    name: "Level 1 · He, She, It",
    blurb: "If the subject is he, she, or it → add -s. If it's I, you, we, they → no -s.",
    questions: [
      { subj: "She", pre: "She", post: "really fast.", base: "run", sform: "runs", answer: "runs",
        tip: "“She” = he/she/it (one person). Third person singular gets an -s → runs." },
      { subj: "They", pre: "They", post: "football after school.", base: "play", sform: "plays", answer: "play",
        tip: "“They” means more than one, so NO -s. The verb stays the same → play." },
      { subj: "He", pre: "He", post: "pizza on Fridays.", base: "like", sform: "likes", answer: "likes",
        tip: "“He” is one person, so add -s → likes." },
      { subj: "I", pre: "I", post: "English at school.", base: "learn", sform: "learns", answer: "learn",
        tip: "We never add -s after “I”. It stays → learn." },
      { subj: "It", pre: "It", post: "very high.", base: "jump", sform: "jumps", answer: "jumps",
        tip: "“It” is he/she/it, so add -s → jumps." },
      { subj: "We", pre: "We", post: "on Sundays.", base: "rest", sform: "rests", answer: "rest",
        tip: "“We” means more than one — no -s → rest." },
    ],
  },
  {
    name: "Level 2 · Names & Nouns",
    blurb: "A single person or thing (the dog, Tom, my sister) works just like he/she/it.",
    questions: [
      { subj: "The dog", pre: "The dog", post: "loudly at night.", base: "bark", sform: "barks", answer: "barks",
        tip: "“The dog” = one thing = it → add -s → barks." },
      { subj: "My friends", pre: "My friends", post: "video games.", base: "love", sform: "loves", answer: "love",
        tip: "“My friends” is more than one (they), so no -s → love." },
      { subj: "Tom", pre: "Tom", post: "his bike to school.", base: "ride", sform: "rides", answer: "rides",
        tip: "“Tom” is one person = he → add -s → rides." },
      { subj: "The boys", pre: "The boys", post: "in the park.", base: "run", sform: "runs", answer: "run",
        tip: "“The boys” means more than one (they), so no -s → run." },
      { subj: "My sister", pre: "My sister", post: "the piano beautifully.", base: "play", sform: "plays", answer: "plays",
        tip: "“My sister” = one person = she → add -s → plays." },
      { subj: "Birds", pre: "Birds", post: "lovely songs.", base: "sing", sform: "sings", answer: "sing",
        tip: "“Birds” is more than one (they) — no -s → sing." },
    ],
  },
  {
    name: "Level 3 · The -es Trick",
    blurb: "Verbs ending in -ch, -sh, -ss, -x, or -o add -es instead of just -s.",
    questions: [
      { subj: "He", pre: "He", post: "TV after dinner.", base: "watch", sform: "watches", answer: "watches",
        tip: "Verbs ending in -ch add -es → watch → watches." },
      { subj: "She", pre: "She", post: "to work by bus.", base: "go", sform: "goes", answer: "goes",
        tip: "Verbs ending in -o add -es → go → goes." },
      { subj: "My mom", pre: "My mom", post: "the dishes.", base: "wash", sform: "washes", answer: "washes",
        tip: "Verbs ending in -sh add -es → wash → washes." },
      { subj: "The mechanic", pre: "The mechanic", post: "broken cars.", base: "fix", sform: "fixes", answer: "fixes",
        tip: "Verbs ending in -x add -es → fix → fixes." },
      { subj: "Our teacher", pre: "Our teacher", post: "us math.", base: "teach", sform: "teaches", answer: "teaches",
        tip: "Verbs ending in -ch add -es → teach → teaches." },
      { subj: "They", pre: "They", post: "their teeth twice a day.", base: "brush", sform: "brushes", answer: "brush",
        tip: "“They” is more than one — no ending at all → brush. (The -es trick only matters when you DO add it!)" },
    ],
  },
  {
    name: "Level 4 · The -y Puzzle",
    blurb: "Consonant + y → change y to -ies (study → studies). But vowel + y → just add -s (play → plays).",
    questions: [
      { subj: "She", pre: "She", post: "English every day.", base: "study", sform: "studies", answer: "studies",
        tip: "consonant + y → drop y, add -ies → study → studies." },
      { subj: "The baby", pre: "The baby", post: "when it's hungry.", base: "cry", sform: "cries", answer: "cries",
        tip: "consonant + y → -ies → cry → cries." },
      { subj: "The eagle", pre: "The eagle", post: "over the hills.", base: "fly", sform: "flies", answer: "flies",
        tip: "consonant + y → -ies → fly → flies." },
      { subj: "My dad", pre: "My dad", post: "tennis on weekends.", base: "play", sform: "plays", answer: "plays",
        tip: "VOWEL + y (a-y) → just add -s → play → plays. No -ies here!" },
      { subj: "He", pre: "He", post: "his best in every game.", base: "try", sform: "tries", answer: "tries",
        tip: "consonant + y → -ies → try → tries." },
      { subj: "We", pre: "We", post: "the heavy bags upstairs.", base: "carry", sform: "carries", answer: "carry",
        tip: "“We” is more than one — no -s → carry. (The -ies trick only matters when you DO add it!)" },
    ],
  },
];

const CHEERS = ["Nice!", "You got it!", "Boom!", "Sweet!", "Yes!", "Spot on!", "Brilliant!"];
const OOPS = ["Almost!", "Not quite!", "Close one!", "Tricky!"];

// ---- Friendly monster mascot ----
function Monster({ mood }) {
  const eyeY = mood === "sad" ? 70 : 64;
  return (
    <svg viewBox="0 0 200 200" width="130" height="130" style={{ overflow: "visible" }}>
      <ellipse cx="100" cy="178" rx="55" ry="10" fill="rgba(0,0,0,0.18)" />
      {/* body */}
      <g style={{ transformOrigin: "100px 110px", animation: mood === "happy" ? "hop 0.6s ease" : "none" }}>
        <path d="M100 22c-40 0-66 30-66 70 0 46 30 78 66 78s66-32 66-78c0-40-26-70-66-70z"
          fill="#7ee081" stroke="#2f6b4f" strokeWidth="5" />
        {/* spots */}
        <circle cx="70" cy="70" r="9" fill="#5cc06a" />
        <circle cx="138" cy="92" r="7" fill="#5cc06a" />
        {/* antenna */}
        <line x1="100" y1="24" x2="100" y2="2" stroke="#2f6b4f" strokeWidth="5" />
        <circle cx="100" cy="0" r="7" fill="#ffd35c" stroke="#2f6b4f" strokeWidth="3" />
        {/* eyes */}
        <ellipse cx="80" cy={eyeY} rx="16" ry="18" fill="#fff" stroke="#2f6b4f" strokeWidth="3" />
        <ellipse cx="124" cy={eyeY} rx="16" ry="18" fill="#fff" stroke="#2f6b4f" strokeWidth="3" />
        <circle cx={mood === "sad" ? 78 : 82} cy={eyeY + 2} r="7" fill="#1d3b2a" />
        <circle cx={mood === "sad" ? 122 : 126} cy={eyeY + 2} r="7" fill="#1d3b2a" />
        {/* mouth */}
        {mood === "happy" && <path d="M76 108 q24 28 48 0" fill="#1d3b2a" />}
        {mood === "sad" && <path d="M80 122 q20 -16 40 0" fill="none" stroke="#1d3b2a" strokeWidth="5" strokeLinecap="round" />}
        {mood === "idle" && <path d="M82 112 q18 12 36 0" fill="none" stroke="#1d3b2a" strokeWidth="5" strokeLinecap="round" />}
        {/* cheeks */}
        <circle cx="60" cy="96" r="8" fill="#ff9aa2" opacity="0.7" />
        <circle cx="144" cy="96" r="8" fill="#ff9aa2" opacity="0.7" />
      </g>
    </svg>
  );
}

export default function App() {
  const [screen, setScreen] = useState("start"); // start | play | levelup | win
  const [level, setLevel] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [picked, setPicked] = useState(null); // the option string chosen
  const [mood, setMood] = useState("idle");

  const levelData = LEVELS[level];
  const q = levelData?.questions[qIndex];

  // randomize which side the correct answer is on, stable per question
  const [flip, setFlip] = useState(false);
  useEffect(() => { setFlip(Math.random() > 0.5); }, [level, qIndex]);

  const options = q ? (flip ? [q.sform, q.base] : [q.base, q.sform]) : [];

  function start() {
    setLevel(0); setQIndex(0); setScore(0); setStreak(0); setBestStreak(0);
    setCorrectCount(0); setTotalAnswered(0); setPicked(null); setMood("idle");
    setScreen("play");
  }

  function choose(opt) {
    if (picked) return;
    const right = opt === q.answer;
    setPicked(opt);
    setTotalAnswered((t) => t + 1);
    setMood(right ? "happy" : "sad");
    if (right) {
      const gained = 10 + Math.min(streak, 5) * 2;
      setScore((s) => s + gained);
      setStreak((s) => { const n = s + 1; setBestStreak((b) => Math.max(b, n)); return n; });
      setCorrectCount((c) => c + 1);
    } else {
      setStreak(0);
    }
  }

  function next() {
    setPicked(null);
    setMood("idle");
    if (qIndex + 1 < levelData.questions.length) {
      setQIndex((i) => i + 1);
    } else if (level + 1 < LEVELS.length) {
      setScreen("levelup");
    } else {
      setScreen("win");
    }
  }

  function nextLevel() {
    setLevel((l) => l + 1);
    setQIndex(0);
    setScreen("play");
  }

  const accuracy = totalAnswered ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const progress = levelData ? ((qIndex + (picked ? 1 : 0)) / levelData.questions.length) * 100 : 0;

  return (
    <div style={styles.root}>
      <style>{css}</style>
      <div style={styles.bgShapes}>
        <span style={{ ...styles.blob, top: "8%", left: "6%", background: "#ffd35c" }} />
        <span style={{ ...styles.blob, top: "70%", left: "82%", background: "#7ee081" }} />
        <span style={{ ...styles.blob, top: "40%", left: "88%", background: "#ff9aa2" }} />
        <span style={{ ...styles.blob, top: "82%", left: "10%", background: "#8ad7ff" }} />
      </div>

      <div style={styles.card}>
        {screen === "start" && (
          <div style={styles.center} className="fade">
            <Monster mood="idle" />
            <h1 style={styles.title}>The <span style={styles.titleAccent}>-S</span> Monster</h1>
            <p style={styles.sub}>Feed the monster the right verb!<br />Learn when to add <b>-s</b> to action words.</p>
            <div style={styles.ruleBox}>
              <p style={styles.ruleLine}><span style={styles.tag}>he / she / it</span> → add <b>-s</b> &nbsp;(<i>He runs</i>)</p>
              <p style={styles.ruleLine}><span style={{ ...styles.tag, background: "#8ad7ff" }}>I / you / we / they</span> → no -s &nbsp;(<i>They run</i>)</p>
            </div>
            <button style={styles.btnPrimary} onClick={start} className="press">Start Playing ▶</button>
          </div>
        )}

        {screen === "play" && q && (
          <div style={styles.center}>
            {/* HUD */}
            <div style={styles.hud}>
              <span style={styles.levelTag}>{levelData.name}</span>
              <div style={styles.hudRight}>
                <span style={styles.scorePill}>⭐ {score}</span>
                <span style={{ ...styles.streakPill, opacity: streak > 0 ? 1 : 0.35 }}>🔥 {streak}</span>
              </div>
            </div>
            <div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${progress}%` }} /></div>

            <div style={{ marginTop: 4 }}><Monster mood={mood} /></div>

            <div style={styles.sentence} className="fade" key={qIndex + "-" + level}>
              <span>{q.pre} </span>
              <span style={styles.blank}>
                {picked ? (picked === q.answer ? q.answer : picked) : "____"}
              </span>
              <span> {q.post}</span>
            </div>

            {!picked ? (
              <div style={styles.options}>
                {options.map((opt) => (
                  <button key={opt} style={styles.optBtn} className="press" onClick={() => choose(opt)}>
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div style={styles.feedbackWrap} className="fade">
                <div style={{
                  ...styles.feedback,
                  background: picked === q.answer ? "#e7fbe9" : "#ffeef0",
                  borderColor: picked === q.answer ? "#7ee081" : "#ff9aa2",
                }}>
                  <p style={styles.fbHead}>
                    {picked === q.answer
                      ? `✅ ${CHEERS[Math.floor(Math.random() * CHEERS.length)]}`
                      : `❌ ${OOPS[Math.floor(Math.random() * OOPS.length)]} The answer is “${q.answer}”.`}
                  </p>
                  <p style={styles.fbTip}>{q.tip}</p>
                </div>
                <button style={styles.btnPrimary} className="press" onClick={next}>
                  {qIndex + 1 < levelData.questions.length ? "Next →" : "Finish Level →"}
                </button>
              </div>
            )}
          </div>
        )}

        {screen === "levelup" && (
          <div style={styles.center} className="fade">
            <Monster mood="happy" />
            <h1 style={styles.title}>Level Up! 🎉</h1>
            <p style={styles.sub}>Score: <b>{score}</b> · Best streak: <b>{bestStreak}</b> 🔥</p>
            <div style={styles.ruleBox}>
              <p style={styles.ruleLine}><b>Next:</b> {LEVELS[level + 1].name.split("·")[1]}</p>
              <p style={{ ...styles.ruleLine, color: "#3a6b52" }}>{LEVELS[level + 1].blurb}</p>
            </div>
            <button style={styles.btnPrimary} className="press" onClick={nextLevel}>Keep Going ▶</button>
          </div>
        )}

        {screen === "win" && (
          <div style={styles.center} className="fade">
            <Monster mood="happy" />
            <h1 style={styles.title}>You Did It! 🏆</h1>
            <p style={styles.sub}>You're an <b>-S</b> expert now!</p>
            <div style={styles.statsRow}>
              <div style={styles.statBox}><div style={styles.statNum}>{score}</div><div style={styles.statLbl}>Score</div></div>
              <div style={styles.statBox}><div style={styles.statNum}>{accuracy}%</div><div style={styles.statLbl}>Correct</div></div>
              <div style={styles.statBox}><div style={styles.statNum}>{bestStreak}</div><div style={styles.statLbl}>Best 🔥</div></div>
            </div>
            <button style={styles.btnPrimary} className="press" onClick={start}>Play Again ↺</button>
          </div>
        )}
      </div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; }
.fade { animation: fade 0.45s ease both; }
@keyframes fade { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none;} }
@keyframes hop { 0%,100%{ transform: translateY(0);} 30%{ transform: translateY(-18px);} 60%{ transform: translateY(0);} }
.press { transition: transform .08s ease, box-shadow .12s ease; }
.press:hover { transform: translateY(-2px); }
.press:active { transform: translateY(2px) scale(0.98); }
`;

const styles = {
  root: {
    minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Lexend', sans-serif", position: "relative", overflow: "hidden",
    background: "radial-gradient(circle at 30% 20%, #2e9e8f 0%, #1f7d76 45%, #155e63 100%)",
    padding: 16,
  },
  bgShapes: { position: "absolute", inset: 0, pointerEvents: "none" },
  blob: { position: "absolute", width: 120, height: 120, borderRadius: "50%", filter: "blur(2px)", opacity: 0.25 },
  card: {
    position: "relative", zIndex: 2, width: "100%", maxWidth: 460, background: "#fffef7",
    borderRadius: 28, padding: "26px 22px 30px", boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
    border: "4px solid #1d3b2a",
  },
  center: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  title: { fontFamily: "'Lexend', sans-serif", fontSize: 32, fontWeight: 800, color: "#1d3b2a", margin: "8px 0 4px", lineHeight: 1.15 },
  titleAccent: { color: "#e8902b" },
  sub: { color: "#3a6b52", fontSize: 16, margin: "4px 0 16px", lineHeight: 1.4 },
  ruleBox: { background: "#f3fbef", border: "2px dashed #7ee081", borderRadius: 16, padding: "12px 16px", width: "100%", marginBottom: 18 },
  ruleLine: { margin: "6px 0", fontSize: 15, color: "#1d3b2a" },
  tag: { background: "#ffd35c", borderRadius: 8, padding: "2px 8px", fontWeight: 800, fontSize: 13, color: "#1d3b2a" },
  btnPrimary: {
    fontFamily: "'Lexend', sans-serif", fontSize: 20, color: "#fff", background: "#e8902b",
    border: "3px solid #1d3b2a", borderRadius: 16, padding: "12px 28px", cursor: "pointer",
    boxShadow: "0 6px 0 #b96f1e", fontWeight: 700,
  },
  hud: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 8 },
  levelTag: { fontFamily: "'Lexend', sans-serif", fontSize: 15, color: "#155e63", background: "#d9f3ef", padding: "4px 12px", borderRadius: 20, fontWeight: 700 },
  hudRight: { display: "flex", gap: 8 },
  scorePill: { background: "#fff3d6", border: "2px solid #ffd35c", borderRadius: 20, padding: "3px 12px", fontWeight: 800, fontSize: 15, color: "#9a6a12" },
  streakPill: { background: "#ffe6e8", border: "2px solid #ff9aa2", borderRadius: 20, padding: "3px 12px", fontWeight: 800, fontSize: 15, color: "#c44" },
  progressTrack: { width: "100%", height: 12, background: "#e6efe9", borderRadius: 20, overflow: "hidden", border: "2px solid #cfe3d6" },
  progressFill: { height: "100%", background: "linear-gradient(90deg,#7ee081,#2e9e8f)", borderRadius: 20, transition: "width .35s ease" },
  sentence: {
    fontFamily: "'Lexend', sans-serif", fontSize: 26, color: "#1d3b2a", lineHeight: 1.4,
    margin: "6px 0 18px", fontWeight: 700, letterSpacing: "0.2px", background: "#f3fbef", borderRadius: 16, padding: "16px 18px", width: "100%",
    border: "2px solid #d4ecd8",
  },
  blank: { color: "#e8902b", borderBottom: "3px solid #e8902b", padding: "0 6px" },
  options: { display: "flex", gap: 14, width: "100%" },
  optBtn: {
    flex: 1, fontFamily: "'Lexend', sans-serif", fontSize: 24, color: "#1d3b2a", background: "#fff",
    border: "3px solid #1d3b2a", borderRadius: 18, padding: "18px 8px", cursor: "pointer", fontWeight: 700,
    boxShadow: "0 6px 0 #c9d6cd", fontWeight: 700,
  },
  feedbackWrap: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 },
  feedback: { width: "100%", border: "2px solid", borderRadius: 16, padding: "14px 16px", textAlign: "left" },
  fbHead: { fontFamily: "'Lexend', sans-serif", fontSize: 19, margin: "0 0 6px", color: "#1d3b2a" },
  fbTip: { margin: 0, fontSize: 15.5, color: "#33524a", lineHeight: 1.45 },
  statsRow: { display: "flex", gap: 12, margin: "10px 0 20px", width: "100%" },
  statBox: { flex: 1, background: "#f3fbef", borderRadius: 16, padding: "14px 6px", border: "2px solid #d4ecd8" },
  statNum: { fontFamily: "'Lexend', sans-serif", fontSize: 26, color: "#e8902b", fontWeight: 800 },
  statLbl: { fontSize: 13, color: "#3a6b52", fontWeight: 700 },
};
