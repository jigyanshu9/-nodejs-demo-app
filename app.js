const express = require('express');
const pkg = require('./package.json');

const app = express();
app.use(express.json());

let tasks = [];
let nextId = 1;

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>${pkg.name}</title></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 40px auto;">
        <h1>Task Manager API 🚀</h1>
        <p>Deployed automatically with GitHub Actions and Docker.</p>
        <ul>
          <li><a href="/health">/health</a></li>
          <li><a href="/api/info">/api/info</a></li>
          <li><a href="/api/tasks">/api/tasks</a></li>
        </ul>
      </body>
    </html>
  `);
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/info', (req, res) => {
  res.json({
    name: pkg.name,
    version: pkg.version,
    uptimeSeconds: Math.round(process.uptime()),
    nodeVersion: process.version,
  });
});

app.get('/api/tasks', (req, res) => res.json(tasks));

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' });
  }
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.patch('/api/tasks/:id/done', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'task not found' });
  task.done = true;
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'task not found' });
  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = app;
