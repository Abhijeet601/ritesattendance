import React from 'react';
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users
} from 'lucide-react';

const Sidebar = ({ active, onChange, collapsed = false, onToggleCollapse }) => {
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'employees', label: 'Employees', icon: Users },
    { key: 'attendance', label: 'Attendance', icon: Calendar },
    { key: 'reports', label: 'Reports', icon: BarChart3 },
    { key: 'monthly-report', label: 'Monthly Reports', icon: FileText },
    { key: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="relative flex h-full flex-col overflow-x-hidden overflow-y-auto overscroll-contain rounded-r-[32px] border-r border-white/70 bg-[linear-gradient(180deg,rgba(250,252,255,0.95)_0%,rgba(232,245,255,0.95)_42%,rgba(238,250,246,0.96)_100%)] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-12 h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-16 right-[-48px] h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute inset-x-6 top-28 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" />
      </div>

      <div className={`relative mb-5 rounded-[28px] border border-white/80 bg-white/70 p-4 shadow-lg shadow-slate-200/40 transition-all duration-300 ${collapsed ? 'px-3' : ''}`}>
        <div className={`mb-3 flex ${collapsed ? 'justify-center' : 'items-start justify-between'} gap-3`}>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/15 to-emerald-500/15 text-cyan-800">
            <ShieldCheck size={20} />
          </div>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-500 transition hover:border-cyan-300 hover:text-cyan-700 md:inline-flex"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>

        {!collapsed && (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700">RITES SmartPresence</p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">Admin Command</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">Approvals, attendance operations and reporting in one workspace.</p>
          </>
        )}
      </div>

      <nav className="relative flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              title={collapsed ? item.label : undefined}
              className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 text-left text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'border-cyan-400/70 bg-[linear-gradient(135deg,#0f8bd8_0%,#0f6bdb_48%,#11a57c_100%)] text-white shadow-[0_16px_35px_rgba(14,116,214,0.28)]'
                  : 'border-transparent bg-white/65 text-slate-700 hover:-translate-y-0.5 hover:border-cyan-100 hover:bg-white/90 hover:shadow-md'
              }`}
            >
              {isActive && <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-white/90" />}
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition duration-300 ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'bg-slate-100 text-slate-600 group-hover:scale-105 group-hover:bg-cyan-50 group-hover:text-cyan-700'
                }`}
              >
                <Icon size={18} />
              </span>
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && (
                <ChevronRight
                  size={15}
                  className={`transition duration-300 ${isActive ? 'translate-x-0 text-white/80' : 'text-slate-300 group-hover:translate-x-0.5 group-hover:text-cyan-500'}`}
                />
              )}
            </button>
          );
        })}
      </nav>

      {!onToggleCollapse && collapsed && (
        <div className="relative mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => onChange(active)}
            className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-500 md:inline-flex"
            aria-label="Sidebar control"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
