const request = require('supertest');
const app = require('./app');

describe('Basic routes', () => {
  it('GET / returns 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('GET /health returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/info returns app details', async () => {
    const res = await request(app).get('/api/info');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('nodejs-demo-app');
  });
});

describe('Tasks API', () => {
  it('creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Learn CI/CD' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Learn CI/CD');
    expect(res.body.done).toBe(false);
  });

  it('rejects a task without a title', async () => {
    const res = await request(app).post('/api/tasks').send({});
    expect(res.statusCode).toBe(400);
  });

  it('lists tasks', async () => {
    await request(app).post('/api/tasks').send({ title: 'Listed task' });
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('marks a task as done', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Finish me' });
    const res = await request(app).patch(`/api/tasks/${created.body.id}/done`);
    expect(res.statusCode).toBe(200);
    expect(res.body.done).toBe(true);
  });

  it('deletes a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Delete me' });
    const res = await request(app).delete(`/api/tasks/${created.body.id}`);
    expect(res.statusCode).toBe(204);
  });

  it('returns 404 for an unknown task', async () => {
    const res = await request(app).patch('/api/tasks/9999/done');
    expect(res.statusCode).toBe(404);
  });
});
