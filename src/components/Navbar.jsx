import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, Settings, User, UserCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({
  variant = 'default',
  onToggleSidebar,
  onAdminAction,
  adminId,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const homePath = user?.role === 'admin' ? '/admin-dashboard' : '/dashboard';
  const handleHome = () => navigate(homePath);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [menuOpen]);

  if (!user) return null;

  if (variant === 'admin') {
    const resolvedAdminId = adminId || user.employee_id || 'ADMIN';

    return (
      <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/72 backdrop-blur-xl supports-[backdrop-filter]:bg-white/65">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onToggleSidebar || handleHome}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              aria-label="Toggle sidebar"
            >
              <Menu size={19} />
            </button>

            <Link to={homePath} className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-100 bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(223,247,255,0.78))] shadow-sm">
                <img src="/rites-logo.jpeg" alt="RITES Logo" className="h-8 w-auto" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-base font-semibold tracking-tight text-slate-950 sm:text-lg">
                    SmartPresence
                  </span>
                  <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700 sm:inline-flex">
                    Live
                  </span>
                </div>
                <p className="hidden truncate text-xs text-slate-500 lg:block">
                  Face verification / Geo-fencing / Attendance reports / Admin approvals
                </p>
              </div>
            </Link>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/85 px-3 py-2 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg shadow-cyan-200/60">
                <UserCircle2 size={22} />
                <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Administrator</p>
                <p className="text-sm font-semibold text-slate-900">{resolvedAdminId}</p>
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition duration-200 ${menuOpen ? 'rotate-180 text-cyan-700' : 'group-hover:text-cyan-700'}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/92 p-2 shadow-2xl shadow-slate-300/30 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onAdminAction?.('profile');
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <User size={16} className="text-cyan-700" />
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onAdminAction?.('settings');
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <Settings size={16} className="text-cyan-700" />
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onAdminAction?.('logout');
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-green-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleHome}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
              title="Home"
            >
              <Menu size={20} />
            </button>
            <Link to={homePath} className="flex items-center gap-3">
              <img src="/rites-logo.jpeg" alt="RITES Logo" className="h-8 w-auto" />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-semibold text-white">SmartPresence</span>
                <span className="text-xs text-white/90">Face verification / Geo-fencing / Attendance reports / Admin approvals</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-white">
            <div className="hidden sm:flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
              <UserCircle2 size={18} />
              <span>{user.employee_id}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
