import { useState, useEffect, useCallback, useRef } from "react";
import { loadUserData, saveUserData } from "./api";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const USERS = {
  mansoor: { name: "Mansoor", gym: "OXYGEN GYM",   color: "#E63946", initial: "M" },
  pari:    { name: "Pari",    gym: "360 FITNESS",   color: "#FF6B9D", initial: "P" },
};

const WORKOUTS_M = [
  {
    id: "push1", label: "PUSH 1", sub: "Chest · Triceps", color: "#E63946", icon: "💪",
    exercises: [
      { id: "p1e1", name: "Machine Chest Press",         sets: 3, reps: "10-12", baseline: 50 },
      { id: "p1e2", name: "Incline DB Press",            sets: 3, reps: "12",    baseline: 30 },
      { id: "p1e3", name: "Pec Deck Flye",               sets: 3, reps: "12-15", baseline: 47 },
      { id: "p1e4", name: "Cable Crossover",             sets: 3, reps: "15",    baseline: 17,   note: "per arm" },
      { id: "p1e5", name: "Rope Pushdown",               sets: 3, reps: "12-15", baseline: 50 },
      { id: "p1e6", name: "Seated OH Tricep Machine",    sets: 3, reps: "12",    baseline: 18 },
      { id: "p1e7", name: "Machine Dips",                sets: 3, reps: "12",    baseline: 30 },
    ],
  },
  {
    id: "pull1", label: "PULL 1", sub: "Back · Biceps", color: "#2196F3", icon: "🔙",
    exercises: [
      { id: "pu1e1", name: "Seated Cable Row",           sets: 3, reps: "10-12", baseline: 40 },
      { id: "pu1e2", name: "Machine Row",                sets: 3, reps: "10-12", baseline: 35 },
      { id: "pu1e3", name: "Lat Pulldown",               sets: 3, reps: "12",    baseline: 40 },
      { id: "pu1e4", name: "Cable Pullover",             sets: 3, reps: "12-15", baseline: 40 },
      { id: "pu1e5", name: "Hammer Curl",                sets: 3, reps: "12",    baseline: 25 },
      { id: "pu1e6", name: "Preacher Curl Machine",      sets: 3, reps: "12",    baseline: 20 },
      { id: "pu1e7", name: "Cable Curl",                 sets: 3, reps: "15",    baseline: 12.5 },
    ],
  },
  {
    id: "shoulders", label: "SHOULDERS", sub: "Delts · Traps", color: "#9C27B0", icon: "🏔️",
    exercises: [
      { id: "sh1", name: "Machine Shoulder Press",       sets: 3, reps: "10-12", baseline: 30 },
      { id: "sh2", name: "Cable Lateral Raise",          sets: 3, reps: "15",    baseline: 10, note: "each arm" },
      { id: "sh3", name: "Rear Delt Flye Machine",       sets: 3, reps: "15",    baseline: 30 },
      { id: "sh4", name: "Cable Front Raise",            sets: 3, reps: "12",    baseline: 13 },
    ],
  },
  {
    id: "legs", label: "LEGS", sub: "Quads · Hams · Calves", color: "#FF9800", icon: "🦵",
    exercises: [
      { id: "lg1", name: "Leg Press",                    sets: 4, reps: "12-15", baseline: 0, note: "set baseline" },
      { id: "lg2", name: "Hack Squat",                   sets: 3, reps: "12",    baseline: 0, note: "set baseline" },
      { id: "lg3", name: "Leg Extension",                sets: 3, reps: "15",    baseline: 0, note: "set baseline" },
      { id: "lg4", name: "Lying Leg Curl",               sets: 3, reps: "12-15", baseline: 0, note: "set baseline" },
      { id: "lg5", name: "Standing Calf Raise",          sets: 4, reps: "15-20", baseline: 0, note: "set baseline" },
    ],
  },
];

