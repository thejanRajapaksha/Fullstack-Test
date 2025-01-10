const request = require('supertest');
const app = require('../server'); // Import your Express app

describe('GET /api/health', () => {
  it('should return 200 and a health check message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('API is running');
  });
});
