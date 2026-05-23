import { useState, useEffect, useRef } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700;900&family=Barlow+Condensed:wght@400;600;700;900&display=swap');`;

const CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Barlow',sans-serif;background:#050a14;color:#e2e8f0;min-height:100vh}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-track{background:#0d1829}
  ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:3px}
  .app{display:flex;min-height:100vh}
  .sidebar{width:240px;background:#080f1e;border-right:1px solid #0f2040;display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100;transition:transform .3s}
  .sidebar.closed{transform:translateX(-240px)}
  .logo-area{padding:20px;border-bottom:1px solid #0f2040}
  .logo{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;letter-spacing:2px;color:#fff}
  .logo span{color:#00d4ff}
  .logo-sub{font-size:10px;color:#4a7fa8;letter-spacing:3px;margin-top:2px}
  .nav-section{padding:6px 0}
  .nav-label{font-size:10px;color:#2a5070;letter-spacing:2px;font-weight:700;padding:10px 20px 3px;text-transform:uppercase}
  .nav-item{display:flex;align-items:center;gap:10px;padding:9px 20px;cursor:pointer;color:#7aa3c0;font-size:13px;font-weight:500;transition:all .2s;position:relative;border:none;background:none;width:100%;text-align:left}
  .nav-item:hover{color:#00d4ff;background:rgba(0,212,255,0.05)}
  .nav-item.active{color:#00d4ff;background:rgba(0,212,255,0.08)}
  .nav-item.active::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:#00d4ff;border-radius:0 2px 2px 0}
  .nav-icon{font-size:17px;width:20px;text-align:center}
  .main{margin-left:240px;flex:1;display:flex;flex-direction:column;min-height:100vh;transition:margin .3s}
  .main.full{margin-left:0}
  .topbar{background:#080f1e;border-bottom:1px solid #0f2040;padding:0 28px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
  .topbar-left{display:flex;align-items:center;gap:12px}
  .menu-btn{background:none;border:1px solid #1e3a5f;color:#7aa3c0;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:16px;display:flex;align-items:center}
  .page-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;letter-spacing:1px;color:#fff}
  .topbar-right{display:flex;align-items:center;gap:12px}
  .avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#0066ff,#00d4ff);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;cursor:pointer}
  .content{padding:24px 28px;flex:1}
  .stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin-bottom:22px}
  .stat-card{background:#0d1829;border:1px solid #0f2040;border-radius:12px;padding:18px;position:relative;overflow:hidden;transition:border-color .2s}
  .stat-card:hover{border-color:#1e3a5f}
  .stat-card::after{content:'';position:absolute;top:0;right:0;width:60px;height:60px;border-radius:50%;opacity:0.08;transform:translate(20px,-20px)}
  .stat-card.blue::after{background:#00d4ff}.stat-card.green::after{background:#00ff88}.stat-card.amber::after{background:#ffaa00}.stat-card.red::after{background:#ff4466}.stat-card.purple::after{background:#9966ff}
  .stat-icon{font-size:20px;margin-bottom:8px}
  .stat-val{font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:900;color:#fff;line-height:1}
  .stat-label{font-size:11px;color:#4a7fa8;margin-top:4px;letter-spacing:0.5px}
  .stat-change{font-size:11px;margin-top:5px;font-weight:600}
  .stat-change.up{color:#00ff88}.stat-change.down{color:#ff4466}
  .stat-card.blue .stat-icon{color:#00d4ff}.stat-card.green .stat-icon{color:#00ff88}.stat-card.amber .stat-icon{color:#ffaa00}.stat-card.red .stat-icon{color:#ff4466}.stat-card.purple .stat-icon{color:#9966ff}
  .section-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;color:#fff;letter-spacing:1px;margin-bottom:16px;display:flex;align-items:center;gap:8px}
  .section-title span{font-size:12px;color:#4a7fa8;font-weight:400;letter-spacing:0;font-family:'Barlow',sans-serif}
  .card{background:#0d1829;border:1px solid #0f2040;border-radius:12px;padding:18px}
  .card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .card-title{font-size:13px;font-weight:600;color:#a0c0d8}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
  @media(max-width:1000px){.grid-3,.grid-4{grid-template-columns:1fr 1fr}}
  @media(max-width:750px){.grid-2,.grid-3,.grid-4{grid-template-columns:1fr}.sidebar{transform:translateX(-240px)}.main{margin-left:0}}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:none;cursor:pointer;font-size:13px;font-weight:600;font-family:'Barlow',sans-serif;transition:all .2s;letter-spacing:0.3px}
  .btn-primary{background:linear-gradient(135deg,#0066ff,#00d4ff);color:#fff}
  .btn-primary:hover{opacity:0.9;transform:translateY(-1px)}
  .btn-outline{background:transparent;color:#00d4ff;border:1px solid #00d4ff22;padding:7px 14px}
  .btn-outline:hover{background:rgba(0,212,255,0.08);border-color:#00d4ff55}
  .btn-danger{background:rgba(255,68,102,0.15);color:#ff4466;border:1px solid rgba(255,68,102,0.2)}
  .btn-danger:hover{background:rgba(255,68,102,0.25)}
  .btn-sm{padding:5px 11px;font-size:12px}
  .btn-success{background:rgba(0,255,136,0.12);color:#00ff88;border:1px solid rgba(0,255,136,0.2)}
  .btn-success:hover{background:rgba(0,255,136,0.2)}
  .btn-amber{background:rgba(255,170,0,0.12);color:#ffaa00;border:1px solid rgba(255,170,0,0.2)}
  .btn-purple{background:rgba(153,102,255,0.12);color:#9966ff;border:1px solid rgba(153,102,255,0.2)}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.5px}
  .badge-active{background:rgba(0,255,136,0.12);color:#00ff88;border:1px solid rgba(0,255,136,0.2)}
  .badge-inactive{background:rgba(255,68,102,0.12);color:#ff4466;border:1px solid rgba(255,68,102,0.2)}
  .badge-pending{background:rgba(255,170,0,0.12);color:#ffaa00;border:1px solid rgba(255,170,0,0.2)}
  .badge-blue{background:rgba(0,212,255,0.12);color:#00d4ff;border:1px solid rgba(0,212,255,0.2)}
  .badge-purple{background:rgba(153,102,255,0.12);color:#9966ff;border:1px solid rgba(153,102,255,0.2)}
  table{width:100%;border-collapse:collapse}
  th{font-size:11px;color:#4a7fa8;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:9px 13px;border-bottom:1px solid #0f2040;text-align:left}
  td{padding:11px 13px;font-size:13px;color:#a0c0d8;border-bottom:1px solid #0a1520}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:rgba(0,212,255,0.03);color:#e2e8f0}
  .table-wrap{overflow-x:auto}
  .form-group{margin-bottom:14px}
  label{display:block;font-size:11px;color:#4a7fa8;font-weight:600;letter-spacing:0.5px;margin-bottom:5px;text-transform:uppercase}
  input,select,textarea{width:100%;background:#06101e;border:1px solid #0f2040;color:#e2e8f0;padding:9px 13px;border-radius:8px;font-size:13px;font-family:'Barlow',sans-serif;outline:none;transition:border-color .2s}
  input:focus,select:focus,textarea:focus{border-color:#00d4ff44}
  select option{background:#0d1829}
  input::placeholder,textarea::placeholder{color:#2a5070}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  @media(max-width:600px){.form-row{grid-template-columns:1fr}}
  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
  .modal{background:#0d1829;border:1px solid #1e3a5f;border-radius:16px;padding:24px;width:100%;max-width:540px;max-height:92vh;overflow-y:auto}
  .modal-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;color:#fff;letter-spacing:1px}
  .progress-bar{background:#0a1520;border-radius:4px;height:6px;overflow:hidden}
  .progress-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#0066ff,#00d4ff);transition:width .5s}
  .avatar-lg{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;flex-shrink:0}
  .trainer-card{background:#0d1829;border:1px solid #0f2040;border-radius:12px;padding:18px;transition:all .25s;cursor:pointer}
  .trainer-card:hover{border-color:#00d4ff33;transform:translateY(-2px)}
  .schedule-slot{background:#06101e;border:1px solid #0f2040;border-radius:8px;padding:11px;margin-bottom:7px;cursor:pointer;transition:all .2s}
  .schedule-slot:hover{border-color:#00d4ff33;background:#0a1520}
  .payment-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid #0a1520}
  .payment-row:last-child{border-bottom:none}
  .att-day{aspect-ratio:1;border-radius:4px;background:#0a1520;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;transition:background .2s}
  .att-day.present{background:rgba(0,255,136,0.25);color:#00ff88}
  .att-day.absent{background:rgba(255,68,102,0.12);color:#ff446688}
  .att-day.today{border:1px solid #00d4ff;color:#00d4ff}
  .neon-line{height:1px;background:linear-gradient(90deg,transparent,#00d4ff44,transparent);margin:16px 0}
  .tab-bar{display:flex;gap:4px;background:#06101e;border-radius:10px;padding:4px;margin-bottom:18px;flex-wrap:wrap}
  .tab-btn{padding:6px 14px;border-radius:7px;border:none;cursor:pointer;font-size:13px;font-weight:600;font-family:'Barlow',sans-serif;transition:all .2s;color:#4a7fa8;background:transparent;white-space:nowrap}
  .tab-btn.active{background:#0d1829;color:#00d4ff}
  .member-pic{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
  .hero-bar{background:linear-gradient(135deg,#06101e,#0d1829);border:1px solid #0f2040;border-radius:12px;padding:22px 26px;margin-bottom:22px;display:flex;align-items:center;justify-content:space-between;overflow:hidden;position:relative}
  .hero-bar::after{content:'IRON PEAK';position:absolute;right:-10px;top:50%;transform:translateY(-50%);font-family:'Barlow Condensed',sans-serif;font-size:80px;font-weight:900;color:rgba(0,212,255,0.04);letter-spacing:4px;white-space:nowrap;pointer-events:none}
  .hero-text h2{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;color:#fff;letter-spacing:1px}
  .hero-text p{font-size:13px;color:#4a7fa8;margin-top:3px}
  .chart-wrap{position:relative;width:100%;height:210px}
  .notification-dot{width:7px;height:7px;background:#ff4466;border-radius:50%;position:absolute;top:2px;right:2px;animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  .search-bar{background:#06101e;border:1px solid #0f2040;border-radius:8px;padding:7px 13px;display:flex;align-items:center;gap:8px}
  .search-bar input{background:transparent;border:none;color:#e2e8f0;font-size:13px;flex:1;outline:none}
  .search-bar input::placeholder{color:#2a5070}
  .empty-state{text-align:center;padding:40px;color:#2a5070}
  .empty-state .icon{font-size:36px;margin-bottom:10px}
  .empty-state p{font-size:14px}
  .notif-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #0a1520;cursor:pointer;transition:background .2s}
  .notif-item:hover{background:rgba(0,212,255,0.03)}
  .notif-item:last-child{border-bottom:none}
  .notif-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px}
  .equip-card{background:#0d1829;border:1px solid #0f2040;border-radius:12px;padding:16px;transition:all .2s}
  .equip-card:hover{border-color:#1e3a5f}
  .workout-exercise{background:#06101e;border:1px solid #0f2040;border-radius:8px;padding:10px 13px;margin-bottom:7px;display:flex;align-items:center;justify-content:space-between}
  .leaderboard-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #0a1520}
  .leaderboard-row:last-child{border-bottom:none}
  .rank-badge{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0}
  .bmi-meter{position:relative;height:12px;border-radius:6px;overflow:hidden;background:linear-gradient(90deg,#0066ff 0%,#00cc88 25%,#ffaa00 50%,#ff6600 75%,#ff4466 100%)}
  .bmi-needle{position:absolute;top:-3px;width:3px;height:18px;background:#fff;border-radius:2px;transform:translateX(-50%);transition:left .5s}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-in{animation:fadeIn .3s ease}
  .ring-container{position:relative;display:inline-flex;align-items:center;justify-content:center}
  .ring-label{position:absolute;text-align:center}
  .star{color:#ffaa00}
`;

const initMembers = [
  {id:1,name:"Marcus Chen",email:"marcus@email.com",phone:"555-0101",membership:"Premium",status:"Active",joined:"2024-01-15",expiry:"2025-01-15",trainer:1,attendance:85,payments:[{date:"2024-01-15",amount:120,status:"Paid"},{date:"2024-02-15",amount:120,status:"Paid"}],weight:82,height:178,age:28},
  {id:2,name:"Sophia Williams",email:"sophia@email.com",phone:"555-0102",membership:"Basic",status:"Active",joined:"2024-02-01",expiry:"2025-02-01",trainer:2,attendance:72,payments:[{date:"2024-02-01",amount:60,status:"Paid"},{date:"2024-03-01",amount:60,status:"Pending"}],weight:61,height:165,age:24},
  {id:3,name:"James Rodriguez",email:"james@email.com",phone:"555-0103",membership:"Elite",status:"Active",joined:"2024-03-10",expiry:"2025-03-10",trainer:1,attendance:91,payments:[{date:"2024-03-10",amount:200,status:"Paid"}],weight:95,height:183,age:32},
  {id:4,name:"Aisha Johnson",email:"aisha@email.com",phone:"555-0104",membership:"Premium",status:"Inactive",joined:"2023-12-01",expiry:"2024-06-01",trainer:3,attendance:44,payments:[{date:"2023-12-01",amount:120,status:"Paid"},{date:"2024-01-01",amount:120,status:"Overdue"}],weight:57,height:162,age:26},
  {id:5,name:"Tyler Brooks",email:"tyler@email.com",phone:"555-0105",membership:"Basic",status:"Active",joined:"2024-04-05",expiry:"2025-04-05",trainer:2,attendance:68,payments:[{date:"2024-04-05",amount:60,status:"Paid"}],weight:88,height:180,age:30},
  {id:6,name:"Leila Patel",email:"leila@email.com",phone:"555-0106",membership:"Elite",status:"Active",joined:"2024-02-20",expiry:"2025-02-20",trainer:1,attendance:95,payments:[{date:"2024-02-20",amount:200,status:"Paid"},{date:"2024-03-20",amount:200,status:"Paid"}],weight:55,height:160,age:22},
  {id:7,name:"David Kim",email:"david@email.com",phone:"555-0107",membership:"Elite",status:"Active",joined:"2024-01-10",expiry:"2025-01-10",trainer:2,attendance:88,payments:[{date:"2024-01-10",amount:200,status:"Paid"}],weight:78,height:175,age:35},
  {id:8,name:"Fatima Al-Rashid",email:"fatima@email.com",phone:"555-0108",membership:"Premium",status:"Active",joined:"2024-03-01",expiry:"2025-03-01",trainer:3,attendance:76,payments:[{date:"2024-03-01",amount:120,status:"Paid"}],weight:63,height:168,age:29},
];

const initTrainers = [
  {id:1,name:"Coach Alex",specialty:"Strength & Conditioning",rating:4.9,clients:12,experience:"8 yrs",availability:"Mon-Fri",bio:"Expert in powerlifting and muscle-building programs.",sessions:48},
  {id:2,name:"Jordan Lee",specialty:"HIIT & Cardio",rating:4.7,clients:9,experience:"5 yrs",availability:"Tue-Sat",bio:"High-energy cardio coach focused on fat loss and endurance.",sessions:36},
  {id:3,name:"Priya Sharma",specialty:"Yoga & Flexibility",rating:4.8,clients:11,experience:"6 yrs",availability:"Mon-Thu",bio:"Certified yoga instructor specializing in mobility and recovery.",sessions:42},
];

const initSchedule = [
  {id:1,name:"Morning HIIT",trainer:2,time:"06:00 AM",duration:"45 min",day:"Monday",capacity:15,enrolled:12,type:"HIIT"},
  {id:2,name:"Power Lifting",trainer:1,time:"08:00 AM",duration:"60 min",day:"Monday",capacity:10,enrolled:7,type:"Strength"},
  {id:3,name:"Yoga Flow",trainer:3,time:"10:00 AM",duration:"60 min",day:"Tuesday",capacity:12,enrolled:10,type:"Yoga"},
  {id:4,name:"Cardio Burn",trainer:2,time:"06:00 PM",duration:"45 min",day:"Wednesday",capacity:20,enrolled:18,type:"Cardio"},
  {id:5,name:"Core & Flex",trainer:3,time:"07:00 AM",duration:"45 min",day:"Thursday",capacity:15,enrolled:8,type:"Yoga"},
  {id:6,name:"Strength Circuit",trainer:1,time:"05:00 PM",duration:"60 min",day:"Friday",capacity:12,enrolled:11,type:"Strength"},
];

const initEquipment = [
  {id:1,name:"Treadmill Pro X5",category:"Cardio",quantity:8,working:7,condition:"Good",lastMaintenance:"2024-05-01",nextMaintenance:"2024-08-01",cost:2400},
  {id:2,name:"Olympic Barbell Set",category:"Weights",quantity:12,working:12,condition:"Excellent",lastMaintenance:"2024-04-15",nextMaintenance:"2024-07-15",cost:800},
  {id:3,name:"Rowing Machine",category:"Cardio",quantity:4,working:3,condition:"Fair",lastMaintenance:"2024-03-20",nextMaintenance:"2024-06-20",cost:1800},
  {id:4,name:"Cable Machine",category:"Strength",quantity:6,working:6,condition:"Excellent",lastMaintenance:"2024-05-10",nextMaintenance:"2024-08-10",cost:3200},
  {id:5,name:"Dumbbells (5-50kg)",category:"Weights",quantity:30,working:28,condition:"Good",lastMaintenance:"2024-04-01",nextMaintenance:"2024-07-01",cost:500},
  {id:6,name:"Spin Bike Elite",category:"Cardio",quantity:15,working:13,condition:"Fair",lastMaintenance:"2024-03-01",nextMaintenance:"2024-06-01",cost:1200},
  {id:7,name:"Smith Machine",category:"Strength",quantity:3,working:3,condition:"Good",lastMaintenance:"2024-05-05",nextMaintenance:"2024-08-05",cost:4500},
  {id:8,name:"Pull-up Station",category:"Bodyweight",quantity:5,working:5,condition:"Excellent",lastMaintenance:"2024-04-20",nextMaintenance:"2024-07-20",cost:600},
];

const initWorkoutPlans = [
  {id:1,name:"Beginner Fat Loss",level:"Beginner",duration:"8 weeks",goal:"Fat Loss",assignedTo:[2,5],exercises:[{name:"Treadmill Walk",sets:1,reps:"30 min",rest:"—"},{name:"Bodyweight Squats",sets:3,reps:15,rest:"60s"},{name:"Push-ups",sets:3,reps:10,rest:"60s"},{name:"Plank Hold",sets:3,reps:"30s",rest:"45s"}]},
  {id:2,name:"Strength Builder Pro",level:"Intermediate",duration:"12 weeks",goal:"Muscle Gain",assignedTo:[1,3,7],exercises:[{name:"Barbell Squat",sets:5,reps:5,rest:"3 min"},{name:"Deadlift",sets:4,reps:6,rest:"3 min"},{name:"Bench Press",sets:5,reps:5,rest:"2 min"},{name:"Overhead Press",sets:4,reps:8,rest:"2 min"},{name:"Pull-ups",sets:4,reps:8,rest:"90s"}]},
  {id:3,name:"Elite Performance",level:"Advanced",duration:"16 weeks",goal:"Athletic",assignedTo:[6],exercises:[{name:"Power Clean",sets:5,reps:3,rest:"3 min"},{name:"Front Squat",sets:5,reps:5,rest:"3 min"},{name:"Romanian DL",sets:4,reps:8,rest:"2 min"},{name:"Box Jumps",sets:4,reps:10,rest:"90s"},{name:"Battle Ropes",sets:3,reps:"45s",rest:"60s"}]},
  {id:4,name:"Yoga & Recovery",level:"Beginner",duration:"4 weeks",goal:"Flexibility",assignedTo:[4,8],exercises:[{name:"Sun Salutation",sets:3,reps:"5 cycles",rest:"30s"},{name:"Pigeon Pose",sets:2,reps:"2 min/side",rest:"—"},{name:"Cat-Cow Stretch",sets:3,reps:10,rest:"30s"}]},
];

const initNotifications = [
  {id:1,type:"alert",title:"Membership Expiring Soon",body:"6 members have memberships expiring within 30 days. Send renewal reminders.",time:"2 hrs ago",read:false},
  {id:2,type:"payment",title:"Overdue Payment Detected",body:"Aisha Johnson's February payment is 45 days overdue — $120 pending.",time:"5 hrs ago",read:false},
  {id:3,type:"maintenance",title:"Rowing Machine #3 Down",body:"Rowing machine unit 3 is flagged for maintenance. Check equipment log.",time:"1 day ago",read:false},
  {id:4,type:"success",title:"Monthly Revenue Target Hit",body:"Gym crossed $80,000 revenue target for the month. Great performance!",time:"2 days ago",read:true},
  {id:5,type:"info",title:"New Class Added",body:"Priya Sharma added 'Core & Flex' Thursday 7AM. 8/15 spots filled.",time:"3 days ago",read:true},
  {id:6,type:"alert",title:"Spin Bikes Need Attention",body:"2 spin bikes out of 15 are currently out of service. Schedule repair.",time:"3 days ago",read:true},
  {id:7,type:"success",title:"New Member Milestone",body:"Iron Peak crossed 300 total members! Growth rate is up 18% YoY.",time:"5 days ago",read:true},
  {id:8,type:"info",title:"Trainer Schedule Updated",body:"Jordan Lee updated availability — now available Saturdays until 4PM.",time:"1 week ago",read:true},
];

const monthlyRevenue=[52000,58000,61000,55000,67000,72000,69000,75000,71000,80000,83000,91000];
const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const memberGrowth=[120,145,162,170,188,205,220,238,255,270,288,310];

const getAvatarColor=(name)=>{const colors=["#0066ff","#9966ff","#ff6600","#00cc88","#ff3366","#0099ff","#cc6600","#006699"];let h=0;for(let c of name)h+=c.charCodeAt(0);return colors[h%colors.length]};
const calcBMI=(w,h)=>(w/((h/100)**2)).toFixed(1);
const getBMICategory=(bmi)=>{if(bmi<18.5)return{label:"Underweight",color:"#00d4ff"};if(bmi<25)return{label:"Normal",color:"#00ff88"};if(bmi<30)return{label:"Overweight",color:"#ffaa00"};return{label:"Obese",color:"#ff4466"}};
const getBMIPct=(bmi)=>Math.min(100,Math.max(0,((bmi-15)/25)*100));

function NavItem({icon,label,active,onClick,badge}){
  return(
    <button className={`nav-item${active?" active":""}`} onClick={onClick}>
      <span className="nav-icon">{icon}</span>
      <span style={{flex:1}}>{label}</span>
      {badge&&<span style={{background:"#ff4466",color:"#fff",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:10,minWidth:18,textAlign:"center"}}>{badge}</span>}
    </button>
  );
}

function StatCard({icon,val,label,change,type,color}){
  return(
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-val">{val}</div>
      <div className="stat-label">{label}</div>
      {change&&<div className={`stat-change ${type}`}>{type==="up"?"▲":"▼"} {change}</div>}
    </div>
  );
}

function Badge({status}){
  const cls={Active:"badge-active",Inactive:"badge-inactive",Pending:"badge-pending",Paid:"badge-active",Overdue:"badge-inactive",Expired:"badge-inactive",Good:"badge-active",Excellent:"badge-active",Fair:"badge-pending","Out of Service":"badge-inactive",Beginner:"badge-blue",Intermediate:"badge-amber",Advanced:"badge-purple"}[status]||"badge-blue";
  return <span className={`badge ${cls}`}>{status}</span>;
}

function Modal({title,onClose,children}){
  return(
    <div className="modal-bg" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="modal fade-in">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div className="modal-title">{title}</div>
          <button onClick={onClose} className="btn btn-outline btn-sm">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── DASHBOARD ── */
function Dashboard({members,trainers,schedule,notifications}){
  const active=members.filter(m=>m.status==="Active").length;
  const revenue=members.reduce((s,m)=>s+({Basic:60,Premium:120,Elite:200}[m.membership]||0),0);
  const unread=notifications.filter(n=>!n.read).length;
  const canvasRef=useRef(null);const canvas2Ref=useRef(null);

  useEffect(()=>{
    const load=()=>{
      if(canvasRef.current&&!canvasRef.current._ch){
        canvasRef.current._ch=new window.Chart(canvasRef.current,{type:"bar",data:{labels:months,datasets:[{label:"Revenue",data:monthlyRevenue,backgroundColor:months.map((_,i)=>i===11?"rgba(0,212,255,0.85)":"rgba(0,102,255,0.5)"),borderRadius:4,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:"#4a7fa8",font:{size:10}},grid:{color:"#0a1520"}},y:{ticks:{color:"#4a7fa8",font:{size:10},callback:v=>"$"+(v/1000)+"k"},grid:{color:"#0a1520"}}}}});
      }
      if(canvas2Ref.current&&!canvas2Ref.current._ch){
        canvas2Ref.current._ch=new window.Chart(canvas2Ref.current,{type:"line",data:{labels:months,datasets:[{label:"Members",data:memberGrowth,borderColor:"#00d4ff",backgroundColor:"rgba(0,212,255,0.07)",fill:true,tension:0.4,pointBackgroundColor:"#00d4ff",pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:"#4a7fa8",font:{size:10}},grid:{display:false}},y:{ticks:{color:"#4a7fa8",font:{size:10}},grid:{color:"#0a1520"}}}}});
      }
    };
    if(!window.Chart){const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";s.onload=load;document.head.appendChild(s);}else load();
    return()=>{canvasRef.current?._ch?.destroy();canvas2Ref.current?._ch?.destroy()};
  },[]);

  return(
    <div className="fade-in">
      <div className="hero-bar">
        <div className="hero-text">
          <h2>⚡ Welcome back, Admin</h2>
          <p>Iron Peak Fitness — {new Date().toLocaleDateString("en",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</p>
        </div>
        <div style={{display:"flex",gap:10,position:"relative",zIndex:1,flexWrap:"wrap",justifyContent:"flex-end"}}>
          {[["🔔",`${unread} alerts`,"#ff4466"],["👥",`${members.length} members`,"#00d4ff"],["💰",`$${revenue.toLocaleString()}/mo`,"#00ff88"]].map(([icon,txt,c])=>(
            <div key={txt} style={{background:"#06101e",border:`1px solid ${c}22`,borderRadius:8,padding:"8px 14px",textAlign:"center"}}>
              <div style={{fontSize:16}}>{icon}</div>
              <div style={{fontSize:11,color:c,fontWeight:600,marginTop:2}}>{txt}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon="👥" val={members.length} label="Total Members" change="12% this month" type="up" color="blue"/>
        <StatCard icon="✅" val={active} label="Active Members" change="8% this month" type="up" color="green"/>
        <StatCard icon="💰" val={`$${revenue.toLocaleString()}`} label="Monthly Revenue" change="5% vs last month" type="up" color="amber"/>
        <StatCard icon="🏋️" val={trainers.length} label="Trainers" change="" type="" color="red"/>
        <StatCard icon="📅" val={schedule.length} label="Weekly Classes" change="2 new" type="up" color="blue"/>
        <StatCard icon="🔔" val={unread} label="Unread Alerts" change="" type="" color="purple"/>
      </div>

      <div className="grid-2" style={{marginBottom:16}}>
        <div className="card">
          <div className="card-header"><div className="card-title">📈 Monthly Revenue</div><span style={{fontSize:12,color:"#00d4ff",fontWeight:600}}>2024</span></div>
          <div className="chart-wrap"><canvas ref={canvasRef} role="img" aria-label="Monthly revenue bar chart">Revenue Jan–Dec 2024.</canvas></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">👥 Member Growth</div><span style={{fontSize:12,color:"#00d4ff",fontWeight:600}}>310 total</span></div>
          <div className="chart-wrap"><canvas ref={canvas2Ref} role="img" aria-label="Member growth line chart">Growth Jan–Dec 2024.</canvas></div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">🆕 Recent Members</div></div>
          {members.slice(-5).reverse().map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #0a1520"}}>
              <div className="member-pic" style={{background:getAvatarColor(m.name)}}>{m.name.split(" ").map(x=>x[0]).join("")}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{m.name}</div>
                <div style={{fontSize:11,color:"#4a7fa8"}}>{m.membership} · Joined {m.joined}</div>
              </div>
              <Badge status={m.status}/>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">🔔 Recent Alerts</div></div>
          {notifications.slice(0,4).map(n=>(
            <div key={n.id} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #0a1520"}}>
              <div className="notif-dot" style={{background:{alert:"#ff4466",payment:"#ffaa00",maintenance:"#ff6600",success:"#00ff88",info:"#00d4ff"}[n.type]||"#00d4ff",marginTop:4}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:n.read?"#4a7fa8":"#e2e8f0"}}>{n.title}</div>
                <div style={{fontSize:11,color:"#2a5070",marginTop:2}}>{n.time}</div>
              </div>
              {!n.read&&<div style={{width:7,height:7,background:"#ff4466",borderRadius:"50%",marginTop:5,flexShrink:0}}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── MEMBERS ── */
function Members({members,setMembers,trainers}){
  const [showModal,setShowModal]=useState(false);
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("All");
  const [form,setForm]=useState({name:"",email:"",phone:"",membership:"Basic",trainer:1,weight:70,height:170,age:25});
  const [selectedMember,setSelectedMember]=useState(null);

  const filtered=members.filter(m=>{
    const q=search.toLowerCase();
    return(m.name.toLowerCase().includes(q)||m.email.toLowerCase().includes(q))&&(filter==="All"||m.status===filter||m.membership===filter);
  });

  const handleAdd=()=>{
    if(!form.name||!form.email)return;
    const now=new Date();const exp=new Date(now);exp.setFullYear(exp.getFullYear()+1);
    setMembers([...members,{id:members.length+1,...form,status:"Active",joined:now.toISOString().split("T")[0],expiry:exp.toISOString().split("T")[0],attendance:0,payments:[{date:now.toISOString().split("T")[0],amount:{Basic:60,Premium:120,Elite:200}[form.membership],status:"Paid"}]}]);
    setForm({name:"",email:"",phone:"",membership:"Basic",trainer:1,weight:70,height:170,age:25});
    setShowModal(false);
  };

  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div className="section-title">👥 Members <span>{filtered.length} records</span></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ Add Member</button>
      </div>
      <div className="card" style={{marginBottom:14}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <div className="search-bar" style={{flex:1,minWidth:180}}>
            <span style={{color:"#4a7fa8"}}>🔍</span>
            <input placeholder="Search name or email…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} style={{width:"auto",padding:"7px 13px"}}>
            <option>All</option><option>Active</option><option>Inactive</option><option>Basic</option><option>Premium</option><option>Elite</option>
          </select>
        </div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Member</th><th>Plan</th><th>BMI</th><th>Trainer</th><th>Expiry</th><th>Attendance</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(m=>{
                const bmi=calcBMI(m.weight,m.height);
                const cat=getBMICategory(bmi);
                return(
                  <tr key={m.id}>
                    <td><div style={{display:"flex",alignItems:"center",gap:9}}>
                      <div className="member-pic" style={{background:getAvatarColor(m.name)}}>{m.name.split(" ").map(x=>x[0]).join("")}</div>
                      <div><div style={{fontWeight:600,color:"#e2e8f0",fontSize:13}}>{m.name}</div><div style={{fontSize:11,color:"#4a7fa8"}}>{m.email}</div></div>
                    </div></td>
                    <td><span className="badge badge-blue">{m.membership}</span></td>
                    <td><span style={{fontWeight:700,color:cat.color,fontSize:13}}>{bmi}</span><span style={{fontSize:10,color:"#4a7fa8",marginLeft:4}}>{cat.label}</span></td>
                    <td style={{color:"#a0c0d8"}}>{trainers.find(t=>t.id===m.trainer)?.name||"—"}</td>
                    <td>{m.expiry}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <div style={{flex:1,minWidth:50}}><div className="progress-bar"><div className="progress-fill" style={{width:`${m.attendance}%`,background:m.attendance>80?"linear-gradient(90deg,#00aa55,#00ff88)":m.attendance>50?"linear-gradient(90deg,#aa7700,#ffaa00)":"linear-gradient(90deg,#aa2233,#ff4466)"}}/></div></div>
                        <span style={{fontSize:11,color:"#a0c0d8"}}>{m.attendance}%</span>
                      </div>
                    </td>
                    <td><Badge status={m.status}/></td>
                    <td><div style={{display:"flex",gap:5}}>
                      <button className="btn btn-outline btn-sm" onClick={()=>setSelectedMember(m)}>View</button>
                      <button className={`btn btn-sm ${m.status==="Active"?"btn-danger":"btn-success"}`} onClick={()=>setMembers(members.map(x=>x.id===m.id?{...x,status:x.status==="Active"?"Inactive":"Active"}:x))}>{m.status==="Active"?"Off":"On"}</button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal&&(
        <Modal title="➕ Register New Member" onClose={()=>setShowModal(false)}>
          <div className="form-row"><div className="form-group"><label>Full Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="John Doe"/></div><div className="form-group"><label>Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="john@email.com"/></div></div>
          <div className="form-row"><div className="form-group"><label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="555-0000"/></div><div className="form-group"><label>Membership Plan</label><select value={form.membership} onChange={e=>setForm({...form,membership:e.target.value})}><option>Basic</option><option>Premium</option><option>Elite</option></select></div></div>
          <div className="form-row"><div className="form-group"><label>Weight (kg)</label><input type="number" value={form.weight} onChange={e=>setForm({...form,weight:+e.target.value})}/></div><div className="form-group"><label>Height (cm)</label><input type="number" value={form.height} onChange={e=>setForm({...form,height:+e.target.value})}/></div></div>
          <div className="form-row"><div className="form-group"><label>Age</label><input type="number" value={form.age} onChange={e=>setForm({...form,age:+e.target.value})}/></div><div className="form-group"><label>Assign Trainer</label><select value={form.trainer} onChange={e=>setForm({...form,trainer:+e.target.value})}>{trainers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div></div>
          <div style={{background:"#06101e",borderRadius:8,padding:11,marginBottom:14,fontSize:12,color:"#4a7fa8"}}>
            💳 Plan: <strong style={{color:"#00d4ff"}}>{form.membership}</strong> — ${({Basic:60,Premium:120,Elite:200})[form.membership]}/month · BMI: <strong style={{color:getBMICategory(calcBMI(form.weight,form.height)).color}}>{calcBMI(form.weight,form.height)} ({getBMICategory(calcBMI(form.weight,form.height)).label})</strong>
          </div>
          <button className="btn btn-primary" style={{width:"100%"}} onClick={handleAdd}>Register Member</button>
        </Modal>
      )}

      {selectedMember&&(
        <Modal title={`👤 ${selectedMember.name}`} onClose={()=>setSelectedMember(null)}>
          <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:18}}>
            <div className="avatar-lg" style={{background:getAvatarColor(selectedMember.name),width:56,height:56,fontSize:20}}>{selectedMember.name.split(" ").map(x=>x[0]).join("")}</div>
            <div><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{selectedMember.name}</div><div style={{fontSize:12,color:"#4a7fa8"}}>{selectedMember.email}</div><div style={{marginTop:5}}><Badge status={selectedMember.status}/></div></div>
          </div>
          <div className="grid-2" style={{marginBottom:14}}>
            {[["Plan",<span className="badge badge-blue">{selectedMember.membership}</span>],["Trainer",trainers.find(t=>t.id===selectedMember.trainer)?.name],["Joined",selectedMember.joined],["Expiry",selectedMember.expiry],["Weight",`${selectedMember.weight} kg`],["Height",`${selectedMember.height} cm`]].map(([k,v])=>(
              <div key={k} style={{background:"#06101e",borderRadius:8,padding:11}}><div style={{fontSize:10,color:"#4a7fa8",marginBottom:3}}>{k.toUpperCase()}</div><div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{v}</div></div>
            ))}
          </div>
          <div style={{background:"#06101e",borderRadius:8,padding:12,marginBottom:14}}>
            <div style={{fontSize:11,color:"#4a7fa8",marginBottom:8}}>BMI — {calcBMI(selectedMember.weight,selectedMember.height)} <span style={{color:getBMICategory(calcBMI(selectedMember.weight,selectedMember.height)).color}}>({getBMICategory(calcBMI(selectedMember.weight,selectedMember.height)).label})</span></div>
            <div className="bmi-meter"><div className="bmi-needle" style={{left:`${getBMIPct(calcBMI(selectedMember.weight,selectedMember.height))}%`}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#4a7fa8",marginTop:4}}><span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span></div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:"#4a7fa8",marginBottom:6}}>ATTENDANCE</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}><div className="progress-bar" style={{flex:1}}><div className="progress-fill" style={{width:`${selectedMember.attendance}%`}}/></div><span style={{fontSize:14,fontWeight:700,color:"#00d4ff"}}>{selectedMember.attendance}%</span></div>
          </div>
          <div style={{fontSize:11,color:"#4a7fa8",marginBottom:7}}>PAYMENT HISTORY</div>
          {selectedMember.payments.map((p,i)=>(
            <div key={i} className="payment-row"><span style={{fontSize:12,color:"#a0c0d8"}}>{p.date}</span><span style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>${p.amount}</span><Badge status={p.status}/></div>
          ))}
        </Modal>
      )}
    </div>
  );
}

/* ── TRAINERS ── */
function Trainers({trainers,setTrainers}){
  const [showModal,setShowModal]=useState(false);
  const [selected,setSelected]=useState(null);
  const [form,setForm]=useState({name:"",specialty:"",experience:"",availability:"",bio:""});
  const specColors={"Strength & Conditioning":"#ff6600","HIIT & Cardio":"#ff3366","Yoga & Flexibility":"#9966ff",Cardio:"#00cc88",Strength:"#ff6600"};

  const handleAdd=()=>{if(!form.name)return;setTrainers([...trainers,{id:trainers.length+1,...form,rating:4.5,clients:0,sessions:0}]);setForm({name:"",specialty:"",experience:"",availability:"",bio:""});setShowModal(false);};

  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div className="section-title">🏅 Trainers <span>{trainers.length} coaches</span></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ Add Trainer</button>
      </div>
      <div className="grid-3">
        {trainers.map(t=>{
          const c=specColors[t.specialty]||"#00d4ff";
          return(
            <div key={t.id} className="trainer-card" onClick={()=>setSelected(t)}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:13}}>
                <div className="avatar-lg" style={{background:getAvatarColor(t.name)}}>{t.name.split(" ").map(x=>x[0]).join("")}</div>
                <div><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{t.name}</div><div style={{fontSize:10,marginTop:3,padding:"2px 8px",borderRadius:20,display:"inline-block",background:c+"22",color:c,fontWeight:700}}>{t.specialty}</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:12}}>
                {[["⭐",t.rating,"Rating"],["👥",t.clients,"Clients"],["📅",t.sessions,"Sessions"]].map(([icon,v,label])=>(
                  <div key={label} style={{textAlign:"center",background:"#06101e",borderRadius:7,padding:"7px 4px"}}>
                    <div>{icon}</div><div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{v}</div><div style={{fontSize:9,color:"#4a7fa8"}}>{label}</div>
                  </div>
                ))}
              </div>
              <div className="neon-line"/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#4a7fa8"}}><span>🕐 {t.experience}</span><span>📆 {t.availability}</span></div>
            </div>
          );
        })}
      </div>
      {showModal&&(
        <Modal title="➕ Add Trainer" onClose={()=>setShowModal(false)}>
          <div className="form-row"><div className="form-group"><label>Full Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Coach Name"/></div><div className="form-group"><label>Specialty</label><input value={form.specialty} onChange={e=>setForm({...form,specialty:e.target.value})} placeholder="e.g. Strength & Conditioning"/></div></div>
          <div className="form-row"><div className="form-group"><label>Experience</label><input value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} placeholder="e.g. 5 yrs"/></div><div className="form-group"><label>Availability</label><input value={form.availability} onChange={e=>setForm({...form,availability:e.target.value})} placeholder="e.g. Mon-Fri"/></div></div>
          <div className="form-group"><label>Bio</label><textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="Brief description…" style={{height:70,resize:"vertical"}}/></div>
          <button className="btn btn-primary" style={{width:"100%"}} onClick={handleAdd}>Add Trainer</button>
        </Modal>
      )}
      {selected&&(
        <Modal title={`🏋️ ${selected.name}`} onClose={()=>setSelected(null)}>
          <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:18}}>
            <div className="avatar-lg" style={{background:getAvatarColor(selected.name),width:60,height:60,fontSize:20}}>{selected.name.split(" ").map(x=>x[0]).join("")}</div>
            <div><div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{selected.name}</div><div style={{fontSize:12,color:"#4a7fa8",marginTop:2}}>{selected.specialty}</div><div style={{marginTop:5,fontSize:13,color:"#ffaa00"}}>{"★".repeat(Math.round(selected.rating))} {selected.rating}</div></div>
          </div>
          <div style={{background:"#06101e",borderRadius:8,padding:11,marginBottom:13,fontSize:13,color:"#a0c0d8",lineHeight:1.6}}>{selected.bio}</div>
          <div className="grid-2">{[["Experience",selected.experience],["Availability",selected.availability],["Active Clients",selected.clients],["Sessions Run",selected.sessions]].map(([k,v])=>(<div key={k} style={{background:"#06101e",borderRadius:8,padding:11}}><div style={{fontSize:10,color:"#4a7fa8",marginBottom:3}}>{k.toUpperCase()}</div><div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{v}</div></div>))}</div>
        </Modal>
      )}
    </div>
  );
}

/* ── SCHEDULE ── */
function Schedule({schedule,setSchedule,trainers}){
  const [showModal,setShowModal]=useState(false);
  const [form,setForm]=useState({name:"",trainer:1,time:"06:00 AM",duration:"60 min",day:"Monday",capacity:15,type:"Strength"});
  const [activeDay,setActiveDay]=useState("All");
  const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const typeColors={Strength:"#ff6600",HIIT:"#ff3366",Cardio:"#00cc88",Yoga:"#9966ff",Pilates:"#0099ff",CrossFit:"#ffaa00"};
  const filtered=activeDay==="All"?schedule:schedule.filter(s=>s.day===activeDay);
  const enroll=id=>setSchedule(schedule.map(s=>s.id===id&&s.enrolled<s.capacity?{...s,enrolled:s.enrolled+1}:s));
  const handleAdd=()=>{if(!form.name)return;setSchedule([...schedule,{id:schedule.length+1,...form,enrolled:0}]);setForm({name:"",trainer:1,time:"06:00 AM",duration:"60 min",day:"Monday",capacity:15,type:"Strength"});setShowModal(false);};

  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div className="section-title">📅 Class Schedule <span>{schedule.length} classes</span></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ Add Class</button>
      </div>
      <div className="tab-bar">{["All",...days].map(d=><button key={d} className={`tab-btn${activeDay===d?" active":""}`} onClick={()=>setActiveDay(d)}>{d.substring(0,3)}</button>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:13}}>
        {filtered.map(s=>{
          const trainer=trainers.find(t=>t.id===s.trainer);
          const pct=(s.enrolled/s.capacity)*100;const isFull=s.enrolled>=s.capacity;const c=typeColors[s.type]||"#00d4ff";
          return(
            <div key={s.id} className="card" style={{borderLeft:`3px solid ${c}`,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:12,right:13,fontSize:10,padding:"3px 8px",borderRadius:20,background:c+"22",color:c,fontWeight:700}}>{s.type}</div>
              <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:3,paddingRight:65}}>{s.name}</div>
              <div style={{fontSize:12,color:"#4a7fa8",marginBottom:11}}>with {trainer?.name||"TBD"} · {s.day} {s.time}</div>
              <div style={{display:"flex",gap:12,marginBottom:11,fontSize:11,color:"#7aa3c0"}}><span>⏱ {s.duration}</span><span>👥 {s.enrolled}/{s.capacity}</span></div>
              <div className="progress-bar" style={{marginBottom:11}}><div className="progress-fill" style={{width:`${pct}%`,background:isFull?"linear-gradient(90deg,#aa2233,#ff4466)":pct>80?"linear-gradient(90deg,#aa7700,#ffaa00)":undefined}}/></div>
              <button className={`btn btn-sm ${isFull?"btn-danger":"btn-success"}`} style={{width:"100%"}} onClick={()=>enroll(s.id)} disabled={isFull}>{isFull?"Full — Waitlist":"Enroll Now"}</button>
            </div>
          );
        })}
        {filtered.length===0&&<div className="empty-state" style={{gridColumn:"1/-1"}}><div className="icon">📅</div><p>No classes for this day.</p></div>}
      </div>
      {showModal&&(
        <Modal title="➕ Add New Class" onClose={()=>setShowModal(false)}>
          <div className="form-row"><div className="form-group"><label>Class Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Morning HIIT"/></div><div className="form-group"><label>Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{["Strength","HIIT","Cardio","Yoga","Pilates","CrossFit"].map(t=><option key={t}>{t}</option>)}</select></div></div>
          <div className="form-row"><div className="form-group"><label>Trainer</label><select value={form.trainer} onChange={e=>setForm({...form,trainer:+e.target.value})}>{trainers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div><div className="form-group"><label>Day</label><select value={form.day} onChange={e=>setForm({...form,day:e.target.value})}>{days.map(d=><option key={d}>{d}</option>)}</select></div></div>
          <div className="form-row"><div className="form-group"><label>Time</label><input value={form.time} onChange={e=>setForm({...form,time:e.target.value})} placeholder="06:00 AM"/></div><div className="form-group"><label>Duration</label><input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} placeholder="45 min"/></div></div>
          <div className="form-group"><label>Capacity</label><input type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:+e.target.value})} min={1} max={50}/></div>
          <button className="btn btn-primary" style={{width:"100%"}} onClick={handleAdd}>Create Class</button>
        </Modal>
      )}
    </div>
  );
}

/* ── ATTENDANCE ── */
function Attendance({members}){
  const [selected,setSelected]=useState(members[0]);
  const today=new Date();const todayDay=today.getDate();const daysInMonth=new Date(today.getFullYear(),today.getMonth()+1,0).getDate();
  const getAtt=(m)=>{const t=todayDay;const p=Math.round((m.attendance/100)*t);const days={};let a=0;for(let d=1;d<=t;d++){if(a<p&&Math.random()<(m.attendance/100)*1.5){days[d]="present";a++;}else{days[d]="absent";}}return days;};
  const attDays=getAtt(selected);
  const dayNames=["S","M","T","W","T","F","S"];

  return(
    <div className="fade-in">
      <div className="section-title">📊 Attendance Management</div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title" style={{marginBottom:13}}>Select Member</div>
          {members.map(m=>(
            <div key={m.id} onClick={()=>setSelected(m)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:8,cursor:"pointer",background:selected?.id===m.id?"rgba(0,212,255,0.08)":"transparent",border:selected?.id===m.id?"1px solid #00d4ff33":"1px solid transparent",marginBottom:4,transition:"all .2s"}}>
              <div className="member-pic" style={{background:getAvatarColor(m.name)}}>{m.name.split(" ").map(x=>x[0]).join("")}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{m.name}</div><div style={{fontSize:11,color:"#4a7fa8"}}>{m.membership}</div></div>
              <div style={{fontSize:13,fontWeight:700,color:m.attendance>80?"#00ff88":m.attendance>50?"#ffaa00":"#ff4466"}}>{m.attendance}%</div>
            </div>
          ))}
        </div>
        {selected&&(
          <div>
            <div className="card" style={{marginBottom:13}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <div className="avatar-lg" style={{background:getAvatarColor(selected.name)}}>{selected.name.split(" ").map(x=>x[0]).join("")}</div>
                <div><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{selected.name}</div><div style={{fontSize:12,color:"#4a7fa8"}}>{selected.membership} Member</div></div>
              </div>
              <div className="grid-3" style={{gap:7,marginBottom:14}}>
                {[["Present",Math.round((selected.attendance/100)*todayDay),"#00ff88"],["Absent",todayDay-Math.round((selected.attendance/100)*todayDay),"#ff4466"],["Rate",`${selected.attendance}%`,"#00d4ff"]].map(([l,v,c])=>(
                  <div key={l} style={{background:"#06101e",borderRadius:8,padding:"9px 6px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:900,color:c,fontFamily:"'Barlow Condensed',sans-serif"}}>{v}</div><div style={{fontSize:10,color:"#4a7fa8",marginTop:2}}>{l}</div></div>
                ))}
              </div>
              <div className="neon-line"/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:7}}>
                {dayNames.map((d,i)=><div key={i} style={{textAlign:"center",fontSize:9,color:"#2a5070",fontWeight:700,padding:"2px 0"}}>{d}</div>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
                {Array.from({length:daysInMonth},(_,i)=>{const d=i+1;const status=d>todayDay?"future":attDays[d];return(<div key={d} className={`att-day ${d===todayDay?"today":status==="future"?"":status}`} style={{opacity:d>todayDay?0.2:1}}><span style={{fontSize:9}}>{d}</span></div>);})}
              </div>
            </div>
            <div className="card"><div className="card-title" style={{marginBottom:11}}>Weekly Rate</div>
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day=>{
                const rate=Math.min(100,Math.max(0,selected.attendance+(Math.random()-.5)*30));
                return(<div key={day} style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
                  <div style={{width:28,fontSize:11,color:"#4a7fa8",fontWeight:600}}>{day}</div>
                  <div className="progress-bar" style={{flex:1}}><div className="progress-fill" style={{width:`${rate}%`,background:rate>80?"linear-gradient(90deg,#00aa55,#00ff88)":rate>50?"linear-gradient(90deg,#aa7700,#ffaa00)":"linear-gradient(90deg,#aa2233,#ff4466)"}}/></div>
                  <div style={{width:32,fontSize:11,color:"#a0c0d8",textAlign:"right"}}>{Math.round(rate)}%</div>
                </div>);
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── PAYMENTS ── */
function Payments({members}){
  const canvasRef=useRef(null);
  const allPayments=members.flatMap(m=>m.payments.map(p=>({...p,member:m.name,membership:m.membership})));
  const totalRevenue=allPayments.filter(p=>p.status==="Paid").reduce((s,p)=>s+p.amount,0);
  const totalPending=allPayments.filter(p=>p.status==="Pending").reduce((s,p)=>s+p.amount,0);
  const totalOverdue=allPayments.filter(p=>p.status==="Overdue").reduce((s,p)=>s+p.amount,0);

  useEffect(()=>{
    const load=()=>{if(canvasRef.current&&!canvasRef.current._ch){canvasRef.current._ch=new window.Chart(canvasRef.current,{type:"doughnut",data:{labels:["Paid","Pending","Overdue"],datasets:[{data:[totalRevenue,totalPending,totalOverdue],backgroundColor:["rgba(0,255,136,0.85)","rgba(255,170,0,0.85)","rgba(255,68,102,0.85)"],borderWidth:0,hoverOffset:8}]},options:{responsive:true,maintainAspectRatio:false,cutout:"72%",plugins:{legend:{display:false}}}});}};
    if(!window.Chart){const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";s.onload=load;document.head.appendChild(s);}else load();
    return()=>{canvasRef.current?._ch?.destroy()};
  },[]);

  return(
    <div className="fade-in">
      <div className="section-title">💰 Payment Tracking</div>
      <div className="stat-grid" style={{marginBottom:18}}>
        <StatCard icon="💵" val={`$${totalRevenue.toLocaleString()}`} label="Total Collected" change="" type="" color="green"/>
        <StatCard icon="⏳" val={`$${totalPending}`} label="Pending" change="" type="" color="amber"/>
        <StatCard icon="⚠️" val={`$${totalOverdue}`} label="Overdue" change="" type="" color="red"/>
        <StatCard icon="📊" val={allPayments.length} label="Transactions" change="" type="" color="blue"/>
      </div>
      <div className="grid-2" style={{marginBottom:14}}>
        <div className="card">
          <div className="card-header"><div className="card-title">Revenue Breakdown</div></div>
          <div className="chart-wrap" style={{height:190}}><canvas ref={canvasRef} role="img" aria-label="Payment doughnut chart">Paid, pending, overdue breakdown.</canvas></div>
          <div style={{display:"flex",justifyContent:"center",gap:18,marginTop:10}}>
            {[["Paid","#00ff88",totalRevenue],["Pending","#ffaa00",totalPending],["Overdue","#ff4466",totalOverdue]].map(([l,c,v])=>(
              <div key={l} style={{textAlign:"center"}}><div style={{width:10,height:10,borderRadius:2,background:c,margin:"0 auto 3px"}}/><div style={{fontSize:10,color:"#4a7fa8"}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>${v}</div></div>
            ))}
          </div>
        </div>
        <div className="card"><div className="card-header"><div className="card-title">Recent Transactions</div></div><div style={{maxHeight:260,overflowY:"auto"}}>{allPayments.slice(0,10).map((p,i)=>(<div key={i} className="payment-row"><div><div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{p.member}</div><div style={{fontSize:10,color:"#4a7fa8"}}>{p.date} · {p.membership}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>${p.amount}</div><Badge status={p.status}/></div></div>))}</div></div>
      </div>
      <div className="card"><div className="card-header"><div className="card-title">All Transactions</div></div><div className="table-wrap"><table><thead><tr><th>Member</th><th>Plan</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>{allPayments.map((p,i)=>(<tr key={i}><td style={{fontWeight:600,color:"#e2e8f0"}}>{p.member}</td><td><span className="badge badge-blue">{p.membership}</span></td><td>{p.date}</td><td style={{fontWeight:700,color:"#fff"}}>${p.amount}</td><td><Badge status={p.status}/></td></tr>))}</tbody></table></div></div>
    </div>
  );
}

/* ── WORKOUT PLANS (NEW) ── */
function WorkoutPlans({plans,setPlans,members}){
  const [selected,setSelected]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [form,setForm]=useState({name:"",level:"Beginner",duration:"8 weeks",goal:"Fat Loss",exercises:[]});
  const [exForm,setExForm]=useState({name:"",sets:3,reps:12,rest:"60s"});
  const levels=["Beginner","Intermediate","Advanced"];
  const goals=["Fat Loss","Muscle Gain","Athletic","Endurance","Flexibility","General Fitness"];
  const levelColors={Beginner:"#00cc88",Intermediate:"#ffaa00",Advanced:"#ff4466"};

  const addExercise=()=>{if(!exForm.name)return;setForm(f=>({...f,exercises:[...f.exercises,{...exForm}]}));setExForm({name:"",sets:3,reps:12,rest:"60s"});};
  const handleCreate=()=>{if(!form.name)return;setPlans([...plans,{id:plans.length+1,...form,assignedTo:[]}]);setForm({name:"",level:"Beginner",duration:"8 weeks",goal:"Fat Loss",exercises:[]});setShowModal(false);};

  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div className="section-title">💪 Workout Plans <span>{plans.length} programs</span></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ Create Plan</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {plans.map(p=>{
          const c=levelColors[p.level]||"#00d4ff";
          const assignedMembers=members.filter(m=>p.assignedTo.includes(m.id));
          return(
            <div key={p.id} className="card" style={{borderTop:`3px solid ${c}`,cursor:"pointer",transition:"border-color .2s"}} onClick={()=>setSelected(p)}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                <div><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{p.name}</div><div style={{fontSize:11,color:"#4a7fa8",marginTop:3}}>{p.goal} · {p.duration}</div></div>
                <Badge status={p.level}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                {[["🏋️",p.exercises.length,"Exercises"],["👥",p.assignedTo.length,"Members"]].map(([icon,v,label])=>(
                  <div key={label} style={{background:"#06101e",borderRadius:8,padding:"8px 10px",display:"flex",alignItems:"center",gap:7}}>
                    <span>{icon}</span><div><div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{v}</div><div style={{fontSize:10,color:"#4a7fa8"}}>{label}</div></div>
                  </div>
                ))}
              </div>
              <div className="neon-line"/>
              <div style={{fontSize:11,color:"#4a7fa8"}}>Exercises: {p.exercises.slice(0,3).map(e=>e.name).join(", ")}{p.exercises.length>3?"…":""}</div>
              {assignedMembers.length>0&&(
                <div style={{display:"flex",gap:-4,marginTop:8,alignItems:"center"}}>
                  {assignedMembers.slice(0,5).map(m=>(
                    <div key={m.id} style={{width:22,height:22,borderRadius:"50%",background:getAvatarColor(m.name),border:"2px solid #0d1829",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"#fff",marginRight:-6,zIndex:1}}>{m.name[0]}</div>
                  ))}
                  {assignedMembers.length>5&&<span style={{fontSize:10,color:"#4a7fa8",marginLeft:12}}>+{assignedMembers.length-5}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal&&(
        <Modal title="💪 Create Workout Plan" onClose={()=>setShowModal(false)}>
          <div className="form-row"><div className="form-group"><label>Plan Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Strength Builder"/></div><div className="form-group"><label>Duration</label><input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} placeholder="e.g. 8 weeks"/></div></div>
          <div className="form-row"><div className="form-group"><label>Level</label><select value={form.level} onChange={e=>setForm({...form,level:e.target.value})}>{levels.map(l=><option key={l}>{l}</option>)}</select></div><div className="form-group"><label>Goal</label><select value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})}>{goals.map(g=><option key={g}>{g}</option>)}</select></div></div>
          <div className="neon-line"/>
          <div style={{fontSize:12,color:"#4a7fa8",marginBottom:10,fontWeight:600}}>ADD EXERCISES</div>
          <div className="form-row" style={{gridTemplateColumns:"2fr 1fr 1fr 1fr"}}>
            <input value={exForm.name} onChange={e=>setExForm({...exForm,name:e.target.value})} placeholder="Exercise name"/>
            <input type="number" value={exForm.sets} onChange={e=>setExForm({...exForm,sets:+e.target.value})} placeholder="Sets" min={1}/>
            <input value={exForm.reps} onChange={e=>setExForm({...exForm,reps:e.target.value})} placeholder="Reps"/>
            <input value={exForm.rest} onChange={e=>setExForm({...exForm,rest:e.target.value})} placeholder="Rest"/>
          </div>
          <button className="btn btn-outline btn-sm" onClick={addExercise} style={{marginBottom:10}}>+ Add Exercise</button>
          {form.exercises.map((e,i)=>(
            <div key={i} className="workout-exercise">
              <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{e.name}</div>
              <div style={{fontSize:11,color:"#4a7fa8"}}>{e.sets} sets × {e.reps} · rest {e.rest}</div>
            </div>
          ))}
          {form.exercises.length===0&&<div style={{fontSize:12,color:"#2a5070",textAlign:"center",padding:"10px 0"}}>No exercises yet.</div>}
          <div className="neon-line"/>
          <button className="btn btn-primary" style={{width:"100%"}} onClick={handleCreate}>Create Plan</button>
        </Modal>
      )}

      {selected&&(
        <Modal title={`💪 ${selected.name}`} onClose={()=>setSelected(null)}>
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
            <Badge status={selected.level}/><span className="badge badge-blue">{selected.goal}</span><span className="badge badge-blue">{selected.duration}</span>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:"#4a7fa8",marginBottom:10,fontWeight:600,letterSpacing:1}}>EXERCISES</div>
            <table style={{width:"100%"}}>
              <thead><tr><th style={{padding:"7px 10px"}}>Exercise</th><th style={{padding:"7px 10px"}}>Sets</th><th style={{padding:"7px 10px"}}>Reps</th><th style={{padding:"7px 10px"}}>Rest</th></tr></thead>
              <tbody>{selected.exercises.map((e,i)=>(<tr key={i}><td style={{padding:"9px 10px",fontWeight:600,color:"#e2e8f0"}}>{e.name}</td><td style={{padding:"9px 10px"}}>{e.sets}</td><td style={{padding:"9px 10px"}}>{e.reps}</td><td style={{padding:"9px 10px"}}>{e.rest}</td></tr>))}</tbody>
            </table>
          </div>
          <div style={{fontSize:11,color:"#4a7fa8",marginBottom:8,fontWeight:600,letterSpacing:1}}>ASSIGNED MEMBERS ({selected.assignedTo.length})</div>
          {members.filter(m=>selected.assignedTo.includes(m.id)).map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:"1px solid #0a1520"}}>
              <div className="member-pic" style={{background:getAvatarColor(m.name)}}>{m.name.split(" ").map(x=>x[0]).join("")}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{m.name}</div><div style={{fontSize:11,color:"#4a7fa8"}}>{m.membership}</div></div>
              <Badge status={m.status}/>
            </div>
          ))}
          {selected.assignedTo.length===0&&<div style={{fontSize:12,color:"#2a5070",padding:"10px 0"}}>No members assigned yet.</div>}
        </Modal>
      )}
    </div>
  );
}

/* ── EQUIPMENT (NEW) ── */
function Equipment({equipment,setEquipment}){
  const [showModal,setShowModal]=useState(false);
  const [filter,setFilter]=useState("All");
  const [form,setForm]=useState({name:"",category:"Cardio",quantity:1,working:1,condition:"Good",lastMaintenance:"",nextMaintenance:"",cost:0});
  const categories=["All","Cardio","Weights","Strength","Bodyweight"];
  const condColors={Excellent:"#00ff88",Good:"#00d4ff",Fair:"#ffaa00","Out of Service":"#ff4466"};
  const filtered=filter==="All"?equipment:equipment.filter(e=>e.category===filter);
  const totalWorking=equipment.reduce((s,e)=>s+e.working,0);
  const totalUnits=equipment.reduce((s,e)=>s+e.quantity,0);
  const needsMaintenance=equipment.filter(e=>new Date(e.nextMaintenance)<new Date()).length;

  const handleAdd=()=>{if(!form.name)return;setEquipment([...equipment,{id:equipment.length+1,...form}]);setForm({name:"",category:"Cardio",quantity:1,working:1,condition:"Good",lastMaintenance:"",nextMaintenance:"",cost:0});setShowModal(false);};

  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div className="section-title">🔧 Equipment Manager <span>{equipment.length} items</span></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ Add Equipment</button>
      </div>
      <div className="stat-grid" style={{marginBottom:18}}>
        <StatCard icon="🏋️" val={equipment.length} label="Equipment Types" change="" type="" color="blue"/>
        <StatCard icon="✅" val={totalWorking} label="Units Working" change="" type="" color="green"/>
        <StatCard icon="⚠️" val={totalUnits-totalWorking} label="Out of Service" change="" type="" color="red"/>
        <StatCard icon="🔧" val={needsMaintenance} label="Maintenance Due" change="" type="" color="amber"/>
      </div>

      <div className="tab-bar">{categories.map(c=><button key={c} className={`tab-btn${filter===c?" active":""}`} onClick={()=>setFilter(c)}>{c}</button>)}</div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:13}}>
        {filtered.map(e=>{
          const pct=Math.round((e.working/e.quantity)*100);
          const c=condColors[e.condition]||"#00d4ff";
          const overdue=new Date(e.nextMaintenance)<new Date();
          return(
            <div key={e.id} className="equip-card">
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                <div><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{e.name}</div><div style={{fontSize:11,color:"#4a7fa8",marginTop:2}}>{e.category}</div></div>
                <Badge status={e.condition}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                {[["Total",e.quantity,"units"],["Working",e.working,"active"]].map(([l,v,sub])=>(
                  <div key={l} style={{background:"#06101e",borderRadius:8,padding:"8px 10px"}}>
                    <div style={{fontSize:18,fontWeight:900,color:l==="Working"?c:"#e2e8f0",fontFamily:"'Barlow Condensed',sans-serif"}}>{v}</div>
                    <div style={{fontSize:10,color:"#4a7fa8"}}>{l} {sub}</div>
                  </div>
                ))}
              </div>
              <div className="progress-bar" style={{marginBottom:10}}>
                <div className="progress-fill" style={{width:`${pct}%`,background:pct>80?"linear-gradient(90deg,#00aa55,#00ff88)":pct>60?"linear-gradient(90deg,#aa7700,#ffaa00)":"linear-gradient(90deg,#aa2233,#ff4466)"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#4a7fa8"}}>
                <span>🔧 Last: {e.lastMaintenance||"N/A"}</span>
                <span style={{color:overdue?"#ff4466":"#4a7fa8"}}>Next: {e.nextMaintenance||"N/A"}{overdue?" ⚠️":""}</span>
              </div>
            </div>
          );
        })}
      </div>

      {showModal&&(
        <Modal title="🔧 Add Equipment" onClose={()=>setShowModal(false)}>
          <div className="form-row"><div className="form-group"><label>Equipment Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Treadmill Pro"/></div><div className="form-group"><label>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{["Cardio","Weights","Strength","Bodyweight"].map(c=><option key={c}>{c}</option>)}</select></div></div>
          <div className="form-row"><div className="form-group"><label>Total Units</label><input type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:+e.target.value})} min={1}/></div><div className="form-group"><label>Working Units</label><input type="number" value={form.working} onChange={e=>setForm({...form,working:+e.target.value})} min={0}/></div></div>
          <div className="form-row"><div className="form-group"><label>Condition</label><select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})}><option>Excellent</option><option>Good</option><option>Fair</option><option>Out of Service</option></select></div><div className="form-group"><label>Cost per Unit ($)</label><input type="number" value={form.cost} onChange={e=>setForm({...form,cost:+e.target.value})}/></div></div>
          <div className="form-row"><div className="form-group"><label>Last Maintenance</label><input type="date" value={form.lastMaintenance} onChange={e=>setForm({...form,lastMaintenance:e.target.value})}/></div><div className="form-group"><label>Next Maintenance</label><input type="date" value={form.nextMaintenance} onChange={e=>setForm({...form,nextMaintenance:e.target.value})}/></div></div>
          <button className="btn btn-primary" style={{width:"100%"}} onClick={handleAdd}>Add Equipment</button>
        </Modal>
      )}
    </div>
  );
}

/* ── BODY METRICS / BMI (NEW) ── */
function BodyMetrics({members}){
  const [selected,setSelected]=useState(members[0]);
  const [histTab,setHistTab]=useState("weight");

  const bmi=selected?calcBMI(selected.weight,selected.height):0;
  const cat=selected?getBMICategory(bmi):{label:"—",color:"#4a7fa8"};
  const pct=getBMIPct(bmi);

  const mockHistory={
    weight:[82,83,81,80,79,78,77,78],
    bmi:[25.9,26.2,25.6,25.3,24.9,24.6,24.3,24.6],
    labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"]
  };

  const canvasRef=useRef(null);
  useEffect(()=>{
    if(!selected)return;
    const load=()=>{
      if(canvasRef.current){
        canvasRef.current._ch?.destroy();
        const isW=histTab==="weight";
        canvasRef.current._ch=new window.Chart(canvasRef.current,{
          type:"line",
          data:{labels:mockHistory.labels,datasets:[{label:isW?"Weight (kg)":"BMI",data:isW?mockHistory.weight:mockHistory.bmi,borderColor:isW?"#00d4ff":"#9966ff",backgroundColor:isW?"rgba(0,212,255,0.07)":"rgba(153,102,255,0.07)",fill:true,tension:0.4,pointBackgroundColor:isW?"#00d4ff":"#9966ff",pointRadius:4}]},
          options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:"#4a7fa8",font:{size:10}},grid:{display:false}},y:{ticks:{color:"#4a7fa8",font:{size:10}},grid:{color:"#0a1520"}}}}
        });
      }
    };
    if(!window.Chart){const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";s.onload=load;document.head.appendChild(s);}else load();
    return()=>{canvasRef.current?._ch?.destroy()};
  },[selected,histTab]);

  const idealWeight=selected?((22*(selected.height/100)**2)).toFixed(1):0;
  const weightDiff=selected?(selected.weight-idealWeight).toFixed(1):0;

  return(
    <div className="fade-in">
      <div className="section-title">📐 Body Metrics & BMI Tracker</div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title" style={{marginBottom:13}}>Select Member</div>
          {members.map(m=>{
            const b=calcBMI(m.weight,m.height);const ct=getBMICategory(b);
            return(
              <div key={m.id} onClick={()=>setSelected(m)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:8,cursor:"pointer",background:selected?.id===m.id?"rgba(0,212,255,0.08)":"transparent",border:selected?.id===m.id?"1px solid #00d4ff33":"1px solid transparent",marginBottom:4,transition:"all .2s"}}>
                <div className="member-pic" style={{background:getAvatarColor(m.name)}}>{m.name.split(" ").map(x=>x[0]).join("")}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{m.name}</div><div style={{fontSize:11,color:"#4a7fa8"}}>{m.weight}kg · {m.height}cm</div></div>
                <span style={{fontSize:13,fontWeight:700,color:ct.color}}>{b}</span>
              </div>
            );
          })}
        </div>

        {selected&&(
          <div>
            <div className="card" style={{marginBottom:13}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div className="avatar-lg" style={{background:getAvatarColor(selected.name)}}>{selected.name.split(" ").map(x=>x[0]).join("")}</div>
                <div><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{selected.name}</div><div style={{fontSize:12,color:"#4a7fa8"}}>{selected.age} yrs · {selected.membership}</div></div>
              </div>

              <div className="grid-4" style={{gap:8,marginBottom:14}}>
                {[["⚖️",selected.weight+"kg","Weight"],["📏",selected.height+"cm","Height"],["🔢",bmi,"BMI"],["🎯",cat.label,"Category"]].map(([icon,v,label])=>(
                  <div key={label} style={{background:"#06101e",borderRadius:8,padding:"10px 8px",textAlign:"center"}}>
                    <div style={{fontSize:15}}>{icon}</div>
                    <div style={{fontSize:label==="BMI"?18:13,fontWeight:700,color:label==="BMI"||label==="Category"?cat.color:"#e2e8f0",fontFamily:"'Barlow Condensed',sans-serif"}}>{v}</div>
                    <div style={{fontSize:9,color:"#4a7fa8",marginTop:2}}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#4a7fa8",marginBottom:6}}>
                  <span>BMI Scale</span><span style={{color:cat.color,fontWeight:700}}>{bmi} — {cat.label}</span>
                </div>
                <div className="bmi-meter"><div className="bmi-needle" style={{left:`${pct}%`}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#2a5070",marginTop:4}}>
                  <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
                </div>
              </div>

              <div className="neon-line"/>
              <div className="grid-2" style={{gap:8}}>
                {[["🎯 Ideal Weight",`${idealWeight} kg`,"Based on BMI 22"],["⬆️ Difference",`${weightDiff > 0 ? '+' : ''}${weightDiff} kg`,weightDiff > 0 ? "Above ideal" : weightDiff < 0 ? "Below ideal" : "At ideal"]].map(([t,v,sub])=>(
                  <div key={t} style={{background:"#06101e",borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:11,color:"#4a7fa8",marginBottom:3}}>{t}</div>
                    <div style={{fontSize:16,fontWeight:900,color:t.includes("Diff")?Math.abs(weightDiff)>5?"#ffaa00":"#00ff88":"#00d4ff",fontFamily:"'Barlow Condensed',sans-serif"}}>{v}</div>
                    <div style={{fontSize:10,color:"#4a7fa8"}}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">📈 Progress History</div>
                <div style={{display:"flex",gap:5}}>
                  {["weight","bmi"].map(t=><button key={t} className={`tab-btn btn-sm${histTab===t?" active":""}`} onClick={()=>setHistTab(t)} style={{padding:"4px 10px",fontSize:11}}>{t.toUpperCase()}</button>)}
                </div>
              </div>
              <div className="chart-wrap" style={{height:160}}><canvas ref={canvasRef} role="img" aria-label="Body metric trend chart">Weight and BMI history over months.</canvas></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── LEADERBOARD (NEW) ── */
function Leaderboard({members,schedule}){
  const [metric,setMetric]=useState("attendance");
  const metrics={attendance:{label:"Attendance Rate",key:"attendance",unit:"%",icon:"📊"},points:{label:"Points (simulated)",key:"points",unit:"pts",icon:"⭐"},streak:{label:"Current Streak",key:"streak",unit:"days",icon:"🔥"}};

  const enriched=members.map((m,i)=>({...m,points:Math.round(m.attendance*10+Math.random()*500),streak:Math.floor(Math.random()*30)+1}));
  const sorted=[...enriched].sort((a,b)=>b[metric]-(a[metric]));

  const topColors=["#ffd700","#c0c0c0","#cd7f32"];
  const topIcons=["🥇","🥈","🥉"];

  const canvasRef=useRef(null);
  useEffect(()=>{
    const load=()=>{
      if(canvasRef.current){
        canvasRef.current._ch?.destroy();
        const top8=sorted.slice(0,8);
        canvasRef.current._ch=new window.Chart(canvasRef.current,{
          type:"bar",
          data:{labels:top8.map(m=>m.name.split(" ")[0]),datasets:[{data:top8.map(m=>m[metric]),backgroundColor:top8.map((_,i)=>i===0?"rgba(255,215,0,0.8)":i===1?"rgba(192,192,192,0.8)":i===2?"rgba(205,127,50,0.8)":"rgba(0,102,255,0.5)"),borderRadius:5,borderSkipped:false}]},
          options:{responsive:true,maintainAspectRatio:false,indexAxis:"y",plugins:{legend:{display:false}},scales:{x:{ticks:{color:"#4a7fa8",font:{size:10}},grid:{color:"#0a1520"}},y:{ticks:{color:"#a0c0d8",font:{size:11,weight:"600"}},grid:{display:false}}}}
        });
      }
    };
    if(!window.Chart){const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";s.onload=load;document.head.appendChild(s);}else load();
    return()=>{canvasRef.current?._ch?.destroy()};
  },[metric,sorted]);

  return(
    <div className="fade-in">
      <div className="section-title">🏆 Member Leaderboard</div>
      <div style={{background:"linear-gradient(135deg,#06101e,#0d1829)",border:"1px solid #0f2040",borderRadius:12,padding:"20px 24px",marginBottom:18,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:"#fff"}}>🏆 Top Performers</div>
          <div style={{fontSize:12,color:"#4a7fa8",marginTop:3}}>Ranked by {metrics[metric].label.toLowerCase()}</div>
        </div>
        <div style={{display:"flex",gap:7}}>
          {Object.entries(metrics).map(([k,v])=>(
            <button key={k} className={`btn btn-sm${metric===k?" btn-primary":" btn-outline"}`} onClick={()=>setMetric(k)}>{v.icon} {v.label.split(" ")[0]}</button>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{marginBottom:16}}>
        <div className="card">
          {sorted.slice(0,3).map((m,i)=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:13,padding:"14px",borderRadius:10,marginBottom:8,background:i===0?"rgba(255,215,0,0.06)":i===1?"rgba(192,192,192,0.04)":"rgba(205,127,50,0.04)",border:`1px solid ${topColors[i]}22`}}>
              <div style={{fontSize:26}}>{topIcons[i]}</div>
              <div className="member-pic" style={{background:getAvatarColor(m.name),width:40,height:40,fontSize:14}}>{m.name.split(" ").map(x=>x[0]).join("")}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{m.name}</div>
                <div style={{fontSize:11,color:"#4a7fa8"}}>{m.membership} Member</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:900,color:topColors[i],fontFamily:"'Barlow Condensed',sans-serif"}}>{m[metric]}{metrics[metric].unit}</div>
                <div style={{fontSize:10,color:"#4a7fa8"}}>{metrics[metric].label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">📊 All Rankings</div></div>
          <div className="chart-wrap" style={{height:240}}><canvas ref={canvasRef} role="img" aria-label="Member ranking horizontal bar chart">Member leaderboard rankings.</canvas></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Full Rankings</div></div>
        {sorted.map((m,i)=>(
          <div key={m.id} className="leaderboard-row">
            <div className="rank-badge" style={{background:i<3?topColors[i]+"22":"#06101e",color:i<3?topColors[i]:"#4a7fa8",border:`1px solid ${i<3?topColors[i]+"44":"#0f2040"}`}}>{i<3?topIcons[i]:`#${i+1}`}</div>
            <div className="member-pic" style={{background:getAvatarColor(m.name)}}>{m.name.split(" ").map(x=>x[0]).join("")}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{m.name}</div><div style={{fontSize:11,color:"#4a7fa8"}}>{m.membership}</div></div>
            <div style={{minWidth:80}}>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${(m[metric]/sorted[0][metric])*100}%`,background:i===0?"linear-gradient(90deg,#aa8800,#ffd700)":i===1?"linear-gradient(90deg,#888,#c0c0c0)":i===2?"linear-gradient(90deg,#7a4010,#cd7f32)":undefined}}/></div>
            </div>
            <div style={{fontSize:14,fontWeight:900,color:i<3?topColors[i]:"#e2e8f0",fontFamily:"'Barlow Condensed',sans-serif",minWidth:60,textAlign:"right"}}>{m[metric]}{metrics[metric].unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── NOTIFICATIONS (NEW) ── */
function Notifications({notifications,setNotifications}){
  const [filter,setFilter]=useState("All");
  const unread=notifications.filter(n=>!n.read).length;
  const typeIcons={alert:"⚠️",payment:"💳",maintenance:"🔧",success:"✅",info:"ℹ️"};
  const typeColors={alert:"#ff4466",payment:"#ffaa00",maintenance:"#ff6600",success:"#00ff88",info:"#00d4ff"};

  const filtered=filter==="All"?notifications:filter==="Unread"?notifications.filter(n=>!n.read):notifications.filter(n=>n.type===filter);
  const markAll=()=>setNotifications(notifications.map(n=>({...n,read:true})));
  const markOne=id=>setNotifications(notifications.map(n=>n.id===id?{...n,read:true}:n));
  const dismiss=id=>setNotifications(notifications.filter(n=>n.id!==id));

  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div className="section-title">🔔 Notifications <span>{unread} unread</span></div>
        {unread>0&&<button className="btn btn-outline btn-sm" onClick={markAll}>Mark all read</button>}
      </div>

      <div className="stat-grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",marginBottom:18}}>
        {[["⚠️",notifications.filter(n=>n.type==="alert").length,"Alerts","red"],["💳",notifications.filter(n=>n.type==="payment").length,"Payments","amber"],["🔧",notifications.filter(n=>n.type==="maintenance").length,"Maintenance","amber"],["✅",notifications.filter(n=>n.type==="success").length,"Success","green"],["🔕",notifications.filter(n=>n.read).length,"Read","blue"]].map(([icon,v,label,color])=>(
          <div key={label} className={`stat-card ${color}`}><div className="stat-icon">{icon}</div><div className="stat-val">{v}</div><div className="stat-label">{label}</div></div>
        ))}
      </div>

      <div className="tab-bar">{["All","Unread","alert","payment","maintenance","success","info"].map(f=><button key={f} className={`tab-btn${filter===f?" active":""}`} onClick={()=>setFilter(f)} style={{textTransform:"capitalize"}}>{f}</button>)}</div>

      <div className="card">
        {filtered.length===0&&<div className="empty-state"><div className="icon">🔔</div><p>No notifications in this category.</p></div>}
        {filtered.map(n=>(
          <div key={n.id} className="notif-item" style={{padding:"13px 0",opacity:n.read?0.7:1}}>
            <div style={{width:38,height:38,borderRadius:10,background:typeColors[n.type]+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,border:`1px solid ${typeColors[n.type]}22`}}>{typeIcons[n.type]}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                <div style={{fontSize:13,fontWeight:600,color:n.read?"#a0c0d8":"#e2e8f0"}}>{n.title}</div>
                {!n.read&&<div style={{width:7,height:7,background:"#ff4466",borderRadius:"50%",flexShrink:0}}/>}
              </div>
              <div style={{fontSize:12,color:"#4a7fa8",lineHeight:1.5,marginBottom:4}}>{n.body}</div>
              <div style={{fontSize:10,color:"#2a5070"}}>{n.time}</div>
            </div>
            <div style={{display:"flex",gap:5,flexShrink:0}}>
              {!n.read&&<button className="btn btn-outline btn-sm" onClick={()=>markOne(n.id)}>Read</button>}
              <button className="btn btn-danger btn-sm" onClick={()=>dismiss(n.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ADMIN ── */
function Admin({members,trainers,schedule,equipment,plans}){
  const [tab,setTab]=useState("overview");
  const plans2={Basic:{price:60,count:members.filter(m=>m.membership==="Basic").length},Premium:{price:120,count:members.filter(m=>m.membership==="Premium").length},Elite:{price:200,count:members.filter(m=>m.membership==="Elite").length}};

  return(
    <div className="fade-in">
      <div className="section-title">⚙️ Admin Panel</div>
      <div className="tab-bar">
        {["overview","plans","equipment","settings"].map(t=><button key={t} className={`tab-btn${tab===t?" active":""}`} onClick={()=>setTab(t)} style={{textTransform:"capitalize"}}>{t}</button>)}
      </div>

      {tab==="overview"&&(
        <div>
          <div className="stat-grid" style={{marginBottom:18}}>
            <StatCard icon="👥" val={members.length} label="Total Members" change="" type="" color="blue"/>
            <StatCard icon="✅" val={members.filter(m=>m.status==="Active").length} label="Active" change="" type="" color="green"/>
            <StatCard icon="🏋️" val={trainers.length} label="Trainers" change="" type="" color="amber"/>
            <StatCard icon="🔧" val={equipment.length} label="Equipment Types" change="" type="" color="red"/>
            <StatCard icon="💪" val={plans.length} label="Workout Plans" change="" type="" color="purple"/>
            <StatCard icon="📅" val={schedule.length} label="Classes/Week" change="" type="" color="blue"/>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="card-title" style={{marginBottom:13}}>Membership Split</div>
              {Object.entries(plans2).map(([k,v])=>(
                <div key={k} style={{marginBottom:13}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}><span style={{color:"#a0c0d8",fontWeight:600}}>{k}</span><span style={{color:"#e2e8f0",fontWeight:700}}>{v.count} members · ${v.price}/mo</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{width:`${(v.count/members.length)*100}%`,background:k==="Elite"?"linear-gradient(90deg,#ff6600,#ffaa00)":k==="Premium"?"linear-gradient(90deg,#0066ff,#00d4ff)":"linear-gradient(90deg,#00aa55,#00ff88)"}}/></div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-title" style={{marginBottom:13}}>Quick Stats</div>
              {[["Monthly Revenue","$"+members.reduce((s,m)=>s+({Basic:60,Premium:120,Elite:200}[m.membership]||0),0).toLocaleString()],["Avg Attendance",`${Math.round(members.reduce((s,m)=>s+m.attendance,0)/members.length)}%`],["Equipment Uptime",`${Math.round(equipment.reduce((s,e)=>s+(e.working/e.quantity),0)/equipment.length*100)}%`],["Class Fill Rate",`${Math.round(schedule.reduce((s,c)=>s+(c.enrolled/c.capacity),0)/schedule.length*100)}%`],["Active Plans",plans.length],["Total Enrollments",schedule.reduce((s,c)=>s+c.enrolled,0)]].map(([k,v])=>(
                <div key={k} className="payment-row"><span style={{fontSize:13,color:"#a0c0d8"}}>{k}</span><span style={{fontSize:14,fontWeight:700,color:"#00d4ff"}}>{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==="plans"&&(
        <div className="grid-3">
          {[{name:"Basic",price:60,color:"#00cc88",features:["Gym floor access","Locker rooms","2 group classes/week","Basic fitness assessment","App access"]},{name:"Premium",price:120,color:"#0066ff",features:["All Basic features","Unlimited group classes","1 PT session/month","Nutrition guidance","Priority booking","Guest pass × 1/mo"]},{name:"Elite",price:200,color:"#ff6600",features:["All Premium features","Unlimited PT sessions","Custom meal plan","Recovery room","24/7 access","Guest passes × 2/mo","Quarterly health screening"]}].map(p=>(
            <div key={p.name} className="card" style={{borderTop:`3px solid ${p.color}`,textAlign:"center"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:"#fff",marginBottom:3}}>{p.name}</div>
              <div style={{fontSize:36,fontWeight:900,color:p.color,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:3}}>${p.price}<span style={{fontSize:14,color:"#4a7fa8",fontWeight:400}}>/mo</span></div>
              <div style={{fontSize:12,color:"#4a7fa8",marginBottom:14}}>{plans2[p.name].count} members enrolled</div>
              <div className="neon-line"/>
              {p.features.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",fontSize:12,color:"#a0c0d8",textAlign:"left"}}><span style={{color:p.color,fontSize:13}}>✓</span>{f}</div>)}
            </div>
          ))}
        </div>
      )}

      {tab==="equipment"&&(
        <div className="card"><div className="table-wrap"><table><thead><tr><th>Equipment</th><th>Category</th><th>Units</th><th>Working</th><th>Condition</th><th>Next Maintenance</th></tr></thead><tbody>{equipment.map(e=>(<tr key={e.id}><td style={{fontWeight:600,color:"#e2e8f0"}}>{e.name}</td><td>{e.category}</td><td>{e.quantity}</td><td style={{color:e.working===e.quantity?"#00ff88":"#ffaa00",fontWeight:600}}>{e.working}/{e.quantity}</td><td><Badge status={e.condition}/></td><td style={{color:new Date(e.nextMaintenance)<new Date()?"#ff4466":"#a0c0d8"}}>{e.nextMaintenance}{new Date(e.nextMaintenance)<new Date()?" ⚠️":""}</td></tr>))}</tbody></table></div></div>
      )}

      {tab==="settings"&&(
        <div className="grid-2">
          <div className="card"><div className="card-title" style={{marginBottom:14}}>Gym Information</div>
            <div className="form-group"><label>Gym Name</label><input defaultValue="Iron Peak Fitness"/></div>
            <div className="form-group"><label>Address</label><input defaultValue="123 Fitness Ave, NY 10001"/></div>
            <div className="form-group"><label>Phone</label><input defaultValue="555-GYM-PEAK"/></div>
            <div className="form-group"><label>Email</label><input defaultValue="admin@ironpeak.com"/></div>
            <button className="btn btn-primary">Save Changes</button>
          </div>
          <div className="card"><div className="card-title" style={{marginBottom:14}}>Operating Hours</div>
            {["Monday–Friday","Saturday","Sunday"].map(d=>(
              <div key={d} className="form-group"><label>{d}</label><div className="form-row"><input defaultValue={d==="Sunday"?"10:00 AM":"05:00 AM"} placeholder="Open"/><input defaultValue={d==="Sunday"?"06:00 PM":d==="Saturday"?"08:00 PM":"11:00 PM"} placeholder="Close"/></div></div>
            ))}
            <button className="btn btn-primary">Save Hours</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── APP ── */
export default function App(){
  const [page,setPage]=useState("dashboard");
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [members,setMembers]=useState(initMembers);
  const [trainers,setTrainers]=useState(initTrainers);
  const [schedule,setSchedule]=useState(initSchedule);
  const [equipment,setEquipment]=useState(initEquipment);
  const [plans,setPlans]=useState(initWorkoutPlans);
  const [notifications,setNotifications]=useState(initNotifications);

  const unread=notifications.filter(n=>!n.read).length;

  const navs=[
    {section:"Main",items:[
      {id:"dashboard",icon:"🏠",label:"Dashboard"},
      {id:"members",icon:"👥",label:"Members"},
      {id:"trainers",icon:"🏅",label:"Trainers"},
    ]},
    {section:"Management",items:[
      {id:"schedule",icon:"📅",label:"Schedule"},
      {id:"attendance",icon:"📊",label:"Attendance"},
      {id:"payments",icon:"💰",label:"Payments"},
    ]},
    {section:"Features",items:[
      {id:"workouts",icon:"💪",label:"Workout Plans"},
      {id:"equipment",icon:"🔧",label:"Equipment"},
      {id:"metrics",icon:"📐",label:"Body Metrics"},
      {id:"leaderboard",icon:"🏆",label:"Leaderboard"},
      {id:"notifications",icon:"🔔",label:"Notifications",badge:unread||null},
    ]},
    {section:"System",items:[
      {id:"admin",icon:"⚙️",label:"Admin Panel"},
    ]},
  ];

  const titles={dashboard:"Dashboard",members:"Members",trainers:"Trainers",schedule:"Class Schedule",attendance:"Attendance",payments:"Payments",workouts:"Workout Plans",equipment:"Equipment",metrics:"Body Metrics",leaderboard:"Leaderboard",notifications:"Notifications",admin:"Admin Panel"};

  const go=(id)=>{setPage(id);if(window.innerWidth<750)setSidebarOpen(false)};

  return(
    <>
      <style>{FONT+CSS}</style>
      <div className="app">
        <nav className={`sidebar${sidebarOpen?"":" closed"}`}>
          <div className="logo-area">
            <div className="logo">IRON<span>PEAK</span></div>
            <div className="logo-sub">FITNESS MANAGEMENT</div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
            {navs.map(sec=>(
              <div key={sec.section} className="nav-section">
                <div className="nav-label">{sec.section}</div>
                {sec.items.map(item=><NavItem key={item.id} icon={item.icon} label={item.label} active={page===item.id} onClick={()=>go(item.id)} badge={item.badge}/>)}
              </div>
            ))}
          </div>
          <div style={{padding:"14px 20px",borderTop:"1px solid #0f2040",fontSize:11,color:"#2a5070"}}>
            <div style={{fontWeight:600,color:"#4a7fa8"}}>Admin</div>
            <div>v3.0.0 · Iron Peak</div>
          </div>
        </nav>

        <main className={`main${sidebarOpen?"":" full"}`}>
          <div className="topbar">
            <div className="topbar-left">
              <button className="menu-btn" onClick={()=>setSidebarOpen(!sidebarOpen)}>☰</button>
              <div className="page-title">{titles[page]}</div>
            </div>
            <div className="topbar-right">
              <div style={{position:"relative"}}>
                <button className="btn btn-outline btn-sm" onClick={()=>go("notifications")}>🔔</button>
                {unread>0&&<div className="notification-dot"/>}
              </div>
              <div style={{fontSize:12,color:"#4a7fa8",display:"flex",gap:12}}>
                <span>👥 {members.length}</span>
                <span style={{color:"#00ff88"}}>💰 ${members.reduce((s,m)=>s+({Basic:60,Premium:120,Elite:200}[m.membership]||0),0).toLocaleString()}</span>
              </div>
              <div className="avatar">A</div>
            </div>
          </div>

          <div className="content">
            {page==="dashboard"&&<Dashboard members={members} trainers={trainers} schedule={schedule} notifications={notifications}/>}
            {page==="members"&&<Members members={members} setMembers={setMembers} trainers={trainers}/>}
            {page==="trainers"&&<Trainers trainers={trainers} setTrainers={setTrainers}/>}
            {page==="schedule"&&<Schedule schedule={schedule} setSchedule={setSchedule} trainers={trainers}/>}
            {page==="attendance"&&<Attendance members={members}/>}
            {page==="payments"&&<Payments members={members}/>}
            {page==="workouts"&&<WorkoutPlans plans={plans} setPlans={setPlans} members={members}/>}
            {page==="equipment"&&<Equipment equipment={equipment} setEquipment={setEquipment}/>}
            {page==="metrics"&&<BodyMetrics members={members}/>}
            {page==="leaderboard"&&<Leaderboard members={members} schedule={schedule}/>}
            {page==="notifications"&&<Notifications notifications={notifications} setNotifications={setNotifications}/>}
            {page==="admin"&&<Admin members={members} trainers={trainers} schedule={schedule} equipment={equipment} plans={plans}/>}
          </div>
        </main>
      </div>
    </>
  );
}