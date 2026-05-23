import { useState, useEffect } from "react";

// ─── SHARED ───────────────────────────────────────────────────────────────────
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

// ─── MANSOOR'S PLAN ───────────────────────────────────────────────────────────
const mansoorPlan = {
  "Push 1": {
    day: "Mon", color: "#C9A84C",
    exercises: [
      { name: "Flat Machine Chest Press",          target: "MID CHEST",        sets: 4, defaultReps: 12, type: "compound",  affects: ["Triceps", "Front Delts"] },
      { name: "Panatta Upper Pec Flye",            target: "UPPER CHEST",      sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Vertical Pec Fly",                  target: "LOWER CHEST",      sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Neutral Grip Machine Shoulder Press", target: "FRONT DELTS",   sets: 3, defaultReps: 12, type: "compound",  affects: ["Triceps", "Upper Chest"] },
      { name: "Machine Lateral Raise",             target: "SIDE DELTS",       sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Tricep Dip Machine",                target: "TRICEPS",          sets: 3, defaultReps: 12, type: "compound",  affects: ["Chest", "Front Delts"] },
      { name: "Cable Overhead Extension (Rope)",   target: "TRICEPS LONG HEAD",sets: 3, defaultReps: 12, type: "isolation" },
      { name: "Hip Abductor",                      target: "OUTER THIGH",      sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Standing Calf Raise",               target: "CALVES",           sets: 3, defaultReps: 20, type: "isolation" },
    ],
  },
  "Pull 1": {
    day: "Tue", color: "#B8964A",
    exercises: [
      { name: "Lat Pulldown (V-bar)",              target: "LATS WIDTH",       sets: 4, defaultReps: 12, type: "compound",  affects: ["Biceps", "Rear Delts"] },
      { name: "Seated Cable Row",                  target: "MID BACK",         sets: 3, defaultReps: 12, type: "compound",  affects: ["Biceps", "Rear Delts"] },
      { name: "Machine Rear Delt Flye",            target: "REAR DELTS",       sets: 3, defaultReps: 15, type: "isolation" },
      { name: "DB Shrugs",                         target: "TRAPS",            sets: 3, defaultReps: 15, type: "isolation" },
      { name: "ROC-IT Biceps Curl",                target: "BICEPS",           sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Machine Preacher Curl",             target: "BICEPS PEAK",      sets: 3, defaultReps: 12, type: "isolation" },
      { name: "Romanian Deadlift",                 target: "HAMSTRINGS",       sets: 3, defaultReps: 12, type: "compound",  affects: ["Glutes", "Lower Back"] },
      { name: "Gluteus Standing Machine",          target: "GLUTES",           sets: 3, defaultReps: 12, type: "isolation" },
    ],
  },
  "Push 2": {
    day: "Thu", color: "#D4B86A",
    exercises: [
      { name: "Panatta Inclined Chest Press Circular", target: "UPPER CHEST", sets: 3, defaultReps: 12, type: "compound",  affects: ["Front Delts", "Triceps"] },
      { name: "Straight Arm Chest Flye",           target: "MID CHEST",        sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Cable Lateral Raise",               target: "SIDE DELTS",       sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Cable Front Raise",                 target: "FRONT DELTS",      sets: 3, defaultReps: 12, type: "isolation" },
      { name: "Rope Pushdown",                     target: "TRICEPS",          sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Seated Overhead Tricep Machine",    target: "TRICEPS LONG HEAD",sets: 3, defaultReps: 12, type: "isolation" },
      { name: "Leg Extension",                     target: "QUADS",            sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Leg Press",                         target: "QUADS & GLUTES",   sets: 3, defaultReps: 12, type: "compound",  affects: ["Hamstrings", "Calves"] },
    ],
  },
  "Pull 2": {
    day: "Fri", color: "#A07840",
    exercises: [
      { name: "Fixed Pulldown",                    target: "LATS WIDTH",       sets: 3, defaultReps: 15, type: "compound",  affects: ["Biceps", "Rear Delts"] },
      { name: "Reverse Pec Deck",                  target: "REAR DELTS",       sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Oxygen Rear Delt Machine",          target: "REAR DELTS",       sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Hyperextension",                    target: "LOWER BACK",       sets: 3, defaultReps: 15, type: "compound",  affects: ["Glutes", "Hamstrings"] },
      { name: "Rope Hammer Curl",                  target: "BICEPS & BRACHIALIS", sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Panatta Alternate Arm Curl",        target: "BICEPS",           sets: 3, defaultReps: 12, type: "isolation" },
      { name: "Lying Leg Curl",                    target: "HAMSTRINGS",       sets: 3, defaultReps: 15, type: "isolation" },
      { name: "Hack Squat",                        target: "QUADS & GLUTES",   sets: 2, defaultReps: 12, type: "compound",  affects: ["Glutes", "Hamstrings"] },
    ],
  },
};

// ─── MANSOOR PLAN V2 (Week 2+) ───────────────────────────────────────────────
const mansoorPlanV2 = {
  "Push 1": {
    day: "Mon", color: "#C9A84C",
    exercises: [
      { name: "Incline Press",               target: "UPPER CHEST",        sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Front Delts","Triceps"] },
      { name: "Upper Chest Flye",            target: "UPPER CHEST",        sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Shoulder Press (neutral)",    target: "FRONT DELTS",        sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Triceps","Upper Chest"] },
      { name: "Lateral Raise",               target: "SIDE DELTS",         sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Tricep Dip",                  target: "TRICEPS",            sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Chest","Front Delts"] },
      { name: "Overhead Extension",          target: "TRICEPS LONG HEAD",  sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Leg Extension (warm up)",     target: "QUADS",              sets: 2, defaultReps: "15",    type: "warmup" },
      { name: "Squat",                       target: "QUADS & GLUTES",     sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Hamstrings","Calves"] },
      { name: "Hip Abductor",                target: "OUTER THIGH",        sets: 3, defaultReps: "15",    type: "isolation" },
      { name: "Standing Calf Raise",         target: "CALVES",             sets: 3, defaultReps: "15-20", type: "finisher" },
    ],
  },
  "Pull 1": {
    day: "Tue", color: "#B8964A",
    exercises: [
      { name: "Lat Pulldown (close/neutral)",target: "LATS",               sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Biceps","Rear Delts"] },
      { name: "Row (close/neutral)",         target: "MID BACK",           sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Biceps","Rear Delts"] },
      { name: "Bicep Curl (supinated)",      target: "BICEPS PEAK",        sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Hammer Curl",                 target: "BRACHIALIS",         sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Rear Delt Flye",              target: "REAR DELTS",         sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Shrugs",                      target: "TRAPS",              sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Leg Curl (warm up)",          target: "HAMSTRINGS",         sets: 2, defaultReps: "15",    type: "warmup" },
      { name: "Romanian Deadlift",           target: "HAMSTRINGS & GLUTES",sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Glutes","Lower Back"] },
      { name: "Hip Adductor",                target: "INNER THIGH",        sets: 3, defaultReps: "15",    type: "isolation" },
      { name: "Hyperextension",              target: "LOWER BACK",         sets: 3, defaultReps: "15",    type: "finisher",  affects: ["Glutes","Hamstrings"] },
    ],
  },
  "Push 2": {
    day: "Thu", color: "#D4B86A",
    exercises: [
      { name: "Flat Press",                  target: "MID CHEST",          sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Triceps","Front Delts"] },
      { name: "Lower Chest Flye",            target: "LOWER CHEST",        sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Shoulder Press (wide grip)",  target: "FRONT & SIDE DELTS", sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Triceps"] },
      { name: "Lateral Raise",               target: "SIDE DELTS",         sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Tricep Pushdown",             target: "TRICEPS LATERAL",    sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Overhead Extension",          target: "TRICEPS LONG HEAD",  sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Leg Extension (warm up)",     target: "QUADS",              sets: 2, defaultReps: "15",    type: "warmup" },
      { name: "Hack Squat",                  target: "QUADS & GLUTES",     sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Glutes","Hamstrings"], note: "knee braces!" },
      { name: "Glute Kickback",              target: "GLUTES",             sets: 3, defaultReps: "15",    type: "isolation" },
      { name: "Seated Calf Raise",           target: "CALVES",             sets: 3, defaultReps: "15-20", type: "finisher" },
    ],
  },
  "Pull 2": {
    day: "Fri", color: "#A07840",
    exercises: [
      { name: "Lat Pulldown (wide grip)",    target: "LATS",               sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Biceps","Rear Delts"] },
      { name: "Row (wide grip)",             target: "UPPER BACK",         sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Biceps","Rear Delts"] },
      { name: "Bicep Curl (supinated)",      target: "BICEPS PEAK",        sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Hammer Curl",                 target: "BRACHIALIS",         sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Rear Delt Flye",              target: "REAR DELTS",         sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Shrugs",                      target: "TRAPS",              sets: 3, defaultReps: "12-15", type: "isolation" },
      { name: "Leg Curl (warm up)",          target: "HAMSTRINGS",         sets: 2, defaultReps: "15",    type: "warmup" },
      { name: "Leg Press",                   target: "QUADS & GLUTES",     sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Hamstrings","Calves"] },
      { name: "Hip Thrust",                  target: "GLUTES",             sets: 4, defaultReps: "8-12",  type: "compound",  affects: ["Hamstrings"] },
      { name: "Hyperextension",              target: "LOWER BACK",         sets: 3, defaultReps: "15",    type: "finisher",  affects: ["Glutes","Hamstrings"] },
    ],
  },
};

const REST_TIMES  = { compound: 150, isolation: 75, warmup: 52, finisher: 52 };
const REST_LABELS = { compound: "2–3 MIN", isolation: "60–90 SEC", warmup: "45–60 SEC", finisher: "45–60 SEC" };

const WARMUP_ITEMS = [
  { label: "Treadmill incline 10",       detail: "5 mins" },
  { label: "Arm circles",                detail: "1 min" },
  { label: "Hip flexor stretch",         detail: "1 min" },
  { label: "Wrist flexor stretch",       detail: "1 min" },
  { label: "Light set on first exercise",detail: "50% weight · 1 set" },
];

const STRETCHES = [
  { muscle: "Chest",       duration: "30 secs" },
  { muscle: "Shoulders",   duration: "30 secs each" },
  { muscle: "Triceps",     duration: "30 secs each" },
  { muscle: "Lats",        duration: "30 secs each" },
  { muscle: "Biceps",      duration: "30 secs each" },
  { muscle: "Quads",       duration: "30 secs each" },
  { muscle: "Hamstrings",  duration: "30 secs" },
  { muscle: "Glutes",      duration: "30 secs each" },
  { muscle: "Calves",      duration: "30 secs each" },
  { muscle: "Hip Flexors", duration: "30 secs each" },
];

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

// ─── PARI'S PLAN ─────────────────────────────────────────────────────────────
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
      { name: "Seated Calf Raise", target: "CALVES", sets: 3, defaultReps: 20, tip: "Full range every rep. All the way up, all the way down. Slow counts." },
    ],
  },
  "Day 2": {
    day: "Wed", color: "#A78BFA", focus: "Upper Body",
    description: "Back · Shoulders · Chest · Arms",
    exercises: [
      { name: "Treadmill Walk (Incline 8-10%)", target: "CARDIO WARMUP", sets: 1, defaultReps: "10 min", tip: "Same warmup as Day 1 — gets blood flowing before lifting." },
      { name: "Lat Pulldown (Wide Grip)", target: "BACK WIDTH", sets: 3, defaultReps: 15, tip: "Pull bar to upper chest. Lean back slightly. Control the weight on the way up." },
      { name: "Seated Cable Row", target: "MID BACK", sets: 3, defaultReps: 15, tip: "Sit tall. Pull elbows back, squeeze shoulder blades together. Don't round your back." },
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
      { name: "Treadmill Walk (Incline 8-10%)", target: "CARDIO WARMUP", sets: 1, defaultReps: "10 min", tip: "Warmup walk before full body session. Take it easy here." },
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

// ─── WARMUP CHECKLIST ────────────────────────────────────────────────────────
function WarmUpChecklist({ color, onStart }) {
  const [checked, setChecked] = useState({});
  const allDone = WARMUP_ITEMS.every((_, i) => checked[i]);
  const toggle = (i) => setChecked(p => ({ ...p, [i]: !p[i] }));
  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 4, marginBottom: 4 }}>BEFORE YOU START</div>
      <div style={{ fontSize: 22, letterSpacing: 2, marginBottom: 20 }}>WARM UP</div>
      {WARMUP_ITEMS.map((item, i) => (
        <div key={i} onClick={() => toggle(i)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#111", border: `1px solid ${checked[i] ? color + "55" : "#1e1e1e"}`, borderRadius: 12, marginBottom: 8, cursor: "pointer", transition: "border-color 0.2s" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${checked[i] ? color : "#333"}`, background: checked[i] ? color : "none", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#000", transition: "all 0.2s" }}>{checked[i] ? "✓" : ""}</div>
          <div>
            <div style={{ fontSize: 14, letterSpacing: 1, color: checked[i] ? "#555" : "#fff" }}>{item.label}</div>
            <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", marginTop: 2 }}>{item.detail}</div>
          </div>
        </div>
      ))}
      <button onClick={onStart} disabled={!allDone} style={{ width: "100%", marginTop: 16, padding: "16px", background: allDone ? color : "#1a1a1a", color: allDone ? "#000" : "#333", border: "none", borderRadius: 12, fontSize: 16, letterSpacing: 3, cursor: allDone ? "pointer" : "not-allowed", fontFamily: "'Bebas Neue', sans-serif", transition: "all 0.3s" }}>
        {allDone ? "START SESSION →" : `${Object.values(checked).filter(Boolean).length}/${WARMUP_ITEMS.length} COMPLETE`}
      </button>
      <button onClick={onStart} style={{ width: "100%", marginTop: 8, padding: "10px", background: "none", color: "#333", border: "none", fontSize: 10, letterSpacing: 3, cursor: "pointer", fontFamily: "monospace" }}>SKIP WARMUP</button>
    </div>
  );
}

// ─── REST TIMER ───────────────────────────────────────────────────────────────
function RestTimer({ seconds, color, onDone }) {
  const [remaining, setRemaining] = useState(seconds);
  const pct = remaining / seconds;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  useEffect(() => {
    if (remaining <= 0) { onDone(); return; }
    const t = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(t);
  }, [remaining]);
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 300, background: "#0f0f0f", borderTop: `2px solid ${color}`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", border: `3px solid ${color}33`, flexShrink: 0, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="23" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${pct * 144.5} 144.5`} strokeLinecap="round" transform="rotate(-90 26 26)" />
        </svg>
        <div style={{ fontSize: 11, fontFamily: "monospace", color, fontWeight: 900 }}>{fmt(remaining)}</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9, color: "#555", fontFamily: "monospace", letterSpacing: 3 }}>REST TIMER</div>
        <div style={{ fontSize: 13, letterSpacing: 2, color: "#fff", marginTop: 2 }}>NEXT SET IN {fmt(remaining)}</div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={() => setRemaining(r => Math.max(0, r - 15))} style={{ background: "#1a1a1a", border: "none", color: "#aaa", borderRadius: 8, padding: "8px 10px", fontSize: 11, fontFamily: "monospace", cursor: "pointer" }}>-15s</button>
        <button onClick={() => setRemaining(r => r + 15)} style={{ background: "#1a1a1a", border: "none", color: "#aaa", borderRadius: 8, padding: "8px 10px", fontSize: 11, fontFamily: "monospace", cursor: "pointer" }}>+15s</button>
        <button onClick={onDone} style={{ background: color, border: "none", color: "#000", borderRadius: 8, padding: "8px 14px", fontSize: 11, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, cursor: "pointer" }}>SKIP</button>
      </div>
    </div>
  );
}

// ─── STRETCH SECTION ─────────────────────────────────────────────────────────
function StretchSection({ color }) {
  const [checked, setChecked] = useState({});
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div style={{ margin: "20px 16px 0", padding: "20px 16px", background: "#111", border: `1px solid ${color}44`, borderRadius: 16 }}>
      <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 4, marginBottom: 4 }}>POST WORKOUT</div>
      <div style={{ fontSize: 20, letterSpacing: 2, marginBottom: 16 }}>STRETCHES</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {STRETCHES.map((s, i) => (
          <div key={i} onClick={() => setChecked(p => ({ ...p, [i]: !p[i] }))} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: checked[i] ? color + "18" : "#1a1a1a", border: `1px solid ${checked[i] ? color + "55" : "#2a2a2a"}`, borderRadius: 10, cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${checked[i] ? color : "#333"}`, background: checked[i] ? color : "none", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#000" }}>{checked[i] ? "✓" : ""}</div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 1, color: checked[i] ? "#666" : "#ccc" }}>{s.muscle}</div>
              <div style={{ fontSize: 9, color: "#444", fontFamily: "monospace" }}>{s.duration}</div>
            </div>
          </div>
        ))}
      </div>
      {done === STRETCHES.length && <div style={{ marginTop: 14, textAlign: "center", fontSize: 11, color: color, fontFamily: "monospace", letterSpacing: 3 }}>ALL DONE 💪</div>}
    </div>
  );
}

// ─── CALENDAR PICKER ─────────────────────────────────────────────────────────
function CalendarPicker({ color, onSelect, onClose }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayLabels  = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const firstDay   = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => viewMonth === 0 ? (setViewMonth(11), setViewYear(y => y - 1)) : setViewMonth(m => m - 1);
  const nextMonth = () => viewMonth === 11 ? (setViewMonth(0),  setViewYear(y => y + 1)) : setViewMonth(m => m + 1);

  const pick = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    const dn = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
    const mn = monthNames[viewMonth].slice(0, 3);
    onSelect(`${dn} · ${mn} ${day}`);
  };

  return (
    <div onClick={e => e.stopPropagation()} style={{ background: "#181818", border: `1px solid ${color}55`, borderRadius: 12, padding: "12px 10px", width: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px" }}>‹</button>
        <div style={{ fontSize: 11, color: "#fff", fontFamily: "monospace", letterSpacing: 2 }}>{monthNames[viewMonth].slice(0,3).toUpperCase()} {viewYear}</div>
        <button onClick={nextMonth} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px" }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {dayLabels.map(d => <div key={d} style={{ textAlign: "center", fontSize: 9, color: "#555", fontFamily: "monospace", padding: "2px 0" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          return (
            <button key={day} onClick={() => pick(day)} style={{ background: isToday ? color + "33" : "none", border: isToday ? `1px solid ${color}66` : "1px solid transparent", color: "#ccc", cursor: "pointer", fontSize: 11, fontFamily: "monospace", padding: "5px 0", borderRadius: 5, textAlign: "center", transition: "background 0.1s" }}
              onMouseEnter={e => e.currentTarget.style.background = color + "55"}
              onMouseLeave={e => e.currentTarget.style.background = isToday ? color + "33" : "none"}>
              {day}
            </button>
          );
        })}
      </div>
      <div onClick={onClose} style={{ marginTop: 10, textAlign: "center", fontSize: 9, color: "#555", fontFamily: "monospace", cursor: "pointer", letterSpacing: 2, paddingTop: 8, borderTop: "1px solid #2a2a2a" }}>CANCEL</div>
    </div>
  );
}

// ─── MANSOOR TRACKER ─────────────────────────────────────────────────────────
function MansoorTracker() {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [selectedDay, setSelectedDay] = useState("Push 1");
  const [logs, setLogs] = useState({});
  const [activeExercise, setActiveExercise] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [editingDate, setEditingDate] = useState(null);
  const [calendarPos, setCalendarPos] = useState(null);
  const [editingExName, setEditingExName] = useState(null);
  const [tempVal, setTempVal] = useState("");
  const [warmupDone, setWarmupDone] = useState(false);
  const [restTimer, setRestTimer] = useState(null); // { seconds, color }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/sync/mansoor");
        const { data } = await res.json();
        setLogs(data.logs ? { ...mansoorLogs, ...data.logs } : { ...mansoorLogs });
      } catch { setLogs({ ...mansoorLogs }); }
      setLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const save = async () => {
      try {
        await fetch("/api/sync/mansoor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { logs } }),
        });
        setSaved(true); setTimeout(() => setSaved(false), 2000);
      } catch {}
    };
    save();
  }, [logs, loaded]);

  // ── Reset warmup when switching days ──────────────────────────────────────
  useEffect(() => { setWarmupDone(false); setActiveExercise(null); setRestTimer(null); }, [selectedDay]);

  const workout = selectedWeek === "Week 1" ? mansoorPlan[selectedDay] : mansoorPlanV2[selectedDay];
  const getKey = (w, d, e, s) => `${w}|${d}|${e}|${s}`;
  const getLog = (e, s, f) => logs[getKey(selectedWeek, selectedDay, e, s)]?.[f] || "";
  const updateLog = (e, s, f, v) => {
    const k = getKey(selectedWeek, selectedDay, e, s);
    const updated = { ...logs, [k]: { ...logs[k], [f]: v } };
    setLogs(updated);
    // Trigger rest timer when set is complete
    const other = f === "weight" ? "reps" : "weight";
    if (v && updated[k]?.[other]) {
      const ex = workout.exercises.find(x => x.name === e);
      setRestTimer({ seconds: REST_TIMES[ex?.type] || 75, color: workout.color });
    }
  };
  const isComplete = (n) => { const ex = workout.exercises.find(e => e.name === n); return Array.from({ length: ex.sets }).every((_, i) => getLog(n, i, "weight") && getLog(n, i, "reps")); };
  const totalComplete = workout.exercises.filter(e => isComplete(e.name)).length;

  // ── Previous week reference ────────────────────────────────────────────────
  const prevWeekNum = parseInt(selectedWeek.split(" ")[1]) - 1;
  const prevWeek = prevWeekNum > 0 ? `Week ${prevWeekNum}` : null;
  const getPrevLog = (e, s, f) => prevWeek ? (logs[`${prevWeek}|${selectedDay}|${e}|${s}`]?.[f] || "") : "";

  // ── Progressive overload suggestion ───────────────────────────────────────
  const getPoSuggestion = (exName, exType) => {
    if (!prevWeek) return null;
    const ex = workout.exercises.find(e => e.name === exName);
    if (!ex) return null;
    const prevSets = Array.from({ length: ex.sets }, (_, i) => ({
      w: parseFloat(getPrevLog(exName, i, "weight")) || 0,
      r: parseFloat(getPrevLog(exName, i, "reps")) || 0,
    }));
    const topW = Math.max(...prevSets.map(s => s.w));
    if (topW === 0) return null;
    const allHit = prevSets.every(s => s.w > 0 && s.r > 0);
    const inc = exType === "compound" ? 2.5 : 2.5;
    return { topW, allHit, suggested: allHit ? topW + inc : topW, inc };
  };

  // ── Custom dates ──────────────────────────────────────────────────────────
  const getDate = (day) => logs[`__date|${selectedWeek}|${day}`] || mansoorWeekDates[selectedWeek]?.[day] || "";
  const commitDate = (day) => { setLogs(p => ({ ...p, [`__date|${selectedWeek}|${day}`]: tempVal })); setEditingDate(null); };

  // ── Exercise name overrides ────────────────────────────────────────────────
  const getExName = (orig) => logs[`__exname|${selectedWeek}|${selectedDay}|${orig}`] || orig;
  const commitExName = (orig) => { setLogs(p => ({ ...p, [`__exname|${selectedWeek}|${selectedDay}|${orig}`]: tempVal.trim() || orig })); setEditingExName(null); };

  // ── Show warmup for fresh sessions only ───────────────────────────────────
  const hasExistingLogs = workout.exercises.some(ex => Array.from({ length: ex.sets }).some((_, i) => getLog(ex.name, i, "weight")));
  const showWarmup = !warmupDone && !hasExistingLogs;

  if (!loaded) return <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "monospace", fontSize: 14, letterSpacing: 2 }}>LOADING...</div>;

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
        {Object.entries(mansoorPlan).map(([day, data]) => {
          const isActive = selectedDay === day;
          const displayDate = getDate(day);
          return (
            <div key={day} data-daytab="1" style={{ flexShrink: 0 }}>
              <button onClick={() => { setSelectedDay(day); setActiveExercise(null); setEditingDate(null); setCalendarPos(null); setEditingExName(null); }}
                style={{ padding: "8px 14px", background: isActive ? data.color : "#1a1a1a", color: isActive ? "#000" : "#555", border: `1px solid ${isActive ? data.color : "#2a2a2a"}`, borderRadius: 8, fontSize: 12, letterSpacing: 1, cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", display: "block", textAlign: "left", minWidth: 80 }}>
                <div>{day}</div>
                <div style={{ fontSize: 9, fontFamily: "monospace", opacity: 0.7, marginTop: 2, display: "flex", alignItems: "center", gap: 3 }}>
                  <span>{displayDate}</span>
                  <span onClick={e => { e.stopPropagation(); const r = e.currentTarget.closest('[data-daytab]').getBoundingClientRect(); if (editingDate === day) { setEditingDate(null); setCalendarPos(null); } else { setCalendarPos({ top: r.bottom + 6, left: Math.min(r.left, window.innerWidth - 220) }); setEditingDate(day); } }}
                    style={{ fontSize: 8, opacity: 0.5, cursor: "pointer" }}>✎</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
      {editingDate && calendarPos && (
        <>
          <div onClick={() => { setEditingDate(null); setCalendarPos(null); }} style={{ position: "fixed", inset: 0, zIndex: 199 }} />
          <div style={{ position: "fixed", top: calendarPos.top, left: calendarPos.left, zIndex: 200, width: 216 }}>
            <CalendarPicker
              color={mansoorPlan[editingDate]?.color || workout.color}
              onSelect={val => { setLogs(p => ({ ...p, [`__date|${selectedWeek}|${editingDate}`]: val })); setEditingDate(null); setCalendarPos(null); }}
              onClose={() => { setEditingDate(null); setCalendarPos(null); }}
            />
          </div>
        </>
      )}
      <div style={{ padding: "16px 16px 0" }}>
        {showWarmup ? (
          <WarmUpChecklist color={workout.color} onStart={() => setWarmupDone(true)} />
        ) : (
        <>
        {workout.exercises.map((exercise, idx) => {
          const done = isComplete(exercise.name);
          const expanded = activeExercise === exercise.name;
          const po = getPoSuggestion(exercise.name, exercise.type);
          const typeBadge = {
            compound: { bg: "#60A5FA22", color: "#60A5FA", label: "COMPOUND" },
            isolation:{ bg: "#A3E63522", color: "#A3E635", label: "ISOLATION" },
            warmup:   { bg: "#94A3B822", color: "#94A3B8", label: "WARM UP" },
            finisher: { bg: "#FB923C22", color: "#FB923C", label: "FINISHER" },
          }[exercise.type] || { bg: "#33333322", color: "#888", label: exercise.type?.toUpperCase() };
          return (
            <div key={exercise.name} style={{ marginBottom: 10, border: `1px solid ${done ? workout.color : expanded ? "#333" : "#1e1e1e"}`, borderRadius: 12, overflow: "hidden", background: done ? `${workout.color}11` : "#111" }}>
              <div onClick={() => setActiveExercise(expanded ? null : exercise.name)} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? workout.color : "#1e1e1e", color: done ? "#000" : "#444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, flexShrink: 0 }}>{done ? "✓" : idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, letterSpacing: 1, lineHeight: 1.2, display: "flex", alignItems: "center", gap: 6 }}>
                    {editingExName === exercise.name ? (
                      <input autoFocus value={tempVal}
                        onChange={e => setTempVal(e.target.value)}
                        onBlur={() => commitExName(exercise.name)}
                        onKeyDown={e => { e.stopPropagation(); if (e.key === "Enter") commitExName(exercise.name); if (e.key === "Escape") setEditingExName(null); }}
                        onClick={e => e.stopPropagation()}
                        style={{ flex: 1, background: "#1a1a1a", border: `1px solid ${workout.color}`, borderRadius: 6, color: "#fff", fontSize: 13, padding: "4px 8px", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1, outline: "none" }} />
                    ) : (
                      <>
                        <span>{getExName(exercise.name)}</span>
                        <span onClick={e => { e.stopPropagation(); setTempVal(getExName(exercise.name)); setEditingExName(exercise.name); }}
                          style={{ fontSize: 11, color: "#444", cursor: "pointer", flexShrink: 0 }}>✎</span>
                      </>
                    )}
                  </div>
                  <div style={{ fontSize: 9, color: workout.color, letterSpacing: 2, fontFamily: "monospace", marginTop: 3 }}>
                    {exercise.target} • {exercise.sets} × {exercise.defaultReps}{exercise.note ? ` · ${exercise.note}` : ""}
                  </div>
                  <div style={{ fontSize: 9, fontFamily: "monospace", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ background: typeBadge.bg, color: typeBadge.color, padding: "1px 6px", borderRadius: 3, letterSpacing: 1 }}>{typeBadge.label}</span>
                    <span style={{ color: "#444", letterSpacing: 1 }}>{REST_LABELS[exercise.type]}</span>
                    {exercise.affects && <span style={{ color: "#555", letterSpacing: 1 }}>+{exercise.affects.join(" · ")}</span>}
                  </div>
                </div>
                <div style={{ color: "#444", fontSize: 16, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>v</div>
              </div>
              {expanded && (
                <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1e1e1e" }}>
                  {/* Progressive overload banner */}
                  {po && (
                    <div style={{ margin: "12px 0 8px", padding: "10px 12px", background: po.allHit ? `${workout.color}11` : "#1a1000", border: `1px solid ${po.allHit ? workout.color + "44" : "#2a1800"}`, borderRadius: 8 }}>
                      <div style={{ fontSize: 9, color: "#555", fontFamily: "monospace", letterSpacing: 2, marginBottom: 4 }}>PROGRESSIVE OVERLOAD</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 10, color: "#666", fontFamily: "monospace" }}>{prevWeek} MAX: {po.topW}kg · {po.allHit ? "✓ ALL REPS HIT" : "✗ NOT COMPLETED"}</div>
                        <div style={{ fontSize: 12, color: po.allHit ? workout.color : "#888", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}>
                          TARGET: {po.suggested}kg {po.allHit ? `(+${po.inc}kg)` : "(same)"}
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr", gap: 8, margin: "12px 0 8px" }}>
                    <div style={{ fontSize: 9, color: "#444", letterSpacing: 2, fontFamily: "monospace", textAlign: "center" }}>SET</div>
                    <div style={{ fontSize: 9, color: "#444", letterSpacing: 2, fontFamily: "monospace", textAlign: "center" }}>KG</div>
                    <div style={{ fontSize: 9, color: "#444", letterSpacing: 2, fontFamily: "monospace", textAlign: "center" }}>REPS</div>
                  </div>
                  {Array.from({ length: exercise.sets }).map((_, setIdx) => {
                    const w = getLog(exercise.name, setIdx, "weight"); const r = getLog(exercise.name, setIdx, "reps"); const setDone = w && r;
                    const prevW = getPrevLog(exercise.name, setIdx, "weight"); const prevR = getPrevLog(exercise.name, setIdx, "reps");
                    const inp = { background: "#1a1a1a", border: `1px solid ${setDone ? workout.color + "66" : "#2a2a2a"}`, borderRadius: 8, color: "#fff", padding: "10px", fontSize: 16, fontFamily: "'Bebas Neue', sans-serif", textAlign: "center", outline: "none", width: "100%", boxSizing: "border-box" };
                    return (
                      <div key={setIdx} style={{ marginBottom: 10 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr", gap: 8, alignItems: "center" }}>
                          <div style={{ textAlign: "center", fontSize: 13, color: setDone ? workout.color : "#444", fontFamily: "monospace" }}>{setDone ? "✓" : setIdx + 1}</div>
                          <input type="number" placeholder="kg" value={w} onChange={e => updateLog(exercise.name, setIdx, "weight", e.target.value)} style={inp} />
                          <input type="number" placeholder="reps" value={r} onChange={e => updateLog(exercise.name, setIdx, "reps", e.target.value)} style={inp} />
                        </div>
                        {prevW && prevR && (
                          <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr", gap: 8, marginTop: 3 }}>
                            <div />
                            <div style={{ textAlign: "center", fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 1 }}>{prevWeek}: {prevW}kg</div>
                            <div style={{ textAlign: "center", fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 1 }}>{prevR} reps</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div style={{ marginTop: 8, padding: "8px 12px", background: "#0d0d0d", borderRadius: 8, fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 1 }}>
                    TARGET: {exercise.sets} × {exercise.defaultReps} REPS · REST: {REST_LABELS[exercise.type]}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </>
        )}
      </div>
      {totalComplete === workout.exercises.length && (
        <>
          <div style={{ margin: "20px 16px 0", padding: "20px", background: `linear-gradient(135deg, ${workout.color}22, ${workout.color}11)`, border: `1px solid ${workout.color}`, borderRadius: 16, textAlign: "center" }}>
            <div style={{ fontSize: 30, letterSpacing: 3, color: workout.color }}>SESSION COMPLETE</div>
            <div style={{ fontSize: 11, color: "#888", fontFamily: "monospace", marginTop: 6 }}>SAUNA → COLD PLUNGE → SAUNA</div>
          </div>
          <StretchSection color={workout.color} />
        </>
      )}
      <div style={{ margin: "16px 16px 0", padding: "12px 16px", background: "#1a1500", border: "1px solid #C9A84C44", borderRadius: 10, fontSize: 10, color: "#C9A84C", fontFamily: "monospace", letterSpacing: 1, lineHeight: 1.8 }}>
        TENNIS ELBOW: HOOKS ON PULLS • ANKLE STRAPS ON CABLES • NEUTRAL GRIP • STOP IF SHARP PAIN
      </div>
      {restTimer && <RestTimer seconds={restTimer.seconds} color={restTimer.color} onDone={() => setRestTimer(null)} />}
    </div>
  );
}

// ─── PARI TRACKER ────────────────────────────────────────────────────────────
function PariTracker() {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [selectedDay, setSelectedDay] = useState("Day 1");
  const [logs, setLogs] = useState({});
  const [activeExercise, setActiveExercise] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/sync/pari");
        const { data } = await res.json();
        setLogs(data.logs ? { ...data.logs } : {});
      } catch { setLogs({}); }
      setLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const save = async () => {
      try {
        await fetch("/api/sync/pari", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { logs } }),
        });
        setSaved(true); setTimeout(() => setSaved(false), 2000);
      } catch {}
    };
    save();
  }, [logs, loaded]);

  const workout = pariPlan[selectedDay];
  const getLog = (e, s, f) => logs[`${selectedWeek}|${selectedDay}|${e}|${s}`]?.[f] || "";
  const updateLog = (e, s, f, v) => { const k = `${selectedWeek}|${selectedDay}|${e}|${s}`; setLogs(p => ({ ...p, [k]: { ...p[k], [f]: v } })); };
  const isComplete = (name) => { const ex = workout.exercises.find(e => e.name === name); if (ex.sets === 1) return !!getLog(name, 0, "done"); return Array.from({ length: ex.sets }).every((_, i) => getLog(name, i, "weight") && getLog(name, i, "reps")); };
  const totalComplete = workout.exercises.filter(e => isComplete(e.name)).length;

  if (!loaded) return <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "monospace", fontSize: 14, letterSpacing: 2 }}>LOADING...</div>;

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
          const done = isComplete(exercise.name);
          const expanded = activeExercise === exercise.name;
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

// ─── PROFILE SELECTOR ────────────────────────────────────────────────────────
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
      <div onClick={() => setProfile(null)} style={{ position: "fixed", top: 12, right: 16, zIndex: 200, cursor: "pointer", fontSize: 10, fontFamily: "monospace", color: "#444", letterSpacing: 2, background: "#111", padding: "6px 10px", borderRadius: 6, border: "1px solid #2a2a2a" }}>
        SWITCH
      </div>
      {profile === "Mansoor" ? <MansoorTracker /> : <PariTracker />}
    </div>
  );
}
