import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Zap, Calendar, SkipForward, Pencil, Check, X, Plus } from "lucide-react";

// ─── MANSOOR ACCENT / STYLE ───────────────────────────────────────────────────
const ACCENT = {
  "Push 1":   { accent:"#C9A96E", dim:"rgba(201,169,110,0.12)", border:"rgba(201,169,110,0.3)" },
  "Pull 1":   { accent:"#D4D4D4", dim:"rgba(212,212,212,0.12)", border:"rgba(212,212,212,0.3)" },
  "Push 2":   { accent:"#C9A96E", dim:"rgba(201,169,110,0.12)", border:"rgba(201,169,110,0.3)" },
  "Pull 2":   { accent:"#D4D4D4", dim:"rgba(212,212,212,0.12)", border:"rgba(212,212,212,0.3)" },
  "Rest Day": { accent:"#4DFFB8", dim:"rgba(77,255,184,0.10)",  border:"rgba(77,255,184,0.3)"  },
};

const TYPE_COLOR = {
  compound:  { bg:"rgba(220,80,80,0.15)",   text:"#e57373", label:"COMPOUND"  },
  isolation: { bg:"rgba(100,160,220,0.15)", text:"#7ab3e0", label:"ISOLATION" },
  warmup:    { bg:"rgba(100,200,140,0.15)", text:"#7bcca0", label:"WARM UP"   },
  finisher:  { bg:"rgba(180,140,220,0.15)", text:"#b89ee0", label:"FINISHER"  },
};

const REST_TIMES  = { compound:150, isolation:75, warmup:50, finisher:50 };
const REST_LABELS = { compound:"2-3 MIN", isolation:"60-90 SEC", warmup:"45-60 SEC", finisher:"45-60 SEC" };

const WARMUP_ITEMS = [
  { label:"Treadmill incline 10",        detail:"5 mins" },
  { label:"Arm circles",                 detail:"1 min" },
  { label:"Hip flexor stretch",          detail:"1 min" },
  { label:"Wrist flexor stretch",        detail:"1 min" },
  { label:"Light set on first exercise", detail:"50% weight · 1 set" },
];

const STRETCHES = [
  { muscle:"Chest",       duration:"30 secs",      video:"https://www.youtube.com/results?search_query=chest+stretch" },
  { muscle:"Shoulders",   duration:"30 secs each", video:"https://www.youtube.com/results?search_query=shoulder+stretch" },
  { muscle:"Triceps",     duration:"30 secs each", video:"https://www.youtube.com/results?search_query=tricep+stretch" },
  { muscle:"Lats",        duration:"30 secs each", video:"https://www.youtube.com/results?search_query=lat+stretch" },
  { muscle:"Biceps",      duration:"30 secs each", video:"https://www.youtube.com/results?search_query=bicep+stretch" },
  { muscle:"Quads",       duration:"30 secs each", video:"https://www.youtube.com/results?search_query=quad+stretch" },
  { muscle:"Hamstrings",  duration:"30 secs",      video:"https://www.youtube.com/results?search_query=hamstring+stretch" },
  { muscle:"Glutes",      duration:"30 secs each", video:"https://www.youtube.com/results?search_query=glute+stretch" },
  { muscle:"Calves",      duration:"30 secs each", video:"https://www.youtube.com/results?search_query=calf+stretch" },
  { muscle:"Hip Flexors", duration:"30 secs each", video:"https://www.youtube.com/results?search_query=hip+flexor+stretch" },
];

const REST_DAY_PLAN = [
  { label:"Cardio",                        detail:"20-30 mins · Treadmill or Bike",   video:"https://www.youtube.com/results?search_query=cardio+workout" },
  { label:"Plank",                         detail:"3 sets · 30-60 secs",              video:"https://www.youtube.com/results?search_query=plank+proper+form" },
  { label:"Leg Raises",                    detail:"3 sets · 15 reps",                 video:"https://www.youtube.com/results?search_query=lying+leg+raises+abs" },
  { label:"Russian Twist",                 detail:"3 sets · 20 reps",                 video:"https://www.youtube.com/results?search_query=russian+twist+obliques" },
  { label:"Cable Crunch",                  detail:"3 sets · 15 reps",                 video:"https://www.youtube.com/results?search_query=cable+crunch+abs" },
  { label:"Hip Flexor Stretch (Kneeling)", detail:"2 sets · 30 secs each side",       video:"https://www.youtube.com/results?search_query=kneeling+hip+flexor+stretch" },
  { label:"Pigeon Pose",                   detail:"2 sets · 30-60 secs each side",    video:"https://www.youtube.com/results?search_query=pigeon+pose+hip+flexor" },
  { label:"Sauna",                         detail:"15 mins",                           video:null },
  { label:"Cold Plunge",                   detail:"1-2 mins",                          video:null },
  { label:"Sauna",                         detail:"10-15 mins",                        video:null },
];

