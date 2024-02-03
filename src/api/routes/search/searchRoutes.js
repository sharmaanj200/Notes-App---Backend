const { search_notes } = require('../../controllers/search/searchController');

const router = require('express').Router();

router.get('/?', search_notes);

module.exports = router;