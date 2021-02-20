const Router = require('express');
const router = new Router();
const telegramController = require('../controllers/telegramController');

router.get('/', telegramController.getMessages);

module.exports = router;