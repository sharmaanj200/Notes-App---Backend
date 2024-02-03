const request = require('supertest');
const app = require('../../../app');
const { disconnect } = require('mongoose');
const User = require('../../../src/api/models/User');
const Note = require('../../../src/api/models/Note');
const dummyNotes = require('../../utils/dummyNotes.json');

let csrfToken;
let resCookies;
let notes;

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

    const user = await User.findOne({ email: userData.email });

    notes = dummyNotes.map((note) => {
        return new Note({
            title: note.title,
            content: note.content,
            userId: user._id
        });
    });

    await Note.insertMany(notes);
});

describe('Search Notes Routes', () => {
    describe('GET /api/search', () => {
        it('should handle search notes for the authenticated user', async () => {
            const query = "title"
            const response = await request(app)
                .get(`/api/search?q=${query}`)
                .set('X-CSRF-TOKEN', csrfToken)
                .set('Cookie', resCookies);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data[0]).toHaveProperty('title');
            expect(response.body.data[0]).toHaveProperty('content');
        });
    });
});

afterAll(async () => {
    await disconnect();
});