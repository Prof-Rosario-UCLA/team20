const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../../prisma/client');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-key';

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());

const openalex_address = 'https://api.openalex.org';

app.get('/api/scholars', async (req, res) => {
  const queryLang = req.query.query;
  if (!queryLang) {
    return res.status(400).json({ error: 'Query is not provided.' });
  }

  try {
    const apiUrl = `${openalex_address}/authors?filter=display_name.search:${encodeURIComponent(queryLang)}&per_page=10`;
    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ error: 'Failed to get scholars' });
    }

    const results = await apiResponse.json();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/scholars/:id', async (req, res) => {
  const scholarId = req.params.id;
  if (!scholarId) {
    return res.status(400).json({ error: 'Scholar ID is not provided.' });
  }

  try {
    const [profileRes, worksRes] = await Promise.all([
      fetch(`${openalex_address}/authors/${scholarId}`),
      fetch(`${openalex_address}/works?filter=author.id:${scholarId}&per_page=5&sort=publication_date:desc`)
    ]);

    if (!profileRes.ok || !worksRes.ok) {
      return res.status(502).json({ error: 'Failed to get scholar details' });
    }

    const profile = await profileRes.json();
    const works = await worksRes.json();

    res.json({ ...profile, works: works.results || [] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is on port ${PORT}`);
});

app.post('/api/auth/signup', async (req, res) => {
  const { userId, password } = req.body;

  try {
    const hpw = await bcrypt.hash(password, 10);
    await prisma.account.create({
      data: {
        userId,
        password: hpw
      }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { userId, password } = req.body;

  const user = await prisma.account.findUnique({ where: { userId } });
  const isValid = user && await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ error: 'Check your user id or password.' });
  }

  const token = jwt.sign({ userId }, JWT_SECRET);
  res.cookie('auth_token', token, { httpOnly: true });
  res.json({ success: true });
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    res.json({ userId });
  } catch (err) {
    res.status(401).json({ error: 'Session invalid or expired' });
  }
});

module.exports = app;
