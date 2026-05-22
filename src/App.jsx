import { useState, useEffect } from "react";

const muscleColors = {
  "CARDIO WARMUP": "#888", "QUADS & GLUTES": "#E879A0", "QUADS": "#E879A0",
  "HAMSTRINGS": "#A78BFA", "HAMSTRINGS & GLUTES": "#A78BFA", "GLUTES": "#F472B6",
  "OUTER THIGH & GLUTES": "#FB923C", "OUTER THIGH": "#FB923C", "INNER THIGH": "#FBBF24",
  "CALVES": "#34D399", "BACK WIDTH": "#60A5FA", "BACK": "#60A5FA", "MID BACK": "#3B82F6",
  "SHOULDERS": "#818CF8", "CHEST": "#F87171", "BICEPS": "#4ADE80", "TRICEPS": "#A3E635",
  "SIDE DELTS": "#818CF8", "MID CHEST": "#F87171", "UPPER CHEST": "#FB923C",
  "LOWER CHEST": "#F87171", "FRONT DELTS": "#818CF8", "TRICEPS LONG HEAD": "#A3E635",
  "LATS WIDTH": "#60A5FA", "REAR DELTS": "#C084FC", "TRAPS": "#94A3B8",
  "BICEPS PEAK": "#4ADE80", "LOWER BACK": "#FB923C", "BICEPS & BRACHIALIS": "#4ADE80",
};
const muscleIcon = {
  "CARDIO WARMUP": "🚶", "QUADS & GLUTES": "🦵", "QUADS": "🦵", "HAMSTRINGS": "🦵",
  "HAMSTRINGS & GLUTES": "🍑", "GLUTES": "🍑", "OUTER THIGH & GLUTES": "🍑",
  "OUTER THIGH": "🦵", "INNER THIGH": "🦵", "CALVES": "🦵", "BACK WIDTH": "💪",
  "BACK": "💪", "MID BACK": "💪", "SHOULDERS": "💪", "CHEST": "💪", "BICEPS": "💪",
  "TRICEPS": "💪", "SIDE DELTS": "💪", "MID CHEST": "💪", "UPPER CHEST": "💪",
  "LOWER CHEST": "💪", "FRONT DELTS": "💪", "TRICEPS LONG HEAD": "💪",
  "LATS WIDTH": "💪", "REAR DELTS": "💪", "TRAPS": "💪", "BICEPS PEAK": "💪",
  "LOWER BACK": "💪", "BICEPS & BRACHIALIS": "💪",
};

const mansoorPlan = {
  "Push 1": {
    day: "Mon", color: "#FF4D4D",
    exercises: [
      { name: "Flat Machine Chest Press", target: "MID CHEST", sets: 4, defaultReps: 12 },
      { name: "Panatta Upper Pec Flye", target: "UPPER CHEST", sets: 3, defaultReps: 15 },
      { name: "Vertical Pec Fly", target: "LOWER CHEST", sets: 3, defaultReps: 15 },
      { name: "Neutral Grip Machine Shoulder Press", target: "FRONT DELTS", sets: 3, defaultReps: 12 },
      { name: "Machine Lateral Raise", target: "SIDE DELTS", sets: 3, defaultReps: 15 },
      { name: "Tricep Dip Machine", target: "TRICEPS", sets: 3, defaultReps: 12 },
      { name: "Cable Overhead Extension (Rope)", target: "TRICEPS LONG HEAD", sets: 3, defaultReps: 12 },
      { name: "Hip Abductor", target: "OUTER THIGH", sets: 3, defaultReps: 15 },
      { name: "Standing Calf Raise", target: "CALVES", sets: 3, defaultReps: 20 },
    ],
  },
  "Pull 1": {
    day: "Tue", color: "#4D9FFF",
    exercises: [
      { name: "Lat Pulldown (V-bar)", target: "LATS WIDTH", sets: 4, defaultReps: 12 },
      { name: "Seated Cable Row", target: "MID BACK", sets: 3, defaultReps: 12 },
      { name: "Machine Rear Delt Flye", target: "REAR DELTS", sets: 3, defaultReps: 15 },
      { name: "DB Shrugs", target: "TRAPS", sets: 3, defaultReps: 15 },
      { name: "ROC-IT Biceps Curl", target: "BICEPS", sets: 3, defaultReps: 15 },
      { name: "Machine Preacher Curl", target: "BICEPS PEAK", sets: 3, defaultReps: 12 },
      { name: "Romanian Deadlift", target: "HAMSTRINGS", sets: 3, defaultReps: 12 },
      { name: "Gluteus Standing Machine", target: "GLUTES", sets: 3, defaultReps: 12 },
    ],
  },
  "Push 2": {
    day: "Thu", color: "#FF8C4D",
    exercises: [
      { name: "Panatta Inclined Chest Press Circular", target: "UPPER CHEST", sets: 3, defaultReps: 12 },
      { name: "Straight Arm Chest Flye", target: "MID CHEST", sets: 3, defaultReps: 15 },
      { name: "Cable Lateral Raise", target: "SIDE DELTS", sets: 3, defaultReps: 15 },
      { name: "Cable Front Raise", target: "FRONT DELTS", sets: 3, defaultReps: 12 },
      { name: "Rope Pushdown", target: "TRICEPS", sets: 3, defaultReps: 15 },
      { name: "Seated Overhead Tricep Machine", target: "TRICEPS LONG HEAD", sets: 3, defaultReps: 12 },
      { name: "Leg Extension", target: "QUADS", sets: 3, defaultReps: 15 },
      { name: "Leg Press", target: "QUADS & GLUTES", sets: 3, defaultReps: 12 },
    ],
  },
  "Pull 2": {
    day: "Fri", color: "#4DFFB8",
    exercises: [
      { name: "Fixed Pulldown", target: "LATS WIDTH", sets: 3, defaultReps: 15 },
      { name: "Reverse Pec Deck", target: "REAR DELTS", sets: 3, defaultReps: 15 },
      { name: "Oxygen Rear Delt Machine", target: "REAR DELTS", sets: 3, defaultReps: 15 },
      { name: "Hyperextension", target: "LOWER BACK", sets: 3, defaultReps: 15 },
      { name: "Rope Hammer Curl", target: "BICEPS & BRACHIALIS", sets: 3, defaultReps: 15 },
      { name: "Panatta Alternate Arm Curl", target: "BICEPS", sets: 3, defaultReps: 12 },
      { name: "Lying Leg Curl", target: "HAMSTRINGS", sets: 3, defaultReps: 15 },
      { name: "Hack Squat", target: "QUADS & GLUTES", sets: 2, defaultReps: 12 },
    ],
  },
};

