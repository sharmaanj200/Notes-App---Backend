const request = require('supertest');
const app = require('../../../app');
const { disconnect } = require('mongoose');
const User = require('../../../src/api/models/User');
const Note = require('../../../src/api/models/Note');
const dummyNotes = require('../../utils/dummyNotes.json');

let csrfToken;
let resCookies;
let notes;
let sharedUserId;

beforeAll(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});

    const userData = {
        fullName: 'Test User A',
        email: 'testusera@test.com',
        password: 'Abc@1234'
    };

    const userbData = {
        fullName: 'Test User B',
        email: 'testuserb@test.com',
        password: 'Abc@1234'
    };

    const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

    resCookies = response.headers['set-cookie'];
    csrfToken = response.body.data.csrfToken

   await request(app)
        .post('/api/auth/signup')
        .send(userbData);

    const user = await User.findOne({ email: userData.email });
    const userb = await User.findOne({ email: userbData.email });

    sharedUserId = userb._id;

    notes = dummyNotes.map((note) => {
        return new Note({
            title: note.title,
            content: note.content,
            userId: user._id
        });
    });

    await Note.insertMany(notes);
});

describe('Notes Share Routes', () => {
    describe('POST /api/notes/:id/share', () => {
        it('should handle share note for the authenticated user', async () => {
            const note = notes[0];
            const sharedUserData = {
                sharedUserId
            }
            const response = await request(app)
                .post(`/api/notes/${note._id}/share`)
                .set('X-CSRF-TOKEN', csrfToken)
                .set('Cookie', resCookies)
                .send(sharedUserData);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Note shared successfully");
        });
    });
});

afterAll(async () => {
    await disconnect();
});