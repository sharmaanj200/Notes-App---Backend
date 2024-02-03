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
    describe('Update /api/notes/:id', () => {
        it('should handle update note for the authenticated user', async () => {
            const note = notes[0];
            const updateNoteData = {
                title: notes[0].title + " update ",
                content: notes[0].content + " update "
            }
            const response = await request(app)
                .put(`/api/notes/${note._id}`)
                .set('X-CSRF-TOKEN', csrfToken)
                .set('Cookie', resCookies)
                .send(updateNoteData);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Note updated successfully");
        });
    });
});

afterAll(async () => {
    await disconnect();
});