const WORKOUTS_P = [
  {
    id: "pb1", label: "FULL BODY A", sub: "Strength Focus", color: "#FF6B9D", icon: "🌸",
    exercises: [
      { id: "pb1e1", name: "Leg Press",                  sets: 3, reps: "12-15", baseline: 0 },
      { id: "pb1e2", name: "Lat Pulldown",               sets: 3, reps: "12",    baseline: 0 },
      { id: "pb1e3", name: "DB Shoulder Press",          sets: 3, reps: "12",    baseline: 0 },
      { id: "pb1e4", name: "Cable Kickback",             sets: 3, reps: "15",    baseline: 0 },
      { id: "pb1e5", name: "Plank",                      sets: 3, reps: "30s",   baseline: 0 },
    ],
  },
  {
    id: "pb2", label: "FULL BODY B", sub: "Hypertrophy Focus", color: "#FF6B9D", icon: "✨",
    exercises: [
      { id: "pb2e1", name: "Smith Machine Squat",        sets: 3, reps: "12",    baseline: 0 },
      { id: "pb2e2", name: "Seated Cable Row",           sets: 3, reps: "12",    baseline: 0 },
      { id: "pb2e3", name: "Pec Deck Flye",              sets: 3, reps: "15",    baseline: 0 },
      { id: "pb2e4", name: "Hip Abductor",               sets: 3, reps: "15",    baseline: 0 },
      { id: "pb2e5", name: "Cable Crunch",               sets: 3, reps: "15",    baseline: 0 },
    ],
  },
  {
    id: "pb3", label: "FULL BODY C", sub: "Glutes & Core", color: "#FF6B9D", icon: "💎",
    exercises: [
      { id: "pb3e1", name: "Hip Thrust Machine",         sets: 4, reps: "12-15", baseline: 0 },
      { id: "pb3e2", name: "Leg Curl",                   sets: 3, reps: "15",    baseline: 0 },
      { id: "pb3e3", name: "DB Lateral Raise",           sets: 3, reps: "15",    baseline: 0 },
      { id: "pb3e4", name: "Assisted Pull-Up",           sets: 3, reps: "10",    baseline: 0 },
      { id: "pb3e5", name: "Russian Twist",              sets: 3, reps: "20",    baseline: 0 },
    ],
  },
];

// ─── APP ROOT ──────────────────────────────────────────────────────────────────

export default function App() {
  const [activeUser, setActiveUser] = useState(null);

  if (!activeUser) {
    return <ProfileSelector onSelect={setActiveUser} />;
  }
  return <WorkoutTracker userId={activeUser} onSwitch={() => setActiveUser(null)} />;
}

// ─── PROFILE SELECTOR ─────────────────────────────────────────────────────────

