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
    describe('Delete /api/notes/:id', () => {
        it('should handle search notes for the authenticated user', async () => {
            const noteId = notes[0]._id;
            const response = await request(app)
                .delete(`/api/notes/${noteId}`)
                .set('X-CSRF-TOKEN', csrfToken)
                .set('Cookie', resCookies);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Note deleted successfully");
        });
    });
});

afterAll(async () => {
    await disconnect();
});