const mansoorWeekDates = {
  "Week 1": { "Push 1": "Mon · May 18", "Pull 1": "Tue · May 19", "Push 2": "Thu · May 21", "Pull 2": "Fri · May 22" },
  "Week 2": { "Push 1": "Mon · May 25", "Pull 1": "Tue · May 26", "Push 2": "Thu · May 28", "Pull 2": "Fri · May 29" },
  "Week 3": { "Push 1": "Mon · Jun 1",  "Pull 1": "Tue · Jun 2",  "Push 2": "Thu · Jun 4",  "Pull 2": "Fri · Jun 5"  },
  "Week 4": { "Push 1": "Mon · Jun 8",  "Pull 1": "Tue · Jun 9",  "Push 2": "Thu · Jun 11", "Pull 2": "Fri · Jun 12" },
};

const mansoorLogs = {
  "Week 1|Push 1|Flat Machine Chest Press|0": { weight: "0", reps: "15" },
  "Week 1|Push 1|Flat Machine Chest Press|1": { weight: "20", reps: "15" },
  "Week 1|Push 1|Flat Machine Chest Press|2": { weight: "20", reps: "12" },
  "Week 1|Push 1|Flat Machine Chest Press|3": { weight: "40", reps: "10" },
  "Week 1|Push 1|Panatta Upper Pec Flye|0": { weight: "5", reps: "15" },
  "Week 1|Push 1|Panatta Upper Pec Flye|1": { weight: "5", reps: "15" },
  "Week 1|Push 1|Panatta Upper Pec Flye|2": { weight: "5", reps: "15" },
  "Week 1|Push 1|Vertical Pec Fly|0": { weight: "15", reps: "15" },
  "Week 1|Push 1|Vertical Pec Fly|1": { weight: "30", reps: "15" },
  "Week 1|Push 1|Vertical Pec Fly|2": { weight: "40", reps: "15" },
  "Week 1|Push 1|Neutral Grip Machine Shoulder Press|0": { weight: "18", reps: "15" },
  "Week 1|Push 1|Neutral Grip Machine Shoulder Press|1": { weight: "18", reps: "15" },
  "Week 1|Push 1|Neutral Grip Machine Shoulder Press|2": { weight: "18", reps: "15" },
  "Week 1|Push 1|Machine Lateral Raise|0": { weight: "15", reps: "15" },
  "Week 1|Push 1|Machine Lateral Raise|1": { weight: "25", reps: "15" },
  "Week 1|Push 1|Machine Lateral Raise|2": { weight: "30", reps: "12" },
  "Week 1|Push 1|Tricep Dip Machine|0": { weight: "45", reps: "15" },
  "Week 1|Push 1|Tricep Dip Machine|1": { weight: "50", reps: "15" },
  "Week 1|Push 1|Tricep Dip Machine|2": { weight: "54", reps: "15" },
  "Week 1|Push 1|Cable Overhead Extension (Rope)|0": { weight: "20", reps: "15" },
  "Week 1|Push 1|Cable Overhead Extension (Rope)|1": { weight: "30", reps: "15" },
  "Week 1|Push 1|Cable Overhead Extension (Rope)|2": { weight: "40", reps: "13" },
  "Week 1|Push 1|Hip Abductor|0": { weight: "30", reps: "15" },
  "Week 1|Push 1|Hip Abductor|1": { weight: "42", reps: "15" },
  "Week 1|Push 1|Hip Abductor|2": { weight: "54", reps: "15" },
  "Week 1|Push 1|Standing Calf Raise|0": { weight: "40", reps: "20" },
  "Week 1|Push 1|Standing Calf Raise|1": { weight: "45", reps: "15" },
  "Week 1|Push 1|Standing Calf Raise|2": { weight: "50", reps: "15" },
  "Week 1|Pull 1|Lat Pulldown (V-bar)|0": { weight: "30", reps: "15" },
  "Week 1|Pull 1|Lat Pulldown (V-bar)|1": { weight: "40", reps: "15" },
  "Week 1|Pull 1|Lat Pulldown (V-bar)|2": { weight: "45", reps: "12" },
  "Week 1|Pull 1|Lat Pulldown (V-bar)|3": { weight: "50", reps: "10" },
  "Week 1|Pull 1|Seated Cable Row|0": { weight: "35", reps: "15" },
  "Week 1|Pull 1|Seated Cable Row|1": { weight: "40", reps: "15" },
  "Week 1|Pull 1|Seated Cable Row|2": { weight: "45", reps: "15" },
  "Week 1|Pull 1|Machine Rear Delt Flye|0": { weight: "30", reps: "15" },
  "Week 1|Pull 1|Machine Rear Delt Flye|1": { weight: "35", reps: "12" },
  "Week 1|Pull 1|Machine Rear Delt Flye|2": { weight: "35", reps: "10" },
  "Week 1|Pull 1|DB Shrugs|0": { weight: "30", reps: "15" },
  "Week 1|Pull 1|DB Shrugs|1": { weight: "35", reps: "15" },
  "Week 1|Pull 1|DB Shrugs|2": { weight: "40", reps: "15" },
  "Week 1|Pull 1|ROC-IT Biceps Curl|0": { weight: "20", reps: "15" },
  "Week 1|Pull 1|ROC-IT Biceps Curl|1": { weight: "29", reps: "15" },
  "Week 1|Pull 1|ROC-IT Biceps Curl|2": { weight: "39", reps: "15" },
  "Week 1|Pull 1|Machine Preacher Curl|0": { weight: "15", reps: "15" },
  "Week 1|Pull 1|Machine Preacher Curl|1": { weight: "20", reps: "15" },
  "Week 1|Pull 1|Machine Preacher Curl|2": { weight: "25", reps: "15" },
  "Week 1|Pull 1|Romanian Deadlift|0": { weight: "30", reps: "15" },
  "Week 1|Pull 1|Romanian Deadlift|1": { weight: "30", reps: "15" },
  "Week 1|Pull 1|Romanian Deadlift|2": { weight: "30", reps: "12" },
  "Week 1|Pull 1|Gluteus Standing Machine|0": { weight: "30", reps: "15" },
  "Week 1|Pull 1|Gluteus Standing Machine|1": { weight: "40", reps: "15" },
  "Week 1|Pull 1|Gluteus Standing Machine|2": { weight: "45", reps: "15" },
  "Week 1|Push 2|Panatta Inclined Chest Press Circular|0": { weight: "30", reps: "15" },
  "Week 1|Push 2|Panatta Inclined Chest Press Circular|1": { weight: "35", reps: "15" },
  "Week 1|Push 2|Panatta Inclined Chest Press Circular|2": { weight: "40", reps: "15" },
  "Week 1|Push 2|Straight Arm Chest Flye|0": { weight: "30", reps: "15" },
  "Week 1|Push 2|Straight Arm Chest Flye|1": { weight: "35", reps: "15" },
  "Week 1|Push 2|Straight Arm Chest Flye|2": { weight: "40", reps: "15" },
  "Week 1|Push 2|Cable Lateral Raise|0": { weight: "6", reps: "15" },
  "Week 1|Push 2|Cable Lateral Raise|1": { weight: "12", reps: "12" },
  "Week 1|Push 2|Cable Lateral Raise|2": { weight: "12", reps: "9" },
  "Week 1|Push 2|Cable Front Raise|0": { weight: "6", reps: "15" },
  "Week 1|Push 2|Cable Front Raise|1": { weight: "7.5", reps: "15" },
  "Week 1|Push 2|Cable Front Raise|2": { weight: "9", reps: "15" },
  "Week 1|Push 2|Rope Pushdown|0": { weight: "10.75", reps: "15" },
  "Week 1|Push 2|Rope Pushdown|1": { weight: "12.5", reps: "15" },
  "Week 1|Push 2|Rope Pushdown|2": { weight: "13", reps: "15" },
  "Week 1|Push 2|Seated Overhead Tricep Machine|0": { weight: "20", reps: "12" },
  "Week 1|Push 2|Seated Overhead Tricep Machine|1": { weight: "30", reps: "12" },
  "Week 1|Push 2|Seated Overhead Tricep Machine|2": { weight: "40", reps: "12" },
  "Week 1|Push 2|Leg Extension|0": { weight: "30", reps: "15" },
  "Week 1|Push 2|Leg Extension|1": { weight: "40", reps: "15" },
  "Week 1|Push 2|Leg Extension|2": { weight: "50", reps: "15" },
  "Week 1|Push 2|Leg Press|0": { weight: "40", reps: "12" },
  "Week 1|Push 2|Leg Press|1": { weight: "80", reps: "12" },
  "Week 1|Push 2|Leg Press|2": { weight: "120", reps: "12" },
  "Week 1|Pull 2|Fixed Pulldown|0": { weight: "26", reps: "15" },
  "Week 1|Pull 2|Fixed Pulldown|1": { weight: "33", reps: "15" },
  "Week 1|Pull 2|Fixed Pulldown|2": { weight: "40", reps: "15" },
  "Week 1|Pull 2|Reverse Pec Deck|0": { weight: "25", reps: "15" },
  "Week 1|Pull 2|Reverse Pec Deck|1": { weight: "30", reps: "15" },
  "Week 1|Pull 2|Reverse Pec Deck|2": { weight: "35", reps: "15" },
  "Week 1|Pull 2|Oxygen Rear Delt Machine|0": { weight: "27", reps: "15" },
  "Week 1|Pull 2|Oxygen Rear Delt Machine|1": { weight: "32", reps: "15" },
  "Week 1|Pull 2|Oxygen Rear Delt Machine|2": { weight: "41", reps: "15" },
  "Week 1|Pull 2|Hyperextension|0": { weight: "0", reps: "15" },
  "Week 1|Pull 2|Hyperextension|1": { weight: "7.5", reps: "12" },
  "Week 1|Pull 2|Hyperextension|2": { weight: "7.5", reps: "12" },
  "Week 1|Pull 2|Rope Hammer Curl|0": { weight: "11.25", reps: "15" },
  "Week 1|Pull 2|Rope Hammer Curl|1": { weight: "13.75", reps: "15" },
  "Week 1|Pull 2|Rope Hammer Curl|2": { weight: "16.25", reps: "15" },
  "Week 1|Pull 2|Panatta Alternate Arm Curl|0": { weight: "15", reps: "12" },
  "Week 1|Pull 2|Panatta Alternate Arm Curl|1": { weight: "15", reps: "12" },
  "Week 1|Pull 2|Panatta Alternate Arm Curl|2": { weight: "15", reps: "12" },
  "Week 1|Pull 2|Lying Leg Curl|0": { weight: "25", reps: "15" },
  "Week 1|Pull 2|Lying Leg Curl|1": { weight: "32", reps: "15" },
  "Week 1|Pull 2|Lying Leg Curl|2": { weight: "32", reps: "15" },
  "Week 1|Pull 2|Hack Squat|0": { weight: "40", reps: "12" },
  "Week 1|Pull 2|Hack Squat|1": { weight: "40", reps: "12" },
};

