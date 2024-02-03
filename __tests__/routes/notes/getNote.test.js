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

describe('Notes Routes', () => {
    describe('GET /api/notes', () => {
        it('should get notes for the authenticated user', async () => {

            const response = await request(app)
                .get('/api/notes')
                .set('X-CSRF-TOKEN', csrfToken)
                .set('Cookie', resCookies);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data[0]).toHaveProperty('title');
            expect(response.body.data[0]).toHaveProperty('content');
        });
        it('should get single note for the authenticated user', async () => {

            const response = await request(app)
                .get(`/api/notes/${notes[0]._id}`)
                .set('X-CSRF-TOKEN', csrfToken)
                .set('Cookie', resCookies);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Object);
            expect(response.body.data).toHaveProperty('title');
            expect(response.body.data).toHaveProperty('content');
        });
        it('should handle get note with invalid noteId', async () => {
            const response = await request(app)
                .get(`/api/notes/1234`)
                .set('X-CSRF-TOKEN', csrfToken)
                .set('Cookie', resCookies);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Bad request");
        });
        it('should handle get note by given id - not found', async () => {
            const response = await request(app)
                .get(`/api/notes/659709e57005c9b1648d0638`)
                .set('X-CSRF-TOKEN', csrfToken)
                .set('Cookie', resCookies);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Note not found");
        });
    });
});

afterAll(async () => {
    await disconnect();
});