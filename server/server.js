import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/schedule', async (_req, res) => {
  try {
    const r = await fetch('https://usis-cdn.eniamza.com/connect.json');
    if (!r.ok) return res.status(r.status).send('Upstream error');
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('Proxy listening on :3001'));