const pariPlan = {
  "Day 1": {
    day: "Mon", color: "#E879A0", focus: "Lower Body",
    description: "Glutes · Quads · Hamstrings · Calves",
    exercises: [
      { name: "Treadmill Walk (Incline 8-10%)", target: "CARDIO WARMUP", sets: 1, defaultReps: "10 min", tip: "Keep incline high, speed moderate. Don't hold the rails. Warmup only." },
      { name: "Leg Press", target: "QUADS & GLUTES", sets: 3, defaultReps: 15, tip: "Feet shoulder-width. Push through heels. Don't lock knees at the top." },
      { name: "Leg Extension", target: "QUADS", sets: 3, defaultReps: 15, tip: "Slow and controlled. Squeeze quad at the top for 1 second before lowering." },
      { name: "Seated Leg Curl", target: "HAMSTRINGS", sets: 3, defaultReps: 15, tip: "Pull heel smoothly. Don't jerk the weight. Feel the back of your thigh working." },
      { name: "Hip Abductor (Outer)", target: "OUTER THIGH & GLUTES", sets: 3, defaultReps: 15, tip: "Open legs slowly. Squeeze glutes at the widest point." },
      { name: "Hip Adductor (Inner)", target: "INNER THIGH", sets: 3, defaultReps: 15, tip: "Close legs with control. Focus on inner thigh — don't use momentum." },
      { name: "Seated Calf Raise", target: "CALVES", sets: 3, defaultReps: 20, tip: "Full range every rep. All the way up, all the way down." },
    ],
  },
  "Day 2": {
    day: "Wed", color: "#A78BFA", focus: "Upper Body",
    description: "Back · Shoulders · Chest · Arms",
    exercises: [
      { name: "Treadmill Walk (Incline 8-10%)", target: "CARDIO WARMUP", sets: 1, defaultReps: "10 min", tip: "Same warmup as Day 1 — gets blood flowing before lifting." },
      { name: "Lat Pulldown (Wide Grip)", target: "BACK WIDTH", sets: 3, defaultReps: 15, tip: "Pull bar to upper chest. Lean back slightly. Control the weight on the way up." },
      { name: "Seated Cable Row", target: "MID BACK", sets: 3, defaultReps: 15, tip: "Sit tall. Pull elbows back, squeeze shoulder blades together." },
      { name: "Machine Shoulder Press", target: "SHOULDERS", sets: 3, defaultReps: 15, tip: "Press straight up. Don't shrug. Start very light." },
      { name: "Pec Deck Flye", target: "CHEST", sets: 3, defaultReps: 15, tip: "Squeeze chest at the front. Open arms slowly — feel the stretch." },
      { name: "Cable Curl", target: "BICEPS", sets: 3, defaultReps: 15, tip: "Keep elbows still at sides. Curl up, lower slowly. No swinging." },
      { name: "Rope Pushdown", target: "TRICEPS", sets: 3, defaultReps: 15, tip: "Push rope down and slightly outward. Lock elbows at sides throughout." },
    ],
  },
  "Day 3": {
    day: "Fri", color: "#34D399", focus: "Full Body",
    description: "Compound movements · Full body activation",
    exercises: [
      { name: "Treadmill Walk (Incline 8-10%)", target: "CARDIO WARMUP", sets: 1, defaultReps: "10 min", tip: "Warmup walk before full body session." },
      { name: "Hack Squat (Light)", target: "QUADS & GLUTES", sets: 3, defaultReps: 12, tip: "Feet hip-width. Lower until thighs are parallel to floor. Push through heels." },
      { name: "Romanian Deadlift (Light)", target: "HAMSTRINGS & GLUTES", sets: 3, defaultReps: 12, tip: "Hinge at hips, keep back flat. Feel the stretch in your hamstrings." },
      { name: "Gluteus Standing Machine", target: "GLUTES", sets: 3, defaultReps: 15, tip: "One leg at a time. Kick back and squeeze glute hard at the top." },
      { name: "Chest Supported Machine Row", target: "BACK", sets: 3, defaultReps: 15, tip: "Chest on the pad. Pull handles toward you, squeeze your back muscles." },
      { name: "Cable Lateral Raise", target: "SIDE DELTS", sets: 3, defaultReps: 15, tip: "Very light weight. Raise arm to shoulder height only. Slow both ways." },
      { name: "Seated Calf Raise", target: "CALVES", sets: 3, defaultReps: 20, tip: "Full range of motion every rep. Slow and controlled." },
    ],
  },
};

