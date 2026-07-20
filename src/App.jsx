import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Zap, Calendar, SkipForward, Pencil, Check, X, Plus } from "lucide-react";

// ─── MANSOOR ACCENT / STYLE ───────────────────────────────────────────────────
const ACCENT = {
  "Push": { accent:"#C9A96E", dim:"rgba(201,169,110,0.12)", border:"rgba(201,169,110,0.3)" },
  "Legs": { accent:"#6BA57A", dim:"rgba(107,165,122,0.12)", border:"rgba(107,165,122,0.3)" },
  "Pull":     { accent:"#D4D4D4", dim:"rgba(212,212,212,0.12)", border:"rgba(212,212,212,0.3)" },
  "Flex Day": { accent:"#E8C85A", dim:"rgba(232,200,90,0.12)",  border:"rgba(232,200,90,0.3)"  },
};

const PARI_ACCENT = {
  "Session A": { accent:"#E8A0A0", dim:"rgba(232,160,160,0.12)", border:"rgba(232,160,160,0.3)" },
  "Session B": { accent:"#C97B7B", dim:"rgba(201,123,123,0.12)", border:"rgba(201,123,123,0.3)" },
  "Session C": { accent:"#D4A574", dim:"rgba(212,165,116,0.12)", border:"rgba(212,165,116,0.3)" },
  "Rest Day":  { accent:"#B8896A", dim:"rgba(184,137,106,0.12)", border:"rgba(184,137,106,0.3)" },
};

const PARI_DAYS = ["Session A","Session B","Session C","Rest Day"];

const PARI_WARMUP_CARDIO = [
  { id:"c1", label:"Treadmill Walk",  detail:"Incline 5 · 5-10 mins" },
  { id:"c2", label:"Stationary Bike", detail:"Easy pace · 5-10 mins" },
  { id:"c3", label:"Stair Climber",   detail:"Comfortable pace · 5-10 mins" },
];
const PARI_WARMUP_MOBILITY = [
  { id:"m1", label:"Hip Circles",       detail:"1 min each side", video:"https://www.youtube.com/results?search_query=hip+circles+warmup+women" },
  { id:"m2", label:"Arm Swings",        detail:"1 min",           video:"https://www.youtube.com/results?search_query=arm+swings+warmup+women" },
  { id:"m3", label:"Bodyweight Squats", detail:"10 reps — nice and slow", video:"https://www.youtube.com/results?search_query=bodyweight+squats+women" },
];

const TYPE_COLOR = {
  compound:  { bg:"rgba(220,80,80,0.15)",   text:"#e57373", label:"COMPOUND"  },
  isolation: { bg:"rgba(100,160,220,0.15)", text:"#7ab3e0", label:"ISOLATION" },
  warmup:    { bg:"rgba(100,200,140,0.15)", text:"#7bcca0", label:"WARM UP"   },
  finisher:  { bg:"rgba(180,140,220,0.15)", text:"#b89ee0", label:"FINISHER"  },
};

const REST_TIMES  = { compound:150, isolation:75, warmup:50, finisher:50 };
const REST_LABELS = { compound:"2-3 MIN", isolation:"60-90 SEC", warmup:"45-60 SEC", finisher:"45-60 SEC" };

// ─── DAY-SPECIFIC WARMUPS ─────────────────────────────────────────────────────
const PUSH_WARMUP = [
  { label:"Treadmill incline 10",        detail:"5 mins" },
  { label:"Arm circles",                 detail:"1 min",  video:"https://www.youtube.com/results?search_query=arm+circles+warmup" },
  { label:"Wrist flexor stretch",        detail:"1 min",  video:"https://www.youtube.com/results?search_query=wrist+flexor+stretch" },
  { label:"Light set on first exercise", detail:"50% weight · 1 set" },
];
const PULL_WARMUP = [
  { label:"Treadmill incline 10",        detail:"5 mins" },
  { label:"Arm circles",                 detail:"1 min",  video:"https://www.youtube.com/results?search_query=arm+circles+warmup" },
  { label:"Lat stretch",                 detail:"30 secs each side", video:"https://www.youtube.com/results?search_query=lat+stretch" },
  { label:"Wrist flexor stretch",        detail:"1 min",  video:"https://www.youtube.com/results?search_query=wrist+flexor+stretch" },
  { label:"Light set on first exercise", detail:"50% weight · 1 set" },
];
const LEGS_WARMUP = [
  { label:"Kneeling Hip Flexor Stretch", detail:"30 secs each side", video:"https://www.youtube.com/results?search_query=kneeling+hip+flexor+stretch" },
  { label:"Standing Quad Stretch",       detail:"30 secs each side", video:"https://www.youtube.com/results?search_query=standing+quad+stretch" },
  { label:"Seated Forward Fold",         detail:"30 secs",           video:"https://www.youtube.com/results?search_query=seated+forward+fold+hamstring+stretch" },
  { label:"Figure 4 Stretch",            detail:"30 secs each side", video:"https://www.youtube.com/results?search_query=figure+4+piriformis+stretch" },
  { label:"Wall Calf Stretch",           detail:"30 secs each side", video:"https://www.youtube.com/results?search_query=wall+calf+stretch" },
];
// Legacy — kept for archive compatibility
const WARMUP_ITEMS = PUSH_WARMUP;

// ─── DAY-SPECIFIC STRETCHES ───────────────────────────────────────────────────
const PUSH_STRETCHES = [
  { muscle:"Chest",        duration:"30 secs",      video:"https://www.youtube.com/results?search_query=chest+stretch" },
  { muscle:"Shoulders",    duration:"30 secs each", video:"https://www.youtube.com/results?search_query=shoulder+stretch" },
  { muscle:"Triceps",      duration:"30 secs each", video:"https://www.youtube.com/results?search_query=tricep+stretch" },
  { muscle:"Wrist Flexor", duration:"30 secs each", video:"https://www.youtube.com/results?search_query=wrist+flexor+stretch" },
];
const PULL_STRETCHES = [
  { muscle:"Lats",         duration:"30 secs each", video:"https://www.youtube.com/results?search_query=lat+stretch" },
  { muscle:"Biceps",       duration:"30 secs each", video:"https://www.youtube.com/results?search_query=bicep+stretch" },
  { muscle:"Rear Delts",   duration:"30 secs each", video:"https://www.youtube.com/results?search_query=rear+delt+stretch" },
  { muscle:"Wrist Flexor", duration:"30 secs each", video:"https://www.youtube.com/results?search_query=wrist+flexor+stretch" },
];
const LEGS_STRETCHES = [
  { muscle:"Quads",        duration:"30 secs each", video:"https://www.youtube.com/results?search_query=quad+stretch" },
  { muscle:"Hamstrings",   duration:"30 secs",      video:"https://www.youtube.com/results?search_query=hamstring+stretch" },
  { muscle:"Glutes",       duration:"30 secs each", video:"https://www.youtube.com/results?search_query=glute+stretch" },
  { muscle:"Hip Flexors",  duration:"30 secs each", video:"https://www.youtube.com/results?search_query=hip+flexor+stretch" },
  { muscle:"Calves",       duration:"30 secs each", video:"https://www.youtube.com/results?search_query=calf+stretch" },
];
// Legacy constant used by PariTracker StretchSection
const STRETCHES = [...PUSH_STRETCHES, ...PULL_STRETCHES, ...LEGS_STRETCHES];

const REST_DAY_PLAN = [
  { label:"Cardio",                        detail:"20-30 mins · Treadmill or Bike",   video:"https://www.youtube.com/results?search_query=cardio+workout" },
  { label:"Plank",                         detail:"3 sets · 30-60 secs",              video:"https://www.youtube.com/results?search_query=plank+proper+form" },
  { label:"Leg Raises",                    detail:"3 sets · 15 reps",                 video:"https://www.youtube.com/results?search_query=lying+leg+raises+abs" },
  { label:"Russian Twist",                 detail:"3 sets · 20 reps",                 video:"https://www.youtube.com/results?search_query=russian+twist+obliques" },
  { label:"Hip Flexor Stretch (Kneeling)", detail:"2 sets · 30 secs each side",       video:"https://www.youtube.com/results?search_query=kneeling+hip+flexor+stretch" },
  { label:"Pigeon Pose",                   detail:"2 sets · 30-60 secs each side",    video:"https://www.youtube.com/results?search_query=pigeon+pose+hip+flexor" },
  { label:"Sauna",                         detail:"15 mins",                           video:null },
  { label:"Cold Plunge",                   detail:"1-2 mins",                          video:null },
  { label:"Sauna",                         detail:"10-15 mins",                        video:null },
];

const PARI_REST_DAY_PLAN = [
  { label:"Cardio",                        detail:"20-30 mins · Treadmill, Bike or Steps", video:"https://www.youtube.com/results?search_query=cardio+workout+women" },
  { label:"Plank",                         detail:"3 sets · 30-60 secs",                   video:"https://www.youtube.com/results?search_query=plank+proper+form" },
  { label:"Leg Raises",                    detail:"3 sets · 15 reps",                      video:"https://www.youtube.com/results?search_query=lying+leg+raises+abs" },
  { label:"Russian Twist",                 detail:"3 sets · 20 reps",                      video:"https://www.youtube.com/results?search_query=russian+twist+obliques" },
  { label:"Hip Flexor Stretch (Kneeling)", detail:"2 sets · 30 secs each side",            video:"https://www.youtube.com/results?search_query=kneeling+hip+flexor+stretch+women" },
  { label:"Pigeon Pose",                   detail:"2 sets · 30-60 secs each side",         video:"https://www.youtube.com/results?search_query=pigeon+pose+women" },
  { label:"Full Body Stretch",             detail:"5-10 mins · Take your time",            video:"https://www.youtube.com/results?search_query=full+body+stretch+women" },
];

