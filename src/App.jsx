import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = 1.5, className = '', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d={d} />
  </svg>
);
const icons = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  patients: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  doctors: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  pharmacy: "M10.5 20H4a2 2 0 01-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H20a2 2 0 012 2v2.5 M12 13v6 M9 16h6",
  lab: "M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2 M8.5 2h7 M14.5 16h-5",
  cart: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
  trash: "M3 6h18 M19 6l-1 14H6L5 6 M8 6V4h8v2",
  check: "M20 6L9 17l-5-5",
  plus: "M12 5v14 M5 12h14",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  bar: "M18 20V10 M12 20V4 M6 20v-6",
  calendar: "M3 4h18v18H3z M3 9h18 M9 3v6 M15 3v6",
  clock: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z M12 6v6l4 2",
  stethoscope: "M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6 6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3 M8 15a6 6 0 006 6 6 6 0 006-6v-3",
  trending: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  loader: "M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83",
  x: "M18 6L6 18 M6 6l12 12",
  flask: "M9 3h6 M10 9l-4 12h12L14 9",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z",
};

// ─── TOAST ───────────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, showToast };
}

function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-green-100 p-4 flex items-center gap-3 min-w-[220px] animate-slide-up">
      <div className="p-2 bg-[#F0F9F4] rounded-xl">
        <Icon d={icons.check} size={18} className="text-[#2E7D5A]" />
      </div>
      <p className="text-sm font-semibold text-[#3D2314]">{msg}</p>
      <button onClick={onClose} className="ml-auto text-[#C4A882] hover:text-[#7A5C45]">
        <Icon d={icons.x} size={14} />
      </button>
    </div>
  );
}

