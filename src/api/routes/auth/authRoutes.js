const { login_user, logout_user, signup_user, refresh_token } = require('../../controllers/auth/authController');
const { csrfProtection, verifyAccessToken, verifyRefreshToken } = require('../../middlewares/authMiddleware');

const router = require('express').Router();

router.post('/signup', signup_user);
router.post('/login', login_user);
router.post('/logout', [csrfProtection, verifyAccessToken], logout_user);
router.post('/refresh-token', [csrfProtection, verifyRefreshToken], refresh_token);

module.exports = router;