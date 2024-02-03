const request = require('supertest');
const app = require('../../../app');
const { disconnect } = require('mongoose');
const User = require('../../../src/api/models/User');

beforeAll(async () => {
  await User.deleteMany({});
});

describe('Auth Routes', () => {
  describe('POST /api/auth/signup', () => {
    it('should sign up a new user', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'testuser@test.com',
        password: 'Abc@1234'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.email).toBe(userData.email);
      expect(typeof response.body.data.csrfToken).toBe('string');

      expect(response.header['set-cookie'].length).toBe(3);

      const cookies = response.header['set-cookie'];
      expect(cookies.some(cookie => cookie.includes('access_token'))).toBe(true);
      expect(cookies.some(cookie => cookie.includes('_csrf'))).toBe(true);
      expect(cookies.some(cookie => cookie.includes('refresh_token'))).toBe(true);

    });
    it('should handle email already exists validation', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'testuser@test.com',
        password: 'Abc@1234'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('A user with this email address already exists.');
    });
  });
  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {

      const loginUserData = {
        email: 'testuser@test.com',
        password: 'Abc@1234'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginUserData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successfull');
      expect(response.body.data.email).toBe(loginUserData.email);
      expect(typeof response.body.data.csrfToken).toBe('string');

      expect(response.header['set-cookie'].length).toBe(3);

      const cookies = response.header['set-cookie'];
      expect(cookies.some(cookie => cookie.includes('access_token'))).toBe(true);
      expect(cookies.some(cookie => cookie.includes('_csrf'))).toBe(true);
      expect(cookies.some(cookie => cookie.includes('refresh_token'))).toBe(true);

    });
    it('should handle invalid email login ', async () => {
      const loginUserData = {
        email: 'invalidtestuser@test.com',
        password: 'Abc@1234'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginUserData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid login credentials');
    });
    it('should handle invalid password login', async () => {
      const loginUserData = {
        email: 'testuser@test.com',
        password: 'Abc@1239'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginUserData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid login credentials');
    });
  });
});

afterAll(async () => {
  await disconnect();
});