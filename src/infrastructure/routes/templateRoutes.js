const express = require('express');
const router = express.Router();
const templateController = require('../controllers/TemplateController');
const authMiddleware = require('../middlewares/authMiddleware');

// All template routes require authentication
router.use(authMiddleware);

router.post('/', templateController.create);
router.get('/', templateController.getAll);
router.get('/:id', templateController.getById);

module.exports = router;