// ─── ARCHIVE PLAN (old program — kept for reference) ─────────────────────────
const ARCHIVE_PLAN = {
  "Push 1": { day:"Monday", exercises: [
    { id:"p1_1", name:"Incline Press",                 target:"UPPER CHEST",        secondary:"Front Delts, Triceps",    type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=incline+chest+press",           poRef:"Panatta Inclined Chest Press Circular", poRefDay:"Push 2" },
    { id:"p1_2", name:"Upper Chest Flye",              target:"UPPER CHEST",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=upper+chest+fly",               poRef:"Panatta Upper Pec Flye",               poRefDay:"Push 1" },
    { id:"p1_3", name:"Shoulder Press (Neutral Grip)", target:"FRONT DELTS",        secondary:"Upper Chest, Triceps",    type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=neutral+grip+shoulder+press",   poRef:"Neutral Grip Machine Shoulder Press",  poRefDay:"Push 1" },
    { id:"p1_4", name:"Machine Lateral Raise",         target:"SIDE DELTS",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=lateral+raise+machine",         poRef:"Machine Lateral Raise",               poRefDay:"Push 1" },
    { id:"p1_5", name:"Tricep Dip",                    target:"TRICEPS",            secondary:"Chest, Shoulders",        type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=tricep+dip+machine",           poRef:"Tricep Dip Machine",                  poRefDay:"Push 1" },
    { id:"p1_6", name:"Overhead Extension",            target:"TRICEPS LONG HEAD",                                      type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=overhead+tricep+extension",     poRef:"Cable Overhead Extension (Rope)",     poRefDay:"Push 1" },
    { id:"p1_7", name:"Leg Extension (Warm Up)",       target:"QUADS",                                                  type:"warmup",    sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=leg+extension",                 poRef:"Leg Extension",                       poRefDay:"Push 2" },
    { id:"p1_8", name:"Squat",                         target:"QUADS & GLUTES",     secondary:"Hamstrings, Lower Back",  type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=squat",                         poRef:"Hack Squat",                          poRefDay:"Pull 2" },
    { id:"p1_9", name:"Hip Abductor",                  target:"OUTER THIGH",                                            type:"isolation", sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=hip+abductor+machine",         poRef:"Hip Abductor",                        poRefDay:"Push 1" },
    { id:"p1_f", name:"Standing Calf Raise",           target:"CALVES",                                                 type:"finisher",  sets:3, defaultReps:"15-20", video:"https://www.youtube.com/results?search_query=standing+calf+raise",           poRef:"Standing Calf Raise",                 poRefDay:"Push 1" },
  ]},
  "Pull 1": { day:"Tuesday", exercises: [
    { id:"pl1_1", name:"Lat Pulldown (Close/Neutral)", target:"LATS WIDTH",          secondary:"Biceps, Rear Delts",     type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=lat+pulldown",      poRef:"Lat Pulldown (V-bar)",                poRefDay:"Pull 1" },
    { id:"pl1_2", name:"Row (Close/Neutral Grip)",     target:"MID BACK",            secondary:"Biceps, Rear Delts",     type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=seated+cable+row",             poRef:"Seated Cable Row",                    poRefDay:"Pull 1" },
    { id:"pl1_3", name:"Bicep Curl (Supinated)",       target:"BICEPS PEAK",                                            type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=bicep+curl+supinated",         poRef:"Machine Preacher Curl",               poRefDay:"Pull 1" },
    { id:"pl1_4", name:"Hammer Curl",                  target:"BRACHIALIS",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=hammer+curl",                   poRef:"ROC-IT Biceps Curl",                  poRefDay:"Pull 1" },
    { id:"pl1_5", name:"Rear Delt Flye",               target:"REAR DELTS",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=rear+delt+fly",                 poRef:"Oxygen Rear Delt Machine",            poRefDay:"Pull 2" },
    { id:"pl1_6", name:"Shrugs",                       target:"TRAPS",                                                  type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=shrugs",                         poRef:"DB Shrugs",                           poRefDay:"Pull 1" },
    { id:"pl1_7", name:"Leg Curl - Lying (Warm Up)",   target:"HAMSTRINGS",                                             type:"warmup",    sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=lying+leg+curl",               poRef:"Lying Leg Curl",                      poRefDay:"Pull 2" },
    { id:"pl1_8", name:"Romanian Deadlift",            target:"HAMSTRINGS & GLUTES", secondary:"Lower Back, Calves",    type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=romanian+deadlift" },
    { id:"pl1_9", name:"Hip Adductor",                 target:"INNER THIGH",                                            type:"isolation", sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=hip+adductor+machine",         poDefault:30 },
    { id:"pl1_f", name:"Hyperextension",               target:"LOWER BACK",          secondary:"Glutes, Hamstrings",    type:"finisher",  sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=hyperextension",               poRef:"Hyperextension",                      poRefDay:"Pull 2" },
  ]},
  "Push 2": { day:"Thursday", exercises: [
    { id:"p2_1", name:"Flat Press",                    target:"MID CHEST",           secondary:"Front Delts, Triceps",   type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=flat+chest+press+machine",    poRef:"Flat Machine Chest Press",            poRefDay:"Push 1" },
    { id:"p2_2", name:"Lower Chest Flye",              target:"LOWER CHEST",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=lower+chest+fly",               poRef:"Vertical Pec Fly",                    poRefDay:"Push 1" },
    { id:"p2_3", name:"Shoulder Press (Wide Grip)",    target:"FRONT & SIDE DELTS",  secondary:"Upper Chest, Triceps",   type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=wide+grip+shoulder+press",    poRef:"Neutral Grip Machine Shoulder Press", poRefDay:"Push 1" },
    { id:"p2_4", name:"Cable Lateral Raise",           target:"SIDE DELTS",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=cable+lateral+raise-Jupl2ciQ",           poRef:"Cable Lateral Raise",                 poRefDay:"Push 2" },
    { id:"p2_5", name:"Tricep Pushdown",               target:"TRICEPS LATERAL",                                        type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=tricep+pushdown",               poRef:"Rope Pushdown",                       poRefDay:"Push 2" },
    { id:"p2_6", name:"Overhead Extension",            target:"TRICEPS LONG HEAD",                                      type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=overhead+tricep+extension",     poRef:"Seated Overhead Tricep Machine",      poRefDay:"Push 2" },
    { id:"p2_7", name:"Leg Extension (Warm Up)",       target:"QUADS",                                                  type:"warmup",    sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=leg+extension",                 poRef:"Leg Extension",                       poRefDay:"Push 2" },
    { id:"p2_8", name:"Hack Squat",                    target:"QUADS & GLUTES",      secondary:"Glutes, Hamstrings",     type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=hack+squat",                   poRef:"Hack Squat",                          poRefDay:"Pull 2", note:"KNEE BRACES!" },
    { id:"p2_9", name:"Glute Kickback",                target:"GLUTES",                                                 type:"isolation", sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=glute+kickback-cgsNePyFo",               poRef:"Gluteus Standing Machine",            poRefDay:"Pull 1" },
    { id:"p2_f", name:"Seated Calf Raise",             target:"CALVES",                                                 type:"finisher",  sets:3, defaultReps:"15-20", video:"https://www.youtube.com/results?search_query=seated+calf+raise" },
  ]},
  "Pull 2": { day:"Friday", exercises: [
    { id:"pl2_1", name:"Lat Pulldown (Wide Grip)",     target:"LATS WIDTH",          secondary:"Biceps, Rear Delts",     type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=lat+pulldown+wide+grip",      poRef:"Fixed Pulldown",                      poRefDay:"Pull 2" },
    { id:"pl2_2", name:"Row (Wide Grip)",              target:"UPPER BACK",          secondary:"Biceps, Rear Delts",     type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=wide+grip+row",               poRef:"Seated Cable Row",                    poRefDay:"Pull 1" },
    { id:"pl2_3", name:"Bicep Curl (Supinated)",       target:"BICEPS PEAK",                                            type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=bicep+curl",                   poRef:"Panatta Alternate Arm Curl",          poRefDay:"Pull 2" },
    { id:"pl2_4", name:"Hammer Curl",                  target:"BRACHIALIS",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=hammer+curl",                   poRef:"Rope Hammer Curl",                    poRefDay:"Pull 2" },
    { id:"pl2_5", name:"Rear Delt Flye",               target:"REAR DELTS",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=rear+delt+fly",                 poRef:"Reverse Pec Deck",                    poRefDay:"Pull 2" },
    { id:"pl2_6", name:"Shrugs",                       target:"TRAPS",                                                  type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=shrugs",                         poRef:"DB Shrugs",                           poRefDay:"Pull 1" },
    { id:"pl2_7", name:"Leg Curl - Seated (Warm Up)",  target:"HAMSTRINGS",                                             type:"warmup",    sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=seated+leg+curl",              poRef:"Lying Leg Curl",                      poRefDay:"Pull 2" },
    { id:"pl2_8", name:"Leg Press",                    target:"QUADS & GLUTES",      secondary:"Hamstrings, Calves",     type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=leg+press-BuqlE",                    poRef:"Leg Press",                           poRefDay:"Push 2" },
    { id:"pl2_9", name:"Hip Thrust",                   target:"GLUTES",              secondary:"Hamstrings, Lower Back", type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=hip+thrust" },
    { id:"pl2_f", name:"Hyperextension",               target:"LOWER BACK",          secondary:"Glutes, Hamstrings",    type:"finisher",  sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=hyperextension",               poRef:"Hyperextension",                      poRefDay:"Pull 2" },
  ]},
};


// ─── MONTH 2 ARCHIVE ─────────────────────────────────────────────────────────
const LEGS_A_ARCHIVE = { label:"LEGS A", exercises: [
  { id:"la_1", name:"Leg Curl Lying (Warm Up)", target:"HAMSTRINGS",     type:"warmup",   sets:3, defaultReps:"15",    poDefault:39,  video:"https://www.youtube.com/results?search_query=lying+leg+curl+jeff+nippard" },
  { id:"la_2", name:"Squat",                   target:"QUADS & GLUTES", type:"compound", sets:4, defaultReps:"8-12",  poDefault:40,  video:"https://www.youtube.com/results?search_query=squat+jeff+nippard",          secondary:"Hamstrings, Lower Back" },
  { id:"la_3", name:"Romanian Deadlift",        target:"HAMSTRINGS",     type:"compound", sets:4, defaultReps:"8-12",  poDefault:40,  video:"https://www.youtube.com/results?search_query=romanian+deadlift+jeff+nippard", secondary:"Glutes, Lower Back" },
  { id:"la_4", name:"Leg Extension",            target:"QUADS",          type:"isolation",sets:3, defaultReps:"12-15", poDefault:57.5,video:"https://www.youtube.com/results?search_query=leg+extension+jeff+nippard" },
  { id:"la_5", name:"Hip Abductor",             target:"OUTER THIGH",    type:"isolation",sets:3, defaultReps:"15",    poDefault:59,  video:"https://www.youtube.com/results?search_query=hip+abductor+jeff+nippard" },
  { id:"la_6", name:"Hip Thrust",               target:"GLUTES",         type:"compound", sets:3, defaultReps:"12-15", poDefault:50,  video:"https://www.youtube.com/results?search_query=hip+thrust+jeff+nippard",    secondary:"Hamstrings" },
  { id:"la_7", name:"Standing Calf Raise",      target:"CALVES",         type:"finisher", sets:3, defaultReps:"15-20", poDefault:55,  video:"https://www.youtube.com/results?search_query=standing+calf+raise+jeff+nippard" },
]};

const LEGS_B_ARCHIVE = { label:"LEGS B", exercises: [
  { id:"lb_1", name:"Leg Curl Seated (Warm Up)",target:"HAMSTRINGS",     type:"warmup",   sets:3, defaultReps:"15",    poDefault:42,  video:"https://www.youtube.com/results?search_query=seated+leg+curl+jeff+nippard" },
  { id:"lb_2", name:"Squat",                   target:"QUADS & GLUTES", type:"compound", sets:4, defaultReps:"8-12",  poDefault:40,  video:"https://www.youtube.com/results?search_query=squat+jeff+nippard",          secondary:"Hamstrings, Lower Back" },
  { id:"lb_3", name:"Romanian Deadlift",        target:"HAMSTRINGS",     type:"compound", sets:4, defaultReps:"8-12",  poDefault:40,  video:"https://www.youtube.com/results?search_query=romanian+deadlift+jeff+nippard", secondary:"Glutes, Lower Back" },
  { id:"lb_4", name:"Leg Press",               target:"QUADS & GLUTES", type:"compound", sets:3, defaultReps:"12-15", poDefault:140, video:"https://www.youtube.com/results?search_query=leg+press+jeff+nippard",      secondary:"Hamstrings, Calves" },
  { id:"lb_5", name:"Hip Adductor",            target:"INNER THIGH",    type:"isolation",sets:3, defaultReps:"15",    poDefault:52,  video:"https://www.youtube.com/results?search_query=hip+adductor+jeff+nippard" },
  { id:"lb_6", name:"Glute Kickback",          target:"GLUTES",         type:"isolation",sets:3, defaultReps:"15",    poDefault:50,  video:"https://www.youtube.com/results?search_query=glute+kickback+jeff+nippard" },
  { id:"lb_7", name:"Standing Calf Raise",      target:"CALVES",         type:"finisher", sets:3, defaultReps:"15-20", poDefault:55,  video:"https://www.youtube.com/results?search_query=standing+calf+raise+jeff+nippard" },
]};

const ARCHIVE_PLAN_2 = {
  "Push 1": { day:"Monday", exercises: [
    { id:"n1_1", name:"Chest Press",              target:"CHEST",            type:"compound",  sets:4, defaultReps:"10-15", poDefault:45,    video:"https://www.youtube.com/results?search_query=chest+press+jeff+nippard",             secondary:"Triceps, Front Delts" },
    { id:"n1_2", name:"Press-Around Flye",        target:"CHEST",            type:"isolation", sets:3, defaultReps:"12-15",                   video:"https://www.youtube.com/results?search_query=press+around+flye+jeff+nippard" },
    { id:"n1_3", name:"Arnold Press",             target:"SHOULDERS",        type:"compound",  sets:3, defaultReps:"10-12",                   video:"https://www.youtube.com/results?search_query=arnold+press+jeff+nippard",            secondary:"Front Delts, Triceps" },
    { id:"n1_4", name:"Cross-body Cable Y-Raise", target:"SIDE DELTS",       type:"isolation", sets:3, defaultReps:"12-15",                   video:"https://www.youtube.com/results?search_query=cable+y+raise+jeff+nippard" },
    { id:"n1_5", name:"Tricep Pushdown",          target:"TRICEPS",          type:"isolation", sets:3, defaultReps:"12-15", poDefault:16.25, video:"https://www.youtube.com/results?search_query=tricep+pushdown+jeff+nippard" },
    { id:"n1_6", name:"Tricep Overhead Extension",target:"TRICEPS LONG HEAD", type:"isolation",sets:3, defaultReps:"12-15",                   video:"https://www.youtube.com/results?search_query=tricep+overhead+extension+jeff+nippard" },
  ]},
  "Pull 1": { day:"Tuesday", exercises: [
    { id:"n2_1", name:"Lat Pulldown",             target:"LATS",             type:"compound",  sets:3, defaultReps:"10-12", poDefault:60,    video:"https://www.youtube.com/results?search_query=lat+pulldown+jeff+nippard",            secondary:"Biceps, Rear Delts", note:"Drop grip each set" },
    { id:"n2_2", name:"Chest Supported Row",      target:"MID BACK",         type:"compound",  sets:3, defaultReps:"10-12", poDefault:50,    video:"https://www.youtube.com/results?search_query=chest+supported+row+jeff+nippard",    secondary:"Biceps, Rear Delts", note:"Omni grip" },
    { id:"n2_3", name:"Pullover + Lat Stretch",   target:"LATS",             type:"isolation", sets:3, defaultReps:"12-15",                   video:"https://www.youtube.com/results?search_query=cable+pullover+lat+stretch+jeff+nippard", note:"Superset · 30s lat stretch after each set" },
    { id:"n2_4", name:"Reverse Cable Crossover",  target:"REAR DELTS",       type:"isolation", sets:3, defaultReps:"12-15",                   video:"https://www.youtube.com/results?search_query=reverse+cable+crossover+jeff+nippard" },
    { id:"n2_5", name:"EZ Bar Curl",              target:"BICEPS",           type:"isolation", sets:3, defaultReps:"10-12",                   video:"https://www.youtube.com/results?search_query=ez+bar+curl+jeff+nippard" },
    { id:"n2_6", name:"Hammer Curl",              target:"BRACHIALIS",       type:"isolation", sets:3, defaultReps:"12-15", poDefault:18.75, video:"https://www.youtube.com/results?search_query=hammer+curl+jeff+nippard",             note:"Preacher style" },
  ]},
  "Push 2": { day:"Thursday", exercises: [
    { id:"n3_1", name:"Incline Press",            target:"UPPER CHEST",      type:"compound",  sets:4, defaultReps:"10-15", poDefault:50,    video:"https://www.youtube.com/results?search_query=incline+press+jeff+nippard",          secondary:"Front Delts, Triceps" },
    { id:"n3_2", name:"Pec Fly",               target:"INNER CHEST",      type:"isolation", sets:3, defaultReps:"12-15",                   video:"https://www.youtube.com/results?search_query=pec+fly+jeff+nippard" },
    { id:"n3_3", name:"Machine Shoulder Press",   target:"FRONT DELTS",      type:"compound",  sets:3, defaultReps:"10-12", poDefault:40,    video:"https://www.youtube.com/results?search_query=machine+shoulder+press+jeff+nippard", secondary:"Triceps" },
    { id:"n3_4", name:"Cable Lateral Raise",      target:"SIDE DELTS",       type:"isolation", sets:3, defaultReps:"12-15", poDefault:6,     video:"https://www.youtube.com/results?search_query=cable+lateral+raise+jeff+nippard" },
    { id:"n3_5", name:"Tricep Dip",               target:"TRICEPS ALL HEADS", type:"compound", sets:3, defaultReps:"10-12", poDefault:59,    video:"https://www.youtube.com/results?search_query=tricep+dip+jeff+nippard",             secondary:"Chest, Shoulders" },
    { id:"n3_6", name:"Cross-body Tricep Extension",target:"TRICEPS LONG",   type:"isolation", sets:3, defaultReps:"12-15",                   video:"https://www.youtube.com/results?search_query=cross+body+tricep+extension+jeff+nippard" },
  ]},
  "Pull 2": { day:"Friday", exercises: [
    { id:"n4_1", name:"Assisted Pull-Up",         target:"LATS",             type:"compound",  sets:3, defaultReps:"AMRAP",                   video:"https://www.youtube.com/results?search_query=assisted+pull+up+jeff+nippard",       secondary:"Biceps, Rear Delts" },
    { id:"n4_2", name:"1-Arm Lat Pulldown",       target:"LATS",             type:"compound",  sets:3, defaultReps:"12-15",                   video:"https://www.youtube.com/results?search_query=one+arm+lat+pulldown+jeff+nippard",  secondary:"Biceps" },
    { id:"n4_3", name:"1-Arm Row",                target:"MID BACK",         type:"compound",  sets:3, defaultReps:"10-12",                   video:"https://www.youtube.com/results?search_query=one+arm+row+jeff+nippard",           secondary:"Biceps, Rear Delts" },
    { id:"n4_4", name:"Shrugs",                   target:"TRAPS",            type:"isolation", sets:3, defaultReps:"12-15", poDefault:60,    video:"https://www.youtube.com/results?search_query=shrugs+jeff+nippard",               note:"Cable first, swap machine if needed" },
    { id:"n4_5", name:"Reverse Pec Deck",         target:"REAR DELTS",       type:"isolation", sets:3, defaultReps:"10-12", poDefault:40,    video:"https://www.youtube.com/results?search_query=reverse+pec+deck+jeff+nippard" },
    { id:"n4_6", name:"Bayesian Cable Curl",      target:"BICEPS",           type:"isolation", sets:3, defaultReps:"12-15", poDefault:34,    video:"https://www.youtube.com/results?search_query=bayesian+cable+curl+jeff+nippard" },
  ]},
};

// ─── WEEK 1 PLAN
// ─── MONTH 3 PROGRAM ─────────────────────────────────────────────────────────
const NEW_PLAN = {
  "Push": { day:"Push Day", exercises: [
    { id:"m3p_1", name:"Incline Press",              target:"UPPER CHEST",      type:"compound",  sets:4, defaultReps:"10-15", poDefault:50,    video:"https://www.youtube.com/results?search_query=incline+press+jeff+nippard",               secondary:"Front Delts, Triceps" },
    { id:"m3p_2", name:"Pec Fly",                 target:"CHEST",            type:"isolation", sets:3, defaultReps:"12-15", poDefault:45,    video:"https://www.youtube.com/results?search_query=pec+fly+jeff+nippard" },
    { id:"m3p_3", name:"Machine Shoulder Press",     target:"FRONT DELTS",      type:"compound",  sets:3, defaultReps:"10-12", poDefault:32.5,  video:"https://www.youtube.com/results?search_query=machine+shoulder+press+jeff+nippard",      secondary:"Triceps" },
    { id:"m3p_4", name:"Machine Lateral Raise",      target:"SIDE DELTS",       type:"isolation", sets:3, defaultReps:"15-20", poDefault:40,    video:"https://www.youtube.com/results?search_query=lateral+raise+machine+jeff+nippard" },
    { id:"m3p_5", name:"Cable Pushdown (rope)",       target:"TRICEPS",          type:"isolation", sets:3, defaultReps:"12-15", poDefault:21.25, poRef:"Tricep Pushdown", poRefDay:"Push", video:"https://www.youtube.com/results?search_query=cable+tricep+pushdown+rope+jeff+nippard" },
    { id:"m3p_6", name:"Cable Overhead Extension (rope)", target:"TRICEPS LONG HEAD", type:"isolation",sets:3, defaultReps:"12-15", poDefault:17.5, poRef:"Tricep Overhead Extension", poRefDay:"Push", video:"https://www.youtube.com/results?search_query=cable+overhead+extension+rope+jeff+nippard" },
  ]},
  "Pull": { day:"Pull Day", exercises: [
    { id:"m3l_1", name:"Lat Pulldown",               target:"LATS",             type:"compound",  sets:3, defaultReps:"10-15", poDefault:60,    video:"https://www.youtube.com/results?search_query=lat+pulldown+jeff+nippard",            secondary:"Biceps, Rear Delts" },
    { id:"m3l_2", name:"T-Bar Row",                  target:"MID BACK",         type:"compound",  sets:3, defaultReps:"10-12", poDefault:60,    video:"https://www.youtube.com/results?search_query=t+bar+row+jeff+nippard",             secondary:"Biceps, Rear Delts", poRef:"Chest Supported Row", poRefDay:"Pull" },
    { id:"m3l_3", name:"Machine Low Row (1 arm)",    target:"LOWER BACK",       type:"compound",  sets:3, defaultReps:"10-12",                  video:"https://www.youtube.com/results?search_query=machine+low+row+one+arm+jeff+nippard", secondary:"Biceps, Rear Delts" },
    { id:"m3l_4", name:"Reverse Pec Deck",           target:"REAR DELTS",       type:"isolation", sets:3, defaultReps:"10-12", poDefault:40,    video:"https://www.youtube.com/results?search_query=reverse+pec+deck+jeff+nippard" },
    { id:"m3l_5", name:"Bayesian Cable Curl",        target:"BICEPS",           type:"isolation", sets:3, defaultReps:"12-15", poDefault:50,    video:"https://www.youtube.com/results?search_query=bayesian+cable+curl+jeff+nippard",    poRef:"EZ Bar Curl", poRefDay:"Pull" },
    { id:"m3l_6", name:"Hammer Preacher Curl",       target:"BRACHIALIS",       type:"isolation", sets:3, defaultReps:"10-12", poDefault:25,    video:"https://www.youtube.com/results?search_query=hammer+preacher+curl+jeff+nippard",  poRef:"Hammer Curl", poRefDay:"Pull" },
  ]},
};

const NEW_LEGS = { day:"Legs Day", exercises: [
  { id:"m3lg_1", name:"Lying Leg Curl (Warm Up)", target:"HAMSTRINGS",     type:"warmup",   sets:3, defaultReps:"15",    poDefault:46,  video:"https://www.youtube.com/results?search_query=lying+leg+curl+jeff+nippard" },
  { id:"m3lg_2", name:"Pendulum/Hack Squat",      target:"QUADS & GLUTES", type:"compound", sets:3, defaultReps:"8-12",  poDefault:80,  video:"https://www.youtube.com/results?search_query=hack+squat+jeff+nippard",    secondary:"Hamstrings, Glutes" },
  { id:"m3lg_3", name:"Romanian Deadlift",         target:"HAMSTRINGS",     type:"compound", sets:3, defaultReps:"8-12",  poDefault:60,  video:"https://www.youtube.com/results?search_query=romanian+deadlift+jeff+nippard", secondary:"Glutes, Lower Back" },
  { id:"m3lg_4", name:"Leg Extension",             target:"QUADS",          type:"isolation",sets:3, defaultReps:"12-15", poDefault:65,  video:"https://www.youtube.com/results?search_query=leg+extension+jeff+nippard" },
  { id:"m3lg_5", name:"Hip Abductor",              target:"OUTER THIGH",    type:"isolation",sets:3, defaultReps:"15",    poDefault:66,  video:"https://www.youtube.com/results?search_query=hip+abductor+jeff+nippard" },
  { id:"m3lg_6", name:"Hip Adductor",              target:"INNER THIGH",    type:"isolation",sets:3, defaultReps:"15",    poDefault:50,  video:"https://www.youtube.com/results?search_query=hip+adductor+jeff+nippard" },
  { id:"m3lg_7", name:"Standing Calf Raise",       target:"CALVES",         type:"finisher", sets:3, defaultReps:"15-20", poDefault:65,  video:"https://www.youtube.com/results?search_query=standing+calf+raise+jeff+nippard" },
]};

// ─── WEEK 1 PLAN (preserved exactly — archive only) ──────────────────────────
const mansoorPlan = {
  "Push 1": { exercises: [
    { id:"m_p1_1", name:"Flat Machine Chest Press",            target:"MID CHEST",         secondary:"Triceps, Front Delts",  type:"compound",  sets:4, defaultReps:"10-12", video:"https://www.youtube.com/results?search_query=machine+chest+press" },
    { id:"m_p1_2", name:"Panatta Upper Pec Flye",              target:"UPPER CHEST",                                          type:"isolation", sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=upper+chest+flye" },
    { id:"m_p1_3", name:"Vertical Pec Fly",                    target:"LOWER CHEST",                                          type:"isolation", sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=vertical+pec+fly" },
    { id:"m_p1_4", name:"Neutral Grip Machine Shoulder Press", target:"FRONT DELTS",        secondary:"Triceps, Upper Chest",  type:"compound",  sets:3, defaultReps:"12",    video:"https://www.youtube.com/results?search_query=neutral+grip+shoulder+press" },
    { id:"m_p1_5", name:"Machine Lateral Raise",               target:"SIDE DELTS",                                          type:"isolation", sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=lateral+raise+machine" },
    { id:"m_p1_6", name:"Tricep Dip Machine",                  target:"TRICEPS",            secondary:"Chest, Front Delts",   type:"compound",  sets:3, defaultReps:"12",    video:"https://www.youtube.com/results?search_query=tricep+dip+machine" },
    { id:"m_p1_7", name:"Cable Overhead Extension (Rope)",     target:"TRICEPS LONG HEAD",                                   type:"isolation", sets:3, defaultReps:"12",    video:"https://www.youtube.com/results?search_query=cable+overhead+tricep+extension" },
    { id:"m_p1_8", name:"Hip Abductor",                        target:"OUTER THIGH",                                         type:"isolation", sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=hip+abductor+machine" },
    { id:"m_p1_9", name:"Standing Calf Raise",                 target:"CALVES",                                              type:"finisher",  sets:3, defaultReps:"20",    video:"https://www.youtube.com/results?search_query=standing+calf+raise" },
  ]},
  "Pull 1": { exercises: [
    { id:"m_pl1_1", name:"Lat Pulldown (V-bar)",       target:"LATS WIDTH",          secondary:"Biceps, Rear Delts",    type:"compound",  sets:4, defaultReps:"12", video:"https://www.youtube.com/results?search_query=lat+pulldown" },
    { id:"m_pl1_2", name:"Seated Cable Row",            target:"MID BACK",            secondary:"Biceps, Rear Delts",    type:"compound",  sets:3, defaultReps:"12", video:"https://www.youtube.com/results?search_query=seated+cable+row" },
    { id:"m_pl1_3", name:"Machine Rear Delt Flye",      target:"REAR DELTS",                                            type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=rear+delt+fly+machine" },
    { id:"m_pl1_4", name:"DB Shrugs",                   target:"TRAPS",                                                 type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=dumbbell+shrugs" },
    { id:"m_pl1_5", name:"ROC-IT Biceps Curl",          target:"BICEPS",                                                type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=roc-it+bicep+curl" },
    { id:"m_pl1_6", name:"Machine Preacher Curl",       target:"BICEPS PEAK",                                           type:"isolation", sets:3, defaultReps:"12", video:"https://www.youtube.com/results?search_query=preacher+curl+machine" },
    { id:"m_pl1_7", name:"Romanian Deadlift",           target:"HAMSTRINGS",          secondary:"Glutes, Lower Back",   type:"compound",  sets:3, defaultReps:"12", video:"https://www.youtube.com/results?search_query=romanian+deadlift" },
    { id:"m_pl1_8", name:"Gluteus Standing Machine",    target:"GLUTES",                                                type:"isolation", sets:3, defaultReps:"12", video:"https://www.youtube.com/results?search_query=gluteus+standing+machine" },
  ]},
  "Push 2": { exercises: [
    { id:"m_p2_1", name:"Panatta Inclined Chest Press Circular", target:"UPPER CHEST",   secondary:"Front Delts, Triceps", type:"compound",  sets:3, defaultReps:"12", video:"https://www.youtube.com/results?search_query=incline+chest+press" },
    { id:"m_p2_2", name:"Straight Arm Chest Flye",               target:"MID CHEST",                                      type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=chest+flye" },
    { id:"m_p2_3", name:"Cable Lateral Raise",                   target:"SIDE DELTS",                                     type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=cable+lateral+raise-Jupl2ciQ" },
    { id:"m_p2_4", name:"Cable Front Raise",                     target:"FRONT DELTS",                                    type:"isolation", sets:3, defaultReps:"12", video:"https://www.youtube.com/results?search_query=cable+front+raise" },
    { id:"m_p2_5", name:"Rope Pushdown",                         target:"TRICEPS",                                        type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=rope+pushdown" },
    { id:"m_p2_6", name:"Seated Overhead Tricep Machine",        target:"TRICEPS LONG HEAD",                              type:"isolation", sets:3, defaultReps:"12", video:"https://www.youtube.com/results?search_query=overhead+tricep+extension+machine" },
    { id:"m_p2_7", name:"Leg Extension",                         target:"QUADS",                                          type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=leg+extension" },
    { id:"m_p2_8", name:"Leg Press",                             target:"QUADS & GLUTES", secondary:"Hamstrings, Calves", type:"compound",  sets:3, defaultReps:"12", video:"https://www.youtube.com/results?search_query=leg+press-BuqlE" },
  ]},
  "Pull 2": { exercises: [
    { id:"m_pl2_1", name:"Fixed Pulldown",               target:"LATS WIDTH",          secondary:"Biceps, Rear Delts",  type:"compound",  sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=lat+pulldown" },
    { id:"m_pl2_2", name:"Reverse Pec Deck",             target:"REAR DELTS",                                          type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=reverse+pec+deck" },
    { id:"m_pl2_3", name:"Oxygen Rear Delt Machine",     target:"REAR DELTS",                                          type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=rear+delt+machine" },
    { id:"m_pl2_4", name:"Hyperextension",               target:"LOWER BACK",          secondary:"Glutes, Hamstrings", type:"compound",  sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=hyperextension" },
    { id:"m_pl2_5", name:"Rope Hammer Curl",             target:"BICEPS & BRACHIALIS",                                 type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=rope+hammer+curl" },
    { id:"m_pl2_6", name:"Panatta Alternate Arm Curl",   target:"BICEPS",                                              type:"isolation", sets:3, defaultReps:"12", video:"https://www.youtube.com/results?search_query=alternate+arm+curl" },
    { id:"m_pl2_7", name:"Lying Leg Curl",               target:"HAMSTRINGS",                                          type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=lying+leg+curl" },
    { id:"m_pl2_8", name:"Hack Squat",                   target:"QUADS & GLUTES",      secondary:"Glutes, Hamstrings", type:"compound",  sets:2, defaultReps:"12", video:"https://www.youtube.com/results?search_query=hack+squat" },
  ]},
};

// ─── WEEK 1 LOGS (preserved exactly) ─────────────────────────────────────────
const mansoorLogs = {
  "Week 1|Push 1|Flat Machine Chest Press|0": { weight:"0",     reps:"15" },
  "Week 1|Push 1|Flat Machine Chest Press|1": { weight:"20",    reps:"15" },
  "Week 1|Push 1|Flat Machine Chest Press|2": { weight:"20",    reps:"12" },
  "Week 1|Push 1|Flat Machine Chest Press|3": { weight:"40",    reps:"10" },
  "Week 1|Push 1|Panatta Upper Pec Flye|0":   { weight:"5",     reps:"15" },
  "Week 1|Push 1|Panatta Upper Pec Flye|1":   { weight:"5",     reps:"15" },
  "Week 1|Push 1|Panatta Upper Pec Flye|2":   { weight:"5",     reps:"15" },
  "Week 1|Push 1|Vertical Pec Fly|0":         { weight:"15",    reps:"15" },
  "Week 1|Push 1|Vertical Pec Fly|1":         { weight:"30",    reps:"15" },
  "Week 1|Push 1|Vertical Pec Fly|2":         { weight:"40",    reps:"15" },
  "Week 1|Push 1|Neutral Grip Machine Shoulder Press|0": { weight:"18", reps:"15" },
  "Week 1|Push 1|Neutral Grip Machine Shoulder Press|1": { weight:"18", reps:"15" },
  "Week 1|Push 1|Neutral Grip Machine Shoulder Press|2": { weight:"18", reps:"15" },
  "Week 1|Push 1|Machine Lateral Raise|0":    { weight:"15",    reps:"15" },
  "Week 1|Push 1|Machine Lateral Raise|1":    { weight:"25",    reps:"15" },
  "Week 1|Push 1|Machine Lateral Raise|2":    { weight:"30",    reps:"12" },
  "Week 1|Push 1|Tricep Dip Machine|0":       { weight:"45",    reps:"15" },
  "Week 1|Push 1|Tricep Dip Machine|1":       { weight:"50",    reps:"15" },
  "Week 1|Push 1|Tricep Dip Machine|2":       { weight:"54",    reps:"15" },
  "Week 1|Push 1|Cable Overhead Extension (Rope)|0": { weight:"20", reps:"15" },
  "Week 1|Push 1|Cable Overhead Extension (Rope)|1": { weight:"30", reps:"15" },
  "Week 1|Push 1|Cable Overhead Extension (Rope)|2": { weight:"40", reps:"13" },
  "Week 1|Push 1|Hip Abductor|0":             { weight:"30",    reps:"15" },
  "Week 1|Push 1|Hip Abductor|1":             { weight:"42",    reps:"15" },
  "Week 1|Push 1|Hip Abductor|2":             { weight:"54",    reps:"15" },
  "Week 1|Push 1|Standing Calf Raise|0":      { weight:"40",    reps:"20" },
  "Week 1|Push 1|Standing Calf Raise|1":      { weight:"45",    reps:"15" },
  "Week 1|Push 1|Standing Calf Raise|2":      { weight:"50",    reps:"15" },
  "Week 1|Pull 1|Lat Pulldown (V-bar)|0":     { weight:"30",    reps:"15" },
  "Week 1|Pull 1|Lat Pulldown (V-bar)|1":     { weight:"40",    reps:"15" },
  "Week 1|Pull 1|Lat Pulldown (V-bar)|2":     { weight:"45",    reps:"12" },
  "Week 1|Pull 1|Lat Pulldown (V-bar)|3":     { weight:"50",    reps:"10" },
  "Week 1|Pull 1|Seated Cable Row|0":         { weight:"35",    reps:"15" },
  "Week 1|Pull 1|Seated Cable Row|1":         { weight:"40",    reps:"15" },
  "Week 1|Pull 1|Seated Cable Row|2":         { weight:"45",    reps:"15" },
  "Week 1|Pull 1|Machine Rear Delt Flye|0":   { weight:"30",    reps:"15" },
  "Week 1|Pull 1|Machine Rear Delt Flye|1":   { weight:"35",    reps:"12" },
  "Week 1|Pull 1|Machine Rear Delt Flye|2":   { weight:"35",    reps:"10" },
  "Week 1|Pull 1|DB Shrugs|0":               { weight:"30",    reps:"15" },
  "Week 1|Pull 1|DB Shrugs|1":               { weight:"35",    reps:"15" },
  "Week 1|Pull 1|DB Shrugs|2":               { weight:"40",    reps:"15" },
  "Week 1|Pull 1|ROC-IT Biceps Curl|0":       { weight:"20",    reps:"15" },
  "Week 1|Pull 1|ROC-IT Biceps Curl|1":       { weight:"29",    reps:"15" },
  "Week 1|Pull 1|ROC-IT Biceps Curl|2":       { weight:"39",    reps:"15" },
  "Week 1|Pull 1|Machine Preacher Curl|0":    { weight:"15",    reps:"15" },
  "Week 1|Pull 1|Machine Preacher Curl|1":    { weight:"20",    reps:"15" },
  "Week 1|Pull 1|Machine Preacher Curl|2":    { weight:"25",    reps:"15" },
  "Week 1|Pull 1|Romanian Deadlift|0":        { weight:"30",    reps:"15" },
  "Week 1|Pull 1|Romanian Deadlift|1":        { weight:"30",    reps:"15" },
  "Week 1|Pull 1|Romanian Deadlift|2":        { weight:"30",    reps:"12" },
  "Week 1|Pull 1|Gluteus Standing Machine|0": { weight:"30",    reps:"15" },
  "Week 1|Pull 1|Gluteus Standing Machine|1": { weight:"40",    reps:"15" },
  "Week 1|Pull 1|Gluteus Standing Machine|2": { weight:"45",    reps:"15" },
  "Week 1|Push 2|Panatta Inclined Chest Press Circular|0": { weight:"30", reps:"15" },
  "Week 1|Push 2|Panatta Inclined Chest Press Circular|1": { weight:"35", reps:"15" },
  "Week 1|Push 2|Panatta Inclined Chest Press Circular|2": { weight:"40", reps:"15" },
  "Week 1|Push 2|Straight Arm Chest Flye|0":  { weight:"30",    reps:"15" },
  "Week 1|Push 2|Straight Arm Chest Flye|1":  { weight:"35",    reps:"15" },
  "Week 1|Push 2|Straight Arm Chest Flye|2":  { weight:"40",    reps:"15" },
  "Week 1|Push 2|Cable Lateral Raise|0":      { weight:"6",     reps:"15" },
  "Week 1|Push 2|Cable Lateral Raise|1":      { weight:"12",    reps:"12" },
  "Week 1|Push 2|Cable Lateral Raise|2":      { weight:"12",    reps:"9"  },
  "Week 1|Push 2|Cable Front Raise|0":        { weight:"6",     reps:"15" },
  "Week 1|Push 2|Cable Front Raise|1":        { weight:"7.5",   reps:"15" },
  "Week 1|Push 2|Cable Front Raise|2":        { weight:"9",     reps:"15" },
  "Week 1|Push 2|Rope Pushdown|0":            { weight:"10.75", reps:"15" },
  "Week 1|Push 2|Rope Pushdown|1":            { weight:"12.5",  reps:"15" },
  "Week 1|Push 2|Rope Pushdown|2":            { weight:"13",    reps:"15" },
  "Week 1|Push 2|Seated Overhead Tricep Machine|0": { weight:"20", reps:"12" },
  "Week 1|Push 2|Seated Overhead Tricep Machine|1": { weight:"30", reps:"12" },
  "Week 1|Push 2|Seated Overhead Tricep Machine|2": { weight:"40", reps:"12" },
  "Week 1|Push 2|Leg Extension|0":            { weight:"30",    reps:"15" },
  "Week 1|Push 2|Leg Extension|1":            { weight:"40",    reps:"15" },
  "Week 1|Push 2|Leg Extension|2":            { weight:"50",    reps:"15" },
  "Week 1|Push 2|Leg Press|0":               { weight:"40",    reps:"12" },
  "Week 1|Push 2|Leg Press|1":               { weight:"80",    reps:"12" },
  "Week 1|Push 2|Leg Press|2":               { weight:"120",   reps:"12" },
  "Week 1|Pull 2|Fixed Pulldown|0":           { weight:"26",    reps:"15" },
  "Week 1|Pull 2|Fixed Pulldown|1":           { weight:"33",    reps:"15" },
  "Week 1|Pull 2|Fixed Pulldown|2":           { weight:"40",    reps:"15" },
  "Week 1|Pull 2|Reverse Pec Deck|0":         { weight:"25",    reps:"15" },
  "Week 1|Pull 2|Reverse Pec Deck|1":         { weight:"30",    reps:"15" },
  "Week 1|Pull 2|Reverse Pec Deck|2":         { weight:"35",    reps:"15" },
  "Week 1|Pull 2|Oxygen Rear Delt Machine|0": { weight:"27",    reps:"15" },
  "Week 1|Pull 2|Oxygen Rear Delt Machine|1": { weight:"32",    reps:"15" },
  "Week 1|Pull 2|Oxygen Rear Delt Machine|2": { weight:"41",    reps:"15" },
  "Week 1|Pull 2|Hyperextension|0":           { weight:"0",     reps:"15" },
  "Week 1|Pull 2|Hyperextension|1":           { weight:"7.5",   reps:"12" },
  "Week 1|Pull 2|Hyperextension|2":           { weight:"7.5",   reps:"12" },
  "Week 1|Pull 2|Rope Hammer Curl|0":         { weight:"11.25", reps:"15" },
  "Week 1|Pull 2|Rope Hammer Curl|1":         { weight:"13.75", reps:"15" },
  "Week 1|Pull 2|Rope Hammer Curl|2":         { weight:"16.25", reps:"15" },
  "Week 1|Pull 2|Panatta Alternate Arm Curl|0": { weight:"15",  reps:"12" },
  "Week 1|Pull 2|Panatta Alternate Arm Curl|1": { weight:"15",  reps:"12" },
  "Week 1|Pull 2|Panatta Alternate Arm Curl|2": { weight:"15",  reps:"12" },
  "Week 1|Pull 2|Lying Leg Curl|0":           { weight:"25",    reps:"15" },
  "Week 1|Pull 2|Lying Leg Curl|1":           { weight:"32",    reps:"15" },
  "Week 1|Pull 2|Lying Leg Curl|2":           { weight:"32",    reps:"15" },
  "Week 1|Pull 2|Hack Squat|0":              { weight:"40",    reps:"12" },
  "Week 1|Pull 2|Hack Squat|1":              { weight:"40",    reps:"12" },
};

const mansoorWeekDates = {
  "Week 1": { "Push 1":"Mon · May 18", "Pull 1":"Tue · May 19", "Push 2":"Thu · May 21", "Pull 2":"Fri · May 22" },
  "Week 2": { "Push 1":"Mon · May 25", "Pull 1":"Tue · May 26", "Push 2":"Thu · May 28", "Pull 2":"Fri · May 29" },
  "Week 3": { "Push 1":"Mon · Jun 1",  "Pull 1":"Tue · Jun 2",  "Push 2":"Thu · Jun 4",  "Pull 2":"Fri · Jun 5"  },
  "Week 4": { "Push 1":"Mon · Jun 8",  "Pull 1":"Tue · Jun 9",  "Push 2":"Thu · Jun 11", "Pull 2":"Fri · Jun 12" },
};

// ─── PARI PLAN (preserved exactly) ───────────────────────────────────────────
const pariPlan = {
  "Session A": { focus:"Lower Body + Core", description:"Quads · Hamstrings · Glutes · Calves · Core", exercises: [
    { id:"a_2", name:"Leg Curl",            target:"HAMSTRINGS",                                      type:"isolation", sets:3, defaultReps:"12-15", tip:"Pull heel smoothly — don't jerk. Feel the back of your thigh working all the way.", video:"https://www.youtube.com/shorts/lGNeJsdqJwg" },
    { id:"a_1", name:"Leg Press",           target:"QUADS & GLUTES",  secondary:"Hamstrings, Calves", type:"compound",  sets:3, defaultReps:"12-15", tip:"Feet shoulder-width, push through heels. Don't lock knees at the top. Light weight to start.", video:"https://www.youtube.com/shorts/KwDFg-BuqlE" },
    { id:"a_3", name:"Hip Abductor",        target:"OUTER THIGH",                                     type:"isolation", sets:3, defaultReps:"15",    tip:"Open legs slowly, squeeze glutes at the widest point. Control both ways.", video:"https://www.youtube.com/shorts/uwKOs7z3O3g" },
    { id:"a_4", name:"Hip Adductor",        target:"INNER THIGH",                                     type:"isolation", sets:3, defaultReps:"15",    tip:"Close legs with control — don't slam them together. Focus on inner thigh.", video:"https://www.youtube.com/watch?v=e9AqTFMmP18" },
    { id:"a_5", name:"Seated Calf Raise",   target:"CALVES",                                          type:"finisher",  sets:3, defaultReps:"15-20", tip:"Full range every rep — all the way up, all the way down. Go slow.", video:"https://www.youtube.com/shorts/2UWMiKqwKUE" },
    { id:"a_6", name:"Plank",               target:"CORE",                                            type:"isolation", sets:3, defaultReps:"30 secs", noWeight:true, timedSet:true, tip:"Keep your body in a straight line. Breathe normally. Don't let your hips sag.", video:"https://www.youtube.com/shorts/Pkp3SOvipZ0" },
    { id:"a_7", name:"Leg Raises",          target:"LOWER ABS",                                       type:"isolation", sets:3, defaultReps:"15",    noWeight:true, tip:"Keep legs straight, lower slowly. Don't let feet touch the floor between reps.", video:"https://www.youtube.com/shorts/6cKTtcWxvQo" },
  ]},
  "Session B": { focus:"Upper Body + Core", description:"Back · Chest · Shoulders · Arms · Core", exercises: [
    { id:"b_1", name:"Lat Pulldown",        target:"BACK WIDTH",      secondary:"Biceps, Rear Delts", type:"compound",  sets:3, defaultReps:"12-15", tip:"Pull bar to upper chest, lean back slightly. Control the weight on the way up — don't let it snap.", video:"https://www.youtube.com/watch?v=RXMe40v6kso" },
    { id:"b_2", name:"Seated Cable Row",    target:"MID BACK",        secondary:"Biceps, Rear Delts", type:"compound",  sets:3, defaultReps:"12-15", tip:"Sit tall, pull elbows back and squeeze shoulder blades together. Don't round your back.", video:"https://www.youtube.com/shorts/I3Ia2y_Bh90" },
    { id:"b_3", name:"Pec Deck Flye",       target:"CHEST",                                           type:"isolation", sets:3, defaultReps:"12-15", tip:"Squeeze chest at the front. Open arms slowly and feel the stretch. Light weight.", video:"https://www.youtube.com/shorts/IZS2RMmqt3E" },
    { id:"b_4", name:"Machine Shoulder Press", target:"SHOULDERS",    secondary:"Triceps",            type:"compound",  sets:3, defaultReps:"12-15", tip:"Press straight up, don't shrug. Start very light — shoulders are easy to strain.", video:"https://www.youtube.com/shorts/PM1hB_2xNBU" },
    { id:"b_5", name:"Cable Curl",          target:"BICEPS",                                          type:"isolation", sets:3, defaultReps:"12-15", tip:"Keep elbows still at sides. Curl up, lower slowly. No swinging — let the bicep do the work.", video:"https://www.youtube.com/shorts/4XQLqBelbPw" },
    { id:"b_6", name:"Rope Pushdown",       target:"TRICEPS",                                         type:"finisher",  sets:3, defaultReps:"12-15", tip:"Push rope down and slightly outward. Keep elbows locked at sides throughout.", video:"https://www.youtube.com/shorts/4NWWB0f0vzQ" },
    { id:"b_7", name:"Russian Twist",       target:"OBLIQUES",                                        type:"isolation", sets:3, defaultReps:"20",    noWeight:true, tip:"Sit back at 45°, feet off the floor. Twist side to side — feel your waist working.", video:"https://www.youtube.com/shorts/hLAZ-IgVXPw" },
  ]},
  "Session C": { focus:"Glutes + Full Body", description:"Glutes · Full body · Core finisher", exercises: [
    { id:"c_1", name:"Hip Thrust Machine",  target:"GLUTES",          secondary:"Hamstrings",         type:"compound",  sets:3, defaultReps:"12-15", tip:"Drive hips up and squeeze glutes hard at the top. Hold for 1 second. This is your main glute builder.", video:"https://www.youtube.com/shorts/m8g9VogoxMo" },
    { id:"c_2", name:"Glute Kickback",      target:"GLUTES",                                          type:"isolation", sets:3, defaultReps:"15",    tip:"One leg at a time. Kick back and squeeze the glute hard at the top. Slow and controlled.", video:"https://www.youtube.com/shorts/n-cgsNePyFo" },
    { id:"c_3", name:"Romanian Deadlift",   target:"HAMSTRINGS",      secondary:"Glutes, Lower Back", type:"compound",  sets:3, defaultReps:"12",    tip:"Light weight only. Hinge at hips, keep back flat. Feel the stretch in your hamstrings as you lower.", video:"https://www.youtube.com/shorts/CBOhr6H7BEY" },
    { id:"c_4", name:"Leg Press",           target:"QUADS & GLUTES",  secondary:"Hamstrings",         type:"compound",  sets:3, defaultReps:"12-15", tip:"Place feet higher on the platform to hit glutes more. Push through heels.", video:"https://www.youtube.com/shorts/KwDFg-BuqlE" },
    { id:"c_5", name:"Cable Lateral Raise", target:"SIDE DELTS",                                      type:"isolation", sets:3, defaultReps:"15",    tip:"Very light weight. Raise arm to shoulder height only. Slow on the way down.", video:"https://www.youtube.com/shorts/lK-Jupl2ciQ" },
    { id:"c_6", name:"Cable Crunch",        target:"ABS",                                             type:"isolation", sets:3, defaultReps:"15",    tip:"Pull down with your abs, not your arms. Round your back as you crunch down.", video:"https://www.youtube.com/shorts/VLbPGv1osLw" },
    { id:"c_7", name:"Seated Calf Raise",   target:"CALVES",                                          type:"finisher",  sets:3, defaultReps:"15-20", tip:"Full range of motion every rep. Slow and controlled — feel the calf stretch at the bottom.", video:"https://www.youtube.com/shorts/2UWMiKqwKUE" },
  ]},
};

const pariWeekDates = {
  "Week 1":{"Session A":"","Session B":"","Session C":""},
  "Week 2":{"Session A":"","Session B":"","Session C":""},
  "Week 3":{"Session A":"","Session B":"","Session C":""},
  "Week 4":{"Session A":"","Session B":"","Session C":""},
};

const WEEKS    = ["Week 1","Week 2","Week 3","Week 4"];
const ALL_DAYS = ["Push","Pull","Legs","Flex Day"];
const ARCHIVE_DAYS = ["Push 1","Pull 1","Push 2","Pull 2"];

const FLEX_DEFAULTS = [
  { id:"fd_1", name:"Chest Press",              target:"CHEST",          type:"compound",  sets:3, defaultReps:"10-15", poDefault:65,   video:"https://www.youtube.com/results?search_query=chest+press+jeff+nippard" },
  { id:"fd_2", name:"Lat Pullover",             target:"LATS",           type:"isolation", sets:3, defaultReps:"12-15",                  video:"https://www.youtube.com/results?search_query=lat+pullover+jeff+nippard" },
  { id:"fd_3", name:"Machine Shoulder Press",   target:"FRONT DELTS",    type:"compound",  sets:3, defaultReps:"10-12", poDefault:32.5, video:"https://www.youtube.com/results?search_query=machine+shoulder+press+jeff+nippard" },
  { id:"fd_4", name:"Leg Press",               target:"QUADS & GLUTES", type:"compound",  sets:3, defaultReps:"12-15", poDefault:200,  video:"https://www.youtube.com/results?search_query=leg+press+jeff+nippard" },
  { id:"fd_5", name:"Shrugs",                  target:"TRAPS",          type:"isolation", sets:3, defaultReps:"12-15", poDefault:60,   video:"https://www.youtube.com/results?search_query=shrugs+jeff+nippard" },
  { id:"fd_6", name:"Preacher Curl",           target:"BICEPS",         type:"isolation", sets:3, defaultReps:"10-12", poDefault:30,   video:"https://www.youtube.com/results?search_query=preacher+curl+jeff+nippard" },
  { id:"fd_7", name:"Bent Over Cable Kickback", target:"TRICEPS",        type:"isolation", sets:3, defaultReps:"12-15",                  video:"https://www.youtube.com/results?search_query=bent+over+cable+kickback+jeff+nippard", note:"Wrist strap" },
  { id:"fd_8", name:"Seated Calf Raise",       target:"CALVES",         type:"finisher",  sets:3, defaultReps:"15-20", poDefault:65,   video:"https://www.youtube.com/results?search_query=seated+calf+raise+jeff+nippard" },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600&display=swap');
  * { box-sizing: border-box; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  input::placeholder { color: rgba(245,241,232,0.2); }
  ::-webkit-scrollbar { display: none; }
`;

// ─── CALENDAR PICKER ─────────────────────────────────────────────────────────
function CalendarPicker({ color, onSelect, onClose }) {
  const today = new Date();
  const [vm, setVm] = useState(today.getMonth());
  const [vy, setVy] = useState(today.getFullYear());
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayLabels = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const firstDay = new Date(vy, vm, 1).getDay();
  const daysInMonth = new Date(vy, vm+1, 0).getDate();
  const prevM = () => vm===0?(setVm(11),setVy(y=>y-1)):setVm(m=>m-1);
  const nextM = () => vm===11?(setVm(0),setVy(y=>y+1)):setVm(m=>m+1);
  const pick = (d) => {
    const dt = new Date(vy, vm, d);
    const dn = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dt.getDay()];
    onSelect(`${dn} · ${months[vm].slice(0,3)} ${d}`);
  };
  return (
    <div style={{ background:"#181818", border:`1px solid ${color}66`, borderRadius:12, padding:"14px 12px", width:"100%", boxSizing:"border-box", marginTop:6 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <button onClick={e=>{e.stopPropagation();prevM();}} style={{ background:"#2a2a2a", border:"none", color:"#ccc", cursor:"pointer", fontSize:16, padding:"4px 10px", borderRadius:6 }}>‹</button>
        <div style={{ fontSize:12, color:"#fff", fontFamily:'"JetBrains Mono",monospace', letterSpacing:2 }}>{months[vm].slice(0,3).toUpperCase()} {vy}</div>
        <button onClick={e=>{e.stopPropagation();nextM();}} style={{ background:"#2a2a2a", border:"none", color:"#ccc", cursor:"pointer", fontSize:16, padding:"4px 10px", borderRadius:6 }}>›</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:6 }}>
        {dayLabels.map(d=><div key={d} style={{ textAlign:"center", fontSize:9, color:"#555", fontFamily:'"JetBrains Mono",monospace', padding:"2px 0" }}>{d}</div>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
        {Array.from({length:firstDay},(_,i)=><div key={`e${i}`}/>)}
        {Array.from({length:daysInMonth},(_,i)=>{
          const d=i+1; const isTd=d===today.getDate()&&vm===today.getMonth()&&vy===today.getFullYear();
          return (
            <button key={d} onClick={e=>{e.stopPropagation();pick(d);}}
              style={{ background:isTd?color+"33":"none", border:isTd?`1px solid ${color}66`:"1px solid transparent", color:isTd?color:"#ccc", cursor:"pointer", fontSize:12, fontFamily:'"JetBrains Mono",monospace', padding:"6px 0", borderRadius:6, textAlign:"center", transition:"all 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.background=color+"44"}
              onMouseLeave={e=>e.currentTarget.style.background=isTd?color+"33":"none"}>
              {d}
            </button>
          );
        })}
      </div>
      <button onClick={e=>{e.stopPropagation();onClose();}} style={{ width:"100%", marginTop:10, padding:"8px", background:"transparent", border:"1px solid #2a2a2a", borderRadius:6, color:"#555", fontSize:10, fontFamily:'"JetBrains Mono",monospace', cursor:"pointer", letterSpacing:2 }}>CANCEL</button>
    </div>
  );
}

// ─── REST TIMER ───────────────────────────────────────────────────────────────
function RestTimer({ seconds, color, onDone }) {
  const startRef = useRef(Date.now());
  const adjustRef = useRef(0); // tracks manual +/- adjustments
  const [remaining, setRemaining] = useState(seconds);
  const fmt = s => `${Math.floor(Math.max(0,s)/60)}:${String(Math.max(0,s)%60).padStart(2,"0")}`;

  useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      const left = seconds + adjustRef.current - elapsed;
      if (left <= 0) { setRemaining(0); onDone(); return; }
      setRemaining(left);
    };
    tick();
    const t = setInterval(tick, 500); // poll every 500ms so it catches up fast after background
    return () => clearInterval(t);
  }, []);

  const adjust = (delta) => {
    adjustRef.current += delta;
    setRemaining(r => Math.max(0, r + delta));
  };

  const pct = remaining / seconds;
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:300, background:"#0f0f0f", borderTop:`2px solid ${color}`, padding:"14px 20px", display:"flex", alignItems:"center", gap:16 }}>
      <div style={{ width:50, height:50, borderRadius:"50%", border:`3px solid ${color}33`, flexShrink:0, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg style={{ position:"absolute", inset:0 }} viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="22" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${Math.max(0,pct)*138.2} 138.2`} strokeLinecap="round" transform="rotate(-90 25 25)"/>
        </svg>
        <div style={{ fontSize:10, fontFamily:'"JetBrains Mono",monospace', color, fontWeight:900 }}>{fmt(remaining)}</div>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:9, color:"#555", fontFamily:'"JetBrains Mono",monospace', letterSpacing:3 }}>REST TIMER</div>
        <div style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:14, letterSpacing:2, color:"#fff", marginTop:2 }}>NEXT SET IN {fmt(remaining)}</div>
      </div>
      <div style={{ display:"flex", gap:8, flexShrink:0 }}>
        <button onClick={()=>adjust(-15)} style={{ background:"#1a1a1a", border:"none", color:"#aaa", borderRadius:8, padding:"8px 10px", fontSize:11, fontFamily:'"JetBrains Mono",monospace', cursor:"pointer" }}>-15s</button>
        <button onClick={()=>adjust(+15)} style={{ background:"#1a1a1a", border:"none", color:"#aaa", borderRadius:8, padding:"8px 10px", fontSize:11, fontFamily:'"JetBrains Mono",monospace', cursor:"pointer" }}>+15s</button>
        <button onClick={onDone} style={{ background:color, border:"none", color:"#000", borderRadius:8, padding:"8px 14px", fontSize:11, fontFamily:'"Bebas Neue",sans-serif', letterSpacing:2, cursor:"pointer" }}>SKIP</button>
      </div>
    </div>
  );
}

// ─── STRETCH SECTION ─────────────────────────────────────────────────────────
function StretchSection({ color, items, checked, onToggle }) {
  const stretches = items || PUSH_STRETCHES;
  const done = Object.values(checked||{}).filter(Boolean).length;
  return (
    <div style={{ margin:"20px 16px 0", padding:"20px 16px", background:"#111", border:`1px solid ${color}44`, borderRadius:16 }}>
      <div style={{ fontSize:10, color:"#555", fontFamily:'"JetBrains Mono",monospace', letterSpacing:4, marginBottom:4 }}>POST WORKOUT</div>
      <div style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:22, letterSpacing:2, marginBottom:14 }}>STRETCHES</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {stretches.map((s,i) => (
          <div key={i} style={{ background:checked[i]?color+"18":"#1a1a1a", border:`1px solid ${checked[i]?color+"55":"#2a2a2a"}`, borderRadius:10, overflow:"hidden", transition:"all 0.2s" }}>
            <div onClick={()=>onToggle(i)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", cursor:"pointer" }}>
              <div style={{ width:18, height:18, borderRadius:"50%", border:`1.5px solid ${checked[i]?color:"#333"}`, background:checked[i]?color:"none", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#000" }}>{checked[i]?"✓":""}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, letterSpacing:1, color:checked[i]?"#666":"#ccc", fontFamily:'"Bebas Neue",sans-serif' }}>{s.muscle}</div>
                <div style={{ fontSize:9, color:"#444", fontFamily:'"JetBrains Mono",monospace' }}>{s.duration}</div>
              </div>
            </div>
            <a href={s.video} target="_blank" rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"5px", borderTop:`1px solid ${color}22`, color:color+"99", textDecoration:"none", fontSize:9, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.1em" }}>
              <ExternalLink size={9}/> WATCH
            </a>
          </div>
        ))}
      </div>
      {done===stretches.length && <div style={{ marginTop:14, textAlign:"center", fontSize:11, color, fontFamily:'"JetBrains Mono",monospace', letterSpacing:3 }}>ALL DONE 💪</div>}    </div>
  );
}

// ─── REST DAY VIEW ────────────────────────────────────────────────────────────
function RestDayView({ accent, dim, border, plan }) {
  const items = plan || REST_DAY_PLAN;
  const [checked, setChecked] = useState({});
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div style={{ padding:"16px 16px 80px" }}>
      <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:10, letterSpacing:"0.2em", color:"rgba(245,241,232,0.4)", marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>
        <Zap size={11} color={accent}/> ACTIVE RECOVERY · CORE · MOBILITY
      </div>
      {items.map((item,i) => {
        const ch = checked[i];
        return (
          <div key={i} style={{ marginBottom:8, background:ch?dim:"rgba(245,241,232,0.03)", border:`1px solid ${ch?border:"rgba(245,241,232,0.07)"}`, borderRadius:12, overflow:"hidden", transition:"all 0.2s" }}>
            <div onClick={()=>setChecked(p=>({...p,[i]:!ch}))} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", cursor:"pointer" }}>
              <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${ch?accent:"rgba(245,241,232,0.2)"}`, background:ch?accent:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#0a0a0a", fontWeight:700 }}>{ch?"✓":""}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, color:ch?"rgba(245,241,232,0.4)":"rgba(245,241,232,0.85)", textDecoration:ch?"line-through":"none", fontFamily:'"Bebas Neue",sans-serif', letterSpacing:1 }}>{item.label}</div>
                <div style={{ fontSize:11, color:"rgba(245,241,232,0.4)", fontFamily:'"JetBrains Mono",monospace', marginTop:2 }}>{item.detail}</div>
              </div>
            </div>
            {item.video && (
              <a href={item.video} target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"8px", borderTop:`1px solid ${border}`, color:accent, textDecoration:"none", fontSize:10, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.1em" }}>
                <ExternalLink size={10}/> WATCH DEMO
              </a>
            )}
          </div>
        );
      })}
      {done===items.length && (
        <div style={{ marginTop:8, padding:20, background:dim, border:`1px solid ${accent}`, borderRadius:16, textAlign:"center" }}>
          <div style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:24, letterSpacing:3, color:accent }}>RECOVERY COMPLETE</div>
          <div style={{ fontSize:11, color:"rgba(245,241,232,0.5)", fontFamily:'"JetBrains Mono",monospace', marginTop:6 }}>REST · RECOVER · COME BACK STRONGER</div>
        </div>
      )}
    </div>
  );
}

// ─── MANSOOR TRACKER ─────────────────────────────────────────────────────────
function MansoorTracker() {
  const [selectedWeek,  setSelectedWeek]  = useState("Week 1");
  const [selectedDay,   setSelectedDay]   = useState("Push");
  const [logs,          setLogs]          = useState({});
  const [extraSets,     setExtraSets]     = useState({});
  const [activeEx,      setActiveEx]      = useState(null);
  const [saved,         setSaved]         = useState(false);
  const [loaded,        setLoaded]        = useState(false);
  const [calendarDay,   setCalendarDay]   = useState(null);
  const [editingName,   setEditingName]   = useState(null);
  const [tempName,      setTempName]      = useState("");
  const [warmupDone,    setWarmupDone]    = useState(false);
  const [warmupChecked, setWarmupChecked] = useState({});
  const [restTimer,     setRestTimer]     = useState(null);
  const [copied,        setCopied]        = useState(false);
  const [archiveMode,   setArchiveMode]   = useState(false);
  const [archiveDay,    setArchiveDay]    = useState("Push 1");
  const [archiveProg,   setArchiveProg]   = useState(2);
  const [flexExercises, setFlexExercises] = useState({});
  const [showAddEx,     setShowAddEx]     = useState(false);
  const [newExName,     setNewExName]     = useState("");
  const [newExTarget,   setNewExTarget]   = useState("");

  const isLegs    = selectedDay === "Legs";
  const isPush    = selectedDay === "Push";
  const isPull    = selectedDay === "Pull";
  const isFlexDay = selectedDay === "Flex Day";
  const flexWeekKey = selectedWeek;
  const flexList = flexExercises[flexWeekKey] ?? FLEX_DEFAULTS;
  const { accent, dim, border } = ACCENT[selectedDay];

  const getWorkout = () => {
    if (archiveMode) return null;
    if (isFlexDay) return { exercises: flexList };
    if (isLegs) return NEW_LEGS;
    return NEW_PLAN[selectedDay] || null;
  };
  const workout = getWorkout();
  const warmupItems = isPush ? PUSH_WARMUP : isPull ? PULL_WARMUP : LEGS_WARMUP;
  const stretchItems = isPush ? PUSH_STRETCHES : isPull ? PULL_STRETCHES : isLegs ? LEGS_STRETCHES : PUSH_STRETCHES;

  // ── API Load ───────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/sync/mansoor");
        const { data } = await res.json();
        setLogs(data.logs ? { ...mansoorLogs, ...data.logs } : { ...mansoorLogs });
        setExtraSets(data.extraSets || {});
        setFlexExercises(data.flexExercises || {});
      } catch { setLogs({ ...mansoorLogs }); }
      setLoaded(true);
    })();
  }, []);

  // ── API Save (debounced) ───────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(async () => {
      try {
        await fetch("/api/sync/mansoor", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ data: { logs, extraSets, flexExercises } }),
        });
        setSaved(true); setTimeout(()=>setSaved(false),1500);
      } catch {}
    }, 700);
    return () => clearTimeout(t);
  }, [logs, extraSets, loaded]);

  useEffect(() => { setWarmupDone(false); setActiveEx(null); setRestTimer(null); setWarmupChecked({}); setCalendarDay(null); }, [selectedDay]);

  // ── Log helpers ───────────────────────────────────────────────────────────
  const gk = (w,d,e,s) => `P3|${w}|${d}|${e}|${s}`;
  const getLog = (e,s,f) => logs[gk(selectedWeek,selectedDay,e,s)]?.[f] || "";
  const updateLog = (exName,si,field,value) => {
    const k = gk(selectedWeek,selectedDay,exName,si);
    setLogs(p => ({ ...p, [k]: { ...p[k], [field]: value } }));
  };
  const handleLogSet = (ex,si) => {
    const k = gk(selectedWeek,selectedDay,ex.name,si);
    if (logs[k]?.weight && logs[k]?.reps) {
      setLogs(p => ({ ...p, [k]: { ...p[k], confirmed:"1" } }));
      setRestTimer({ seconds: REST_TIMES[ex.type]||75, color: accent });
    }
  };

  // ── Progressive overload — uses poRef/poRefDay for cross-exercise mapping ──
  const getMaxWeight = (ex) => {
    const searchName = ex.poRef || ex.name;
    const searchDay  = ex.poRefDay || selectedDay;
    let maxW = 0, maxWeek = null;

    // Search all past weeks on the mapped day
    WEEKS.forEach(wk => {
      if (parseInt(wk.split(" ")[1]) >= parseInt(selectedWeek.split(" ")[1])) return;
      for (let si = 0; si < 10; si++) {
        const w = parseFloat(logs[gk(wk, searchDay, searchName, si)]?.weight) || 0;
        if (w > maxW) { maxW = w; maxWeek = wk; }
      }
    });

    // Also search current week on all OTHER days (same-week cross-day reference)
    ALL_DAYS.forEach(day => {
      if (day === selectedDay) return;
      for (let si = 0; si < 10; si++) {
        const w = parseFloat(logs[gk(selectedWeek, day, searchName, si)]?.weight) || 0;
        if (w > maxW) { maxW = w; maxWeek = `${selectedWeek} · ${day}`; }
      }
    });

    return maxW > 0 ? { maxW, maxWeek } : null;
  };
  const getPo = (ex) => {
    const r = getMaxWeight(ex);
    if (r) return { maxW: r.maxW, maxWeek: r.maxWeek, suggested: r.maxW + 2.5 };
    if (ex.poDefault) return { maxW: ex.poDefault, maxWeek: "last session ref", suggested: ex.poDefault + 2.5 };
    return null;
  };

  // ── Extra sets ────────────────────────────────────────────────────────────
  const getExKey = (exId) => `${selectedWeek}|${selectedDay}|${exId}`;
  const getTotalSets = (ex) => ex.sets + (extraSets[getExKey(ex.id)]||0);
  const addSet = (ex) => { const k=getExKey(ex.id); setExtraSets(p=>({...p,[k]:(p[k]||0)+1})); };
  const removeSet = (ex) => { const k=getExKey(ex.id); if((extraSets[k]||0)>0) setExtraSets(p=>({...p,[k]:p[k]-1})); };

  // ── Dates & names ─────────────────────────────────────────────────────────
  const getDate = (day) => logs[`__date|${selectedWeek}|${day}`] || mansoorWeekDates[selectedWeek]?.[day] || "";
  const setDate = (day,val) => { setLogs(p=>({...p,[`__date|${selectedWeek}|${day}`]:val})); setCalendarDay(null); };
  const getExName = (orig) => logs[`__exname|${selectedDay}|${orig}`] || orig;
  const saveExName = (orig) => { setLogs(p=>({...p,[`__exname|${selectedDay}|${orig}`]:tempName.trim()||orig})); setEditingName(null); };

  // ── Per-exercise notes ────────────────────────────────────────────────────
  const getNoteKey = (exName) => `P3|__note|${selectedWeek}|${selectedDay}|${exName}`;
  const getNote = (exName) => logs[getNoteKey(exName)] || "";
  const saveNote = (exName, text) => setLogs(p => ({ ...p, [getNoteKey(exName)]: text }));

  // ── Stretch state (persisted in logs) ─────────────────────────────────────
  const getStretchKey = (i) => `P3|__stretch|${selectedWeek}|${selectedDay}|${i}`;
  const stretchChecked = stretchItems.reduce((acc,_,i) => ({...acc,[i]:!!logs[getStretchKey(i)]}), {});
  const toggleStretch = (i) => setLogs(p=>({...p,[getStretchKey(i)]:p[getStretchKey(i)]?"":"1"}));

  // ── Completion ────────────────────────────────────────────────────────────
  const isComplete = (ex) => Array.from({length:getTotalSets(ex)}).every((_,i) => !!getLog(ex.name,i,"confirmed"));
  const totalComplete = workout ? workout.exercises.filter(isComplete).length : 0;
  const hasLogs = workout?.exercises.some(ex=>Array.from({length:getTotalSets(ex)}).some((_,i)=>getLog(ex.name,i,"weight")));
  const allWarmupDone = warmupItems.every((_,i)=>warmupChecked[`wu_${i}`]);
  const showWarmup = !warmupDone && !hasLogs && !archiveMode && !isFlexDay;

  if (!loaded) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(245,241,232,0.5)", fontFamily:'"JetBrains Mono",monospace', letterSpacing:4, fontSize:12 }}>
      SYNCING...
    </div>
  );

  // ── Header ────────────────────────────────────────────────────────────────
  const Header = () => (
    <div style={{ background:`linear-gradient(135deg,${accent}22,#0a0a0a)`, borderBottom:`2px solid ${accent}`, padding:"48px 16px 14px", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(10px)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:10, letterSpacing:"0.2em", color:accent, marginBottom:4 }}>
            THEOGLUMI · WELLFIT{saved?" · SAVED ✓":""}
          </div>
          <div style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:28, letterSpacing:"0.02em", lineHeight:1, color:"#f5f1e8" }}>{archiveMode?"ARCHIVE":selectedDay}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end" }}>
          <button onClick={()=>{ setArchiveMode(m=>!m); setArchiveDay("Push 1"); }}
            style={{ background:archiveMode?accent:"rgba(245,241,232,0.08)", border:`1px solid ${archiveMode?accent:"rgba(245,241,232,0.2)"}`, borderRadius:8, color:archiveMode?"#0a0a0a":"rgba(245,241,232,0.5)", fontSize:9, fontFamily:'"JetBrains Mono",monospace', letterSpacing:2, padding:"5px 10px", cursor:"pointer" }}>
            {archiveMode?"← BACK":"ARCHIVE"}
          </button>
          {!archiveMode && workout && (
            <div style={{ background:accent, color:"#000", borderRadius:"50%", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, fontFamily:'"JetBrains Mono",monospace', flexShrink:0 }}>
              {totalComplete}/{workout.exercises.length}
            </div>
          )}
        </div>
      </div>
      {!archiveMode && workout && (
        <div style={{ marginTop:10, height:3, background:"rgba(245,241,232,0.08)", borderRadius:2 }}>
          <div style={{ height:"100%", width:`${(totalComplete/workout.exercises.length)*100}%`, background:accent, borderRadius:2, transition:"width 0.4s" }}/>
        </div>
      )}
      <div style={{ display:"flex", gap:6, marginTop:12 }}>
        {WEEKS.map(w=>(
          <button key={w} onClick={()=>setSelectedWeek(w)} style={{ flex:1, padding:"5px 0", background:selectedWeek===w?accent:"rgba(245,241,232,0.05)", color:selectedWeek===w?"#0a0a0a":"rgba(245,241,232,0.4)", border:"none", borderRadius:5, fontSize:10, letterSpacing:"0.15em", cursor:"pointer", fontFamily:'"JetBrains Mono",monospace' }}>{w}</button>
        ))}
      </div>
    </div>
  );

  // ── Day Selector ──────────────────────────────────────────────────────────
  const DaySelector = () => (
    <div style={{ padding:"10px 16px 0" }}>
      <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4 }}>
        {ALL_DAYS.map(d => {
          const a = ACCENT[d].accent;
          const isSel = selectedDay===d;
          return (
            <button key={d} onClick={()=>{setSelectedDay(d);setCalendarDay(null);}}
              style={{ flexShrink:0, minWidth:68, padding:"10px 10px", background:isSel?a:"rgba(245,241,232,0.04)", color:isSel?"#0a0a0a":"rgba(245,241,232,0.55)", border:`1px solid ${isSel?a:"rgba(245,241,232,0.08)"}`, borderRadius:10, cursor:"pointer", fontFamily:'"Bebas Neue",sans-serif', textAlign:"center" }}>
              <div style={{ fontSize:10, letterSpacing:"0.1em" }}>{d}</div>
              <div style={{ fontSize:8, fontFamily:'"JetBrains Mono",monospace', opacity:0.7, marginTop:2 }}>
                {getDate(d) ? getDate(d).replace(/^[A-Za-z]+ · /,"") : "—"}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 2px 0", position:"relative" }}>
        <Calendar size={11} color={accent}/>
        <span style={{ fontSize:11, fontFamily:'"JetBrains Mono",monospace', color:getDate(selectedDay)?"rgba(245,241,232,0.7)":"rgba(245,241,232,0.3)" }}>
          {getDate(selectedDay)||"No date set"}
        </span>
        <button onClick={()=>setCalendarDay(calendarDay===selectedDay?null:selectedDay)}
          style={{ background:"transparent", border:"none", cursor:"pointer", padding:2, color:"rgba(245,241,232,0.35)", display:"flex", alignItems:"center" }}>
          <Pencil size={11}/>
        </button>
        {calendarDay===selectedDay && (
          <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:500, marginTop:4 }}>
            <CalendarPicker color={accent} onSelect={v=>setDate(selectedDay,v)} onClose={()=>setCalendarDay(null)}/>
          </div>
        )}
      </div>
    </div>
  );

  // ── ARCHIVE VIEW ─────────────────────────────────────────────────────────
  if (archiveMode) {
    const archiveAccent = "#C9A96E";
    const prog1Days = ["Push 1","Pull 1","Push 2","Pull 2"];
    const prog2Days = ["Push 1","Pull 1","Legs","Push 2","Pull 2","Flex Day"];
    const currentArchiveDays = archiveProg === 1 ? prog1Days : prog2Days;
    const validArchiveDay = currentArchiveDays.includes(archiveDay) ? archiveDay : currentArchiveDays[0];

    const getArchiveWorkout = () => {
      if (archiveProg === 1) {
        const wkNum = parseInt(selectedWeek.split(" ")[1]);
        return (wkNum === 1 ? mansoorPlan : ARCHIVE_PLAN)[validArchiveDay] || null;
      }
      // Month 2 — Legs had rotation
      if (validArchiveDay === "Legs") {
        const wkNum = parseInt(selectedWeek.split(" ")[1]);
        return wkNum % 2 === 1 ? LEGS_A_ARCHIVE : LEGS_B_ARCHIVE;
      }
      if (validArchiveDay === "Flex Day") return { exercises: FLEX_DEFAULTS };
      return ARCHIVE_PLAN_2[validArchiveDay] || null;
    };
    const archiveWorkout = getArchiveWorkout();
    const archivePrefix = archiveProg === 1 ? "" : "P2|";

    return (
      <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#f5f1e8", fontFamily:'"Inter",sans-serif', paddingBottom:80 }}>
        <style>{CSS}</style>
        <Header/>
        <div style={{ padding:"10px 16px 0" }}>
          {/* Program selector */}
          <div style={{ display:"flex", gap:6, marginBottom:10 }}>
            {[1,2].map(p => (
              <button key={p} onClick={()=>{setArchiveProg(p); setArchiveDay(p===1?"Push 1":"Push 1");}}
                style={{ flex:1, padding:"8px", background:archiveProg===p?archiveAccent:"rgba(245,241,232,0.06)", color:archiveProg===p?"#0a0a0a":"rgba(245,241,232,0.4)", border:`1px solid ${archiveProg===p?archiveAccent:"rgba(245,241,232,0.15)"}`, borderRadius:8, fontSize:10, fontFamily:'"JetBrains Mono",monospace', letterSpacing:2, cursor:"pointer" }}>
                MONTH {p}
              </button>
            ))}
          </div>
          {/* Day tabs */}
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4 }}>
            {currentArchiveDays.map(d => (
              <button key={d} onClick={()=>setArchiveDay(d)}
                style={{ flexShrink:0, minWidth:68, padding:"10px", background:validArchiveDay===d?archiveAccent:"rgba(245,241,232,0.04)", color:validArchiveDay===d?"#0a0a0a":"rgba(245,241,232,0.55)", border:`1px solid ${validArchiveDay===d?archiveAccent:"rgba(245,241,232,0.08)"}`, borderRadius:10, cursor:"pointer", fontFamily:'"Bebas Neue",sans-serif', fontSize:10, letterSpacing:"0.1em", textAlign:"center" }}>
                {d==="Flex Day"?"FLEX":d}
              </button>
            ))}
          </div>
          <div style={{ marginTop:8, fontSize:10, color:"rgba(245,241,232,0.3)", fontFamily:'"JetBrains Mono",monospace', letterSpacing:2 }}>READ-ONLY · MONTH {archiveProg} DATA</div>
        </div>
        <div style={{ padding:"12px 16px 0" }}>
          {!archiveWorkout ? (
            <div style={{ padding:20, textAlign:"center", color:"rgba(245,241,232,0.3)", fontFamily:'"JetBrains Mono",monospace', fontSize:12 }}>No data for this selection</div>
          ) : archiveWorkout.exercises.map((ex, idx) => {
            const loggedSets = Array.from({length:ex.sets+3}, (_,si) => {
              const entry = logs[`${archivePrefix}${selectedWeek}|${validArchiveDay}|${ex.name}|${si}`];
              return entry?.weight||entry?.reps ? { w:entry.weight, r:entry.reps, si } : null;
            }).filter(Boolean);
            return (
              <div key={ex.id||ex.name} style={{ marginBottom:8, background:"rgba(245,241,232,0.02)", border:`1px solid ${loggedSets.length?archiveAccent+"44":"rgba(245,241,232,0.07)"}`, borderRadius:12, padding:"14px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:loggedSets.length?10:0 }}>
                  <div>
                    <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:10, color:archiveAccent, marginBottom:2 }}>{String(idx+1).padStart(2,"0")} · {ex.target}</div>
                    <div style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:16, letterSpacing:1 }}>{ex.name}</div>
                  </div>
                  <div style={{ fontSize:10, color:"rgba(245,241,232,0.3)", fontFamily:'"JetBrains Mono",monospace' }}>{ex.sets}×{ex.defaultReps}</div>
                </div>
                {loggedSets.length ? (
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {loggedSets.map(({w,r,si}) => (
                      <div key={si} style={{ background:archiveAccent+"18", border:`1px solid ${archiveAccent}33`, borderRadius:6, padding:"5px 10px", fontSize:11, fontFamily:'"JetBrains Mono",monospace', color:archiveAccent }}>
                        {w||"—"}kg × {r||"—"}
                      </div>
                    ))}
                  </div>
                ) : <div style={{ fontSize:10, color:"rgba(245,241,232,0.2)", fontFamily:'"JetBrains Mono",monospace' }}>Not logged</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── WARMUP SCREEN ─────────────────────────────────────────────────────────
  if (showWarmup) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#f5f1e8", fontFamily:'"Inter",sans-serif' }}>
      <style>{CSS}</style>
      <Header/>
      <DaySelector/>
      <div style={{ padding:"14px 16px 40px" }}>
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:10, letterSpacing:"0.2em", color:"rgba(245,241,232,0.4)", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
          <Zap size={11} color={accent}/> WARM UP — COMPLETE BEFORE TRAINING
        </div>
        {warmupItems.map((item,i)=>{
          const key=`wu_${i}`; const ch=warmupChecked[key];
          return (
            <div key={i} style={{ marginBottom:8, background:ch?dim:"rgba(245,241,232,0.03)", border:`1px solid ${ch?border:"rgba(245,241,232,0.07)"}`, borderRadius:12, overflow:"hidden", transition:"all 0.2s" }}>
              <div onClick={()=>setWarmupChecked(p=>({...p,[key]:!ch}))} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", cursor:"pointer" }}>
                <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${ch?accent:"rgba(245,241,232,0.2)"}`, background:ch?accent:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#0a0a0a", fontWeight:700 }}>{ch?"✓":""}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, color:ch?"rgba(245,241,232,0.4)":"rgba(245,241,232,0.85)", textDecoration:ch?"line-through":"none", fontFamily:'"Bebas Neue",sans-serif', letterSpacing:1 }}>{item.label}</div>
                  <div style={{ fontSize:11, color:"rgba(245,241,232,0.4)", fontFamily:'"JetBrains Mono",monospace', marginTop:2 }}>{item.detail}</div>
                </div>
              </div>
              {item.video && (
                <a href={item.video} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"7px", borderTop:`1px solid ${accent}22`, color:accent+"99", textDecoration:"none", fontSize:9, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.1em" }}>
                  <ExternalLink size={9}/> WATCH
                </a>
              )}
            </div>
          );
        })}
        <button onClick={()=>setWarmupDone(true)} disabled={!allWarmupDone}
          style={{ width:"100%", padding:"15px", marginTop:6, background:allWarmupDone?accent:"rgba(245,241,232,0.06)", color:allWarmupDone?"#0a0a0a":"rgba(245,241,232,0.3)", border:"none", borderRadius:12, fontFamily:'"Bebas Neue",sans-serif', fontSize:20, letterSpacing:"0.1em", cursor:allWarmupDone?"pointer":"not-allowed", transition:"all 0.3s" }}>
          {allWarmupDone?"START SESSION →":`${Object.values(warmupChecked).filter(Boolean).length}/${warmupItems.length} COMPLETE`}
        </button>
        <button onClick={()=>setWarmupDone(true)} style={{ width:"100%", padding:"10px", marginTop:8, background:"none", color:"rgba(245,241,232,0.3)", border:"none", fontSize:10, letterSpacing:3, cursor:"pointer", fontFamily:'"JetBrains Mono",monospace', display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <SkipForward size={12}/> SKIP WARMUP
        </button>
      </div>
    </div>
  );

  // ── Copy session summary ──────────────────────────────────────────────────
  const copySummary = () => {
    const date = getDate(selectedDay) || selectedDay;
    let text = `${selectedDay.toUpperCase()} — ${selectedWeek.toUpperCase()}\n${date}\n${"─".repeat(30)}\n\n`;
    workout.exercises.forEach((ex, idx) => {
      const displayName = getExName(ex.name);
      text += `${String(idx+1).padStart(2,"0")}. ${displayName}\n`;
      const total = getTotalSets(ex);
      let hasSets = false;
      for (let si = 0; si < total; si++) {
        const w = getLog(ex.name, si, "weight");
        const r = getLog(ex.name, si, "reps");
        if (w || r) { text += `    Set ${si+1}: ${w||"—"}kg × ${r||"—"}\n`; hasSets = true; }
      }
      if (!hasSets) text += `    Not logged\n`;
      const note = getNote(ex.name);
      if (note) text += `    Note: ${note}\n`;
      text += "\n";
    });
    text += `─────────────────────────────\nTHEOGLUMI · WELLFIT`;

    const done = () => { setCopied(true); setTimeout(()=>setCopied(false), 2000); };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallback(text, done));
    } else {
      fallback(text, done);
    }
  };

  const fallback = (text, done) => {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = "position:fixed;opacity:0;top:0;left:0;";
    document.body.appendChild(el);
    el.focus(); el.select();
    try { document.execCommand("copy"); done(); } catch {}
    document.body.removeChild(el);
  };

  // ── TRAINING SCREEN ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#f5f1e8", fontFamily:'"Inter",sans-serif', paddingBottom:restTimer?120:80 }}>
      <style>{CSS}</style>
      <Header/>
      <DaySelector/>
      <div style={{ padding:"10px 16px 0" }}>
        <button onClick={copySummary} style={{ width:"100%", padding:"10px", marginBottom:10, background:"rgba(245,241,232,0.04)", border:`1px solid ${copied?accent+"66":"rgba(245,241,232,0.1)"}`, borderRadius:10, color:copied?accent:"rgba(245,241,232,0.4)", fontSize:10, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.2em", cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {copied ? "✓ COPIED TO CLIPBOARD" : "📋 COPY SESSION SUMMARY"}
        </button>

        {/* Flex Day — add exercise panel */}
        {isFlexDay && (
          <div style={{ marginBottom:10 }}>
            {showAddEx ? (
              <div style={{ padding:"14px 16px", background:"rgba(245,241,232,0.04)", border:`1px solid ${accent}44`, borderRadius:12 }}>
                <div style={{ fontSize:9, color:accent, fontFamily:'"JetBrains Mono",monospace', letterSpacing:3, marginBottom:10 }}>ADD EXERCISE</div>
                <input value={newExName} onChange={e=>setNewExName(e.target.value)} placeholder="Exercise name"
                  style={{ width:"100%", background:"rgba(245,241,232,0.06)", border:`1px solid ${accent}44`, borderRadius:8, color:"#f5f1e8", padding:"10px 12px", fontSize:14, fontFamily:'"JetBrains Mono",monospace', outline:"none", marginBottom:8 }}/>
                <input value={newExTarget} onChange={e=>setNewExTarget(e.target.value)} placeholder="Muscle group (e.g. CHEST)"
                  style={{ width:"100%", background:"rgba(245,241,232,0.06)", border:`1px solid ${accent}44`, borderRadius:8, color:"#f5f1e8", padding:"10px 12px", fontSize:14, fontFamily:'"JetBrains Mono",monospace', outline:"none", marginBottom:10 }}/>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>{
                    if (!newExName.trim()) return;
                    const newEx = { id:`flex_${Date.now()}`, name:newExName.trim(), target:newExTarget.trim().toUpperCase()||"GENERAL", type:"isolation", sets:3, defaultReps:"12-15", video:`https://www.youtube.com/results?search_query=${newExName.trim().replace(/ /g,"+")}+jeff+nippard` };
                    setFlexExercises(p=>({...p,[flexWeekKey]:[...flexList,newEx]}));
                    setNewExName(""); setNewExTarget(""); setShowAddEx(false);
                  }} style={{ flex:1, padding:"10px", background:accent, color:"#0a0a0a", border:"none", borderRadius:8, fontFamily:'"Bebas Neue",sans-serif', fontSize:16, letterSpacing:1, cursor:"pointer" }}>
                    ADD
                  </button>
                  <button onClick={()=>{setShowAddEx(false);setNewExName("");setNewExTarget("");}} style={{ padding:"10px 16px", background:"rgba(245,241,232,0.06)", color:"rgba(245,241,232,0.4)", border:"none", borderRadius:8, fontFamily:'"Bebas Neue",sans-serif', fontSize:16, cursor:"pointer" }}>
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={()=>setShowAddEx(true)}
                style={{ width:"100%", padding:"10px", background:"rgba(245,241,232,0.04)", border:`1px dashed ${accent}66`, borderRadius:10, color:accent, fontSize:11, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.15em", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <Plus size={13}/> ADD EXERCISE
              </button>
            )}
          </div>
        )}

        {workout.exercises.map((ex,idx) => {
          const isOpen = activeEx===ex.id;
          const done = isComplete(ex);
          const tc = TYPE_COLOR[ex.type]||TYPE_COLOR.isolation;
          const displayName = getExName(ex.name);
          const po = getPo(ex);
          const totalSets = getTotalSets(ex);
          return (
            <div key={ex.id} style={{ marginBottom:10, border:`1px solid ${done?accent:isOpen?border:"rgba(245,241,232,0.07)"}`, borderRadius:14, overflow:"hidden", background:done?dim:"rgba(245,241,232,0.02)" }}>
              {/* Card header */}
              <div onClick={()=>setActiveEx(isOpen?null:ex.id)} style={{ padding:"14px 16px", cursor:"pointer" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                      <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:11, color:accent, fontWeight:600 }}>{String(idx+1).padStart(2,"0")}</div>
                      <div style={{ fontSize:9, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.15em", padding:"2px 6px", background:tc.bg, color:tc.text, borderRadius:3 }}>{tc.label}</div>
                      {ex.note && <div style={{ fontSize:9, fontFamily:'"JetBrains Mono",monospace', padding:"2px 6px", background:"rgba(220,80,80,0.2)", color:"#e57373", borderRadius:3 }}>{ex.note}</div>}
                    </div>
                    {editingName===ex.id ? (
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }} onClick={e=>e.stopPropagation()}>
                        <input value={tempName} onChange={e=>setTempName(e.target.value)} autoFocus
                          style={{ flex:1, background:"rgba(245,241,232,0.08)", border:`1px solid ${accent}66`, borderRadius:6, color:"#f5f1e8", padding:"4px 8px", fontSize:15, outline:"none", fontWeight:600 }}/>
                        <button onClick={()=>saveExName(ex.name)} style={{ background:accent, border:"none", borderRadius:5, color:"#0a0a0a", padding:"4px 6px", cursor:"pointer" }}><Check size={13}/></button>
                        <button onClick={()=>setEditingName(null)} style={{ background:"rgba(245,241,232,0.08)", border:"none", borderRadius:5, color:"rgba(245,241,232,0.5)", padding:"4px 6px", cursor:"pointer" }}><X size={13}/></button>
                      </div>
                    ) : (
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                        <span style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:17, letterSpacing:1, lineHeight:1.25 }}>{displayName}</span>
                        <button onClick={e=>{e.stopPropagation();setTempName(displayName);setEditingName(ex.id);}} style={{ background:"transparent", border:"none", cursor:"pointer", padding:2, color:"rgba(245,241,232,0.25)" }}><Pencil size={12}/></button>
                        {getNote(ex.name) && <div style={{ width:6, height:6, borderRadius:"50%", background:accent, flexShrink:0 }}/>}
                      </div>
                    )}
                    <div style={{ fontSize:12, color:"rgba(245,241,232,0.5)" }}>
                      <span style={{ color:"rgba(245,241,232,0.65)" }}>{ex.target}</span>
                      {ex.secondary && <span style={{ color:"rgba(245,241,232,0.3)" }}> · {ex.secondary}</span>}
                    </div>
                  </div>
                  <div style={{ color:"rgba(245,241,232,0.3)", flexShrink:0, display:"flex", alignItems:"center", gap:8 }}>{isFlexDay && (<button onClick={e=>{e.stopPropagation();setFlexExercises(p=>({...p,[flexWeekKey]:flexList.filter(fe=>fe.id!==ex.id)}));}} style={{ background:"rgba(220,80,80,0.1)", border:"1px solid rgba(220,80,80,0.25)", borderRadius:6, color:"#e57373", padding:"4px 8px", cursor:"pointer", display:"flex", alignItems:"center" }}><X size={12}/></button>)}{isOpen?<ChevronUp size={18}/>:<ChevronDown size={18}/>}</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginTop:12 }}>
                  {[["SETS",totalSets],["REPS",ex.defaultReps],["REST",REST_LABELS[ex.type]]].map(([label,val])=>(
                    <div key={label} style={{ padding:"8px", background:"rgba(245,241,232,0.04)", borderRadius:6, textAlign:"center" }}>
                      <div style={{ fontSize:9, color:"rgba(245,241,232,0.4)", fontFamily:'"JetBrains Mono",monospace', marginBottom:2 }}>{label}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:accent, fontFamily:'"JetBrains Mono",monospace' }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Expanded panel */}
              {isOpen && (
                <div style={{ borderTop:"1px solid rgba(245,241,232,0.06)", padding:"14px 16px 16px", background:"rgba(0,0,0,0.2)" }}>
                  {/* PO banner */}
                  <div style={{ marginBottom:12, padding:"10px 12px", background:"rgba(245,241,232,0.04)", border:`1px solid ${accent}33`, borderRadius:8 }}>
                    <div style={{ fontSize:9, color:"rgba(245,241,232,0.4)", fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.15em", marginBottom:6 }}>PROGRESSIVE OVERLOAD</div>
                    {po ? (
                      po.isDefault ? (
                        <div style={{ fontSize:12, color:accent, fontFamily:'"JetBrains Mono",monospace' }}>
                          SUGGESTED START: {po.suggested}kg
                        </div>
                      ) : (() => {
                        const startW = Math.round(po.maxW * 0.75 / 2.5) * 2.5;
                        return (
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
                            <div style={{ background:"rgba(245,241,232,0.04)", borderRadius:6, padding:"8px 6px", textAlign:"center" }}>
                              <div style={{ fontSize:9, color:"rgba(245,241,232,0.3)", fontFamily:'"JetBrains Mono",monospace', marginBottom:3 }}>SET 1 START</div>
                              <div style={{ fontSize:14, color:"rgba(245,241,232,0.6)", fontFamily:'"JetBrains Mono",monospace', fontWeight:700 }}>~{startW}kg</div>
                            </div>
                            <div style={{ background:"rgba(245,241,232,0.04)", borderRadius:6, padding:"8px 6px", textAlign:"center" }}>
                              <div style={{ fontSize:9, color:"rgba(245,241,232,0.3)", fontFamily:'"JetBrains Mono",monospace', marginBottom:3 }}>{po.maxWeek} MAX</div>
                              <div style={{ fontSize:14, color:"rgba(245,241,232,0.8)", fontFamily:'"JetBrains Mono",monospace', fontWeight:700 }}>{po.maxW}kg</div>
                            </div>
                            <div style={{ background:accent+"18", border:`1px solid ${accent}44`, borderRadius:6, padding:"8px 6px", textAlign:"center" }}>
                              <div style={{ fontSize:9, color:accent+"99", fontFamily:'"JetBrains Mono",monospace', marginBottom:3 }}>TOP SET AIM</div>
                              <div style={{ fontSize:14, color:accent, fontFamily:'"JetBrains Mono",monospace', fontWeight:700 }}>{po.suggested}kg</div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div style={{ fontSize:11, color:"rgba(245,241,232,0.3)", fontFamily:'"JetBrains Mono",monospace' }}>No previous data — establish your baseline today 💪</div>
                    )}
                  </div>
                  {/* Set headers */}
                  <div style={{ display:"grid", gridTemplateColumns:"32px 1fr 1fr 80px", gap:8, marginBottom:8 }}>
                    {["SET","KG","REPS",""].map(h=>(
                      <div key={h} style={{ fontSize:9, color:"rgba(245,241,232,0.35)", fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.15em", textAlign:"center" }}>{h}</div>
                    ))}
                  </div>
                  {/* Set rows */}
                  {Array.from({length:totalSets}).map((_,si)=>{
                    const w=getLog(ex.name,si,"weight"); const r=getLog(ex.name,si,"reps");
                    const confirmed = !!getLog(ex.name,si,"confirmed");
                    const hasData = !!(w && r);
                    const isExtra=si>=ex.sets;
                    return (
                      <div key={si} style={{ display:"grid", gridTemplateColumns:"32px 1fr 1fr 80px", gap:8, marginBottom:8, alignItems:"center" }}>
                        <div style={{ textAlign:"center", fontSize:12, color:confirmed?accent:isExtra?"rgba(245,241,232,0.2)":"rgba(245,241,232,0.3)", fontFamily:'"JetBrains Mono",monospace', fontWeight:600 }}>
                          {confirmed?"✓":isExtra?`+${si-ex.sets+1}`:si+1}
                        </div>
                        <input type="number" placeholder="kg" value={w}
                          onChange={e=>updateLog(ex.name,si,"weight",e.target.value)}
                          style={{ background:"rgba(245,241,232,0.05)", border:`1px solid ${confirmed?accent+"66":isExtra?"rgba(245,241,232,0.05)":"rgba(245,241,232,0.1)"}`, borderRadius:7, color:"#f5f1e8", padding:"10px", fontSize:15, fontFamily:'"JetBrains Mono",monospace', textAlign:"center", outline:"none", width:"100%" }}/>
                        <input type="number" placeholder="reps" value={r}
                          onChange={e=>updateLog(ex.name,si,"reps",e.target.value)}
                          style={{ background:"rgba(245,241,232,0.05)", border:`1px solid ${confirmed?accent+"66":isExtra?"rgba(245,241,232,0.05)":"rgba(245,241,232,0.1)"}`, borderRadius:7, color:"#f5f1e8", padding:"10px", fontSize:15, fontFamily:'"JetBrains Mono",monospace', textAlign:"center", outline:"none", width:"100%" }}/>
                        <button onClick={()=>handleLogSet(ex,si)}
                          style={{ padding:"10px 6px", background:confirmed?accent:hasData?"rgba(245,241,232,0.15)":"rgba(245,241,232,0.06)", color:confirmed?"#0a0a0a":hasData?"#f5f1e8":"rgba(245,241,232,0.4)", border:confirmed?"none":`1px solid ${hasData?accent+"55":"transparent"}`, borderRadius:7, fontSize:10, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.08em", cursor:"pointer", fontWeight:600 }}>
                          {confirmed?"DONE ✓":"LOG"}
                        </button>
                      </div>
                    );
                  })}
                  {/* Add/Remove set */}
                  <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                    <button onClick={()=>addSet(ex)}
                      style={{ flex:1, padding:"9px", background:"rgba(245,241,232,0.04)", border:"1px dashed rgba(245,241,232,0.15)", borderRadius:8, color:"rgba(245,241,232,0.4)", fontSize:11, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.1em", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <Plus size={12}/> ADD SET
                    </button>
                    {(extraSets[getExKey(ex.id)]||0)>0 && (
                      <button onClick={()=>removeSet(ex)}
                        style={{ flex:1, padding:"9px", background:"rgba(220,80,80,0.06)", border:"1px dashed rgba(220,80,80,0.25)", borderRadius:8, color:"#e57373", fontSize:11, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.1em", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                        <X size={12}/> REMOVE SET
                      </button>
                    )}
                  </div>
                  {/* Watch demo */}
                  <a href={ex.video} target="_blank" rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px", background:dim, border:`1px solid ${border}`, borderRadius:8, color:accent, textDecoration:"none", fontSize:12, fontWeight:600, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.08em" }}>
                    <ExternalLink size={12}/> WATCH DEMO
                  </a>
                  {/* Per-exercise note */}
                  <div style={{ marginTop:10 }}>
                    <div style={{ fontSize:9, color:"rgba(245,241,232,0.3)", fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.15em", marginBottom:5, display:"flex", alignItems:"center", gap:6 }}>
                      <Pencil size={9}/> NOTE
                    </div>
                    <textarea
                      value={getNote(ex.name)}
                      onChange={e => saveNote(ex.name, e.target.value)}
                      placeholder="e.g. felt strong today, try 45kg next week..."
                      rows={2}
                      style={{ width:"100%", background:"rgba(245,241,232,0.04)", border:"1px solid rgba(245,241,232,0.1)", borderRadius:8, color:"#f5f1e8", padding:"10px 12px", fontSize:12, fontFamily:'"JetBrains Mono",monospace', outline:"none", resize:"vertical", lineHeight:1.5 }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalComplete===workout.exercises.length && (
        <>
          <div style={{ margin:"20px 16px 0", padding:20, background:dim, border:`1px solid ${accent}`, borderRadius:16, textAlign:"center" }}>
            <div style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:28, letterSpacing:3, color:accent }}>SESSION COMPLETE</div>
            <div style={{ fontSize:11, color:"rgba(245,241,232,0.5)", fontFamily:'"JetBrains Mono",monospace', marginTop:6 }}>SAUNA · COLD PLUNGE · SAUNA</div>
          </div>
          <StretchSection color={accent} items={stretchItems} checked={stretchChecked} onToggle={toggleStretch}/>
        </>
      )}

      <div style={{ margin:"16px 16px 0", padding:"12px 16px", background:"rgba(201,169,110,0.06)", border:"1px solid rgba(201,169,110,0.2)", borderRadius:10, fontSize:10, color:"#C9A96E", fontFamily:'"JetBrains Mono",monospace', letterSpacing:1, lineHeight:1.8 }}>
        {isPush && "TENNIS ELBOW · WRIST WRAPS ON PRESS · ANKLE STRAPS ON CABLES · NEUTRAL GRIP · STOP IF SHARP PAIN"}
        {isPull && "TENNIS ELBOW · HOOKS ON PULLS · ANKLE STRAPS ON CABLES · NEUTRAL GRIP · STOP IF SHARP PAIN"}
        {isLegs && "BELT ON SQUAT & RDL · STOP IF SHARP PAIN"}
        {isFlexDay && "TENNIS ELBOW · NEUTRAL GRIP · STOP IF SHARP PAIN"}
      </div>

      {restTimer && <RestTimer seconds={restTimer.seconds} color={restTimer.color} onDone={()=>setRestTimer(null)}/>}
    </div>
  );
}

// ─── PLANK TIMER ─────────────────────────────────────────────────────────────
function PlankTimer({ setIdx, savedSecs, accent, onComplete }) {
  const startRef = useRef(null);
  const [running,  setRunning]  = useState(false);
  const [elapsed,  setElapsed]  = useState(0);
  const done = !!savedSecs;

  useEffect(() => {
    if (!running) return;
    const tick = () => setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    tick();
    const t = setInterval(tick, 500);
    return () => clearInterval(t);
  }, [running]);

  const start = () => { startRef.current = Date.now(); setElapsed(0); setRunning(true); };
  const finish = () => { setRunning(false); onComplete(String(Math.floor((Date.now() - startRef.current) / 1000))); };

  return (
    <div style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
      <div style={{ width:32, textAlign:"center", fontSize:12, fontFamily:'"JetBrains Mono",monospace', fontWeight:600, color:done?accent:"rgba(245,241,232,0.3)", flexShrink:0 }}>
        {done?"✓":setIdx+1}
      </div>
      {done ? (
        <div style={{ flex:1, padding:"13px", background:accent+"18", border:`1px solid ${accent}55`, borderRadius:8, textAlign:"center", color:accent, fontFamily:'"JetBrains Mono",monospace', fontSize:15, fontWeight:700 }}>
          ✓ {savedSecs}s HELD
        </div>
      ) : running ? (
        <>
          <div style={{ flex:1, padding:"13px", background:"rgba(245,241,232,0.06)", borderRadius:8, textAlign:"center", color:"#f5f1e8", fontFamily:'"JetBrains Mono",monospace', fontSize:22, fontWeight:700 }}>
            {elapsed}s
          </div>
          <button onClick={finish} style={{ padding:"13px 20px", background:accent, color:"#0a0a0a", border:"none", borderRadius:8, fontFamily:'"Bebas Neue",sans-serif', fontSize:16, letterSpacing:1, cursor:"pointer", flexShrink:0 }}>
            DONE
          </button>
        </>
      ) : (
        <button onClick={start} style={{ flex:1, padding:"13px", background:"rgba(245,241,232,0.05)", border:"1px solid rgba(245,241,232,0.12)", borderRadius:8, color:"rgba(245,241,232,0.5)", fontFamily:'"Bebas Neue",sans-serif', fontSize:15, letterSpacing:1, cursor:"pointer" }}>
          START SET {setIdx+1}
        </button>
      )}
    </div>
  );
}

// ─── PARI TRACKER ────────────────────────────────────────────────────────────
function PariTracker() {
  const [selectedWeek,  setSelectedWeek]  = useState("Week 1");
  const [selectedDay,   setSelectedDay]   = useState("Session A");
  const [logs,          setLogs]          = useState({});
  const [extraSets,     setExtraSets]     = useState({});
  const [activeEx,      setActiveEx]      = useState(null);
  const [saved,         setSaved]         = useState(false);
  const [loaded,        setLoaded]        = useState(false);
  const [calendarDay,   setCalendarDay]   = useState(null);
  const [editingName,   setEditingName]   = useState(null);
  const [tempName,      setTempName]      = useState("");
  const [warmupDone,    setWarmupDone]    = useState(false);
  const [warmupChecked, setWarmupChecked] = useState({});
  const [restTimer,     setRestTimer]     = useState(null);

  const isRestDay = selectedDay === "Rest Day";
  const { accent, dim, border } = PARI_ACCENT[selectedDay];
  const workout = isRestDay ? null : pariPlan[selectedDay];

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/sync/pari");
        const { data } = await res.json();
        setLogs(data.logs || {});
        setExtraSets(data.extraSets || {});
      } catch { setLogs({}); }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(async () => {
      try {
        await fetch("/api/sync/pari", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ data: { logs, extraSets, flexExercises } }),
        });
        setSaved(true); setTimeout(()=>setSaved(false),1500);
      } catch {}
    }, 700);
    return () => clearTimeout(t);
  }, [logs, extraSets, loaded]);

  useEffect(() => { setWarmupDone(false); setActiveEx(null); setRestTimer(null); setWarmupChecked({}); setCalendarDay(null); }, [selectedDay]);

  const gk = (w,d,e,s) => `${w}|${d}|${e}|${s}`;
  const getLog = (e,s,f) => logs[gk(selectedWeek,selectedDay,e,s)]?.[f] || "";
  const updateLog = (exName,si,field,value) => { const k=gk(selectedWeek,selectedDay,exName,si); setLogs(p=>({...p,[k]:{...p[k],[field]:value}})); };
  const handleLogSet = (ex,si) => {
    const k=gk(selectedWeek,selectedDay,ex.name,si);
    const setDone = ex.noWeight ? !!logs[k]?.reps : (logs[k]?.weight && logs[k]?.reps);
    if (setDone) {
      setLogs(p => ({ ...p, [k]: { ...p[k], confirmed:"1" } }));
      setRestTimer({seconds:REST_TIMES[ex.type]||75,color:accent});
    }
  };

  const getExKey = (exId) => `${selectedWeek}|${selectedDay}|${exId}`;
  const getTotalSets = (ex) => ex.sets + (extraSets[getExKey(ex.id)]||0);
  const addSet = (ex) => { const k=getExKey(ex.id); setExtraSets(p=>({...p,[k]:(p[k]||0)+1})); };
  const removeSet = (ex) => { const k=getExKey(ex.id); if((extraSets[k]||0)>0) setExtraSets(p=>({...p,[k]:p[k]-1})); };

  const getDate = (day) => logs[`__date|${selectedWeek}|${day}`] || pariWeekDates[selectedWeek]?.[day] || "";
  const setDate = (day,val) => { setLogs(p=>({...p,[`__date|${selectedWeek}|${day}`]:val})); setCalendarDay(null); };
  const getExName = (orig) => logs[`__exname|${selectedDay}|${orig}`] || orig;
  const saveExName = (orig) => { setLogs(p=>({...p,[`__exname|${selectedDay}|${orig}`]:tempName.trim()||orig})); setEditingName(null); };
  const getNoteKey = (exName) => `P3|__note|${selectedWeek}|${selectedDay}|${exName}`;
  const getNote = (exName) => logs[getNoteKey(exName)] || "";
  const saveNote = (exName,text) => setLogs(p=>({...p,[getNoteKey(exName)]:text}));

  const isComplete = (ex) => {
    if (ex.sets===1) return !!getLog(ex.name,0,"done");
    const total = getTotalSets(ex);
    if (ex.timedSet) return Array.from({length:total}).every((_,i)=>!!getLog(ex.name,i,"reps"));
    if (ex.noWeight) return Array.from({length:total}).every((_,i)=>!!getLog(ex.name,i,"confirmed"));
    return Array.from({length:total}).every((_,i)=>!!getLog(ex.name,i,"confirmed"));
  };
  const totalComplete = workout ? workout.exercises.filter(isComplete).length : 0;
  const hasLogs = workout?.exercises.some(ex=>isComplete(ex));
  const allWarmupDone = Object.keys(warmupChecked).some(k => k.startsWith("c") && warmupChecked[k]) &&
    PARI_WARMUP_MOBILITY.every(m => warmupChecked[m.id]);
  const showWarmup = !warmupDone && !hasLogs && !isRestDay;

  if (!loaded) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(245,241,232,0.5)", fontFamily:'"JetBrains Mono",monospace', letterSpacing:4, fontSize:12 }}>SYNCING...</div>
  );

  const Header = () => (
    <div style={{ background:`linear-gradient(135deg,${accent}22,#0a0a0a)`, borderBottom:`2px solid ${accent}`, padding:"20px 16px 14px", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(10px)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:10, letterSpacing:"0.2em", color:accent, marginBottom:4 }}>
            PARI · FITNESS 360{saved?" · SAVED ✓":""}
          </div>
          <div style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:28, letterSpacing:"0.02em", lineHeight:1, color:"#f5f1e8" }}>{selectedDay}</div>
        </div>
        {!isRestDay && workout && (
          <div style={{ background:accent, color:"#0a0a0a", borderRadius:"50%", width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, fontFamily:'"JetBrains Mono",monospace', flexShrink:0 }}>
            {totalComplete}/{workout.exercises.length}
          </div>
        )}
      </div>
      {!isRestDay && workout && (
        <div style={{ marginTop:10, height:3, background:"rgba(245,241,232,0.08)", borderRadius:2 }}>
          <div style={{ height:"100%", width:`${(totalComplete/workout.exercises.length)*100}%`, background:accent, borderRadius:2, transition:"width 0.4s" }}/>
        </div>
      )}
      <div style={{ display:"flex", gap:6, marginTop:12 }}>
        {WEEKS.map(w=>(
          <button key={w} onClick={()=>setSelectedWeek(w)} style={{ flex:1, padding:"5px 0", background:selectedWeek===w?accent:"rgba(245,241,232,0.05)", color:selectedWeek===w?"#0a0a0a":"rgba(245,241,232,0.4)", border:"none", borderRadius:5, fontSize:10, letterSpacing:"0.15em", cursor:"pointer", fontFamily:'"JetBrains Mono",monospace' }}>{w}</button>
        ))}
      </div>
    </div>
  );

  const DaySelector = () => (
    <div style={{ padding:"10px 16px 0" }}>
      <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4 }}>
        {PARI_DAYS.map(d => {
          const a = PARI_ACCENT[d].accent;
          const isSel = selectedDay===d;
          return (
            <button key={d} onClick={()=>{setSelectedDay(d);setCalendarDay(null);}}
              style={{ flexShrink:0, minWidth:74, padding:"10px 10px", background:isSel?a:"rgba(245,241,232,0.04)", color:isSel?"#0a0a0a":"rgba(245,241,232,0.55)", border:`1px solid ${isSel?a:"rgba(245,241,232,0.08)"}`, borderRadius:10, cursor:"pointer", fontFamily:'"Bebas Neue",sans-serif', textAlign:"center" }}>
              <div style={{ fontSize:10, letterSpacing:"0.1em" }}>{d==="Rest Day"?"REST":d}</div>
              <div style={{ fontSize:8, fontFamily:'"JetBrains Mono",monospace', opacity:0.7, marginTop:2 }}>
                {getDate(d) ? getDate(d).replace(/^[A-Za-z]+ · /,"") : "—"}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 2px 0", position:"relative" }}>
        <Calendar size={11} color={accent}/>
        <span style={{ fontSize:11, fontFamily:'"JetBrains Mono",monospace', color:getDate(selectedDay)?"rgba(245,241,232,0.7)":"rgba(245,241,232,0.3)" }}>
          {getDate(selectedDay)||"No date set"}
        </span>
        <button onClick={()=>setCalendarDay(calendarDay===selectedDay?null:selectedDay)}
          style={{ background:"transparent", border:"none", cursor:"pointer", padding:2, color:"rgba(245,241,232,0.35)", display:"flex", alignItems:"center" }}>
          <Pencil size={11}/>
        </button>
        {calendarDay===selectedDay && (
          <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:500, marginTop:4 }}>
            <CalendarPicker color={accent} onSelect={v=>setDate(selectedDay,v)} onClose={()=>setCalendarDay(null)}/>
          </div>
        )}
      </div>
    </div>
  );

  if (showWarmup) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#f5f1e8", fontFamily:'"Inter",sans-serif' }}>
      <style>{CSS}</style>
      <Header/>
      <DaySelector/>
      <div style={{ padding:"14px 16px 40px" }}>
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:10, letterSpacing:"0.2em", color:"rgba(245,241,232,0.4)", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
          <Zap size={11} color={accent}/> WARM UP — CHOOSE YOUR CARDIO + MOBILITY
        </div>

        {/* Cardio — pick one */}
        <div style={{ fontSize:9, color:accent, fontFamily:'"JetBrains Mono",monospace', letterSpacing:3, marginBottom:8 }}>CARDIO · PICK ONE</div>
        {PARI_WARMUP_CARDIO.map(item => {
          const ch = warmupChecked[item.id];
          return (
            <div key={item.id} onClick={()=>{
              const newChecked = { ...warmupChecked };
              PARI_WARMUP_CARDIO.forEach(c => { newChecked[c.id] = false; });
              newChecked[item.id] = !ch;
              setWarmupChecked(newChecked);
            }}
              style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", marginBottom:8, background:ch?dim:"rgba(245,241,232,0.03)", border:`1px solid ${ch?border:"rgba(245,241,232,0.07)"}`, borderRadius:12, cursor:"pointer", transition:"all 0.2s" }}>
              <div style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${ch?accent:"rgba(245,241,232,0.2)"}`, background:ch?accent:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#0a0a0a", fontWeight:700 }}>{ch?"✓":""}</div>
              <div>
                <div style={{ fontSize:14, color:ch?"rgba(245,241,232,0.5)":"rgba(245,241,232,0.85)", fontFamily:'"Bebas Neue",sans-serif', letterSpacing:1 }}>{item.label}</div>
                <div style={{ fontSize:11, color:"rgba(245,241,232,0.4)", fontFamily:'"JetBrains Mono",monospace', marginTop:2 }}>{item.detail}</div>
              </div>
            </div>
          );
        })}

        {/* Mobility — all required */}
        <div style={{ fontSize:9, color:accent, fontFamily:'"JetBrains Mono",monospace', letterSpacing:3, margin:"16px 0 8px" }}>MOBILITY · ALL 3</div>
        {PARI_WARMUP_MOBILITY.map(item => {
          const ch = warmupChecked[item.id];
          return (
            <div key={item.id} style={{ marginBottom:8, background:ch?dim:"rgba(245,241,232,0.03)", border:`1px solid ${ch?border:"rgba(245,241,232,0.07)"}`, borderRadius:12, overflow:"hidden", transition:"all 0.2s" }}>
              <div onClick={()=>setWarmupChecked(p=>({...p,[item.id]:!ch}))}
                style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", cursor:"pointer" }}>
                <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${ch?accent:"rgba(245,241,232,0.2)"}`, background:ch?accent:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#0a0a0a", fontWeight:700 }}>{ch?"✓":""}</div>
                <div>
                  <div style={{ fontSize:14, color:ch?"rgba(245,241,232,0.4)":"rgba(245,241,232,0.85)", textDecoration:ch?"line-through":"none", fontFamily:'"Bebas Neue",sans-serif', letterSpacing:1 }}>{item.label}</div>
                  <div style={{ fontSize:11, color:"rgba(245,241,232,0.4)", fontFamily:'"JetBrains Mono",monospace', marginTop:2 }}>{item.detail}</div>
                </div>
              </div>
              <a href={item.video} target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"7px", borderTop:`1px solid ${accent}22`, color:accent+"99", textDecoration:"none", fontSize:9, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.1em" }}>
                <ExternalLink size={9}/> WATCH
              </a>
            </div>
          );
        })}

        <button onClick={()=>setWarmupDone(true)} disabled={!allWarmupDone}
          style={{ width:"100%", padding:"15px", marginTop:6, background:allWarmupDone?accent:"rgba(245,241,232,0.06)", color:allWarmupDone?"#0a0a0a":"rgba(245,241,232,0.3)", border:"none", borderRadius:12, fontFamily:'"Bebas Neue",sans-serif', fontSize:20, letterSpacing:"0.1em", cursor:allWarmupDone?"pointer":"not-allowed", transition:"all 0.3s" }}>
          {allWarmupDone?"LET'S GO! →":"COMPLETE WARMUP FIRST"}
        </button>
        <button onClick={()=>setWarmupDone(true)} style={{ width:"100%", padding:"10px", marginTop:8, background:"none", color:"rgba(245,241,232,0.3)", border:"none", fontSize:10, letterSpacing:3, cursor:"pointer", fontFamily:'"JetBrains Mono",monospace', display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <SkipForward size={12}/> SKIP WARMUP
        </button>
      </div>
    </div>
  );

  if (isRestDay) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#f5f1e8", fontFamily:'"Inter",sans-serif', paddingBottom:80 }}>
      <style>{CSS}</style>
      <Header/>
      <DaySelector/>
      <RestDayView accent={accent} dim={dim} border={border} plan={PARI_REST_DAY_PLAN}/>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#f5f1e8", fontFamily:'"Inter",sans-serif', paddingBottom:restTimer?120:80 }}>
      <style>{CSS}</style>
      <Header/>
      <DaySelector/>
      <div style={{ padding:"10px 16px 0" }}>
        {workout.exercises.map((ex,idx) => {
          const isOpen = activeEx===ex.id;
          const done = isComplete(ex);
          const tc = TYPE_COLOR[ex.type]||TYPE_COLOR.isolation;
          const displayName = getExName(ex.name);
          const totalSets = getTotalSets(ex);
          const isSingleSet = ex.sets===1;

          return (
            <div key={ex.id} style={{ marginBottom:10, border:`1px solid ${done?accent:isOpen?border:"rgba(245,241,232,0.07)"}`, borderRadius:14, overflow:"hidden", background:done?dim:"rgba(245,241,232,0.02)" }}>
              <div onClick={()=>setActiveEx(isOpen?null:ex.id)} style={{ padding:"14px 16px", cursor:"pointer" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                      <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:11, color:accent, fontWeight:600 }}>{String(idx+1).padStart(2,"0")}</div>
                      <div style={{ fontSize:9, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.15em", padding:"2px 6px", background:tc.bg, color:tc.text, borderRadius:3 }}>{tc.label}</div>
                    </div>
                    {editingName===ex.id ? (
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }} onClick={e=>e.stopPropagation()}>
                        <input value={tempName} onChange={e=>setTempName(e.target.value)} autoFocus
                          style={{ flex:1, background:"rgba(245,241,232,0.08)", border:`1px solid ${accent}66`, borderRadius:6, color:"#f5f1e8", padding:"4px 8px", fontSize:15, outline:"none", fontWeight:600 }}/>
                        <button onClick={()=>saveExName(ex.name)} style={{ background:accent, border:"none", borderRadius:5, color:"#0a0a0a", padding:"4px 6px", cursor:"pointer" }}><Check size={13}/></button>
                        <button onClick={()=>setEditingName(null)} style={{ background:"rgba(245,241,232,0.08)", border:"none", borderRadius:5, color:"rgba(245,241,232,0.5)", padding:"4px 6px", cursor:"pointer" }}><X size={13}/></button>
                      </div>
                    ) : (
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                        <span style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:17, letterSpacing:1, lineHeight:1.25 }}>{displayName}</span>
                        <button onClick={e=>{e.stopPropagation();setTempName(displayName);setEditingName(ex.id);}} style={{ background:"transparent", border:"none", cursor:"pointer", padding:2, color:"rgba(245,241,232,0.25)" }}><Pencil size={12}/></button>
                        {getNote(ex.name) && <div style={{ width:6, height:6, borderRadius:"50%", background:accent, flexShrink:0 }}/>}
                      </div>
                    )}
                    <div style={{ fontSize:12, color:"rgba(245,241,232,0.5)" }}>
                      <span style={{ color:"rgba(245,241,232,0.65)" }}>{ex.target}</span>
                      {ex.secondary && <span style={{ color:"rgba(245,241,232,0.3)" }}> · {ex.secondary}</span>}
                    </div>
                  </div>
                  <div style={{ color:"rgba(245,241,232,0.3)", flexShrink:0 }}>{isOpen?<ChevronUp size={18}/>:<ChevronDown size={18}/>}</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginTop:12 }}>
                  {[["SETS",isSingleSet?"1":totalSets],["REPS",ex.defaultReps],["REST",REST_LABELS[ex.type]]].map(([label,val])=>(
                    <div key={label} style={{ padding:"8px", background:"rgba(245,241,232,0.04)", borderRadius:6, textAlign:"center" }}>
                      <div style={{ fontSize:9, color:"rgba(245,241,232,0.4)", fontFamily:'"JetBrains Mono",monospace', marginBottom:2 }}>{label}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:accent, fontFamily:'"JetBrains Mono",monospace' }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {isOpen && (
                <div style={{ borderTop:"1px solid rgba(245,241,232,0.06)", padding:"14px 16px 16px", background:"rgba(0,0,0,0.2)" }}>
                  {/* Coaching tip */}
                  {ex.tip && (
                    <div style={{ marginBottom:12, padding:"10px 12px", background:accent+"11", border:`1px solid ${accent}33`, borderRadius:8 }}>
                      <div style={{ fontSize:9, color:accent+"99", fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.15em", marginBottom:4 }}>COACHING TIP</div>
                      <div style={{ fontSize:12, color:"rgba(245,241,232,0.7)", lineHeight:1.6 }}>{ex.tip}</div>
                    </div>
                  )}

                  {/* Single-set (treadmill) */}
                  {isSingleSet ? (
                    <button onClick={()=>updateLog(ex.name,0,"done",getLog(ex.name,0,"done")?"":"1")}
                      style={{ width:"100%", padding:"14px", background:getLog(ex.name,0,"done")?accent:"rgba(245,241,232,0.06)", color:getLog(ex.name,0,"done")?"#0a0a0a":"rgba(245,241,232,0.4)", border:`1px solid ${accent}44`, borderRadius:10, fontFamily:'"Bebas Neue",sans-serif', fontSize:18, letterSpacing:"0.1em", cursor:"pointer", marginBottom:10 }}>
                      {getLog(ex.name,0,"done")?"✓ DONE":"MARK COMPLETE"}
                    </button>
                  ) : (
                    <>
                      {/* Set headers */}
                  {!ex.timedSet && (
                    <div style={{ display:"grid", gridTemplateColumns:ex.noWeight?"32px 1fr 80px":"32px 1fr 1fr 80px", gap:8, marginBottom:8 }}>
                      {(ex.noWeight ? ["SET","REPS",""] : ["SET","KG","REPS",""]).map(h=>(
                        <div key={h} style={{ fontSize:9, color:"rgba(245,241,232,0.35)", fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.15em", textAlign:"center" }}>{h}</div>
                      ))}
                    </div>
                  )}

                  {Array.from({length:totalSets}).map((_,si)=>{
                        const w=getLog(ex.name,si,"weight");
                        const r=getLog(ex.name,si,"reps");
                        const confirmed = !!getLog(ex.name,si,"confirmed");
                        const hasData = ex.noWeight ? !!r : !!(w && r);
                        const isExtra=si>=ex.sets;

                        // Plank — start/stop timer records seconds
                        if (ex.timedSet) return (
                          <PlankTimer
                            key={si}
                            setIdx={si}
                            savedSecs={getLog(ex.name,si,"reps")}
                            accent={accent}
                            onComplete={secs=>updateLog(ex.name,si,"reps",secs)}
                          />
                        );

                        return (
                          <div key={si} style={{ display:"grid", gridTemplateColumns:ex.noWeight?"32px 1fr 80px":"32px 1fr 1fr 80px", gap:8, marginBottom:8, alignItems:"center" }}>
                            <div style={{ textAlign:"center", fontSize:12, color:confirmed?accent:isExtra?"rgba(245,241,232,0.2)":"rgba(245,241,232,0.3)", fontFamily:'"JetBrains Mono",monospace', fontWeight:600 }}>
                              {confirmed?"✓":isExtra?`+${si-ex.sets+1}`:si+1}
                            </div>
                            {!ex.noWeight && (
                              <input type="number" placeholder="kg" value={w}
                                onChange={e=>updateLog(ex.name,si,"weight",e.target.value)}
                                style={{ background:"rgba(245,241,232,0.05)", border:`1px solid ${confirmed?accent+"66":isExtra?"rgba(245,241,232,0.05)":"rgba(245,241,232,0.1)"}`, borderRadius:7, color:"#f5f1e8", padding:"10px", fontSize:15, fontFamily:'"JetBrains Mono",monospace', textAlign:"center", outline:"none", width:"100%" }}/>
                            )}
                            <input type="number" placeholder="reps" value={r}
                              onChange={e=>updateLog(ex.name,si,"reps",e.target.value)}
                              style={{ background:"rgba(245,241,232,0.05)", border:`1px solid ${confirmed?accent+"66":isExtra?"rgba(245,241,232,0.05)":"rgba(245,241,232,0.1)"}`, borderRadius:7, color:"#f5f1e8", padding:"10px", fontSize:15, fontFamily:'"JetBrains Mono",monospace', textAlign:"center", outline:"none", width:"100%" }}/>
                            <button onClick={()=>handleLogSet(ex,si)}
                              style={{ padding:"10px 6px", background:confirmed?accent:hasData?"rgba(245,241,232,0.15)":"rgba(245,241,232,0.06)", color:confirmed?"#0a0a0a":hasData?"#f5f1e8":"rgba(245,241,232,0.4)", border:confirmed?"none":`1px solid ${hasData?accent+"55":"transparent"}`, borderRadius:7, fontSize:10, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.08em", cursor:"pointer", fontWeight:600 }}>
                              {confirmed?"DONE ✓":"LOG"}
                            </button>
                          </div>
                        );
                      })}
                      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                        <button onClick={()=>addSet(ex)}
                          style={{ flex:1, padding:"9px", background:"rgba(245,241,232,0.04)", border:"1px dashed rgba(245,241,232,0.15)", borderRadius:8, color:"rgba(245,241,232,0.4)", fontSize:11, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.1em", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                          <Plus size={12}/> ADD SET
                        </button>
                        {(extraSets[getExKey(ex.id)]||0)>0 && (
                          <button onClick={()=>removeSet(ex)}
                            style={{ flex:1, padding:"9px", background:"rgba(220,80,80,0.06)", border:"1px dashed rgba(220,80,80,0.25)", borderRadius:8, color:"#e57373", fontSize:11, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.1em", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                            <X size={12}/> REMOVE SET
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  {/* Watch demo */}
                  <a href={ex.video} target="_blank" rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px", background:dim, border:`1px solid ${border}`, borderRadius:8, color:accent, textDecoration:"none", fontSize:12, fontWeight:600, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.08em" }}>
                    <ExternalLink size={12}/> WATCH DEMO
                  </a>

                  {/* Note */}
                  <div style={{ marginTop:10 }}>
                    <div style={{ fontSize:9, color:"rgba(245,241,232,0.3)", fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.15em", marginBottom:5, display:"flex", alignItems:"center", gap:6 }}>
                      <Pencil size={9}/> NOTE
                    </div>
                    <textarea value={getNote(ex.name)} onChange={e=>saveNote(ex.name,e.target.value)}
                      placeholder="e.g. felt strong, try heavier next time..."
                      rows={2}
                      style={{ width:"100%", background:"rgba(245,241,232,0.04)", border:"1px solid rgba(245,241,232,0.1)", borderRadius:8, color:"#f5f1e8", padding:"10px 12px", fontSize:12, fontFamily:'"JetBrains Mono",monospace', outline:"none", resize:"vertical", lineHeight:1.5 }}/>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalComplete===workout.exercises.length && (
        <>
          <div style={{ margin:"20px 16px 0", padding:20, background:dim, border:`1px solid ${accent}`, borderRadius:16, textAlign:"center" }}>
            <div style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:28, letterSpacing:3, color:accent }}>AMAZING WORK PARI! 💪</div>
            <div style={{ fontSize:11, color:"rgba(245,241,232,0.5)", fontFamily:'"JetBrains Mono",monospace', marginTop:6 }}>YOU CRUSHED IT · NOW REST & RECOVER</div>
          </div>
        </>
      )}

      <div style={{ margin:"16px 16px 0", padding:"12px 16px", background:`${accent}0a`, border:`1px solid ${accent}33`, borderRadius:10, fontSize:10, color:accent, fontFamily:'"JetBrains Mono",monospace', letterSpacing:1, lineHeight:1.8 }}>
        BEGINNER PLAN · START LIGHT · FOCUS ON FORM · ADD WEIGHT GRADUALLY EACH WEEK
      </div>

      {restTimer && <RestTimer seconds={restTimer.seconds} color={restTimer.color} onDone={()=>setRestTimer(null)}/>}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [profile, setProfile] = useState(null);
  if (!profile) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue', Impact, sans-serif", color:"#fff" }}>
      <div style={{ fontSize:11, letterSpacing:6, color:"#444", fontFamily:"monospace", marginBottom:16 }}>WORKOUT TRACKER</div>
      <div style={{ fontSize:48, letterSpacing:4, marginBottom:8 }}>WHO'S TRAINING?</div>
      <div style={{ fontSize:13, color:"#555", fontFamily:"monospace", letterSpacing:2, marginBottom:60 }}>SELECT YOUR PROFILE</div>
      <div style={{ display:"flex", gap:24 }}>
        <div onClick={()=>setProfile("Mansoor")} style={{ cursor:"pointer", width:150, padding:"32px 20px", background:"#111", border:"1px solid #C9A96E44", borderRadius:16, textAlign:"center" }}
          onMouseEnter={e=>e.currentTarget.style.border="1px solid #C9A96E"}
          onMouseLeave={e=>e.currentTarget.style.border="1px solid #C9A96E44"}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"#C9A96E22", border:"2px solid #C9A96E", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:24, color:"#C9A96E" }}>M</div>
          <div style={{ fontSize:22, letterSpacing:2, color:"#C9A96E" }}>MANSOOR</div>
          <div style={{ fontSize:9, fontFamily:"monospace", color:"#555", letterSpacing:2, marginTop:6 }}>WELLFIT • 4 DAYS</div>
        </div>
        <div onClick={()=>setProfile("Pari")} style={{ cursor:"pointer", width:150, padding:"32px 20px", background:"#111", border:"1px solid #E879A044", borderRadius:16, textAlign:"center" }}
          onMouseEnter={e=>e.currentTarget.style.border="1px solid #E879A0"}
          onMouseLeave={e=>e.currentTarget.style.border="1px solid #E879A044"}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"#E879A022", border:"2px solid #E879A0", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:24, color:"#E879A0" }}>P</div>
          <div style={{ fontSize:22, letterSpacing:2, color:"#E879A0" }}>PARI</div>
          <div style={{ fontSize:9, fontFamily:"monospace", color:"#555", letterSpacing:2, marginTop:6 }}>FITNESS 360 • 3 DAYS</div>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <div onClick={()=>setProfile(null)} style={{ position:"fixed", top:12, left:16, zIndex:200, cursor:"pointer", fontSize:10, fontFamily:"monospace", color:"#444", letterSpacing:2, background:"#111", padding:"6px 10px", borderRadius:6, border:"1px solid #2a2a2a" }}>SWITCH</div>
      {profile==="Mansoor"?<MansoorTracker/>:<PariTracker/>}
    </div>
  );
}
