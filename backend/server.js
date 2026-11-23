/**
 * ============================================================================
 * JOINEAZY — PRODUCTION REST API SERVER (Node.js + Express + PostgreSQL + JWT)
 * ============================================================================
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'joineazy_jwt_secret_change_in_prod';

app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgres://joineazy:joineazy_password@localhost:5432/joineazy_db',
});

// ----------------------------------------------------------------------------
// JWT AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) MIDDLEWARE
// ----------------------------------------------------------------------------
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired JWT token' });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ error: `Access denied: requires ${role} role` });
  }
  next();
};

// ----------------------------------------------------------------------------
// 1. HEALTH CHECK
// ----------------------------------------------------------------------------
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'joineazy-api', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', detail: err.message });
  }
});

// ----------------------------------------------------------------------------
// 2. AUTHENTICATION ROUTES (REGISTER & LOGIN)
// ----------------------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role = 'STUDENT', department = '' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (!['STUDENT', 'ADMIN'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const codePrefix = role === 'ADMIN' ? 'PROF' : 'STU-2026';
    const randomCode = `${codePrefix}-${Math.floor(100 + Math.random() * 900)}`;

    const { rows } = await pool.query(
      `INSERT INTO users (code_id, name, email, password_hash, role, department)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, code_id AS "codeId", name, email, role, department`,
      [randomCode, name.trim(), cleanEmail, passwordHash, role, department.trim()]
    );

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, codeId: user.codeId },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', detail: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, codeId: user.code_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        codeId: user.code_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', detail: err.message });
  }
});

// ----------------------------------------------------------------------------
// 3. STUDENT GROUP & MEMBER MANAGEMENT ROUTES
// ----------------------------------------------------------------------------
app.get('/api/groups/my', authenticate, requireRole('STUDENT'), async (req, res) => {
  try {
    const membershipRes = await pool.query(
      `SELECT gm.group_id, gm.role_in_group, g.name, g.invite_code, g.created_at
       FROM group_members gm
       JOIN groups g ON g.id = gm.group_id
       WHERE gm.user_id = $1`,
      [req.user.id]
    );

    if (membershipRes.rows.length === 0) {
      return res.json({ group: null, members: [] });
    }

    const group = membershipRes.rows[0];
    const membersRes = await pool.query(
      `SELECT u.id, u.code_id AS "codeId", u.name, u.email, gm.role_in_group AS "roleInGroup", gm.joined_at AS "joinedAt"
       FROM group_members gm
       JOIN users u ON u.id = gm.user_id
       WHERE gm.group_id = $1
       ORDER BY gm.joined_at ASC`,
      [group.group_id]
    );

    res.json({
      group: {
        id: group.group_id,
        name: group.name,
        inviteCode: group.invite_code,
        createdAt: group.created_at,
      },
      members: membersRes.rows,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load group', detail: err.message });
  }
});

app.post('/api/groups', authenticate, requireRole('STUDENT'), async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Group name is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const alreadyInGroup = await client.query(
      'SELECT id FROM group_members WHERE user_id = $1',
      [req.user.id]
    );
    if (alreadyInGroup.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You already belong to a group' });
    }

    const inviteCode = `${name.trim().slice(0, 3).toUpperCase()}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    const groupRes = await client.query(
      `INSERT INTO groups (name, invite_code, created_by)
       VALUES ($1, $2, $3)
       RETURNING id, name, invite_code AS "inviteCode", created_at AS "createdAt"`,
      [name.trim(), inviteCode, req.user.id]
    );

    await client.query(
      `INSERT INTO group_members (group_id, user_id, role_in_group)
       VALUES ($1, $2, 'LEADER')`,
      [groupRes.rows[0].id, req.user.id]
    );

    await client.query('COMMIT');
    res.status(201).json(groupRes.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to create group', detail: err.message });
  } finally {
    client.release();
  }
});

app.post('/api/groups/:groupId/members', authenticate, requireRole('STUDENT'), async (req, res) => {
  const { groupId } = req.params;
  const { identifier } = req.body; // Student email or Student code_id
  if (!identifier || !identifier.trim()) {
    return res.status(400).json({ error: 'Student email or ID is required' });
  }

  try {
    const cleanId = identifier.trim().toLowerCase();
    const studentRes = await pool.query(
      `SELECT id, code_id, name, email FROM users
       WHERE role = 'STUDENT' AND (LOWER(email) = $1 OR LOWER(code_id) = $1)`,
      [cleanId]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({ error: 'No student found with that email or ID' });
    }

    const student = studentRes.rows[0];
    const existingMember = await pool.query(
      'SELECT group_id FROM group_members WHERE user_id = $1',
      [student.id]
    );
    if (existingMember.rows.length > 0) {
      return res.status(409).json({ error: 'Student is already in a group' });
    }

    await pool.query(
      `INSERT INTO group_members (group_id, user_id, role_in_group)
       VALUES ($1, $2, 'MEMBER')`,
      [groupId, student.id]
    );

    res.status(201).json({
      message: 'Member added successfully',
      member: {
        id: student.id,
        codeId: student.code_id,
        name: student.name,
        email: student.email,
        roleInGroup: 'MEMBER',
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add member', detail: err.message });
  }
});

// ----------------------------------------------------------------------------
// 4. ASSIGNMENT MANAGEMENT ROUTES (PROFESSOR CRUD + STUDENT VIEW)
// ----------------------------------------------------------------------------
app.get('/api/assignments', authenticate, async (req, res) => {
  try {
    if (req.user.role === 'ADMIN') {
      const { rows } = await pool.query(
        `SELECT a.id, a.title, a.description, a.due_date AS "dueDate",
                a.onedrive_url AS "oneDriveUrl", a.target_type AS "targetType",
                a.created_at AS "createdAt"
         FROM assignments a
         ORDER BY a.created_at DESC`
      );
      return res.json(rows);
    }

    // Student role: fetch assignments for ALL or specifically assigned to student's group
    const grpRes = await pool.query(
      'SELECT group_id FROM group_members WHERE user_id = $1',
      [req.user.id]
    );
    const groupId = grpRes.rows[0]?.group_id || null;

    const { rows } = await pool.query(
      `SELECT a.id, a.title, a.description, a.due_date AS "dueDate",
              a.onedrive_url AS "oneDriveUrl", a.target_type AS "targetType",
              s.id AS "submissionId", s.confirmed_at AS "confirmedAt", s.note
       FROM assignments a
       LEFT JOIN assignment_targets at ON at.assignment_id = a.id
       LEFT JOIN submissions s ON s.assignment_id = a.id AND s.group_id = $1
       WHERE a.target_type = 'ALL' OR at.group_id = $1
       GROUP BY a.id, s.id
       ORDER BY a.due_date ASC`,
      [groupId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assignments', detail: err.message });
  }
});

app.post('/api/assignments', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { title, description, dueDate, oneDriveUrl, targetType = 'ALL', targetGroupIds = [] } = req.body;
  if (!title || !description || !dueDate || !oneDriveUrl) {
    return res.status(400).json({ error: 'All assignment fields are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO assignments (title, description, due_date, onedrive_url, target_type, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, description, due_date AS "dueDate", onedrive_url AS "oneDriveUrl", target_type AS "targetType"`,
      [title.trim(), description.trim(), dueDate, oneDriveUrl.trim(), targetType, req.user.id]
    );

    const created = rows[0];
    if (targetType === 'SPECIFIC' && Array.isArray(targetGroupIds)) {
      for (const gid of targetGroupIds) {
        await client.query(
          'INSERT INTO assignment_targets (assignment_id, group_id) VALUES ($1, $2)',
          [created.id, gid]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(created);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to create assignment', detail: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/assignments/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, oneDriveUrl, targetType, targetGroupIds = [] } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `UPDATE assignments
       SET title = $1, description = $2, due_date = $3, onedrive_url = $4, target_type = $5
       WHERE id = $6
       RETURNING id, title, description, due_date AS "dueDate", onedrive_url AS "oneDriveUrl", target_type AS "targetType"`,
      [title.trim(), description.trim(), dueDate, oneDriveUrl.trim(), targetType, id]
    );

    await client.query('DELETE FROM assignment_targets WHERE assignment_id = $1', [id]);
    if (targetType === 'SPECIFIC' && Array.isArray(targetGroupIds)) {
      for (const gid of targetGroupIds) {
        await client.query(
          'INSERT INTO assignment_targets (assignment_id, group_id) VALUES ($1, $2)',
          [id, gid]
        );
      }
    }

    await client.query('COMMIT');
    res.json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to update assignment', detail: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/assignments/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    await pool.query('DELETE FROM assignments WHERE id = $1', [req.params.id]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete assignment', detail: err.message });
  }
});

// ----------------------------------------------------------------------------
// 5. TWO-STEP SUBMISSION CONFIRMATION & ANALYTICS ROUTES
// ----------------------------------------------------------------------------
app.post('/api/submissions/confirm', authenticate, requireRole('STUDENT'), async (req, res) => {
  const { assignmentId, groupId, note = '' } = req.body;
  if (!assignmentId || !groupId) {
    return res.status(400).json({ error: 'assignmentId and groupId are required' });
  }

  try {
    // Verify student belongs to the specified group
    const memberCheck = await pool.query(
      'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, req.user.id]
    );
    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    const { rows } = await pool.query(
      `INSERT INTO submissions (assignment_id, group_id, confirmed_by, note)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (assignment_id, group_id) DO NOTHING
       RETURNING id, assignment_id AS "assignmentId", group_id AS "groupId", confirmed_at AS "confirmedAt", note`,
      [assignmentId, groupId, req.user.id, note.trim()]
    );

    if (rows.length === 0) {
      return res.status(409).json({ error: 'Submission already confirmed for this group' });
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to confirm submission', detail: err.message });
  }
});

app.get('/api/analytics/overview', authenticate, requireRole('ADMIN'), async (_req, res) => {
  try {
    const [assignmentsRes, groupsRes, submissionsRes, studentsRes] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM assignments'),
      pool.query('SELECT COUNT(*)::int AS count FROM groups'),
      pool.query('SELECT COUNT(*)::int AS count FROM submissions'),
      pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'STUDENT'"),
    ]);

    res.json({
      totalAssignments: assignmentsRes.rows[0].count,
      activeGroups: groupsRes.rows[0].count,
      verifiedSubmissions: submissionsRes.rows[0].count,
      totalStudents: studentsRes.rows[0].count,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute analytics', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Joineazy REST API listening on http://localhost:${PORT}`);
});
