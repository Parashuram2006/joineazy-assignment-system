-- ============================================================================
-- JOINEAZY — POSTGRESQL RELATIONAL DATABASE SCHEMA & INITIAL SEED DATA
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE group_role AS ENUM ('LEADER', 'MEMBER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE target_scope AS ENUM ('ALL', 'SPECIFIC');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table (Students & Professors)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_id VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT',
    department VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Project Groups Table
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    invite_code VARCHAR(16) UNIQUE NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Group Memberships (1 Student -> 1 Active Group)
CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_group group_role NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    onedrive_url TEXT NOT NULL,
    target_type target_scope NOT NULL DEFAULT 'ALL',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Specific Group Targeting Join Table
CREATE TABLE IF NOT EXISTS assignment_targets (
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (assignment_id, group_id)
);

-- 6. Two-Step Verified Group Submissions
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    confirmed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    note TEXT,
    confirmed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (assignment_id, group_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_group_id ON submissions(group_id);

-- ============================================================================
-- SEED DATA (Default password for seeded accounts: "password123")
-- ============================================================================
INSERT INTO users (id, code_id, name, email, password_hash, role, department)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'PROF-101', 'Dr. Ananya Sharma', 'ananya.sharma@joineazy.edu', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D2vW9gB6Y4qR9O1b8dJ0iP1yR4K2u', 'ADMIN', 'Computer Science'),
  ('22222222-2222-2222-2222-222222222201', 'STU-2026-01', 'Aarav Patel', 'aarav@joineazy.edu', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D2vW9gB6Y4qR9O1b8dJ0iP1yR4K2u', 'STUDENT', 'B.Tech CSE'),
  ('22222222-2222-2222-2222-222222222202', 'STU-2026-02', 'Sneha Nair', 'sneha@joineazy.edu', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D2vW9gB6Y4qR9O1b8dJ0iP1yR4K2u', 'STUDENT', 'B.Tech CSE'),
  ('22222222-2222-2222-2222-222222222203', 'STU-2026-03', 'Rohan Kulkarni', 'rohan@joineazy.edu', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D2vW9gB6Y4qR9O1b8dJ0iP1yR4K2u', 'STUDENT', 'B.Tech IT'),
  ('22222222-2222-2222-2222-222222222204', 'STU-2026-04', 'Meera Krishnan', 'meera@joineazy.edu', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D2vW9gB6Y4qR9O1b8dJ0iP1yR4K2u', 'STUDENT', 'B.Tech IT')
ON CONFLICT (email) DO NOTHING;
