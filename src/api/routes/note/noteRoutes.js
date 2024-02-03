const { get_notes, add_note, update_note, get_note, delete_note, share_note } = require('../../controllers/note/noteController');
const { csrfProtection, verifyAccessToken } = require('../../middlewares/authMiddleware');

const router = require('express').Router();

router.get('/', get_notes);
router.post('/', add_note);

router.get('/:id', get_note);
router.put('/:id', update_note);
router.delete('/:id', delete_note);
router.post('/:id/share', share_note);

module.exports = router;