const pariWeekDates = {
  "Week 1": { "Day 1": "Mon · May 18", "Day 2": "Wed · May 20", "Day 3": "Fri · May 22" },
  "Week 2": { "Day 1": "Mon · May 25", "Day 2": "Wed · May 27", "Day 3": "Fri · May 29" },
  "Week 3": { "Day 1": "Mon · Jun 1",  "Day 2": "Wed · Jun 3",  "Day 3": "Fri · Jun 5"  },
  "Week 4": { "Day 1": "Mon · Jun 8",  "Day 2": "Wed · Jun 10", "Day 3": "Fri · Jun 12" },
};

const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4"];

function loadStorage(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function saveStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

function MansoorTracker() {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [selectedDay, setSelectedDay] = useState("Push 1");
  const [logs, setLogs] = useState(() => loadStorage("theoglumi_workout_logs", mansoorLogs));
  const [activeExercise, setActiveExercise] = useState(null);
  const [saved, setSaved] = useState(false);

  const workout = mansoorPlan[selectedDay];
  const getKey = (w, d, e, s) => `${w}|${d}|${e}|${s}`;
  const getLog = (e, s, f) => logs[getKey(selectedWeek, selectedDay, e, s)]?.[f] || "";
  const updateLog = (e, s, f, v) => {
    const k = getKey(selectedWeek, selectedDay, e, s);
    const next = { ...logs, [k]: { ...logs[k], [f]: v } };
    setLogs(next); saveStorage("theoglumi_workout_logs", next);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };
  const isComplete = (n) => { const ex = workout.exercises.find(e => e.name === n); return Array.from({ length: ex.sets }).every((_, i) => getLog(n, i, "weight") && getLog(n, i, "reps")); };
  const totalComplete = workout.exercises.filter(e => isComplete(e.name)).length;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'Bebas Neue', Impact, sans-serif", color: "#fff", paddingBottom: 80 }}>
      <div style={{ background: `linear-gradient(135deg, ${workout.color}22, #0a0a0a)`, borderBottom: `2px solid ${workout.color}`, padding: "20px 16px 16px", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: workout.color, fontFamily: "monospace" }}>MANSOOR • OXYGEN GYM {saved && <span style={{ color: "#4DFFB8" }}>• SAVED</span>}</div>
            <div style={{ fontSize: 24, letterSpacing: 2, marginTop: 2 }}>{selectedDay}</div>
          </div>
          <div style={{ background: workout.color, color: "#000", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, fontFamily: "monospace", flexShrink: 0 }}>{totalComplete}/{workout.exercises.length}</div>
        </div>
        <div style={{ marginTop: 10, height: 3, background: "#222", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${(totalComplete / workout.exercises.length) * 100}%`, background: workout.color, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
      </div>
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 8 }}>
        {WEEKS.map(w => <button key={w} onClick={() => setSelectedWeek(w)} style={{ flex: 1, padding: "6px 0", background: selectedWeek === w ? workout.color : "#1a1a1a", color: selectedWeek === w ? "#000" : "#666", border: "none", borderRadius: 6, fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif" }}>{w}</button>)}
      </div>
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 8, overflowX: "auto" }}>
        {Object.entries(mansoorPlan).map(([day, data]) => (
          <button key={day} onClick={() => { setSelectedDay(day); setActiveExercise(null); }} style={{ flexShrink: 0, padding: "8px 14px", background: selectedDay === day ? data.color : "#1a1a1a", color: selectedDay === day ? "#000" : "#555", border: `1px solid ${selectedDay === day ? data.color : "#2a2a2a"}`, borderRadius: 8, fontSize: 12, letterSpacing: 1, cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif" }}>
            {day}<div style={{ fontSize: 9, fontFamily: "monospace", opacity: 0.7 }}>{mansoorWeekDates[selectedWeek]?.[day]}</div>
          </button>
        ))}
      </div>
      <div style={{ padding: "16px 16px 0" }}>
        {workout.exercises.map((exercise, idx) => {
          const done = isComplete(exercise.name); const expanded = activeExercise === exercise.name;
          return (
            <div key={exercise.name} style={{ marginBottom: 10, border: `1px solid ${done ? workout.color : expanded ? "#333" : "#1e1e1e"}`, borderRadius: 12, overflow: "hidden", background: done ? `${workout.color}11` : "#111" }}>
              <div onClick={() => setActiveExercise(expanded ? null : exercise.name)} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? workout.color : "#1e1e1e", color: done ? "#000" : "#444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, flexShrink: 0 }}>{done ? "✓" : idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, letterSpacing: 1, lineHeight: 1.2 }}>{exercise.name}</div>
                  <div style={{ fontSize: 9, color: workout.color, letterSpacing: 2, fontFamily: "monospace", marginTop: 3 }}>{exercise.target} • {exercise.sets} SETS • {exercise.defaultReps} REPS</div>
                </div>
                <div style={{ color: "#444", fontSize: 16, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>v</div>
              </div>
              {expanded && (
                <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1e1e1e" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr", gap: 8, margin: "12px 0 8px" }}>
                    <div style={{ fontSize: 9, color: "#444", letterSpacing: 2, fontFamily: "monospace", textAlign: "center" }}>SET</div>
                    <div style={{ fontSize: 9, color: "#444", letterSpacing: 2, fontFamily: "monospace", textAlign: "center" }}>KG</div>
                    <div style={{ fontSize: 9, color: "#444", letterSpacing: 2, fontFamily: "monospace", textAlign: "center" }}>REPS</div>
                  </div>
                  {Array.from({ length: exercise.sets }).map((_, setIdx) => {
                    const w = getLog(exercise.name, setIdx, "weight"); const r = getLog(exercise.name, setIdx, "reps"); const setDone = w && r;
                    const inp = { background: "#1a1a1a", border: `1px solid ${setDone ? workout.color + "66" : "#2a2a2a"}`, borderRadius: 8, color: "#fff", padding: "10px", fontSize: 16, fontFamily: "'Bebas Neue', sans-serif", textAlign: "center", outline: "none", width: "100%", boxSizing: "border-box" };
                    return (
                      <div key={setIdx} style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr", gap: 8, marginBottom: 8, alignItems: "center" }}>
                        <div style={{ textAlign: "center", fontSize: 13, color: setDone ? workout.color : "#444", fontFamily: "monospace" }}>{setDone ? "✓" : setIdx + 1}</div>
                        <input type="number" placeholder="kg" value={w} onChange={e => updateLog(exercise.name, setIdx, "weight", e.target.value)} style={inp} />
                        <input type="number" placeholder="reps" value={r} onChange={e => updateLog(exercise.name, setIdx, "reps", e.target.value)} style={inp} />
                      </div>
                    );
                  })}
                  <div style={{ marginTop: 8, padding: "8px 12px", background: "#0d0d0d", borderRadius: 8, fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 1 }}>TARGET: {exercise.sets} x {exercise.defaultReps} REPS • +2.5-5KG EACH WEEK</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {totalComplete === workout.exercises.length && (
        <div style={{ margin: "20px 16px", padding: "20px", background: `linear-gradient(135deg, ${workout.color}22, ${workout.color}11)`, border: `1px solid ${workout.color}`, borderRadius: 16, textAlign: "center" }}>
          <div style={{ fontSize: 30, letterSpacing: 3, color: workout.color }}>SESSION COMPLETE</div>
          <div style={{ fontSize: 11, color: "#888", fontFamily: "monospace", marginTop: 6 }}>SAUNA - COLD PLUNGE - SAUNA</div>
        </div>
      )}
      <div style={{ margin: "16px 16px 0", padding: "12px 16px", background: "#1a0f00", border: "1px solid #FF8C4D44", borderRadius: 10, fontSize: 10, color: "#FF8C4D", fontFamily: "monospace", letterSpacing: 1, lineHeight: 1.8 }}>
        TENNIS ELBOW: HOOKS ON PULLS • ANKLE STRAPS ON CABLES • NEUTRAL GRIP • STOP IF SHARP PAIN
      </div>
    </div>
  );
}

function PariTracker() {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [selectedDay, setSelectedDay] = useState("Day 1");
  const [logs, setLogs] = useState(() => loadStorage("pari_workout_logs", {}));
  const [activeExercise, setActiveExercise] = useState(null);
  const [saved, setSaved] = useState(false);

  const workout = pariPlan[selectedDay];
  const getLog = (e, s, f) => logs[`${selectedWeek}|${selectedDay}|${e}|${s}`]?.[f] || "";
  const updateLog = (e, s, f, v) => {
    const k = `${selectedWeek}|${selectedDay}|${e}|${s}`;
    const next = { ...logs, [k]: { ...logs[k], [f]: v } };
    setLogs(next); saveStorage("pari_workout_logs", next);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };
  const isComplete = (name) => { const ex = workout.exercises.find(e => e.name === name); if (ex.sets === 1) return !!getLog(name, 0, "done"); return Array.from({ length: ex.sets }).every((_, i) => getLog(name, i, "weight") && getLog(name, i, "reps")); };
  const totalComplete = workout.exercises.filter(e => isComplete(e.name)).length;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'Bebas Neue', Impact, sans-serif", color: "#fff", paddingBottom: 80 }}>
      <div style={{ background: `linear-gradient(135deg, ${workout.color}22, #0a0a0a)`, borderBottom: `2px solid ${workout.color}`, padding: "20px 16px 16px", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: workout.color, fontFamily: "monospace" }}>PARI • 360 FITNESS {saved && <span style={{ color: "#4DFFB8" }}>• SAVED</span>}</div>
            <div style={{ fontSize: 24, letterSpacing: 2, marginTop: 2 }}>{selectedDay} — {workout.focus}</div>
            <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 1, marginTop: 2 }}>{workout.description.toUpperCase()}</div>
          </div>
          <div style={{ background: workout.color, color: "#000", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, fontFamily: "monospace", flexShrink: 0 }}>{totalComplete}/{workout.exercises.length}</div>
        </div>
        <div style={{ marginTop: 10, height: 3, background: "#222", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${(totalComplete / workout.exercises.length) * 100}%`, background: workout.color, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
      </div>
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 8 }}>
        {WEEKS.map(w => <button key={w} onClick={() => setSelectedWeek(w)} style={{ flex: 1, padding: "6px 0", background: selectedWeek === w ? workout.color : "#1a1a1a", color: selectedWeek === w ? "#000" : "#666", border: "none", borderRadius: 6, fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif" }}>{w}</button>)}
      </div>
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 8 }}>
        {Object.entries(pariPlan).map(([day, data]) => (
          <button key={day} onClick={() => { setSelectedDay(day); setActiveExercise(null); }} style={{ flex: 1, padding: "8px 0", background: selectedDay === day ? data.color : "#1a1a1a", color: selectedDay === day ? "#000" : "#555", border: `1px solid ${selectedDay === day ? data.color : "#2a2a2a"}`, borderRadius: 8, fontSize: 12, letterSpacing: 1, cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif" }}>
            {day}<div style={{ fontSize: 9, fontFamily: "monospace", opacity: 0.7 }}>{pariWeekDates[selectedWeek]?.[day]}</div>
          </button>
        ))}
      </div>
      <div style={{ padding: "16px 16px 0" }}>
        {workout.exercises.map((exercise, idx) => {
          const done = isComplete(exercise.name); const expanded = activeExercise === exercise.name;
          const mColor = muscleColors[exercise.target] || "#888";
          return (
            <div key={exercise.name} style={{ marginBottom: 10, border: `1px solid ${done ? workout.color : expanded ? "#333" : "#1e1e1e"}`, borderRadius: 12, overflow: "hidden", background: done ? `${workout.color}11` : "#111" }}>
              <div onClick={() => setActiveExercise(expanded ? null : exercise.name)} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? workout.color : "#1e1e1e", color: done ? "#000" : "#444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, flexShrink: 0 }}>{done ? "✓" : idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, letterSpacing: 1, lineHeight: 1.2 }}>{exercise.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <span style={{ background: mColor + "22", color: mColor, fontSize: 9, fontFamily: "monospace", letterSpacing: 1, padding: "2px 8px", borderRadius: 4, border: `1px solid ${mColor}44` }}>{exercise.target}</span>
                    <span style={{ fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 1 }}>{exercise.sets === 1 ? exercise.defaultReps : `${exercise.sets} × ${exercise.defaultReps}`}</span>
                  </div>
                </div>
                <div style={{ color: "#444", fontSize: 16, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>v</div>
              </div>
              {expanded && (
                <div style={{ borderTop: "1px solid #1e1e1e" }}>
                  <div style={{ padding: "20px 16px", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: mColor + "18", border: `2px solid ${mColor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{muscleIcon[exercise.target] || "💪"}</div>
                    <div>
                      <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2 }}>TARGET MUSCLE</div>
                      <div style={{ fontSize: 18, letterSpacing: 2, color: mColor, marginTop: 2 }}>{exercise.target}</div>
                      <div style={{ fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 1, marginTop: 4 }}>{exercise.sets === 1 ? exercise.defaultReps : `${exercise.sets} SETS • ${exercise.defaultReps} REPS`}</div>
                    </div>
                  </div>
                  {exercise.tip && (
                    <div style={{ padding: "14px 16px", background: mColor + "11", borderTop: `1px solid ${mColor}22` }}>
                      <div style={{ fontSize: 9, color: mColor, letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>COACHING TIP</div>
                      <div style={{ fontSize: 13, letterSpacing: 0.5, lineHeight: 1.6, color: "#bbb", fontFamily: "Arial, sans-serif", fontWeight: "normal" }}>{exercise.tip}</div>
                    </div>
                  )}
                  {exercise.sets > 1 && (
                    <div style={{ padding: "12px 16px 16px", borderTop: "1px solid #1a1a1a" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr", gap: 8, margin: "0 0 8px" }}>
                        <div style={{ fontSize: 9, color: "#444", letterSpacing: 2, fontFamily: "monospace", textAlign: "center" }}>SET</div>
                        <div style={{ fontSize: 9, color: "#444", letterSpacing: 2, fontFamily: "monospace", textAlign: "center" }}>KG</div>
                        <div style={{ fontSize: 9, color: "#444", letterSpacing: 2, fontFamily: "monospace", textAlign: "center" }}>REPS</div>
                      </div>
                      {Array.from({ length: exercise.sets }).map((_, i) => {
                        const w = getLog(exercise.name, i, "weight"); const r = getLog(exercise.name, i, "reps"); const setDone = w && r;
                        const inp = { background: "#1a1a1a", border: `1px solid ${setDone ? workout.color + "66" : "#2a2a2a"}`, borderRadius: 8, color: "#fff", padding: "10px", fontSize: 16, fontFamily: "'Bebas Neue', sans-serif", textAlign: "center", outline: "none", width: "100%", boxSizing: "border-box" };
                        return (
                          <div key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr", gap: 8, marginBottom: 8, alignItems: "center" }}>
                            <div style={{ textAlign: "center", fontSize: 13, color: setDone ? workout.color : "#444", fontFamily: "monospace" }}>{setDone ? "✓" : i + 1}</div>
                            <input type="number" placeholder="kg" value={w} onChange={e => updateLog(exercise.name, i, "weight", e.target.value)} style={inp} />
                            <input type="number" placeholder="reps" value={r} onChange={e => updateLog(exercise.name, i, "reps", e.target.value)} style={inp} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {exercise.sets === 1 && (
                    <div style={{ padding: "12px 16px 16px", borderTop: "1px solid #1a1a1a" }}>
                      <button onClick={() => updateLog(exercise.name, 0, "done", getLog(exercise.name, 0, "done") ? "" : "1")}
                        style={{ width: "100%", padding: "12px", background: getLog(exercise.name, 0, "done") ? workout.color : "#1a1a1a", color: getLog(exercise.name, 0, "done") ? "#000" : "#555", border: `1px solid ${workout.color}44`, borderRadius: 8, fontSize: 14, letterSpacing: 2, cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif" }}>
                        {getLog(exercise.name, 0, "done") ? "✓ DONE" : "MARK COMPLETE"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {totalComplete === workout.exercises.length && (
        <div style={{ margin: "20px 16px", padding: "20px", background: `linear-gradient(135deg, ${workout.color}22, ${workout.color}11)`, border: `1px solid ${workout.color}`, borderRadius: 16, textAlign: "center" }}>
          <div style={{ fontSize: 30, letterSpacing: 3, color: workout.color }}>SESSION COMPLETE</div>
          <div style={{ fontSize: 11, color: "#888", fontFamily: "monospace", marginTop: 6, letterSpacing: 2 }}>GREAT WORK PARI!</div>
        </div>
      )}
      <div style={{ margin: "16px 16px 0", padding: "12px 16px", background: "#0d1a12", border: "1px solid #34D39933", borderRadius: 10, fontSize: 10, color: "#34D399", fontFamily: "monospace", letterSpacing: 1, lineHeight: 1.8 }}>
        BEGINNER PLAN • START LIGHT • FOCUS ON FORM • ADD WEIGHT GRADUALLY EACH WEEK
      </div>
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState(null);
  if (!profile) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', Impact, sans-serif", color: "#fff" }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#444", fontFamily: "monospace", marginBottom: 16 }}>WORKOUT TRACKER</div>
        <div style={{ fontSize: 48, letterSpacing: 4, marginBottom: 8 }}>WHO'S TRAINING?</div>
        <div style={{ fontSize: 13, color: "#555", fontFamily: "monospace", letterSpacing: 2, marginBottom: 60 }}>SELECT YOUR PROFILE</div>
        <div style={{ display: "flex", gap: 24 }}>
          <div onClick={() => setProfile("Mansoor")} style={{ cursor: "pointer", width: 150, padding: "32px 20px", background: "#111", border: "1px solid #FF4D4D44", borderRadius: 16, textAlign: "center" }}
            onMouseEnter={e => e.currentTarget.style.border = "1px solid #FF4D4D"}
            onMouseLeave={e => e.currentTarget.style.border = "1px solid #FF4D4D44"}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FF4D4D22", border: "2px solid #FF4D4D", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24, color: "#FF4D4D" }}>M</div>
            <div style={{ fontSize: 22, letterSpacing: 2, color: "#FF4D4D" }}>MANSOOR</div>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: "#555", letterSpacing: 2, marginTop: 6 }}>OXYGEN GYM • 4 DAYS</div>
          </div>
          <div onClick={() => setProfile("Pari")} style={{ cursor: "pointer", width: 150, padding: "32px 20px", background: "#111", border: "1px solid #E879A044", borderRadius: 16, textAlign: "center" }}
            onMouseEnter={e => e.currentTarget.style.border = "1px solid #E879A0"}
            onMouseLeave={e => e.currentTarget.style.border = "1px solid #E879A044"}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#E879A022", border: "2px solid #E879A0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24, color: "#E879A0" }}>P</div>
            <div style={{ fontSize: 22, letterSpacing: 2, color: "#E879A0" }}>PARI</div>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: "#555", letterSpacing: 2, marginTop: 6 }}>360 FITNESS • 3 DAYS</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div onClick={() => setProfile(null)} style={{ position: "fixed", top: 12, right: 16, zIndex: 200, cursor: "pointer", fontSize: 10, fontFamily: "monospace", color: "#444", letterSpacing: 2, background: "#111", padding: "6px 10px", borderRadius: 6, border: "1px solid #2a2a2a" }}>SWITCH</div>
      {profile === "Mansoor" ? <MansoorTracker /> : <PariTracker />}
    </div>
  );
}
