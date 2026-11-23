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
          <div className="px-3 py-2.5 rounded-xl bg-slate
