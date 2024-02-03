const express = require('express');
const router = express.Router();
const authRoutes = require('./auth/authRoutes');
const noteRoutes = require('./note/noteRoutes');
const searchRoutes = require('./search/searchRoutes');
const { csrfProtection, verifyAccessToken } = require('../middlewares/authMiddleware');

router.use('/auth', authRoutes);
router.use('/notes', [csrfProtection, verifyAccessToken], noteRoutes);
router.use('/search', [csrfProtection, verifyAccessToken], searchRoutes);

module.exports = router;