// ─── NEW PPL PLAN (Week 2+) ───────────────────────────────────────────────────
const PLAN = {
  "Push 1": { day:"Monday", exercises: [
    { id:"p1_1", name:"Incline Press",                 target:"UPPER CHEST",        secondary:"Front Delts, Triceps",    type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=incline+chest+press" },
    { id:"p1_2", name:"Upper Chest Flye",              target:"UPPER CHEST",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=upper+chest+fly" },
    { id:"p1_3", name:"Shoulder Press (Neutral Grip)", target:"FRONT DELTS",        secondary:"Upper Chest, Triceps",    type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=neutral+grip+shoulder+press" },
    { id:"p1_4", name:"Lateral Raise",                 target:"SIDE DELTS",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=lateral+raise" },
    { id:"p1_5", name:"Tricep Dip",                    target:"TRICEPS",            secondary:"Chest, Shoulders",        type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=tricep+dip+machine" },
    { id:"p1_6", name:"Overhead Extension",            target:"TRICEPS LONG HEAD",                                      type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=overhead+tricep+extension" },
    { id:"p1_7", name:"Leg Extension (Warm Up)",       target:"QUADS",                                                  type:"warmup",    sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=leg+extension" },
    { id:"p1_8", name:"Squat",                         target:"QUADS & GLUTES",     secondary:"Hamstrings, Lower Back",  type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=squat" },
    { id:"p1_9", name:"Hip Abductor",                  target:"OUTER THIGH",                                            type:"isolation", sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=hip+abductor+machine" },
    { id:"p1_f", name:"Standing Calf Raise",           target:"CALVES",                                                 type:"finisher",  sets:3, defaultReps:"15-20", video:"https://www.youtube.com/results?search_query=standing+calf+raise" },
  ]},
  "Pull 1": { day:"Tuesday", exercises: [
    { id:"pl1_1", name:"Lat Pulldown (Close/Neutral)", target:"LATS WIDTH",          secondary:"Biceps, Rear Delts",     type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=lat+pulldown+close+grip" },
    { id:"pl1_2", name:"Row (Close/Neutral Grip)",     target:"MID BACK",            secondary:"Biceps, Rear Delts",     type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=seated+cable+row" },
    { id:"pl1_3", name:"Bicep Curl (Supinated)",       target:"BICEPS PEAK",                                            type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=bicep+curl+supinated" },
    { id:"pl1_4", name:"Hammer Curl",                  target:"BRACHIALIS",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=hammer+curl" },
    { id:"pl1_5", name:"Rear Delt Flye",               target:"REAR DELTS",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=rear+delt+fly" },
    { id:"pl1_6", name:"Shrugs",                       target:"TRAPS",                                                  type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=shrugs" },
    { id:"pl1_7", name:"Leg Curl (Warm Up)",           target:"HAMSTRINGS",                                             type:"warmup",    sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=leg+curl" },
    { id:"pl1_8", name:"Romanian Deadlift",            target:"HAMSTRINGS & GLUTES", secondary:"Lower Back, Calves",    type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=romanian+deadlift" },
    { id:"pl1_9", name:"Hip Adductor",                 target:"INNER THIGH",                                            type:"isolation", sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=hip+adductor+machine" },
    { id:"pl1_f", name:"Hyperextension",               target:"LOWER BACK",          secondary:"Glutes, Hamstrings",    type:"finisher",  sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=hyperextension" },
  ]},
  "Push 2": { day:"Thursday", exercises: [
    { id:"p2_1", name:"Flat Press",                    target:"MID CHEST",           secondary:"Front Delts, Triceps",   type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=flat+chest+press+machine" },
    { id:"p2_2", name:"Lower Chest Flye",              target:"LOWER CHEST",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=lower+chest+fly" },
    { id:"p2_3", name:"Shoulder Press (Wide Grip)",    target:"FRONT & SIDE DELTS",  secondary:"Upper Chest, Triceps",   type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=wide+grip+shoulder+press" },
    { id:"p2_4", name:"Lateral Raise",                 target:"SIDE DELTS",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=lateral+raise" },
    { id:"p2_5", name:"Tricep Pushdown",               target:"TRICEPS LATERAL",                                        type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=tricep+pushdown" },
    { id:"p2_6", name:"Overhead Extension",            target:"TRICEPS LONG HEAD",                                      type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=overhead+tricep+extension" },
    { id:"p2_7", name:"Leg Extension (Warm Up)",       target:"QUADS",                                                  type:"warmup",    sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=leg+extension" },
    { id:"p2_8", name:"Hack Squat",                    target:"QUADS & GLUTES",      secondary:"Glutes, Hamstrings",     type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=hack+squat", note:"KNEE BRACES!" },
    { id:"p2_9", name:"Glute Kickback",                target:"GLUTES",                                                 type:"isolation", sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=glute+kickback" },
    { id:"p2_f", name:"Seated Calf Raise",             target:"CALVES",                                                 type:"finisher",  sets:3, defaultReps:"15-20", video:"https://www.youtube.com/results?search_query=seated+calf+raise" },
  ]},
  "Pull 2": { day:"Friday", exercises: [
    { id:"pl2_1", name:"Lat Pulldown (Wide Grip)",     target:"LATS WIDTH",          secondary:"Biceps, Rear Delts",     type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=wide+grip+lat+pulldown" },
    { id:"pl2_2", name:"Row (Wide Grip)",              target:"UPPER BACK",          secondary:"Biceps, Rear Delts",     type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=wide+grip+row" },
    { id:"pl2_3", name:"Bicep Curl (Supinated)",       target:"BICEPS PEAK",                                            type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=bicep+curl" },
    { id:"pl2_4", name:"Hammer Curl",                  target:"BRACHIALIS",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=hammer+curl" },
    { id:"pl2_5", name:"Rear Delt Flye",               target:"REAR DELTS",                                             type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=rear+delt+fly" },
    { id:"pl2_6", name:"Shrugs",                       target:"TRAPS",                                                  type:"isolation", sets:3, defaultReps:"12-15", video:"https://www.youtube.com/results?search_query=shrugs" },
    { id:"pl2_7", name:"Leg Curl (Warm Up)",           target:"HAMSTRINGS",                                             type:"warmup",    sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=leg+curl" },
    { id:"pl2_8", name:"Leg Press",                    target:"QUADS & GLUTES",      secondary:"Hamstrings, Calves",     type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=leg+press" },
    { id:"pl2_9", name:"Hip Thrust",                   target:"GLUTES",              secondary:"Hamstrings, Lower Back", type:"compound",  sets:4, defaultReps:"8-12",  video:"https://www.youtube.com/results?search_query=hip+thrust" },
    { id:"pl2_f", name:"Hyperextension",               target:"LOWER BACK",          secondary:"Glutes, Hamstrings",    type:"finisher",  sets:3, defaultReps:"15",    video:"https://www.youtube.com/results?search_query=hyperextension" },
  ]},
};

// ─── WEEK 1 PLAN (preserved exactly) ─────────────────────────────────────────
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
    { id:"m_pl1_1", name:"Lat Pulldown (V-bar)",       target:"LATS WIDTH",          secondary:"Biceps, Rear Delts",    type:"compound",  sets:4, defaultReps:"12", video:"https://www.youtube.com/results?search_query=lat+pulldown+v+bar" },
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
    { id:"m_p2_3", name:"Cable Lateral Raise",                   target:"SIDE DELTS",                                     type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=cable+lateral+raise" },
    { id:"m_p2_4", name:"Cable Front Raise",                     target:"FRONT DELTS",                                    type:"isolation", sets:3, defaultReps:"12", video:"https://www.youtube.com/results?search_query=cable+front+raise" },
    { id:"m_p2_5", name:"Rope Pushdown",                         target:"TRICEPS",                                        type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=rope+pushdown" },
    { id:"m_p2_6", name:"Seated Overhead Tricep Machine",        target:"TRICEPS LONG HEAD",                              type:"isolation", sets:3, defaultReps:"12", video:"https://www.youtube.com/results?search_query=overhead+tricep+extension+machine" },
    { id:"m_p2_7", name:"Leg Extension",                         target:"QUADS",                                          type:"isolation", sets:3, defaultReps:"15", video:"https://www.youtube.com/results?search_query=leg+extension" },
    { id:"m_p2_8", name:"Leg Press",                             target:"QUADS & GLUTES", secondary:"Hamstrings, Calves", type:"compound",  sets:3, defaultReps:"12", video:"https://www.youtube.com/results?search_query=leg+press" },
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
const muscleColors = {
  "CARDIO WARMUP":"#888","QUADS & GLUTES":"#E879A0","QUADS":"#E879A0","HAMSTRINGS":"#A78BFA",
  "HAMSTRINGS & GLUTES":"#A78BFA","GLUTES":"#F472B6","OUTER THIGH & GLUTES":"#FB923C","OUTER THIGH":"#FB923C",
  "INNER THIGH":"#FBBF24","CALVES":"#34D399","BACK WIDTH":"#60A5FA","BACK":"#60A5FA","MID BACK":"#3B82F6",
  "SHOULDERS":"#818CF8","CHEST":"#F87171","BICEPS":"#4ADE80","TRICEPS":"#A3E635","SIDE DELTS":"#818CF8",
};
const muscleIcon = {
  "CARDIO WARMUP":"🚶","QUADS & GLUTES":"🦵","QUADS":"🦵","HAMSTRINGS":"🦵","HAMSTRINGS & GLUTES":"🍑",
  "GLUTES":"🍑","OUTER THIGH & GLUTES":"🍑","OUTER THIGH":"🦵","INNER THIGH":"🦵","CALVES":"🦵",
  "BACK WIDTH":"💪","BACK":"💪","MID BACK":"💪","SHOULDERS":"💪","CHEST":"💪","BICEPS":"💪",
  "TRICEPS":"💪","SIDE DELTS":"💪",
};
const pariPlan = {
  "Day 1": { day:"Mon", color:"#E879A0", focus:"Lower Body", description:"Glutes · Quads · Hamstrings · Calves", exercises: [
    { name:"Treadmill Walk (Incline 8-10%)", target:"CARDIO WARMUP", sets:1, defaultReps:"10 min", tip:"Keep incline high, speed moderate. Don't hold the rails. Warmup only." },
    { name:"Leg Press",             target:"QUADS & GLUTES",    sets:3, defaultReps:15, tip:"Feet shoulder-width. Push through heels. Don't lock knees at the top." },
    { name:"Leg Extension",         target:"QUADS",             sets:3, defaultReps:15, tip:"Slow and controlled. Squeeze quad at the top for 1 second before lowering." },
    { name:"Seated Leg Curl",       target:"HAMSTRINGS",        sets:3, defaultReps:15, tip:"Pull heel smoothly. Don't jerk the weight. Feel the back of your thigh working." },
    { name:"Hip Abductor (Outer)",  target:"OUTER THIGH & GLUTES", sets:3, defaultReps:15, tip:"Open legs slowly. Squeeze glutes at the widest point." },
    { name:"Hip Adductor (Inner)",  target:"INNER THIGH",       sets:3, defaultReps:15, tip:"Close legs with control. Focus on inner thigh — don't use momentum." },
    { name:"Seated Calf Raise",     target:"CALVES",            sets:3, defaultReps:20, tip:"Full range every rep. All the way up, all the way down. Slow counts." },
  ]},
  "Day 2": { day:"Wed", color:"#A78BFA", focus:"Upper Body", description:"Back · Shoulders · Chest · Arms", exercises: [
    { name:"Treadmill Walk (Incline 8-10%)", target:"CARDIO WARMUP", sets:1, defaultReps:"10 min", tip:"Same warmup as Day 1 — gets blood flowing before lifting." },
    { name:"Lat Pulldown (Wide Grip)", target:"BACK WIDTH",     sets:3, defaultReps:15, tip:"Pull bar to upper chest. Lean back slightly. Control the weight on the way up." },
    { name:"Seated Cable Row",      target:"MID BACK",          sets:3, defaultReps:15, tip:"Sit tall. Pull elbows back, squeeze shoulder blades together. Don't round your back." },
    { name:"Machine Shoulder Press",target:"SHOULDERS",         sets:3, defaultReps:15, tip:"Press straight up. Don't shrug. Start very light." },
    { name:"Pec Deck Flye",         target:"CHEST",             sets:3, defaultReps:15, tip:"Squeeze chest at the front. Open arms slowly — feel the stretch." },
    { name:"Cable Curl",            target:"BICEPS",            sets:3, defaultReps:15, tip:"Keep elbows still at sides. Curl up, lower slowly. No swinging." },
    { name:"Rope Pushdown",         target:"TRICEPS",           sets:3, defaultReps:15, tip:"Push rope down and slightly outward. Lock elbows at sides throughout." },
  ]},
  "Day 3": { day:"Fri", color:"#34D399", focus:"Full Body", description:"Compound movements · Full body activation", exercises: [
    { name:"Treadmill Walk (Incline 8-10%)", target:"CARDIO WARMUP", sets:1, defaultReps:"10 min", tip:"Warmup walk before full body session. Take it easy here." },
    { name:"Hack Squat (Light)",    target:"QUADS & GLUTES",    sets:3, defaultReps:12, tip:"Feet hip-width. Lower until thighs are parallel to floor. Push through heels." },
    { name:"Romanian Deadlift (Light)", target:"HAMSTRINGS & GLUTES", sets:3, defaultReps:12, tip:"Hinge at hips, keep back flat. Feel the stretch in your hamstrings." },
    { name:"Gluteus Standing Machine", target:"GLUTES",         sets:3, defaultReps:15, tip:"One leg at a time. Kick back and squeeze glute hard at the top." },
    { name:"Chest Supported Machine Row", target:"BACK",        sets:3, defaultReps:15, tip:"Chest on the pad. Pull handles toward you, squeeze your back muscles." },
    { name:"Cable Lateral Raise",   target:"SIDE DELTS",        sets:3, defaultReps:15, tip:"Very light weight. Raise arm to shoulder height only. Slow both ways." },
    { name:"Seated Calf Raise",     target:"CALVES",            sets:3, defaultReps:20, tip:"Full range of motion every rep. Slow and controlled." },
  ]},
};
const pariWeekDates = {
  "Week 1":{"Day 1":"Mon · May 18","Day 2":"Wed · May 20","Day 3":"Fri · May 22"},
  "Week 2":{"Day 1":"Mon · May 25","Day 2":"Wed · May 27","Day 3":"Fri · May 29"},
  "Week 3":{"Day 1":"Mon · Jun 1", "Day 2":"Wed · Jun 3", "Day 3":"Fri · Jun 5" },
  "Week 4":{"Day 1":"Mon · Jun 8", "Day 2":"Wed · Jun 10","Day 3":"Fri · Jun 12"},
};

const WEEKS    = ["Week 1","Week 2","Week 3","Week 4"];
const ALL_DAYS = ["Push 1","Pull 1","Push 2","Pull 2","Rest Day"];

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
  const [remaining, setRemaining] = useState(seconds);
  const pct = remaining / seconds;
  const fmt = s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  useEffect(() => {
    if (remaining<=0) { onDone(); return; }
    const t = setInterval(()=>setRemaining(r=>r-1),1000);
    return ()=>clearInterval(t);
  }, [remaining]);
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:300, background:"#0f0f0f", borderTop:`2px solid ${color}`, padding:"14px 20px", display:"flex", alignItems:"center", gap:16 }}>
      <div style={{ width:50, height:50, borderRadius:"50%", border:`3px solid ${color}33`, flexShrink:0, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg style={{ position:"absolute", inset:0 }} viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="22" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${pct*138.2} 138.2`} strokeLinecap="round" transform="rotate(-90 25 25)"/>
        </svg>
        <div style={{ fontSize:10, fontFamily:'"JetBrains Mono",monospace', color, fontWeight:900 }}>{fmt(remaining)}</div>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:9, color:"#555", fontFamily:'"JetBrains Mono",monospace', letterSpacing:3 }}>REST TIMER</div>
        <div style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:14, letterSpacing:2, color:"#fff", marginTop:2 }}>NEXT SET IN {fmt(remaining)}</div>
      </div>
      <div style={{ display:"flex", gap:8, flexShrink:0 }}>
        <button onClick={()=>setRemaining(r=>Math.max(0,r-15))} style={{ background:"#1a1a1a", border:"none", color:"#aaa", borderRadius:8, padding:"8px 10px", fontSize:11, fontFamily:'"JetBrains Mono",monospace', cursor:"pointer" }}>-15s</button>
        <button onClick={()=>setRemaining(r=>r+15)} style={{ background:"#1a1a1a", border:"none", color:"#aaa", borderRadius:8, padding:"8px 10px", fontSize:11, fontFamily:'"JetBrains Mono",monospace', cursor:"pointer" }}>+15s</button>
        <button onClick={onDone} style={{ background:color, border:"none", color:"#000", borderRadius:8, padding:"8px 14px", fontSize:11, fontFamily:'"Bebas Neue",sans-serif', letterSpacing:2, cursor:"pointer" }}>SKIP</button>
      </div>
    </div>
  );
}

// ─── STRETCH SECTION ─────────────────────────────────────────────────────────
function StretchSection({ color }) {
  const [checked, setChecked] = useState({});
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div style={{ margin:"20px 16px 0", padding:"20px 16px", background:"#111", border:`1px solid ${color}44`, borderRadius:16 }}>
      <div style={{ fontSize:10, color:"#555", fontFamily:'"JetBrains Mono",monospace', letterSpacing:4, marginBottom:4 }}>POST WORKOUT</div>
      <div style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:22, letterSpacing:2, marginBottom:14 }}>STRETCHES</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {STRETCHES.map((s,i) => (
          <div key={i} style={{ background:checked[i]?color+"18":"#1a1a1a", border:`1px solid ${checked[i]?color+"55":"#2a2a2a"}`, borderRadius:10, overflow:"hidden", transition:"all 0.2s" }}>
            <div onClick={()=>setChecked(p=>({...p,[i]:!p[i]}))} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", cursor:"pointer" }}>
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
      {done===STRETCHES.length && <div style={{ marginTop:14, textAlign:"center", fontSize:11, color, fontFamily:'"JetBrains Mono",monospace', letterSpacing:3 }}>ALL DONE 💪</div>}
    </div>
  );
}

// ─── REST DAY VIEW ────────────────────────────────────────────────────────────
function RestDayView({ accent, dim, border }) {
  const [checked, setChecked] = useState({});
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div style={{ padding:"16px 16px 80px" }}>
      <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:10, letterSpacing:"0.2em", color:"rgba(245,241,232,0.4)", marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>
        <Zap size={11} color={accent}/> ACTIVE RECOVERY · CORE · MOBILITY
      </div>
      {REST_DAY_PLAN.map((item,i) => {
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
      {done===REST_DAY_PLAN.length && (
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
  const [selectedDay,   setSelectedDay]   = useState("Push 1");
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
  const { accent, dim, border } = ACCENT[selectedDay];
  const workout = isRestDay ? null : (selectedWeek === "Week 1" ? mansoorPlan[selectedDay] : PLAN[selectedDay]);

  // ── API Load ───────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/sync/mansoor");
        const { data } = await res.json();
        setLogs(data.logs ? { ...mansoorLogs, ...data.logs } : { ...mansoorLogs });
        setExtraSets(data.extraSets || {});
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
          body: JSON.stringify({ data: { logs, extraSets } }),
        });
        setSaved(true); setTimeout(()=>setSaved(false),1500);
      } catch {}
    }, 700);
    return () => clearTimeout(t);
  }, [logs, extraSets, loaded]);

  useEffect(() => { setWarmupDone(false); setActiveEx(null); setRestTimer(null); setWarmupChecked({}); setCalendarDay(null); }, [selectedDay]);

  // ── Log helpers ───────────────────────────────────────────────────────────
  const gk = (w,d,e,s) => `${w}|${d}|${e}|${s}`;
  const getLog = (e,s,f) => logs[gk(selectedWeek,selectedDay,e,s)]?.[f] || "";
  const updateLog = (exName,si,field,value) => {
    const k = gk(selectedWeek,selectedDay,exName,si);
    setLogs(p => ({ ...p, [k]: { ...p[k], [field]: value } }));
  };
  const handleLogSet = (ex,si) => {
    const k = gk(selectedWeek,selectedDay,ex.name,si);
    if (logs[k]?.weight && logs[k]?.reps) {
      setRestTimer({ seconds: REST_TIMES[ex.type]||75, color: accent });
    }
  };

  // ── Progressive overload ──────────────────────────────────────────────────
  const getMaxWeight = (exName) => {
    let maxW=0, maxWeek=null;
    WEEKS.forEach(wk => {
      if (parseInt(wk.split(" ")[1]) >= parseInt(selectedWeek.split(" ")[1])) return;
      for (let si=0; si<10; si++) {
        const w = parseFloat(logs[gk(wk,selectedDay,exName,si)]?.weight)||0;
        if (w>maxW) { maxW=w; maxWeek=wk; }
      }
    });
    return maxW>0 ? { maxW, maxWeek } : null;
  };
  const getPo = (ex) => {
    const r = getMaxWeight(ex.name);
    if (!r) return null;
    return { maxW:r.maxW, maxWeek:r.maxWeek, suggested: r.maxW+2.5 };
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

  // ── Completion ────────────────────────────────────────────────────────────
  const isComplete = (ex) => Array.from({length:getTotalSets(ex)}).every((_,i)=>getLog(ex.name,i,"weight")&&getLog(ex.name,i,"reps"));
  const totalComplete = workout ? workout.exercises.filter(isComplete).length : 0;
  const hasLogs = workout?.exercises.some(ex=>Array.from({length:getTotalSets(ex)}).some((_,i)=>getLog(ex.name,i,"weight")));
  const allWarmupDone = WARMUP_ITEMS.every((_,i)=>warmupChecked[`wu_${i}`]);
  const showWarmup = !warmupDone && !hasLogs && !isRestDay;

  if (!loaded) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(245,241,232,0.5)", fontFamily:'"JetBrains Mono",monospace', letterSpacing:4, fontSize:12 }}>
      SYNCING...
    </div>
  );

  // ── Header ────────────────────────────────────────────────────────────────
  const Header = () => (
    <div style={{ background:`linear-gradient(135deg,${accent}22,#0a0a0a)`, borderBottom:`2px solid ${accent}`, padding:"20px 16px 14px", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(10px)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:10, letterSpacing:"0.2em", color:accent, marginBottom:4 }}>
            THEOGLUMI · OXYGEN GYM{saved?" · SAVED ✓":""}
          </div>
          <div style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:28, letterSpacing:"0.02em", lineHeight:1, color:"#f5f1e8" }}>{selectedDay}</div>
        </div>
        {!isRestDay && workout && (
          <div style={{ background:accent, color:"#000", borderRadius:"50%", width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, fontFamily:'"JetBrains Mono",monospace', flexShrink:0 }}>
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
        {WARMUP_ITEMS.map((item,i)=>{
          const key=`wu_${i}`; const ch=warmupChecked[key];
          return (
            <div key={i} onClick={()=>setWarmupChecked(p=>({...p,[key]:!ch}))}
              style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", marginBottom:8, background:ch?dim:"rgba(245,241,232,0.03)", border:`1px solid ${ch?border:"rgba(245,241,232,0.07)"}`, borderRadius:12, cursor:"pointer", transition:"all 0.2s" }}>
              <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${ch?accent:"rgba(245,241,232,0.2)"}`, background:ch?accent:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#0a0a0a", fontWeight:700 }}>{ch?"✓":""}</div>
              <div>
                <div style={{ fontSize:14, color:ch?"rgba(245,241,232,0.4)":"rgba(245,241,232,0.85)", textDecoration:ch?"line-through":"none", fontFamily:'"Bebas Neue",sans-serif', letterSpacing:1 }}>{item.label}</div>
                <div style={{ fontSize:11, color:"rgba(245,241,232,0.4)", fontFamily:'"JetBrains Mono",monospace', marginTop:2 }}>{item.detail}</div>
              </div>
            </div>
          );
        })}
        <button onClick={()=>setWarmupDone(true)} disabled={!allWarmupDone}
          style={{ width:"100%", padding:"15px", marginTop:6, background:allWarmupDone?accent:"rgba(245,241,232,0.06)", color:allWarmupDone?"#0a0a0a":"rgba(245,241,232,0.3)", border:"none", borderRadius:12, fontFamily:'"Bebas Neue",sans-serif', fontSize:20, letterSpacing:"0.1em", cursor:allWarmupDone?"pointer":"not-allowed", transition:"all 0.3s" }}>
          {allWarmupDone?"START SESSION →":`${Object.values(warmupChecked).filter(Boolean).length}/${WARMUP_ITEMS.length} COMPLETE`}
        </button>
        <button onClick={()=>setWarmupDone(true)} style={{ width:"100%", padding:"10px", marginTop:8, background:"none", color:"rgba(245,241,232,0.3)", border:"none", fontSize:10, letterSpacing:3, cursor:"pointer", fontFamily:'"JetBrains Mono",monospace', display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <SkipForward size={12}/> SKIP WARMUP
        </button>
      </div>
    </div>
  );

  // ── REST DAY SCREEN ───────────────────────────────────────────────────────
  if (isRestDay) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#f5f1e8", fontFamily:'"Inter",sans-serif', paddingBottom:80 }}>
      <style>{CSS}</style>
      <Header/>
      <DaySelector/>
      <RestDayView accent={accent} dim={dim} border={border}/>
    </div>
  );

  // ── TRAINING SCREEN ───────────────────────────────────────────────────────
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
                    <div style={{ fontSize:9, color:"rgba(245,241,232,0.4)", fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.15em", marginBottom:4 }}>PROGRESSIVE OVERLOAD</div>
                    {po ? (
                      <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, fontFamily:'"JetBrains Mono",monospace', flexWrap:"wrap" }}>
                        <span style={{ color:"rgba(245,241,232,0.5)" }}>MAX ({po.maxWeek}): <span style={{ color:"rgba(245,241,232,0.8)" }}>{po.maxW}kg</span></span>
                        <span style={{ color:"rgba(245,241,232,0.3)" }}>→</span>
                        <span style={{ color:accent }}>TARGET: {po.suggested}kg (+2.5)</span>
                      </div>
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
                    const w=getLog(ex.name,si,"weight"); const r=getLog(ex.name,si,"reps"); const setDone=w&&r; const isExtra=si>=ex.sets;
                    return (
                      <div key={si} style={{ display:"grid", gridTemplateColumns:"32px 1fr 1fr 80px", gap:8, marginBottom:8, alignItems:"center" }}>
                        <div style={{ textAlign:"center", fontSize:12, color:setDone?accent:isExtra?"rgba(245,241,232,0.2)":"rgba(245,241,232,0.3)", fontFamily:'"JetBrains Mono",monospace', fontWeight:600 }}>
                          {setDone?"✓":isExtra?`+${si-ex.sets+1}`:si+1}
                        </div>
                        <input type="number" placeholder="kg" value={w}
                          onChange={e=>updateLog(ex.name,si,"weight",e.target.value)}
                          style={{ background:"rgba(245,241,232,0.05)", border:`1px solid ${setDone?accent+"66":isExtra?"rgba(245,241,232,0.05)":"rgba(245,241,232,0.1)"}`, borderRadius:7, color:"#f5f1e8", padding:"10px", fontSize:15, fontFamily:'"JetBrains Mono",monospace', textAlign:"center", outline:"none", width:"100%" }}/>
                        <input type="number" placeholder="reps" value={r}
                          onChange={e=>updateLog(ex.name,si,"reps",e.target.value)}
                          style={{ background:"rgba(245,241,232,0.05)", border:`1px solid ${setDone?accent+"66":isExtra?"rgba(245,241,232,0.05)":"rgba(245,241,232,0.1)"}`, borderRadius:7, color:"#f5f1e8", padding:"10px", fontSize:15, fontFamily:'"JetBrains Mono",monospace', textAlign:"center", outline:"none", width:"100%" }}/>
                        <button onClick={()=>handleLogSet(ex,si)}
                          style={{ padding:"10px 6px", background:setDone?accent:"rgba(245,241,232,0.06)", color:setDone?"#0a0a0a":"rgba(245,241,232,0.4)", border:"none", borderRadius:7, fontSize:10, fontFamily:'"JetBrains Mono",monospace', letterSpacing:"0.08em", cursor:"pointer", fontWeight:600 }}>
                          {setDone?"DONE ✓":"LOG"}
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
          <StretchSection color={accent}/>
        </>
      )}

      <div style={{ margin:"16px 16px 0", padding:"12px 16px", background:"rgba(201,169,110,0.06)", border:"1px solid rgba(201,169,110,0.2)", borderRadius:10, fontSize:10, color:"#C9A96E", fontFamily:'"JetBrains Mono",monospace', letterSpacing:1, lineHeight:1.8 }}>
        TENNIS ELBOW · HOOKS ON PULLS · ANKLE STRAPS ON CABLES · NEUTRAL GRIP · STOP IF SHARP PAIN
      </div>

      {restTimer && <RestTimer seconds={restTimer.seconds} color={restTimer.color} onDone={()=>setRestTimer(null)}/>}
    </div>
  );
}

// ─── PARI TRACKER (preserved exactly) ────────────────────────────────────────
function PariTracker() {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [selectedDay, setSelectedDay]   = useState("Day 1");
  const [logs, setLogs]                 = useState({});
  const [activeExercise, setActiveExercise] = useState(null);
  const [saved, setSaved]   = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try { const res=await fetch("/api/sync/pari"); const{data}=await res.json(); setLogs(data.logs?{...data.logs}:{}); }
      catch { setLogs({}); }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try { await fetch("/api/sync/pari",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:{logs}})}); setSaved(true); setTimeout(()=>setSaved(false),2000); }
      catch {}
    })();
  }, [logs, loaded]);

  const workout = pariPlan[selectedDay];
  const getLog = (e,s,f) => logs[`${selectedWeek}|${selectedDay}|${e}|${s}`]?.[f]||"";
  const updateLog = (e,s,f,v) => { const k=`${selectedWeek}|${selectedDay}|${e}|${s}`; setLogs(p=>({...p,[k]:{...p[k],[f]:v}})); };
  const isComplete = (name) => { const ex=workout.exercises.find(e=>e.name===name); if(ex.sets===1) return !!getLog(name,0,"done"); return Array.from({length:ex.sets}).every((_,i)=>getLog(name,i,"weight")&&getLog(name,i,"reps")); };
  const totalComplete = workout.exercises.filter(e=>isComplete(e.name)).length;

  if (!loaded) return <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontFamily:"monospace", fontSize:14, letterSpacing:2 }}>LOADING...</div>;

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", fontFamily:"'Bebas Neue', Impact, sans-serif", color:"#fff", paddingBottom:80 }}>
      <div style={{ background:`linear-gradient(135deg,${workout.color}22,#0a0a0a)`, borderBottom:`2px solid ${workout.color}`, padding:"20px 16px 16px", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(10px)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, letterSpacing:4, color:workout.color, fontFamily:"monospace" }}>PARI • 360 FITNESS{saved&&<span style={{ color:"#4DFFB8" }}> • SAVED</span>}</div>
            <div style={{ fontSize:24, letterSpacing:2, marginTop:2 }}>{selectedDay} — {workout.focus}</div>
            <div style={{ fontSize:10, color:"#555", fontFamily:"monospace", letterSpacing:1, marginTop:2 }}>{workout.description.toUpperCase()}</div>
          </div>
          <div style={{ background:workout.color, color:"#000", borderRadius:"50%", width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, fontFamily:"monospace", flexShrink:0 }}>{totalComplete}/{workout.exercises.length}</div>
        </div>
        <div style={{ marginTop:10, height:3, background:"#222", borderRadius:2 }}>
          <div style={{ height:"100%", width:`${(totalComplete/workout.exercises.length)*100}%`, background:workout.color, borderRadius:2, transition:"width 0.4s ease" }}/>
        </div>
      </div>
      <div style={{ padding:"12px 16px 0", display:"flex", gap:8 }}>
        {WEEKS.map(w=><button key={w} onClick={()=>setSelectedWeek(w)} style={{ flex:1, padding:"6px 0", background:selectedWeek===w?workout.color:"#1a1a1a", color:selectedWeek===w?"#000":"#666", border:"none", borderRadius:6, fontSize:11, letterSpacing:2, cursor:"pointer", fontFamily:"'Bebas Neue', sans-serif" }}>{w}</button>)}
      </div>
      <div style={{ padding:"12px 16px 0", display:"flex", gap:8 }}>
        {Object.entries(pariPlan).map(([day,data])=>(
          <button key={day} onClick={()=>{setSelectedDay(day);setActiveExercise(null);}} style={{ flex:1, padding:"8px 0", background:selectedDay===day?data.color:"#1a1a1a", color:selectedDay===day?"#000":"#555", border:`1px solid ${selectedDay===day?data.color:"#2a2a2a"}`, borderRadius:8, fontSize:12, letterSpacing:1, cursor:"pointer", fontFamily:"'Bebas Neue', sans-serif" }}>
            {day}<div style={{ fontSize:9, fontFamily:"monospace", opacity:0.7 }}>{pariWeekDates[selectedWeek]?.[day]}</div>
          </button>
        ))}
      </div>
      <div style={{ padding:"16px 16px 0" }}>
        {workout.exercises.map((exercise,idx)=>{
          const done=isComplete(exercise.name); const expanded=activeExercise===exercise.name; const mColor=muscleColors[exercise.target]||"#888";
          return (
            <div key={exercise.name} style={{ marginBottom:10, border:`1px solid ${done?workout.color:expanded?"#333":"#1e1e1e"}`, borderRadius:12, overflow:"hidden", background:done?`${workout.color}11`:"#111" }}>
              <div onClick={()=>setActiveExercise(expanded?null:exercise.name)} style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:done?workout.color:"#1e1e1e", color:done?"#000":"#444", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, flexShrink:0 }}>{done?"✓":idx+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, letterSpacing:1, lineHeight:1.2 }}>{exercise.name}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
                    <span style={{ background:mColor+"22", color:mColor, fontSize:9, fontFamily:"monospace", letterSpacing:1, padding:"2px 8px", borderRadius:4, border:`1px solid ${mColor}44` }}>{exercise.target}</span>
                    <span style={{ fontSize:9, color:"#444", fontFamily:"monospace", letterSpacing:1 }}>{exercise.sets===1?exercise.defaultReps:`${exercise.sets} × ${exercise.defaultReps}`}</span>
                  </div>
                </div>
                <div style={{ color:"#444", fontSize:16, transition:"transform 0.2s", transform:expanded?"rotate(180deg)":"rotate(0deg)" }}>v</div>
              </div>
              {expanded && (
                <div style={{ borderTop:"1px solid #1e1e1e" }}>
                  <div style={{ padding:"20px 16px", background:"#0d0d0d", display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
                    <div style={{ width:64, height:64, borderRadius:"50%", background:mColor+"18", border:`2px solid ${mColor}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>{muscleIcon[exercise.target]||"💪"}</div>
                    <div>
                      <div style={{ fontSize:10, color:"#444", fontFamily:"monospace", letterSpacing:2 }}>TARGET MUSCLE</div>
                      <div style={{ fontSize:18, letterSpacing:2, color:mColor, marginTop:2 }}>{exercise.target}</div>
                      <div style={{ fontSize:9, color:"#444", fontFamily:"monospace", letterSpacing:1, marginTop:4 }}>{exercise.sets===1?exercise.defaultReps:`${exercise.sets} SETS • ${exercise.defaultReps} REPS`}</div>
                    </div>
                  </div>
                  {exercise.tip && (
                    <div style={{ padding:"14px 16px", background:mColor+"11", borderTop:`1px solid ${mColor}22` }}>
                      <div style={{ fontSize:9, color:mColor, letterSpacing:2, fontFamily:"monospace", marginBottom:6 }}>COACHING TIP</div>
                      <div style={{ fontSize:13, letterSpacing:0.5, lineHeight:1.6, color:"#bbb", fontFamily:"Arial, sans-serif", fontWeight:"normal" }}>{exercise.tip}</div>
                    </div>
                  )}
                  {exercise.sets>1 && (
                    <div style={{ padding:"12px 16px 16px", borderTop:"1px solid #1a1a1a" }}>
                      <div style={{ display:"grid", gridTemplateColumns:"36px 1fr 1fr", gap:8, margin:"0 0 8px" }}>
                        {["SET","KG","REPS"].map(h=><div key={h} style={{ fontSize:9, color:"#444", letterSpacing:2, fontFamily:"monospace", textAlign:"center" }}>{h}</div>)}
                      </div>
                      {Array.from({length:exercise.sets}).map((_,i)=>{
                        const w=getLog(exercise.name,i,"weight"); const r=getLog(exercise.name,i,"reps"); const setDone=w&&r;
                        const inp={background:"#1a1a1a",border:`1px solid ${setDone?workout.color+"66":"#2a2a2a"}`,borderRadius:8,color:"#fff",padding:"10px",fontSize:16,fontFamily:"'Bebas Neue',sans-serif",textAlign:"center",outline:"none",width:"100%",boxSizing:"border-box"};
                        return (
                          <div key={i} style={{ display:"grid", gridTemplateColumns:"36px 1fr 1fr", gap:8, marginBottom:8, alignItems:"center" }}>
                            <div style={{ textAlign:"center", fontSize:13, color:setDone?workout.color:"#444", fontFamily:"monospace" }}>{setDone?"✓":i+1}</div>
                            <input type="number" placeholder="kg" value={w} onChange={e=>updateLog(exercise.name,i,"weight",e.target.value)} style={inp}/>
                            <input type="number" placeholder="reps" value={r} onChange={e=>updateLog(exercise.name,i,"reps",e.target.value)} style={inp}/>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {exercise.sets===1 && (
                    <div style={{ padding:"12px 16px 16px", borderTop:"1px solid #1a1a1a" }}>
                      <button onClick={()=>updateLog(exercise.name,0,"done",getLog(exercise.name,0,"done")?"":"1")}
                        style={{ width:"100%", padding:"12px", background:getLog(exercise.name,0,"done")?workout.color:"#1a1a1a", color:getLog(exercise.name,0,"done")?"#000":"#555", border:`1px solid ${workout.color}44`, borderRadius:8, fontSize:14, letterSpacing:2, cursor:"pointer", fontFamily:"'Bebas Neue',sans-serif" }}>
                        {getLog(exercise.name,0,"done")?"✓ DONE":"MARK COMPLETE"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {totalComplete===workout.exercises.length && (
        <div style={{ margin:"20px 16px", padding:"20px", background:`linear-gradient(135deg,${workout.color}22,${workout.color}11)`, border:`1px solid ${workout.color}`, borderRadius:16, textAlign:"center" }}>
          <div style={{ fontSize:30, letterSpacing:3, color:workout.color }}>SESSION COMPLETE</div>
          <div style={{ fontSize:11, color:"#888", fontFamily:"monospace", marginTop:6, letterSpacing:2 }}>GREAT WORK PARI!</div>
        </div>
      )}
      <div style={{ margin:"16px 16px 0", padding:"12px 16px", background:"#0d1a12", border:"1px solid #34D39933", borderRadius:10, fontSize:10, color:"#34D399", fontFamily:"monospace", letterSpacing:1, lineHeight:1.8 }}>
        BEGINNER PLAN • START LIGHT • FOCUS ON FORM • ADD WEIGHT GRADUALLY EACH WEEK
      </div>
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
          <div style={{ fontSize:9, fontFamily:"monospace", color:"#555", letterSpacing:2, marginTop:6 }}>OXYGEN GYM • 4 DAYS</div>
        </div>
        <div onClick={()=>setProfile("Pari")} style={{ cursor:"pointer", width:150, padding:"32px 20px", background:"#111", border:"1px solid #E879A044", borderRadius:16, textAlign:"center" }}
          onMouseEnter={e=>e.currentTarget.style.border="1px solid #E879A0"}
          onMouseLeave={e=>e.currentTarget.style.border="1px solid #E879A044"}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"#E879A022", border:"2px solid #E879A0", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:24, color:"#E879A0" }}>P</div>
          <div style={{ fontSize:22, letterSpacing:2, color:"#E879A0" }}>PARI</div>
          <div style={{ fontSize:9, fontFamily:"monospace", color:"#555", letterSpacing:2, marginTop:6 }}>360 FITNESS • 3 DAYS</div>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <div onClick={()=>setProfile(null)} style={{ position:"fixed", top:12, right:16, zIndex:200, cursor:"pointer", fontSize:10, fontFamily:"monospace", color:"#444", letterSpacing:2, background:"#111", padding:"6px 10px", borderRadius:6, border:"1px solid #2a2a2a" }}>SWITCH</div>
      {profile==="Mansoor"?<MansoorTracker/>:<PariTracker/>}
    </div>
  );
}
