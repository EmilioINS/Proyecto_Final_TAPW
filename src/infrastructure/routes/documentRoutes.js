const express = require('express');
const router = express.Router();
const documentController = require('../controllers/DocumentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route requires authentication
router.use(authMiddleware);

// POST /api/documents
// Accepts body: { token: 'UUID', data: {...}, mode: 'generate'|'consult' }
router.post('/', documentController.generateOrConsult);

// GET /api/documents
// Returns document history for the logged in user
router.get('/', documentController.getAll);

module.exports = router;
