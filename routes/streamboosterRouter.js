const Router = require('express');
const router = new Router();

const { streamboosterController } = require('../controllers/streamboosterController');

router.post('/start', streamboosterController.start);

module.exports = router;