function ProfileSelector({ onSelect }) {
  const profiles = [
    { id: "mansoor", days: "4 DAYS" },
    { id: "pari",    days: "3 DAYS" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ fontSize: 10, letterSpacing: 6, color: "#333", fontFamily: "monospace", marginBottom: 8 }}>
        WORKOUT TRACKER
      </div>
      <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 40, letterSpacing: -1 }}>
        WHO'S TRAINING?
      </div>
      <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 380 }}>
        {profiles.map(p => {
          const u = USERS[p.id];
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              style={{
                flex: 1, background: "#111", border: "1px solid #222",
                borderRadius: 18, padding: "28px 16px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = u.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}
            >
              <div style={{
                width: 68, height: 68, borderRadius: "50%",
                background: u.color + "18", border: `2px solid ${u.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 30, fontWeight: 900, color: u.color,
              }}>
                {u.initial}
              </div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>{u.name}</div>
              <div style={{ color: "#444", fontSize: 9, fontFamily: "monospace", letterSpacing: 2 }}>{u.gym}</div>
              <div style={{
                background: u.color + "18", color: u.color,
                fontSize: 9, fontFamily: "monospace", letterSpacing: 2,
                padding: "4px 12px", borderRadius: 20,
              }}>
                {p.days}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── WORKOUT TRACKER (HOME) ───────────────────────────────────────────────────

function WorkoutTracker({ userId, onSwitch }) {
  const isMansoor = userId === "mansoor";
  const user      = USERS[userId];
  const workouts  = isMansoor ? WORKOUTS_M : WORKOUTS_P;

  const [activeWorkout, setActiveWorkout] = useState(null);
  const [weights,       setWeights]       = useState({});
  const [completed,     setCompleted]     = useState({});
  const [loading,       setLoading]       = useState(true);
  const [synced,        setSynced]        = useState(false);
  const saveTimer = useRef(null);

  // ── Load on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    loadUserData(userId).then(data => {
      if (data.weights)   setWeights(data.weights);
      if (data.completed) setCompleted(data.completed);
      setLoading(false);
    });
  }, [userId]);

  // ── Debounced save ─────────────────────────────────────────────────────────
  const persist = useCallback((w, c) => {
    setSynced(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await saveUserData(userId, { weights: w, completed: c });
      setSynced(true);
      setTimeout(() => setSynced(false), 2000);
    }, 700);
  }, [userId]);

  const updateWeight = (exId, val) => {
    const w = { ...weights, [exId]: val };
    setWeights(w);
    persist(w, completed);
  };

  const toggleSet = (exId, setIdx) => {
    const cur  = completed[exId] || [];
    const next = [...cur];
    next[setIdx] = !next[setIdx];
    const c = { ...completed, [exId]: next };
    setCompleted(c);
    persist(weights, c);
  };

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0a",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ color: "#333", fontFamily: "monospace", fontSize: 11, letterSpacing: 4 }}>
          SYNCING…
        </div>
      </div>
    );
  }

  // ── Active session ─────────────────────────────────────────────────────────
  if (activeWorkout !== null) {
    return (
      <WorkoutSession
        workout={workouts[activeWorkout]}
        user={user}
        weights={weights}
        completed={completed}
        synced={synced}
        onUpdateWeight={updateWeight}
        onToggleSet={toggleSet}
        onBack={() => setActiveWorkout(null)}
      />
    );
  }

  // ── Home dashboard ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{
        padding: "24px 20px 16px",
        borderBottom: "1px solid #111",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: 4, color: "#444" }}>
            {user.gym}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>
            {user.name.toUpperCase()}
          </div>
        </div>
        <button
          onClick={onSwitch}
          style={{
            background: "none", border: "1px solid #222", borderRadius: 8,
            color: "#555", fontSize: 10, fontFamily: "monospace",
            letterSpacing: 2, padding: "6px 14px", cursor: "pointer",
          }}
        >
          SWITCH
        </button>
      </div>

      {/* Tennis elbow banner */}
      {isMansoor && (
        <div style={{
          margin: "16px 20px 0",
          background: "#1a0a00", border: "1px solid #FF9800",
          borderRadius: 10, padding: "10px 14px",
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 16, lineHeight: 1.2 }}>⚠️</span>
          <div style={{ fontSize: 10, color: "#FF9800", fontFamily: "monospace", letterSpacing: 1, lineHeight: 1.6 }}>
            TENNIS ELBOW — neutral grip only · cables &amp; machines · ankle straps on wrists · hooks on all pulls
          </div>
        </div>
      )}

      {/* Workout list */}
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: 4, color: "#444", marginBottom: 16 }}>
          SELECT WORKOUT
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {workouts.map((wk, i) => {
            const done = wk.exercises.filter(ex =>
              (completed[ex.id] || []).filter(Boolean).length >= ex.sets
            ).length;
            const pct = done / wk.exercises.length;

            return (
              <button
                key={wk.id}
                onClick={() => setActiveWorkout(i)}
                style={{
                  width: "100%", background: "#111",
                  border: "1px solid #1a1a1a", borderRadius: 14,
                  padding: "18px 20px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 16, textAlign: "left",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = wk.color + "55"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a1a"}
              >
                <div style={{
                  width: 50, height: 50, borderRadius: 12, flexShrink: 0,
                  background: wk.color + "18", border: `1.5px solid ${wk.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>
                  {wk.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: wk.color, fontSize: 10, fontFamily: "monospace", letterSpacing: 3, marginBottom: 2 }}>
                    {wk.label}
                  </div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{wk.sub}</div>
                  <div style={{ marginTop: 8, height: 3, background: "#1a1a1a", borderRadius: 2 }}>
                    <div style={{
                      height: "100%", width: `${pct * 100}%`,
                      background: wk.color, borderRadius: 2, transition: "width 0.3s",
                    }} />
                  </div>
                  <div style={{ marginTop: 4, color: "#444", fontSize: 10, fontFamily: "monospace" }}>
                    {done}/{wk.exercises.length} COMPLETE
                  </div>
                </div>
                <div style={{ color: "#2a2a2a", fontSize: 22, flexShrink: 0 }}>›</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── WORKOUT SESSION ──────────────────────────────────────────────────────────

function WorkoutSession({ workout, weights, completed, synced, onUpdateWeight, onToggleSet, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", paddingBottom: 60 }}>

      {/* Header */}
      <div style={{
        padding: "20px 20px 16px", borderBottom: "1px solid #111",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, background: "#0a0a0a", zIndex: 10,
      }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: workout.color, fontSize: 22, cursor: "pointer", padding: 0, lineHeight: 1 }}
        >
          ←
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: workout.color, fontSize: 10, fontFamily: "monospace", letterSpacing: 4 }}>
            {workout.label}
          </div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{workout.sub}</div>
        </div>
        <div style={{
          fontSize: 9, fontFamily: "monospace", letterSpacing: 2,
          color: synced ? "#4DFFB8" : "#2a2a2a", transition: "color 0.4s",
        }}>
          {synced ? "SAVED ✓" : "SYNC"}
        </div>
      </div>

      {/* Exercise list */}
      <div style={{ padding: "16px 20px" }}>
        {workout.exercises.map(ex => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            color={workout.color}
            weight={weights[ex.id] ?? ex.baseline}
            completedSets={completed[ex.id] || []}
            onUpdateWeight={w => onUpdateWeight(ex.id, w)}
            onToggleSet={i => onToggleSet(ex.id, i)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── EXERCISE ROW ─────────────────────────────────────────────────────────────

function ExerciseRow({ exercise, color, weight, completedSets, onUpdateWeight, onToggleSet }) {
  const [editing, setEditing] = useState(false);
  const [localW,  setLocalW]  = useState(String(weight));
  const allDone = completedSets.slice(0, exercise.sets).filter(Boolean).length === exercise.sets;

  useEffect(() => { setLocalW(String(weight)); }, [weight]);

  const commit = () => {
    const v = parseFloat(localW);
    if (!isNaN(v)) onUpdateWeight(v);
    setEditing(false);
  };

  const step = weight < 10 ? 1 : 2.5;

  return (
    <div style={{
      background: "#111",
      border: `1px solid ${allDone ? color + "55" : "#1a1a1a"}`,
      borderRadius: 13, padding: "14px 16px", marginBottom: 10,
      transition: "border-color 0.2s",
    }}>
      {/* Name + weight control */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <div style={{ color: allDone ? color : "#fff", fontWeight: 700, fontSize: 14, transition: "color 0.2s" }}>
            {exercise.name}
          </div>
          <div style={{ color: "#444", fontSize: 10, fontFamily: "monospace", marginTop: 3 }}>
            {exercise.sets} × {exercise.reps}{exercise.note ? ` · ${exercise.note}` : ""}
          </div>
        </div>

        {/* Weight stepper */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button
            onClick={() => onUpdateWeight(Math.max(0, weight - step))}
            style={{
              width: 30, height: 30, borderRadius: "50%", background: "#1a1a1a",
              border: "none", color: "#aaa", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
            }}
          >−</button>

          {editing ? (
            <input
              value={localW}
              onChange={e => setLocalW(e.target.value)}
              onBlur={commit}
              onKeyDown={e => e.key === "Enter" && commit()}
              autoFocus
              style={{
                width: 56, background: "#0a0a0a", border: `1px solid ${color}`,
                borderRadius: 7, color: "#fff", textAlign: "center",
                fontSize: 15, fontWeight: 700, padding: "4px 0",
              }}
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              style={{
                minWidth: 56, background: "none", border: "none",
                color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer",
                textAlign: "center",
              }}
            >
              {weight}<span style={{ fontSize: 9, color: "#555", marginLeft: 1 }}>kg</span>
            </button>
          )}

          <button
            onClick={() => onUpdateWeight(weight + step)}
            style={{
              width: 30, height: 30, borderRadius: "50%", background: "#1a1a1a",
              border: "none", color: "#aaa", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
            }}
          >+</button>
        </div>
      </div>

      {/* Set buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: exercise.sets }, (_, i) => (
          <button
            key={i}
            onClick={() => onToggleSet(i)}
            style={{
              flex: 1, height: 38, borderRadius: 9, border: "none", cursor: "pointer",
              background: completedSets[i] ? color : "#1a1a1a",
              color: completedSets[i] ? "#fff" : "#333",
              fontWeight: 700, fontSize: 12, fontFamily: "monospace",
              transition: "all 0.15s",
            }}
          >
            {completedSets[i] ? "✓" : `S${i + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
}