// ─── HOSPITAL LOADER ─────────────────────────────────────────────────────────
function HospitalLoader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing systems');

  const steps = [
    'Initializing systems',
    'Loading patient records',
    'Syncing lab data',
    'Connecting pharmacy',
    'All systems online',
  ];

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress(Math.min(step * 22, 100));
      setStatusText(steps[Math.min(step, steps.length - 1)]);
      if (step >= 5) {
        clearInterval(interval);
        setTimeout(onDone, 600);
      }
    }, 480);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#1C0F0A] via-[#2C1810] to-[#1C0F0A]">
      <div className="relative flex items-center justify-center w-28 h-28 mb-6">
        <div className="absolute inset-0 rounded-full border border-[#D4956A]/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-[-16px] rounded-full border border-[#D4956A]/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        <div className="w-20 h-20 rounded-full border-2 border-[#D4956A]/30 flex items-center justify-center">
          <Icon d={icons.heart} size={36} className="text-[#D4956A] animate-pulse" stroke={2} />
        </div>
      </div>

      <h1 className="text-white text-3xl font-black tracking-tight mb-1">PulseCare</h1>
      <p className="text-[#D4956A]/60 text-xs tracking-[3px] uppercase mb-8">Medical Management</p>

      <svg className="w-72 h-14 mb-6" viewBox="0 0 320 56" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4956A" stopOpacity="0" />
            <stop offset="50%" stopColor="#D4956A" stopOpacity="1" />
            <stop offset="100%" stopColor="#D4956A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,28 L50,28 L65,8 L75,52 L85,18 L95,38 L105,28 L155,28 L170,8 L180,52 L190,18 L200,38 L210,28 L260,28 L275,8 L285,52 L295,18 L305,38 L315,28 L320,28"
          stroke="url(#ecgGrad)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 600,
            strokeDashoffset: 600,
            animation: 'drawECG 2s ease-in-out infinite',
          }}
        />
      </svg>

      <div className="w-56 h-1 bg-[#D4956A]/15 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-[#8B4513] to-[#D4956A] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[#D4956A]/50 text-xs">{statusText}...</p>

      <style>{`
        @keyframes drawECG {
          0%   { stroke-dashoffset: 600; opacity: 0.3; }
          50%  { stroke-dashoffset: 0;   opacity: 1;   }
          100% { stroke-dashoffset: -600; opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

// ─── FLOATING PARTICLES ──────────────────────────────────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 4,
    duration: Math.random() * 6 + 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#C17A4A] opacity-10"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animation: `float ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          from { transform: translateY(0) translateX(0); opacity: 0.08; }
          to   { transform: translateY(-20px) translateX(8px); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

// ─── GLASS CARD ──────────────────────────────────────────────────────────────
function GlassCard({ children, className = '' }) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm border border-[#EDD5B8]/60 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ─── STAT CARD (Editable) ─────────────────────────────────────────────────────
function StatCard({ icon, label, value, onValueChange, accentColor = '#A0522D', bgColor = '#FFF3E6' }) {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setLocalVal(value); }, [value]);

  const handleBlur = () => {
    setEditing(false);
    onValueChange?.(localVal);
  };

  return (
    <GlassCard className="p-5 cursor-pointer group" onClick={() => { setEditing(true); setTimeout(() => inputRef.current?.focus(), 50); }}>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl ring-1" style={{ background: bgColor, ringColor: accentColor + '40' }}>
          <Icon d={icons[icon]} size={22} style={{ color: accentColor }} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-[#9E7E6A] uppercase tracking-wider mb-0.5">{label}</p>
          {editing ? (
            <input
              ref={inputRef}
              value={localVal}
              onChange={e => setLocalVal(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={e => e.key === 'Enter' && handleBlur()}
              className="text-xl font-bold text-[#2C1810] border-b-2 border-dashed border-[#C17A4A] outline-none bg-transparent w-28"
            />
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-[#2C1810]">{localVal}</p>
              <Icon d={icons.edit} size={12} className="text-[#C4A882] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>
        <div className="w-1 h-10 rounded-full opacity-30" style={{ background: accentColor }} />
      </div>
    </GlassCard>
  );
}

// ─── INPUT ───────────────────────────────────────────────────────────────────
function Input({ placeholder, value, onChange, type = 'text' }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 bg-[#FAF5F0] border border-[#E8D5C0] rounded-xl text-sm text-[#3D2314] placeholder-[#C4A882] outline-none focus:border-[#A0522D] focus:bg-white focus:ring-2 focus:ring-[#F5D5B0] transition-all"
    />
  );
}

// ─── BUTTON ──────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = 'primary', size = 'md', className = '' }) {
  const base = 'flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-95';
  const variants = {
    primary: 'bg-[#8B4513] hover:bg-[#723A10] text-white shadow-md shadow-[#8B4513]/30',
    ghost: 'bg-transparent hover:bg-[#F5E6D3] text-[#5C3A1E]',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-500',
    outline: 'border border-[#E8D5C0] hover:border-[#A0522D] hover:bg-[#FFF3E6] text-[#5C3A1E]',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const navItems = [
  { id: 'Dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'Patients',  icon: 'patients',  label: 'Patients'  },
  { id: 'Doctors',   icon: 'doctors',   label: 'Doctors'   },
  { id: 'Pharmacy',  icon: 'pharmacy',  label: 'Pharmacy'  },
  { id: 'Lab',       icon: 'lab',       label: 'Laboratory'},
];

function Sidebar({ active, onNav, onLogout }) {
  return (
    <aside className="w-[210px] shrink-0 bg-gradient-to-b from-[#1C0F0A] via-[#2C1810] to-[#1C0F0A] flex flex-col py-6 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-40 bg-[#8B4513]/10 blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2.5 mb-10 px-2">
        <div className="p-2 bg-[#8B4513]/20 rounded-xl animate-pulse">
          <Icon d={icons.heart} size={18} className="text-[#D4956A]" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">PulseCare</p>
          <p className="text-[#D4956A]/60 text-[10px] font-medium tracking-widest uppercase">Medical</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === item.id
                ? 'text-white bg-[#8B4513]/20 border border-[#8B4513]/30'
                : 'text-[#9E7E6A] hover:text-[#DCC8B4] hover:bg-white/5'
            }`}
          >
            {active === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#D4956A] rounded-r-full" />
            )}
            <Icon
              d={icons[item.icon]}
              size={16}
              className={active === item.id ? 'text-[#D4956A]' : ''}
            />
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-3 py-2.5 text-[#7A5C45] hover:text-rose-400 text-xs font-medium rounded-xl hover:bg-rose-500/10 transition-all"
      >
        <Icon d={icons.logout} size={15} />
        Sign Out
      </button>
    </aside>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
function SectionHeader({ title, sub }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#2C1810]">{title}</h2>
      {sub && <p className="text-sm text-[#9E7E6A] mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── CHART.JS LOADER HOOK ────────────────────────────────────────────────────
function useChartJs(callback, deps) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const init = () => {
      if (!chartRef.current || !window.Chart) return;
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
      instanceRef.current = callback(chartRef.current);
    };

    if (window.Chart) {
      init();
    } else {
      const existing = document.getElementById('chartjs-cdn');
      if (!existing) {
        const script = document.createElement('script');
        script.id = 'chartjs-cdn';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
        script.onload = init;
        document.head.appendChild(script);
      } else {
        existing.addEventListener('load', init);
      }
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, deps);

  return chartRef;
}

// ─── PATIENT TRAFFIC CHART ───────────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const BAR_HEIGHTS = [45, 68, 52, 95, 71, 88, 62];
const AVG = Math.round(BAR_HEIGHTS.reduce((a, b) => a + b, 0) / BAR_HEIGHTS.length);

function PatientTrafficChart({ activeBar, onBarClick }) {
  const chartRef = useChartJs((canvas) => {
    return new window.Chart(canvas, {
      type: 'bar',
      data: {
        labels: DAYS,
        datasets: [
          {
            label: 'Admissions',
            data: BAR_HEIGHTS,
            backgroundColor: BAR_HEIGHTS.map((_, i) =>
              i === activeBar ? '#8B4513' : '#EDD5B8'
            ),
            hoverBackgroundColor: BAR_HEIGHTS.map((_, i) =>
              i === activeBar ? '#723A10' : '#C17A4A'
            ),
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Weekly avg',
            data: Array(7).fill(AVG),
            type: 'line',
            borderColor: '#C17A4A',
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointRadius: 0,
            tension: 0,
            fill: false,
            order: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (_, elements) => {
          if (elements.length > 0) {
            const idx = elements[0].index;
            onBarClick(idx);
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#2C1810',
            bodyColor: '#7A5C45',
            borderColor: '#EDD5B8',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (ctx) =>
                ctx.dataset.label === 'Weekly avg'
                  ? `Avg: ${ctx.parsed.y} patients`
                  : `Admitted: ${ctx.parsed.y} patients`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: '#9E7E6A',
              font: { size: 11 },
              autoSkip: false,
            },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
            border: { display: false, dash: [4, 4] },
            ticks: {
              color: '#9E7E6A',
              font: { size: 11 },
              stepSize: 20,
            },
            min: 0,
            max: 110,
          },
        },
      },
    });
  }, [activeBar]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '180px' }}>
      <canvas ref={chartRef} />
    </div>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
const INITIAL_STATS = { patients: '2,840', doctors: '52', revenue: '12.4L', tests: '138' };

const INITIAL_SCHEDULE = [
  { event: 'Morning Rounds',   time: '9:00 AM',  color: '#8B4513' },
  { event: 'Cardiology Meet',  time: '11:00 AM', color: '#C17A4A' },
  { event: 'Lab Report Audit', time: '2:00 PM',  color: '#DCC8B4' },
  { event: 'Board Review',     time: '4:30 PM',  color: '#DCC8B4' },
];

const CAPACITY = [
  { label: 'Bed Occupancy', val: 78, color: 'bg-[#C17A4A]' },
  { label: 'OPD Capacity',  val: 91, color: 'bg-[#2E7D5A]' },
  { label: 'ICU Usage',     val: 55, color: 'bg-rose-400'  },
];

function DashboardView({ showToast }) {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [activeBar, setActiveBar] = useState(3);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ event: '', time: '' });

  const handleBarClick = (i) => {
    setActiveBar(i);
    showToast(`${DAYS[i]}: ${BAR_HEIGHTS[i]} patients admitted`);
  };

  const addEvent = () => {
    if (!newEvent.event || !newEvent.time) return;
    setSchedule([...schedule, { ...newEvent, color: '#DCC8B4' }]);
    setNewEvent({ event: '', time: '' });
    setShowAddEvent(false);
    showToast('Event added to schedule!');
  };

  return (
    <div>
      <SectionHeader title="Hospital Overview" sub="Live analytics — click values to edit" />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon="patients"    label="Total Patients"  value={stats.patients} onValueChange={v => setStats(s => ({ ...s, patients: v }))} accentColor="#A0522D" bgColor="#FFF3E6" />
        <StatCard icon="stethoscope" label="Active Doctors"  value={stats.doctors}  onValueChange={v => setStats(s => ({ ...s, doctors:  v }))} accentColor="#2E7D5A" bgColor="#F0F9F4" />
        <StatCard icon="trending"    label="Revenue (PKR)"   value={stats.revenue}  onValueChange={v => setStats(s => ({ ...s, revenue:  v }))} accentColor="#8B4513" bgColor="#FFF3E6" />
        <StatCard icon="activity"    label="Tests Today"     value={stats.tests}    onValueChange={v => setStats(s => ({ ...s, tests:    v }))} accentColor="#E11D48" bgColor="#FFF1F2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Chart.js Bar Chart */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-[#3D2314]">Weekly Patient Traffic</p>
              <p className="text-xs text-[#9E7E6A] mt-0.5">Click a bar to see daily stats</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Legend */}
              <div className="flex items-center gap-3 text-[10px] text-[#9E7E6A]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#8B4513] inline-block" />
                  Admissions
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 inline-block" style={{ borderTop: '2px dashed #C17A4A' }} />
                  Avg
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#FFF3E6] px-3 py-1.5 rounded-lg">
                <span className="text-xs font-medium text-[#8B4513]">{DAYS[activeBar]}: {BAR_HEIGHTS[activeBar]}</span>
              </div>
            </div>
          </div>
          <PatientTrafficChart activeBar={activeBar} onBarClick={handleBarClick} />
        </GlassCard>

        {/* Schedule */}
        <GlassCard className="p-5">
          <p className="font-semibold text-[#3D2314] mb-1">Today's Schedule</p>
          <p className="text-xs text-[#9E7E6A] mb-4">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <div className="space-y-2">
            {schedule.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF5F0] hover:bg-[#FFF3E6] transition-colors">
                <div className="w-1.5 h-6 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <div>
                  <p className="text-xs font-semibold text-[#3D2314]">{s.event}</p>
                  <p className="text-[10px] text-[#9E7E6A]">{s.time}</p>
                </div>
              </div>
            ))}
          </div>

          {showAddEvent ? (
            <div className="mt-3 space-y-2">
              <Input placeholder="Event name" value={newEvent.event} onChange={e => setNewEvent({ ...newEvent, event: e.target.value })} />
              <Input placeholder="Time (e.g. 5:00 PM)" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
              <div className="flex gap-2">
                <Btn onClick={addEvent} size="sm" className="flex-1">Save</Btn>
                <Btn onClick={() => setShowAddEvent(false)} size="sm" variant="outline">Cancel</Btn>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddEvent(true)}
              className="mt-3 w-full flex items-center gap-2 py-2 px-3 border border-dashed border-[#E8D5C0] rounded-xl text-xs text-[#9E7E6A] hover:border-[#A0522D] hover:text-[#8B4513] hover:bg-[#FFF3E6] transition-all"
            >
              <Icon d={icons.plus} size={13} /> Add event
            </button>
          )}
        </GlassCard>
      </div>

      {/* Capacity */}
      <GlassCard className="p-5">
        <p className="font-semibold text-[#3D2314] mb-4">Hospital Capacity</p>
        <div className="space-y-3">
          {CAPACITY.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-[#7A5C45]">{item.label}</span>
                <span className="text-sm font-bold text-[#3D2314]">{item.val}%</span>
              </div>
              <div className="h-2 bg-[#F5E6D3] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color} transition-all duration-1000`} style={{ width: `${item.val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── PATIENTS VIEW ────────────────────────────────────────────────────────────
function PatientsView({ showToast }) {
  const [patients, setPatients] = useState([
    { id: 1, name: 'Ali Khan',   age: 34, blood: 'O+', condition: 'Stable',   dept: 'Cardiology' },
    { id: 2, name: 'Sara Malik', age: 28, blood: 'A-', condition: 'Recovery', dept: 'Neurology'  },
  ]);
  const [form, setForm] = useState({ name: '', age: '', blood: '', condition: '' });
  const [error, setError] = useState('');

  const conditionColor = {
    Stable:   'bg-[#F0F9F4] text-[#2E7D5A] border-green-100',
    Recovery: 'bg-[#FFF3E6] text-[#8B4513] border-[#EDD5B8]',
    Critical: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  const add = () => {
    if (!form.name || !form.age || !form.blood) {
      setError('Please fill all required fields.');
      return;
    }
    setPatients([...patients, { id: Date.now(), ...form, condition: form.condition || 'Stable', dept: 'General' }]);
    setForm({ name: '', age: '', blood: '', condition: '' });
    setError('');
    showToast('Patient added successfully!');
  };

  return (
    <div>
      <SectionHeader title="Patient Records" sub={`${patients.length} registered patients`} />

      <GlassCard className="p-5 mb-5">
        <p className="text-sm font-semibold text-[#5C3A1E] mb-4 flex items-center gap-2">
          <Icon d={icons.plus} size={15} className="text-[#A0522D]" /> Register New Patient
        </p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input placeholder="Full Name *"           value={form.name}      onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Age *"                value={form.age}       onChange={e => setForm({ ...form, age: e.target.value })} type="number" />
          <Input placeholder="Blood Group *"        value={form.blood}     onChange={e => setForm({ ...form, blood: e.target.value })} />
          <Input placeholder="Condition (optional)" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} />
        </div>
        {error && <p className="text-xs text-rose-500 mb-2">{error}</p>}
        <Btn onClick={add}>
          <Icon d={icons.plus} size={15} /> Add Patient
        </Btn>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {patients.map((p) => (
          <div
            key={p.id}
            className="bg-white/80 backdrop-blur-sm border border-[#F5E6D3] rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 transition-transform"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5E6D3] to-[#EDD5B8] flex items-center justify-center text-[#8B4513] font-bold text-sm">
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-[#3D2314] text-sm">{p.name}</p>
                  <p className="text-xs text-[#9E7E6A]">{p.dept}</p>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${conditionColor[p.condition] || 'bg-[#FAF5F0] text-[#7A5C45] border-[#F0E4D0]'}`}>
                {p.condition}
              </span>
            </div>
            <div className="flex gap-4 text-xs text-[#7A5C45]">
              <span>Age <b className="text-[#3D2314]">{p.age}</b></span>
              <span>Blood <b className="text-[#3D2314]">{p.blood}</b></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DOCTORS VIEW ────────────────────────────────────────────────────────────
function DoctorsView({ showToast }) {
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Ayesha Khan', spec: 'Cardiologist', exp: '12 Years', status: 'Available',  rating: 4.9 },
    { id: 2, name: 'Dr. Bilal Ahmed', spec: 'Neurologist',  exp: '8 Years',  status: 'In Surgery', rating: 4.7 },
    { id: 3, name: 'Dr. Sana Raza',   spec: 'Pediatrician', exp: '6 Years',  status: 'Available',  rating: 4.8 },
  ]);
  const [form, setForm] = useState({ name: '', spec: '', exp: '' });
  const [selected, setSelected] = useState(null);

  const add = () => {
    if (!form.name || !form.spec) return;
    setDoctors([...doctors, { id: Date.now(), ...form, exp: form.exp || 'New', status: 'Available', rating: 4.5 }]);
    setForm({ name: '', spec: '', exp: '' });
    showToast('Doctor registered!');
  };

  return (
    <div>
      <SectionHeader title="Doctor Directory" sub={`${doctors.length} registered specialists`} />

      <GlassCard className="p-5 mb-5">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <Input placeholder="Doctor Name"    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Specialization" value={form.spec} onChange={e => setForm({ ...form, spec: e.target.value })} />
          <Input placeholder="Experience"     value={form.exp}  onChange={e => setForm({ ...form, exp: e.target.value })} />
        </div>
        <Btn onClick={add}><Icon d={icons.plus} size={15} /> Register Doctor</Btn>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {doctors.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setSelected(doc)}
            className="bg-white/80 border border-[#F5E6D3] rounded-2xl p-5 text-left shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B4513] to-[#6B3410] flex items-center justify-center text-white font-bold text-sm">
                {doc.name.split(' ')[1]?.[0] || 'D'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#3D2314] text-sm">{doc.name}</p>
                <p className="text-xs text-[#9E7E6A]">{doc.spec}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${doc.status === 'Available' ? 'bg-[#F0F9F4] text-[#2E7D5A]' : 'bg-amber-50 text-amber-600'}`}>
                {doc.status}
              </span>
            </div>
            <div className="flex gap-4 text-xs text-[#9E7E6A]">
              <span><b className="text-[#5C3A1E]">{doc.exp}</b> experience</span>
              <span>⭐ <b className="text-[#5C3A1E]">{doc.rating}</b></span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-[#2C1810]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#FFFAF6] rounded-3xl p-7 max-w-sm w-full shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B4513] to-[#5C2E0A] flex items-center justify-center text-white font-bold text-lg">
                {selected.name.split(' ')[1]?.[0] || 'D'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C1810]">{selected.name}</h3>
                <p className="text-sm text-[#A0522D] font-medium">{selected.spec}</p>
              </div>
            </div>
            <div className="space-y-2.5 mb-5">
              {[['Experience', selected.exp], ['Rating', `⭐ ${selected.rating}/5`], ['Status', selected.status]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-[#9E7E6A]">{k}</span>
                  <span className="font-semibold text-[#3D2314]">{v}</span>
                </div>
              ))}
            </div>
            <Btn onClick={() => setSelected(null)} variant="outline" className="w-full">Close</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LAB VIEW ────────────────────────────────────────────────────────────────
function LabView({ showToast }) {
  const [tests, setTests] = useState([
    { id: 1, name: 'Blood Glucose', status: 'pending',    patient: 'Ali Khan'   },
    { id: 2, name: 'CBC Count',     status: 'successful', patient: 'Sara Malik' },
  ]);
  const [newTest, setNewTest] = useState('');

  const add = () => {
    if (!newTest.trim()) { showToast('Enter a test name!'); return; }
    setTests([...tests, { id: Date.now(), name: newTest, status: 'pending', patient: 'Walk-in' }]);
    setNewTest('');
    showToast('Test added!');
  };

  const runTest = (id) => {
    setTests(ts => ts.map(t => t.id === id ? { ...t, status: 'processing' } : t));
    setTimeout(() => {
      setTests(ts => ts.map(t => t.id === id ? { ...t, status: 'successful' } : t));
      showToast('Test completed!');
    }, 2500);
  };

  const statusConfig = {
    pending:    { label: 'Pending',       bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-100' },
    processing: { label: 'Processing...', bg: 'bg-[#FFF3E6]', text: 'text-[#8B4513]',  border: 'border-[#EDD5B8]' },
    successful: { label: 'Complete',      bg: 'bg-[#F0F9F4]', text: 'text-[#2E7D5A]',  border: 'border-green-100' },
  };

  return (
    <div>
      <SectionHeader title="Laboratory" sub="Manage and track diagnostic tests" />

      <GlassCard className="p-5 mb-5">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input placeholder="Enter test name..." value={newTest} onChange={e => setNewTest(e.target.value)} />
          </div>
          <Btn onClick={add}><Icon d={icons.plus} size={15} /> Add Test</Btn>
        </div>
      </GlassCard>

      <div className="space-y-3">
        {tests.map((test) => {
          const cfg = statusConfig[test.status];
          return (
            <div key={test.id} className="bg-white/80 border border-[#F5E6D3] rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#FFF3E6] flex items-center justify-center">
                <Icon d={icons.flask} size={18} className="text-[#D4956A]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#3D2314] text-sm">{test.name}</p>
                <p className="text-xs text-[#9E7E6A]">Patient: {test.patient}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                {test.status === 'processing' ? (
                  <span className="animate-pulse">{cfg.label}</span>
                ) : cfg.label}
              </span>
              {test.status === 'pending' && (
                <Btn onClick={() => runTest(test.id)} size="sm" variant="outline">
                  Run Test
                </Btn>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PHARMACY VIEW ────────────────────────────────────────────────────────────
const MEDICINES = [
  { id: 1, name: 'Paracetamol', price: 50,  category: 'Analgesic'     },
  { id: 2, name: 'Ibuprofen',   price: 80,  category: 'NSAID'         },
  { id: 3, name: 'Amoxicillin', price: 150, category: 'Antibiotic'    },
  { id: 4, name: 'Cetirizine',  price: 60,  category: 'Antihistamine' },
  { id: 5, name: 'Omeprazole',  price: 120, category: 'Antacid'       },
  { id: 6, name: 'Metformin',   price: 200, category: 'Antidiabetic'  },
];

function PharmacyView({ cart, addToCart, removeFromCart, onBuy }) {
  const total = cart.reduce((s, i) => s + i.price, 0);

  return (
    <div>
      <SectionHeader title="Pharmacy" sub="Medicine inventory & cart management" />

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-3">
          {MEDICINES.map((med) => (
            <div
              key={med.id}
              className="bg-white/80 border border-[#F5E6D3] rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:translate-x-1 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFF3E6] to-[#FEEBD4] flex items-center justify-center">
                <Icon d={icons.heart} size={16} className="text-[#D4956A]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#3D2314] text-sm">{med.name}</p>
                <p className="text-xs text-[#9E7E6A]">{med.category}</p>
              </div>
              <span className="text-sm font-bold text-[#8B4513]">Rs. {med.price}</span>
              <Btn onClick={() => addToCart(med)} size="sm">
                <Icon d={icons.cart} size={13} /> Add
              </Btn>
            </div>
          ))}
        </div>

        {/* Cart */}
        <GlassCard className="p-5 h-fit sticky top-0">
          <div className="flex items-center gap-2 mb-4">
            <Icon d={icons.cart} size={16} className="text-[#A0522D]" />
            <p className="font-bold text-[#3D2314]">Cart</p>
            {cart.length > 0 && (
              <span className="ml-auto w-5 h-5 rounded-full bg-[#8B4513] text-white text-[10px] font-bold flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>

          <div className="space-y-2 min-h-[80px]">
            {cart.length === 0 && (
              <p className="text-xs text-[#9E7E6A] text-center py-6">Cart is empty</p>
            )}
            {cart.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#F5EDE0] text-sm">
                <span className="text-[#5C3A1E] text-xs">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#A0522D] font-semibold text-xs">Rs.{item.price}</span>
                  <button onClick={() => removeFromCart(i)} className="text-[#C4A882] hover:text-rose-400 transition-colors">
                    <Icon d={icons.trash} size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0E4D0]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-[#7A5C45]">Total</span>
              <span className="text-xl font-bold text-[#2C1810]">Rs. {total}</span>
            </div>
            <Btn onClick={onBuy} className="w-full" size="lg">
              <Icon d={icons.check} size={16} /> Confirm Order
            </Btn>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [view, setView] = useState('Dashboard');
  const [cart, setCart] = useState([]);
  const { toast, showToast } = useToast();

  const addToCart = (m) => { setCart(c => [...c, m]); showToast(`${m.name} added to cart`); };
  const removeFromCart = (i) => setCart(c => c.filter((_, idx) => idx !== i));
  const handleBuy = () => {
    if (cart.length === 0) { showToast('Cart is empty!'); return; }
    setCart([]);
    showToast('Order placed successfully!');
  };

  if (loading) {
    return <HospitalLoader onDone={() => { setLoading(false); setAuth(true); }} />;
  }

  if (!auth) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF5F0] to-[#F0E0CC]">
        <div className="bg-white/90 rounded-3xl p-10 shadow-2xl text-center max-w-sm w-full mx-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B4513] to-[#5C2E0A] flex items-center justify-center mx-auto mb-5">
            <Icon d={icons.heart} size={28} className="text-white" stroke={2} />
          </div>
          <h1 className="text-3xl font-black text-[#2C1810] mb-2">PulseCare</h1>
          <p className="text-sm text-[#9E7E6A] mb-6">Advanced Medical Management</p>
          <Btn onClick={() => setAuth(true)} size="lg" className="w-full">
            <Icon d={icons.shield} size={16} /> Access System
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#FAF5F0] via-[#F5E6D3]/20 to-white overflow-hidden font-sans">
      <Sidebar active={view} onNav={setView} onLogout={() => setAuth(false)} />

      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-[#F5E6D3]/80 bg-white/70 backdrop-blur-sm shrink-0">
          <div>
            <h1 className="text-lg font-bold text-[#2C1810]">{view}</h1>
            <p className="text-xs text-[#9E7E6A]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F0F9F4] border border-[#C8EAD8] px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-[#2E7D5A]">All Systems Online</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B4513] to-[#6B3410] flex items-center justify-center text-white text-xs font-bold">
              Dr
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 relative">
          <FloatingParticles />
          <div className="relative z-10">
            {view === 'Dashboard' && <DashboardView showToast={showToast} />}
            {view === 'Patients'  && <PatientsView  showToast={showToast} />}
            {view === 'Doctors'   && <DoctorsView   showToast={showToast} />}
            {view === 'Pharmacy'  && <PharmacyView  cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} onBuy={handleBuy} />}
            {view === 'Lab'       && <LabView        showToast={showToast} />}
          </div>
        </div>
      </main>

      {toast && <Toast msg={toast} onClose={() => {}} />}
    </div>
  );
}