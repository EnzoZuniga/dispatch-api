import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('API Routes', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /auth/login', () => {
    it('should return token for valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@dispatch.com',
          password: 'admin123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@dispatch.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('code', 'UNAUTHORIZED');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'admin123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Mission Routes', () => {
    let token: string;

    it('should authenticate before accessing missions', async () => {
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@dispatch.com',
          password: 'admin123',
        });

      token = loginResponse.body.token;
    });

    it('should create a mission', async () => {
      const response = await request(app)
        .post('/missions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Fix heating system',
          description: 'Customer reports heating not working',
          location: '123 Main St',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('draft');
      expect(response.body.title).toBe('Fix heating system');
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/missions');

      expect(response.status).toBe(401);
    });
  });
});
