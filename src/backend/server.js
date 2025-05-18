const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(helmet());
app.use(cors());

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

module.exports = app;
