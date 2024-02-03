const request = require('supertest');
const app = require('../../../app');
const { disconnect } = require('mongoose');
const User = require('../../../src/api/models/User');

let csrfToken;
let resCookies;

beforeAll(async () => {
    await User.deleteMany({});
    
    const userData = {
        fullName: 'Test User',
        email: 'testuser@test.com',
        password: 'Abc@1234'
    };

    const response = await request(app)
    .post('/api/auth/signup')
    .send(userData);

    resCookies = response.headers['set-cookie'];
    csrfToken = response.body.data.csrfToken
});

describe('Logout Routes', () => {
    describe('POST /api/auth/logout', () => {
        it('should handle logout a user', async () => {

            const response = await request(app)
                .post('/api/auth/logout')
                .set('X-CSRF-TOKEN', csrfToken)
                .set('Cookie', resCookies);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User successfully logged out');

            
            expect(response.header['set-cookie'].length).toBe(3);
            
            const cookies = response.header['set-cookie'];
   
            expect(cookies.some(cookie => cookie.includes('access_token=;'))).toBe(true);
            expect(cookies.some(cookie => cookie.includes('_csrf=;'))).toBe(true);
            expect(cookies.some(cookie => cookie.includes('refresh_token=;'))).toBe(true);
        });
        it('should handle logout invalid request', async () => {
            const response = await request(app)
                .post('/api/auth/logout')

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Unauthorized');
        });
    });
});

afterAll(async () => {
    await disconnect();
});