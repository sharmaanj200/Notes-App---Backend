const request = require('supertest');
const app = require('../../../app');
const { disconnect } = require('mongoose');
const User = require('../../../src/api/models/User');
const Note = require('../../../src/api/models/Note');

let csrfToken;
let resCookies;

beforeAll(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});
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

describe('Auth Routes', () => {
    describe('POST /api/notes', () => {
        it('should add a new note', async () => {

            const noteData = {
                title: "Test title",
                content: "Test content"
            }

            const response = await request(app)
                .post('/api/notes')
                .set('X-CSRF-TOKEN', csrfToken)
                .set('Cookie', resCookies)
                .send(noteData);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Note added successfully.');
        });
        it('should not add a new note without title and content', async () => {

            const noteData = {
                title: "",
                content: ""
            }

            const response = await request(app)
                .post('/api/notes')
                .set('X-CSRF-TOKEN', csrfToken)
                .set('Cookie', resCookies)
                .send(noteData);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            const errors = response.body.errors;
            expect(errors.some(error => errors.includes('title cannot be empty'))).toBe(true);
            expect(errors.some(error => errors.includes('content cannot be empty'))).toBe(true);
        });
    });
});

afterAll(async () => {
    await disconnect();
});