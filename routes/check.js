const Router = require('express');
const router = new Router();
const checkController = require('../controllers/checkController');

router.post('/', checkController.checkOrder);

module.exports = router;