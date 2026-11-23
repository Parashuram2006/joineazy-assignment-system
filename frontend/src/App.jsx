import React, { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * ============================================================================
 * JOINEAZY — STUDENT, GROUP & ASSIGNMENT MANAGEMENT SYSTEM (FRONTEND)
 * ============================================================================
 * Production React + Tailwind CSS client configured to communicate with the
 * Node.js + Express + PostgreSQL REST API (/api/*) via JWT Bearer tokens,
 * with automatic local persistence fallback for standalone browser previews.
 * ============================================================================
 */

const API_BASE_URL = 'http://localhost:5000/api';
const DB_STORAGE_KEY = 'joineazy_prod_store_v2';
const AUTH_STORAGE_KEY = 'joineazy_auth_session_v2';

// ----------------------------------------------------------------------------
// 1. MINIMAL INLINE SVG ICON SET
// ----------------------------------------------------------------------------
const Icon = ({ name, className = 'w-4 h-4' }) => {
  const paths = {
    brand: (
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </>
    ),
    assignments: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    userPlus: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </>
    ),
    analytics: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
    checkCircle: (
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    externalLink: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    ),
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    ),
    x: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    menu: (
      <>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
    copy: (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    ),
    check: (
      <>
        <polyline points="20 6 9 17 4 12" />
      </>
    ),
    refresh: (
      <>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </>
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name] || null}
    </svg>
  );
};

// ----------------------------------------------------------------------------
// 2. SEED DATA (Matches backend/schema.sql initial records)
// ----------------------------------------------------------------------------
const SEED_DATABASE = {
  users: [
    {
      id: '11111111-1111-1111-1111-111111111101',
      codeId: 'PROF-101',
      name: 'Dr. Ananya Sharma',
      email: 'ananya.sharma@joineazy.edu',
      password: 'password123',
      role: 'ADMIN',
      department: 'Computer Science',
    },
    {
      id: '22222222-2222-2222-2222-222222222201',
      codeId: 'STU-2026-01',
      name: 'Aarav Patel',
      email: 'aarav@joineazy.edu',
      password: 'password123',
      role: 'STUDENT',
      department: 'B.Tech CSE',
    },
    {
      id: '22222222-2222-2222-2222-222222222202',
      codeId: 'STU-2026-02',
      name: 'Sneha Nair',
      email: 'sneha@joineazy.edu',
      password: 'password123',
      role: 'STUDENT',
      department: 'B.Tech CSE',
    },
    {
      id: '22222222-2222-2222-2222-222222222203',
      codeId: 'STU-2026-03',
      name: 'Rohan Kulkarni',
      email: 'rohan@joineazy.edu',
      password: 'password123',
      role: 'STUDENT',
      department: 'B.Tech IT',
    },
    {
      id: '22222222-2222-2222-2222-222222222204',
      codeId: 'STU-2026-04',
      name: 'Meera Krishnan',
      email: 'meera@joineazy.edu',
      password: 'password123',
      role: 'STUDENT',
      department: 'B.Tech IT',
    },
    {
      id: '22222222-2222-2222-2222-222222222205',
      codeId: 'STU-2026-05',
      name: 'Riya Verma',
      email: 'riya@joineazy.edu',
      password: 'password123',
      role: 'STUDENT',
      department: 'B.Tech CSE',
    },
    {
      id: '22222222-2222-2222-2222-222222222206',
      codeId: 'STU-2026-06',
      name: 'Kabir Malhotra',
      email: 'kabir@joineazy.edu',
      password: 'password123',
      role: 'STUDENT',
      department: 'B.Tech AI & DS',
    },
  ],
  groups: [
    {
      id: '33333333-3333-3333-3333-333333333301',
      name: 'Team Quantum',
      inviteCode: 'QTM-804',
      createdBy: '22222222-2222-2222-2222-222222222201',
      createdAt: '2026-11-10T09:30:00.000Z',
    },
    {
      id: '33333333-3333-3333-3333-333333333302',
      name: 'Cloud Nexus',
      inviteCode: 'CLD-319',
      createdBy: '22222222-2222-2222-2222-222222222203',
      createdAt: '2026-11-11T14:15:00.000Z',
    },
  ],
  groupMembers: [
    {
      id: '44444444-4444-4444-4444-444444444401',
      groupId: '33333333-3333-3333-3333-333333333301',
      userId: '22222222-2222-2222-2222-222222222201',
      roleInGroup: 'LEADER',
      joinedAt: '2026-11-10T09:30:00.000Z',
    },
    {
      id: '44444444-4444-4444-4444-444444444402',
      groupId: '33333333-3333-3333-3333-333333333301',
      userId: '22222222-2222-2222-2222-222222222202',
      roleInGroup: 'MEMBER',
      joinedAt: '2026-11-10T10:05:00.000Z',
    },
    {
      id: '44444444-4444-4444-4444-444444444403',
      groupId: '33333333-3333-3333-3333-333333333302',
      userId: '22222222-2222-2222-2222-222222222203',
      roleInGroup: 'LEADER',
      joinedAt: '2026-11-11T14:15:00.000Z',
    },
    {
      id: '44444444-4444-4444-4444-444444444404',
      groupId: '33333333-3333-3333-3333-333333333302',
      userId: '22222222-2222-2222-2222-222222222204',
      roleInGroup: 'MEMBER',
      joinedAt: '2026-11-11T15:00:00.000Z',
    },
  ],
  assignments: [
    {
      id: '55555555-5555-5555-5555-555555555501',
      title: 'Distributed Systems Architecture & ER Modeling',
      description:
        'Design a normalized PostgreSQL schema, create the Entity-Relationship diagram, and upload your architecture report PDF and SQL migration scripts to the shared OneDrive folder.',
      dueDate: '2026-11-28T23:59:00.000Z',
      oneDriveUrl: 'https://onedrive.live.com/?id=joineazy_cs401_asg1',
      targetType: 'ALL',
      targetGroupIds: [],
      createdBy: '11111111-1111-1111-1111-111111111101',
      createdAt: '2026-11-12T08:00:00.000Z',
    },
    {
      id: '55555555-5555-5555-5555-555555555502',
      title: 'REST API Security & JWT Role-Based Access Lab',
      description:
        'Implement Express middleware for JWT authentication, role-based access control (Student vs Admin), and input validation. Upload your Postman collection to OneDrive.',
      dueDate: '2026-12-02T18:00:00.000Z',
      oneDriveUrl: 'https://onedrive.live.com/?id=joineazy_cs401_asg2',
      targetType: 'ALL',
      targetGroupIds: [],
      createdBy: '11111111-1111-1111-1111-111111111101',
      createdAt: '2026-11-15T11:30:00.000Z',
    },
    {
      id: '55555555-5555-5555-5555-555555555503',
      title: 'Honors Track: Multi-Container Docker Compose Pipeline',
      description:
        'Containerize the React frontend, Express API, and PostgreSQL database using Docker Compose with healthchecks and persistent volumes.',
      dueDate: '2026-12-06T17:00:00.000Z',
      oneDriveUrl: 'https://onedrive.live.com/?id=joineazy_cs401_honors',
      targetType: 'SPECIFIC',
      targetGroupIds: ['33333333-3333-3333-3333-333333333301'],
      createdBy: '11111111-1111-1111-1111-111111111101',
      createdAt: '2026-11-18T16:00:00.000Z',
    },
  ],
  submissions: [
    {
      id: '66666666-6666-6666-6666-666666666601',
      assignmentId: '55555555-5555-5555-5555-555555555501',
      groupId: '33333333-3333-3333-3333-333333333301',
      confirmedByUserId: '22222222-2222-2222-2222-222222222201',
      confirmedAt: '2026-11-20T14:22:00.000Z',
      note: 'Uploaded ER_Diagram_v2.pdf and schema.sql to OneDrive.',
    },
    {
      id: '66666666-6666-6666-6666-666666666602',
      assignmentId: '55555555-5555-5555-5555-555555555501',
      groupId: '33333333-3333-3333-3333-333333333302',
      confirmedByUserId: '22222222-2222-2222-2222-222222222203',
      confirmedAt: '2026-11-21T19:45:00.000Z',
      note: 'Submitted complete architectural report and DDL scripts.',
    },
  ],
};

