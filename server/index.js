import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_PATH = resolve(process.cwd(), 'data.json');
const HOURS = Array.from({ length: 15 }, (_, i) => `${String(9 + i).padStart(2, '0')}:00`);

const readDB = () => JSON.parse(readFileSync(DB_PATH, 'utf8'));
const writeDB = (db) => writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

app.get('/sports', (req, res) => {
  res.json(readDB().sports);
});

app.get('/sports/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const sport = db.sports.find(s => s.id === id);
  if (!sport) return res.status(404).json({ error: 'Not found' });
  res.json(sport);
});

// CREATE sport
app.post('/sports', (req, res) => {
  const { name, imageUrl } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });

  const db = readDB();
  const id = name.toLowerCase().replace(/\s+/g, '-');
  if (db.sports.find(s => s.id === id)) {
    return res.status(409).json({ error: 'Sport already exists' });
  }
  const sport = { id, name, imageUrl: imageUrl || '' };
  db.sports.push(sport);
  writeDB(db);
  res.status(201).json(sport);
});

// UPDATE sport
app.put('/sports/:id', (req, res) => {
  const { id } = req.params;
  const { name, imageUrl } = req.body;
  const db = readDB();
  const s = db.sports.find(s => s.id === id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  if (name) s.name = name;
  if (typeof imageUrl === 'string') s.imageUrl = imageUrl;
  writeDB(db);
  res.json(s);
});

// DELETE sport
app.delete('/sports/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const before = db.sports.length;
  db.sports = db.sports.filter(s => s.id !== id);
  writeDB(db);
  res.json({ deleted: before - db.sports.length });
});

// Pricing (read-only)
app.get('/pricing', (req, res) => {
  res.json(readDB().pricing);
});

// Availability (by sport/date)
app.get('/availability', (req, res) => {
  const { sport, date } = req.query; // date: YYYY-MM-DD
  const db = readDB();
  const taken = new Set(db.reservations.filter(r => r.sport === sport && r.date === date).map(r => r.time));
  const slots = HOURS.map(time => ({ time, available: !taken.has(time) }));
  res.json({ date, sport, slots });
});

// reservations
app.get('/reservations', (req, res) => {
  const { userId } = req.query;
  const all = readDB().reservations;
  res.json(userId ? all.filter(r => r.userId === Number(userId)) : all);
});

app.post('/reservations', (req, res) => {
  const { userId, sport, date, time } = req.body;
  const db = readDB();
  const exists = db.reservations.find(r => r.sport === sport && r.date === date && r.time === time);
  if (exists) return res.status(409).json({ error: 'Slot already reserved' });
  const id = db.reservations.length ? Math.max(...db.reservations.map(r => r.id)) + 1 : 1;
  const resv = { id, userId, sport, date, time, createdAt: new Date().toISOString() };
  db.reservations.push(resv);
  writeDB(db);
  res.status(201).json(resv);
});

app.delete('/reservations/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = readDB();
  const before = db.reservations.length;
  db.reservations = db.reservations.filter(r => r.id !== id);
  writeDB(db);
  res.json({ deleted: before - db.reservations.length });
});

// LOGIN — auth role
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const { id, name, role } = user;
  res.json({ user: { id, name, email, role } });
});

// REGISTER — auth role
app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const db = readDB();
  if (db.users.some(u => u.email === email)) return res.status(409).json({ error: 'Email already exists' });
  const id = db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
  const user = { id, name, email, password, role: 'user' };
  db.users.push(user);
  writeDB(db);
  res.status(201).json({ user: { id, name, email, role: 'user' } });
});

// Users (update profile)
app.patch('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;
  const db = readDB();
  const i = db.users.findIndex(u => u.id === id);
  if (i === -1) return res.status(404).json({ error: 'User not found' });
  if (email && db.users.some(u => u.email === email && u.id !== id)) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  db.users[i] = { ...db.users[i], ...(name !== undefined ? { name } : {}), ...(email !== undefined ? { email } : {}) };
  writeDB(db);
  const { password, ...safe } = db.users[i];
  res.json({ user: safe });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Sportin API: http://localhost:${PORT}`));