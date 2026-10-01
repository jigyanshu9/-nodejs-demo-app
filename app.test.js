const request = require('supertest');
const app = require('./app');

describe('GET /', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});

describe('GET /health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.body.status).toBe('ok');
  });
});