// ----------------------------------------------------------------------------
// 3. HELPERS & JWT TOKEN BUILDER
// ----------------------------------------------------------------------------
function createJwtToken(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      codeId: user.codeId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    })
  );
  const sig = btoa(`je_sig_${user.id}`).replace(/=/g, '').slice(0, 24);
  return `${header}.${payload}.${sig}`;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isOverdue(iso) {
  return new Date(iso).getTime() < Date.now();
}

// ----------------------------------------------------------------------------
// 4. API SERVICE LAYER (Connects to Express API with Local Fallback)
// ----------------------------------------------------------------------------
async function syncWithBackend(path, options = {}, token = null) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    // Backend server not running locally; fallback to client store seamlessly
    return null;
  }
}

// ----------------------------------------------------------------------------
// 5. MAIN APPLICATION SHELL
// ----------------------------------------------------------------------------
export default function App() {
  const [db, setDb] = useState(() => {
    try {
      const cached = localStorage.getItem(DB_STORAGE_KEY);
      return cached ? JSON.parse(cached) : SEED_DATABASE;
    } catch {
      return SEED_DATABASE;
    }
  });

  const [session, setSession] = useState(() => {
    try {
      const cached = localStorage.getItem(AUTH_STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('assignments');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    } catch (err) {
      console.error(err);
    }
  }, [db]);

  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast((curr) => (curr && curr.message === message ? null : curr));
    }, 3500);
  }, []);

  const currentUser = useMemo(() => {
    if (!session) return null;
    return db.users.find((u) => u.id === session.userId) || null;
  }, [db.users, session]);

  const handleLogin = async (user) => {
    const remote = await syncWithBackend('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: user.email, password: user.password }),
    });
    const token = remote?.token || createJwtToken(user);
    setSession({ userId: user.id, token });
    setActiveNav('assignments');
    showToast(`Signed in as ${user.name}`);
  };

  const handleRegister = async ({ name, email, password, role, department }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    const prefix = role === 'ADMIN' ? 'PROF' : 'STU-2026';
    const seq = String(db.users.length + 1).padStart(2, '0');
    const newUser = {
      id: `usr_${Date.now()}`,
      codeId: `${prefix}-${seq}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role,
      department: department.trim() || (role === 'ADMIN' ? 'Faculty' : 'B.Tech CSE'),
    };

    await syncWithBackend('/auth/register', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });

    setDb((prev) => ({ ...prev, users: [...prev.users, newUser] }));
    await handleLogin(newUser);
    return { ok: true };
  };

  const handleLogout = () => {
    setSession(null);
    setMobileMenuOpen(false);
    showToast('Signed out', 'info');
  };

  const handleResetStore = () => {
    setDb(SEED_DATABASE);
    showToast('Workspace data reset to defaults', 'info');
  };

  // Unauthenticated View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
        <AuthScreen
          users={db.users}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </div>
    );
  }

  // Navigation items by Role
  const navItems =
    currentUser.role === 'ADMIN'
      ? [
          { id: 'assignments', label: 'Assignments', icon: 'assignments' },
          { id: 'tracking', label: 'Submissions', icon: 'users' },
          { id: 'analytics', label: 'Analytics', icon: 'analytics' },
        ]
      : [
          { id: 'assignments', label: 'Assignments', icon: 'assignments' },
          { id: 'group', label: 'My Group', icon: 'users' },
        ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex">
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />

      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Icon name="brand" className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 block leading-none">
                Joineazy
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {currentUser.role === 'ADMIN' ? 'Faculty Console' : 'Student Portal'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600"
          >
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </div>
          {navItems.map((item) => {
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  name={item.icon}
                  className={`w-4 h-4 ${
                    active ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Footer Controls */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-900 truncate">
                {currentUser.name}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {currentUser.role === 'ADMIN' ? 'Admin' : 'Student'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
              {currentUser.codeId}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetStore}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              title="Reset workspace seed data"
            >
              <Icon name="refresh" className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
            >
              <Icon name="logout" className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Open navigation"
            >
              <Icon name="menu" className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 capitalize">
                {activeNav === 'tracking'
                  ? 'Submission Tracking'
                  : activeNav === 'group'
                  ? 'Group Management'
                  : activeNav}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Session Active
            </span>
          </div>
        </header>

        {/* Workspace View */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {currentUser.role === 'ADMIN' ? (
            <AdminWorkspace
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              currentUser={currentUser}
              session={session}
              db={db}
              setDb={setDb}
              showToast={showToast}
            />
          ) : (
            <StudentWorkspace
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              currentUser={currentUser}
              session={session}
              db={db}
              setDb={setDb}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 6. TOAST NOTIFICATION COMPONENT
// ----------------------------------------------------------------------------
function ToastNotification({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm max-w-sm">
      <Icon
        name={toast.type === 'error' ? 'alert' : 'checkCircle'}
        className={`w-4 h-4 shrink-0 ${
          toast.type === 'error' ? 'text-rose-400' : 'text-emerald-400'
        }`}
      />
      <span className="flex-1 text-xs font-medium">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-white"
        aria-label="Close"
      >
        <Icon name="x" className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 7. CLEAN AUTHENTICATION SCREEN
// ----------------------------------------------------------------------------
function AuthScreen({ users, onLogin, onRegister }) {
  const [tab, setTab] = useState('LOGIN');
  const [email, setEmail] = useState('aarav@joineazy.edu');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [department, setDepartment] = useState('B.Tech CSE');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'LOGIN') {
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );
      if (!user) {
        setError('Invalid email or password.');
        return;
      }
      await onLogin(user);
    } else {
      if (!name.trim() || !email.trim() || password.length < 4) {
        setError('Please complete all fields (password min 4 chars).');
        return;
      }
      const res = await onRegister({ name, email, password, role, department });
      if (!res.ok) setError(res.error);
    }
  };

  const sampleAccounts = [
    {
      roleLabel: 'Professor',
      user: users.find((u) => u.id === '11111111-1111-1111-1111-111111111101'),
    },
    {
      roleLabel: 'Student (Leader)',
      user: users.find((u) => u.id === '22222222-2222-2222-2222-222222222201'),
    },
    {
      roleLabel: 'Student (No Group)',
      user: users.find((u) => u.id === '22222222-2222-2222-2222-222222222205'),
    },
  ].filter((item) => item.user);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Mark */}
        <div className="text-center">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <Icon name="brand" className="w-5 h-5" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Joineazy Academic Workspace
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Group collaboration & assignment submission management
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setTab('LOGIN');
                setError('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                tab === 'LOGIN'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('REGISTER');
                setError('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                tab === 'REGISTER'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'REGISTER' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Siddhartha Thonti"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-600"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="ADMIN">Professor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="B.Tech CSE"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@joineazy.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition shadow-xs"
            >
              {tab === 'LOGIN' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Compact Role Switcher for Testing */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Quick Access Accounts
            </div>
            <div className="space-y-2">
              {sampleAccounts.map(({ roleLabel, user }) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => onLogin(user)}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {roleLabel}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 8. STUDENT WORKSPACE (Assignments + Group Management + 2-Step Verification)
// ----------------------------------------------------------------------------
function StudentWorkspace({
  activeNav,
  setActiveNav,
  currentUser,
  session,
  db,
  setDb,
  showToast,
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteInput, setInviteInput] = useState('');
  const [inviteError, setInviteError] = useState('');

  // Two-step verification modal state
  const [pendingConfirmAsg, setPendingConfirmAsg] = useState(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [verifiedUpload, setVerifiedUpload] = useState(false);

  const [copiedCode, setCopiedCode] = useState(false);

  const membership = useMemo(
    () => db.groupMembers.find((m) => m.userId === currentUser.id) || null,
    [db.groupMembers, currentUser.id]
  );

  const myGroup = useMemo(() => {
    if (!membership) return null;
    return db.groups.find((g) => g.id === membership.groupId) || null;
  }, [db.groups, membership]);

  const roster = useMemo(() => {
    if (!myGroup) return [];
    return db.groupMembers
      .filter((m) => m.groupId === myGroup.id)
      .map((m) => ({
        ...m,
        user: db.users.find((u) => u.id === m.userId),
      }))
      .filter((m) => m.user);
  }, [db.groupMembers, db.users, myGroup]);

  const availablePeers = useMemo(() => {
    const takenIds = new Set(db.groupMembers.map((m) => m.userId));
    return db.users.filter((u) => u.role === 'STUDENT' && !takenIds.has(u.id));
  }, [db.users, db.groupMembers]);

  const assignments = useMemo(() => {
    return db.assignments
      .filter((a) => {
        if (a.targetType === 'ALL') return true;
        return myGroup ? a.targetGroupIds.includes(myGroup.id) : false;
      })
      .map((a) => {
        const submission = myGroup
          ? db.submissions.find(
              (s) => s.assignmentId === a.id && s.groupId === myGroup.id
            )
          : null;
        const confirmedBy = submission
          ? db.users.find((u) => u.id === submission.confirmedByUserId)
          : null;
        return { ...a, submission, confirmedBy };
      });
  }, [db.assignments, db.submissions, db.users, myGroup]);

  const filteredAssignments = useMemo(() => {
    if (statusFilter === 'SUBMITTED') {
      return assignments.filter((a) => Boolean(a.submission));
    }
    if (statusFilter === 'PENDING') {
      return assignments.filter((a) => !a.submission);
    }
    return assignments;
  }, [assignments, statusFilter]);

  const completedCount = assignments.filter((a) => a.submission).length;
  const progressPct =
    assignments.length > 0
      ? Math.round((completedCount / assignments.length) * 100)
      : 0;

  // Create Group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const trimmed = newGroupName.trim();
    if (!trimmed || myGroup) return;

    const newGroup = {
      id: `grp_${Date.now()}`,
      name: trimmed,
      inviteCode: `${trimmed.slice(0, 3).toUpperCase()}-${Math.floor(
        100 + Math.random() * 900
      )}`,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    const newMember = {
      id: `gm_${Date.now()}`,
      groupId: newGroup.id,
      userId: currentUser.id,
      roleInGroup: 'LEADER',
      joinedAt: new Date().toISOString(),
    };

    await syncWithBackend(
      '/groups',
      { method: 'POST', body: JSON.stringify({ name: trimmed }) },
      session?.token
    );

    setDb((prev) => ({
      ...prev,
      groups: [...prev.groups, newGroup],
      groupMembers: [...prev.groupMembers, newMember],
    }));
    setNewGroupName('');
    showToast(`Created group "${newGroup.name}"`);
  };

  // Add Member via Email or Student ID
  const handleAddMember = async (e, presetUser = null) => {
    if (e) e.preventDefault();
    setInviteError('');
    if (!myGroup) return;

    let student = presetUser;
    if (!student) {
      const q = inviteInput.trim().toLowerCase();
      if (!q) return;
      student = db.users.find(
        (u) =>
          u.role === 'STUDENT' &&
          (u.email.toLowerCase() === q || u.codeId.toLowerCase() === q)
      );
    }

    if (!student) {
      setInviteError('Student not found. Check the email or Student ID.');
      return;
    }

    const existing = db.groupMembers.find((m) => m.userId === student.id);
    if (existing) {
      const grp = db.groups.find((g) => g.id === existing.groupId);
      setInviteError(
        `${student.name} is already assigned to "${grp?.name || 'a group'}".`
      );
      return;
    }

    await syncWithBackend(
      `/groups/${myGroup.id}/members`,
      {
        method: 'POST',
        body: JSON.stringify({ identifier: student.email }),
      },
      session?.token
    );

    const memberRecord = {
      id: `gm_${Date.now()}`,
      groupId: myGroup.id,
      userId: student.id,
      roleInGroup: 'MEMBER',
      joinedAt: new Date().toISOString(),
    };

    setDb((prev) => ({
      ...prev,
      groupMembers: [...prev.groupMembers, memberRecord],
    }));
    setInviteInput('');
    showToast(`Added ${student.name} to ${myGroup.name}`);
  };

  // Remove Member
  const handleRemoveMember = (member) => {
    if (member.userId === currentUser.id) return;
    setDb((prev) => ({
      ...prev,
      groupMembers: prev.groupMembers.filter((m) => m.id !== member.id),
    }));
    showToast(`Removed ${member.user.name}`, 'info');
  };

  // Step 1 -> Open Verification Modal
  const startSubmissionConfirmation = (asg) => {
    if (!myGroup) {
      showToast('Create or join a group first to submit assignments.', 'error');
      setActiveNav('group');
      return;
    }
    setSubmissionNote('');
    setVerifiedUpload(false);
    setPendingConfirmAsg(asg);
  };

  // Step 2 -> Finalize Verified Submission
  const confirmSubmission = async (e) => {
    e.preventDefault();
    if (!pendingConfirmAsg || !myGroup || !verifiedUpload) return;

    await syncWithBackend(
      '/submissions/confirm',
      {
        method: 'POST',
        body: JSON.stringify({
          assignmentId: pendingConfirmAsg.id,
          groupId: myGroup.id,
          note: submissionNote.trim(),
        }),
      },
      session?.token
    );

    const newSub = {
      id: `sub_${Date.now()}`,
      assignmentId: pendingConfirmAsg.id,
      groupId: myGroup.id,
      confirmedByUserId: currentUser.id,
      confirmedAt: new Date().toISOString(),
      note:
        submissionNote.trim() || 'Uploaded files to OneDrive submission folder.',
    };

    setDb((prev) => ({
      ...prev,
      submissions: [...prev.submissions, newSub],
    }));
    showToast(`Verified submission for "${pendingConfirmAsg.title}"`);
    setPendingConfirmAsg(null);
  };

  // VIEW: MY GROUP TAB
  if (activeNav === 'group') {
    return (
      <div className="space-y-6">
        {!myGroup ? (
          <div className="max-w-lg bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">
              Create Your Project Group
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Form a team to collaborate on assignments and track group
              submissions together.
            </p>

            <form onSubmit={handleCreateGroup} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Alpha Builders"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
              >
                Create Group
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">
              To join an existing group, share your Student ID (
              <span className="font-mono font-semibold text-slate-700">
                {currentUser.codeId}
              </span>
              ) or email with your group leader.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Group Roster Card */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-slate-900">
                      {myGroup.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(myGroup.inviteCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 1800);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-mono text-xs font-semibold transition"
                      title="Copy invite code"
                    >
                      <span>{myGroup.inviteCode}</span>
                      <Icon
                        name={copiedCode ? 'check' : 'copy'}
                        className="w-3 h-3"
                      />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Created {formatDate(myGroup.createdAt)} • {roster.length}{' '}
                    member{roster.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {roster.map((m) => (
                  <div
                    key={m.id}
                    className="px-6 py-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {m.user.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.roleInGroup === 'LEADER'
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {m.roleInGroup}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span className="font-mono">{m.user.codeId}</span> •{' '}
                        {m.user.email}
                      </div>
                    </div>

                    {membership?.roleInGroup === 'LEADER' &&
                      m.userId !== currentUser.id && (
                        <button
                          onClick={() => handleRemoveMember(m)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Remove member"
                        >
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add Teammate Card */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Add Group Member
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter a classmate&apos;s university email address or Student ID.
                </p>
              </div>

              <form onSubmit={(e) => handleAddMember(e)} className="space-y-3">
                <input
                  type="text"
                  value={inviteInput}
                  onChange={(e) => {
                    setInviteInput(e.target.value);
                    setInviteError('');
                  }}
                  placeholder="kabir@joineazy.edu or STU-2026-06"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                />
                {inviteError && (
                  <p className="text-xs text-rose-600 font-medium">
                    {inviteError}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition"
                >
                  <Icon name="userPlus" className="w-4 h-4" />
                  <span>Add to Group</span>
                </button>
              </form>

              {availablePeers.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                    Unassigned Students
                  </div>
                  <div className="space-y-2">
                    {availablePeers.map((peer) => (
                      <div
                        key={peer.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900">
                            {peer.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {peer.codeId}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddMember(null, peer)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 text-xs font-semibold transition"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // VIEW: ASSIGNMENTS & PROGRESS TAB
  return (
    <div className="space-y-6">
      {/* Group Progress Summary Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-semibold text-slate-500">
            {myGroup ? `Group: ${myGroup.name}` : 'No Group Assigned'}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            {completedCount} of {assignments.length} Assignments Completed
          </h2>
          {!myGroup && (
            <button
              onClick={() => setActiveNav('group')}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Create or join a group to start submitting →
            </button>
          )}
        </div>

        <div className="w-full md:w-72">
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-600">Completion Progress</span>
            <span className="text-indigo-600 tabular-nums">{progressPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200/80">
          {[
            { id: 'ALL', label: `All (${assignments.length})` },
            {
              id: 'PENDING',
              label: `Pending (${assignments.length - completedCount})`,
            },
            { id: 'SUBMITTED', label: `Submitted (${completedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment Cards */}
      <div className="space-y-4">
        {filteredAssignments.map((asg) => {
          const submitted = Boolean(asg.submission);
          const late = !submitted && isOverdue(asg.dueDate);

          return (
            <div
              key={asg.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {submitted ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                        <Icon name="checkCircle" className="w-3.5 h-3.5" />
                        Verified Submitted
                      </span>
                    ) : late ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                        <Icon name="alert" className="w-3.5 h-3.5" />
                        Past Due
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/70">
                        <Icon name="clock" className="w-3.5 h-3.5" />
                        Pending
                      </span>
                    )}

                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-slate-500">
                      Due {formatDateTime(asg.dueDate)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {asg.title}
                  </h3>
                </div>
              </div>

              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                {asg.description}
              </p>

              {submitted && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-900">
                      Confirmed by {asg.confirmedBy?.name || 'Teammate'}
                    </span>{' '}
                    on {formatDateTime(asg.submission.confirmedAt)}
                    {asg.submission.note && (
                      <span className="block text-slate-500 mt-0.5">
                        Note: {asg.submission.note}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={asg.oneDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition"
                >
                  <Icon
                    name="externalLink"
                    className="w-3.5 h-3.5 text-indigo-600"
                  />
                  <span>Open OneDrive Link</span>
                </a>

                {!submitted && (
                  <button
                    type="button"
                    onClick={() => startSubmissionConfirmation(asg)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-2xs"
                  >
                    <Icon name="checkCircle" className="w-3.5 h-3.5" />
                    <span>Yes, I have submitted</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-Step Submission Verification Dialog */}
      {pendingConfirmAsg && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Final Verification Step
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Confirm Assignment Submission
                </h3>
              </div>
              <button
                onClick={() => setPendingConfirmAsg(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={confirmSubmission} className="mt-4 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <div className="font-semibold text-slate-900">
                  {pendingConfirmAsg.title}
                </div>
                <div className="text-slate-500">
                  Submitting for group:{' '}
                  <strong className="text-slate-800">{myGroup?.name}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Submission Note (Optional)
                </label>
                <input
                  type="text"
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  placeholder="e.g., Uploaded final report & code archive"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={verifiedUpload}
                  onChange={(e) => setVerifiedUpload(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I confirm that our files have been uploaded to the shared
                  OneDrive folder and mark this assignment complete for{' '}
                  <strong className="text-slate-900">{myGroup?.name}</strong>.
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingConfirmAsg(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!verifiedUpload}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition"
                >
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// 9. ADMIN (PROFESSOR) WORKSPACE (Assignments CRUD, Tracking & Analytics)
// ----------------------------------------------------------------------------
function AdminWorkspace({
  activeNav,
  setActiveNav,
  currentUser,
  session,
  db,
  setDb,
  showToast,
}) {
  // Assignment Form Modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingAsg, setEditingAsg] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [oneDriveUrl, setOneDriveUrl] = useState('');
  const [targetType, setTargetType] = useState('ALL');
  const [targetGroupIds, setTargetGroupIds] = useState([]);

  // Delete confirmation state (no window.confirm)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Tracking filters
  const [trackView, setTrackView] = useState('GROUP'); // 'GROUP' | 'STUDENT'
  const [filterAssignmentId, setFilterAssignmentId] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const students = useMemo(
    () => db.users.filter((u) => u.role === 'STUDENT'),
    [db.users]
  );

  const assignmentStats = useMemo(() => {
    return db.assignments.map((asg) => {
      const targetGroups =
        asg.targetType === 'ALL'
          ? db.groups
          : db.groups.filter((g) => asg.targetGroupIds.includes(g.id));
      const submittedCount = targetGroups.filter((g) =>
        db.submissions.some(
          (s) => s.assignmentId === asg.id && s.groupId === g.id
        )
      ).length;
      const total = targetGroups.length;
      const pct = total > 0 ? Math.round((submittedCount / total) * 100) : 0;
      return { ...asg, targetGroups, submittedCount, total, pct };
    });
  }, [db.assignments, db.groups, db.submissions]);

  const openCreateForm = () => {
    setEditingAsg(null);
    setTitle('');
    setDescription('');
    setDueDate(
      new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16)
    );
    setOneDriveUrl('https://onedrive.live.com/?id=joineazy_submission');
    setTargetType('ALL');
    setTargetGroupIds([]);
    setFormOpen(true);
  };

  const openEditForm = (asg) => {
    setEditingAsg(asg);
    setTitle(asg.title);
    setDescription(asg.description);
    setDueDate(new Date(asg.dueDate).toISOString().slice(0, 16));
    setOneDriveUrl(asg.oneDriveUrl);
    setTargetType(asg.targetType);
    setTargetGroupIds(asg.targetGroupIds || []);
    setFormOpen(true);
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !dueDate || !oneDriveUrl.trim()) {
      return;
    }
    if (targetType === 'SPECIFIC' && targetGroupIds.length === 0) {
      showToast('Select at least one group.', 'error');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate).toISOString(),
      oneDriveUrl: oneDriveUrl.trim(),
      targetType,
      targetGroupIds: targetType === 'SPECIFIC' ? targetGroupIds : [],
    };

    if (editingAsg) {
      await syncWithBackend(
        `/assignments/${editingAsg.id}`,
        { method: 'PUT', body: JSON.stringify(payload) },
        session?.token
      );
      setDb((prev) => ({
        ...prev,
        assignments: prev.assignments.map((a) =>
          a.id === editingAsg.id ? { ...a, ...payload } : a
        ),
      }));
      showToast('Assignment updated');
    } else {
      await syncWithBackend(
        '/assignments',
        { method: 'POST', body: JSON.stringify(payload) },
        session?.token
      );
      const created = {
        id: `asg_${Date.now()}`,
        ...payload,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
      };
      setDb((prev) => ({
        ...prev,
        assignments: [created, ...prev.assignments],
      }));
      showToast('Assignment created');
    }
    setFormOpen(false);
  };

  const handleDeleteAssignment = async (id) => {
    await syncWithBackend(
      `/assignments/${id}`,
      { method: 'DELETE' },
      session?.token
    );
    setDb((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== id),
      submissions: prev.submissions.filter((s) => s.assignmentId !== id),
    }));
    setConfirmDeleteId(null);
    showToast('Assignment deleted', 'info');
  };

  // Group-wise rows
  const groupRows = useMemo(() => {
    return db.groups
      .filter((g) =>
        g.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
      .map((grp) => {
        const members = db.groupMembers
          .filter((m) => m.groupId === grp.id)
          .map((m) => db.users.find((u) => u.id === m.userId))
          .filter(Boolean);

        const relevantAsgs = db.assignments.filter(
          (a) =>
            (a.targetType === 'ALL' || a.targetGroupIds.includes(grp.id)) &&
            (filterAssignmentId === 'ALL' || a.id === filterAssignmentId)
        );

        const records = relevantAsgs.map((a) => {
          const sub = db.submissions.find(
            (s) => s.assignmentId === a.id && s.groupId === grp.id
          );
          const confirmer = sub
            ? db.users.find((u) => u.id === sub.confirmedByUserId)
            : null;
          return { assignment: a, submission: sub, confirmer };
        });

        const done = records.filter((r) => r.submission).length;
        const pct =
          records.length > 0 ? Math.round((done / records.length) * 100) : 0;
        return { group: grp, members, records, done, total: records.length, pct };
      });
  }, [db, searchTerm, filterAssignmentId]);

  // Student-wise rows
  const studentRows = useMemo(() => {
    return students
      .filter((s) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        return (
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.codeId.toLowerCase().includes(q)
        );
      })
      .map((stu) => {
        const mem = db.groupMembers.find((m) => m.userId === stu.id);
        const grp = mem ? db.groups.find((g) => g.id === mem.groupId) : null;
        const relevantAsgs = db.assignments.filter(
          (a) =>
            (a.targetType === 'ALL' ||
              (grp && a.targetGroupIds.includes(grp.id))) &&
            (filterAssignmentId === 'ALL' || a.id === filterAssignmentId)
        );
        const done = grp
          ? relevantAsgs.filter((a) =>
              db.submissions.some(
                (s) => s.assignmentId === a.id && s.groupId === grp.id
              )
            ).length
          : 0;
        return {
          student: stu,
          group: grp,
          roleInGroup: mem?.roleInGroup || null,
          done,
          total: relevantAsgs.length,
        };
      });
  }, [students, db, searchTerm, filterAssignmentId]);

  // Overall metrics
  const totalExpected = assignmentStats.reduce((sum, a) => sum + a.total, 0);
  const totalSubmitted = assignmentStats.reduce(
    (sum, a) => sum + a.submittedCount,
    0
  );
  const overallCompletionPct =
    totalExpected > 0 ? Math.round((totalSubmitted / totalExpected) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ANALYTICS VIEW */}
      {activeNav === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Total Assignments"
              value={db.assignments.length}
              sub={`${db.groups.length} active groups`}
            />
            <MetricCard
              label="Completion Rate"
              value={`${overallCompletionPct}%`}
              sub={`${totalSubmitted} of ${totalExpected} expected`}
            />
            <MetricCard
              label="Verified Submissions"
              value={totalSubmitted}
              sub="Confirmed via 2-step check"
            />
            <MetricCard
              label="Enrolled Students"
              value={students.length}
              sub={`${db.groupMembers.length} grouped`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">
                Completion Rate by Assignment
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 mb-6">
                Percentage of targeted groups that confirmed submission
              </p>

              <div className="space-y-5">
                {assignmentStats.map((a) => (
                  <div key={a.id}>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-800 truncate pr-4">
                        {a.title}
                      </span>
                      <span className="text-slate-600 tabular-nums shrink-0">
                        {a.submittedCount}/{a.total} ({a.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${a.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">
                Group Performance
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 mb-5">
                Overall completion progress per student group
              </p>

              <div className="space-y-4">
                {[...groupRows]
                  .sort((a, b) => b.pct - a.pct)
                  .map((row) => (
                    <div
                      key={row.group.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold mb-2">
                        <span className="text-slate-900">{row.group.name}</span>
                        <span className="text-emerald-700 tabular-nums">
                          {row.done}/{row.total} ({row.pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSIONS TRACKING VIEW */}
      {activeNav === 'tracking' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="inline-flex bg-slate-100 p-1 rounded-xl self-start">
              <button
                onClick={() => setTrackView('GROUP')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  trackView === 'GROUP'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Group-Wise
              </button>
              <button
                onClick={() => setTrackView('STUDENT')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  trackView === 'STUDENT'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student-Wise
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterAssignmentId}
                onChange={(e) => setFilterAssignmentId(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:border-indigo-600"
              >
                <option value="ALL">All Assignments</option>
                {db.assignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Icon
                  name="search"
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    trackView === 'GROUP'
                      ? 'Search group...'
                      : 'Search student or ID...'
                  }
                  className="pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs w-full sm:w-60 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {trackView === 'GROUP' ? (
            <div className="divide-y divide-slate-200/80">
              {groupRows.map((row) => (
                <div key={row.group.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {row.group.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[11px]">
                          {row.group.inviteCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Members:{' '}
                        {row.members.map((m) => m.name).join(', ') || 'None'}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 self-start sm:self-auto">
                      {row.done} / {row.total} Completed ({row.pct}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {row.records.map(({ assignment, submission, confirmer }) => (
                      <div
                        key={assignment.id}
                        className={`p-3.5 rounded-xl border text-xs ${
                          submission
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          {assignment.title}
                        </div>
                        {submission ? (
                          <div className="mt-1.5 text-emerald-700">
                            <span className="font-semibold">Submitted</span> •{' '}
                            {confirmer?.name} ({formatDate(submission.confirmedAt)})
                          </div>
                        ) : (
                          <div className="mt-1.5 text-amber-700 font-medium">
                            Pending • Due {formatDate(assignment.dueDate)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-5">Student</th>
                    <th className="py-3.5 px-5">Student ID</th>
                    <th className="py-3.5 px-5">Group</th>
                    <th className="py-3.5 px-5">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 text-xs">
                  {studentRows.map((row) => (
                    <tr key={row.student.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900">
                          {row.student.name}
                        </div>
                        <div className="text-slate-500">{row.student.email}</div>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-600">
                        {row.student.codeId}
                      </td>
                      <td className="py-3.5 px-5">
                        {row.group ? (
                          <span className="px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700">
                            {row.group.name}
                          </span>
                        ) : (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-slate-800 tabular-nums">
                        {row.group
                          ? `${row.done} / ${row.total} Submitted`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ASSIGNMENTS MANAGEMENT VIEW (DEFAULT) */}
      {activeNav === 'assignments' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Course Assignments
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Create and manage assignments with OneDrive submission links
              </p>
            </div>
            <button
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-2xs self-start sm:self-auto"
            >
              <Icon name="plus" className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assignmentStats.map((asg) => (
              <div
                key={asg.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          asg.targetType === 'ALL'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {asg.targetType === 'ALL'
                          ? 'All Groups'
                          : `${asg.targetGroups.length} Specific Group(s)`}
                      </span>
                      <span className="text-xs text-slate-500">
                        Due {formatDate(asg.dueDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditForm(asg)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit"
                      >
                        <Icon name="edit" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(asg.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {confirmDeleteId === asg.id && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-2 text-xs">
                      <span className="text-rose-800 font-medium">
                        Delete this assignment?
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(asg.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}

                  <h3 className="text-base font-bold text-slate-900 mt-3">
                    {asg.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {asg.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Group Submissions</span>
                      <span className="text-slate-900 tabular-nums">
                        {asg.submittedCount} / {asg.total} ({asg.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${asg.pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <a
                      href={asg.oneDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      <Icon name="externalLink" className="w-3.5 h-3.5" />
                      <span>OneDrive Folder</span>
                    </a>
                    <button
                      onClick={() => {
                        setFilterAssignmentId(asg.id);
                        setActiveNav('tracking');
                      }}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      View Submissions →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Assignment Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingAsg ? 'Edit Assignment' : 'New Assignment'}
              </h3>
              <button
                onClick={() => setFormOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., System Design & Database Indexing"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Instructions and required deliverables..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    OneDrive Link
                  </label>
                  <input
                    type="url"
                    required
                    value={oneDriveUrl}
                    onChange={(e) => setOneDriveUrl(e.target.value)}
                    placeholder="https://onedrive.live.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetType('ALL')}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                      targetType === 'ALL'
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    All Students & Groups
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('SPECIFIC')}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                      targetType === 'SPECIFIC'
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Specific Groups
                  </button>
                </div>

                {targetType === 'SPECIFIC' && (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-2">
                    {db.groups.map((g) => {
                      const active = targetGroupIds.includes(g.id);
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() =>
                            setTargetGroupIds((prev) =>
                              prev.includes(g.id)
                                ? prev.filter((id) => id !== g.id)
                                : [...prev, g.id]
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                            active
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {g.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {editingAsg ? 'Save Changes' : 'Publish Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, sub }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
        {value}
      </div>
      <div className="text-[11px] text-slate-400 mt-1">{sub}</div>
    </div>
  );
}
