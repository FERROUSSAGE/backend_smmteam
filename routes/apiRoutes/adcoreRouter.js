const Router = require('express');
const router = new Router();

const adcoreController = require('../../controllers/apiControllers/adcoreController');

router.get('/balance', adcoreController.getBalance);
router.post('/create', adcoreController.create);
router.post('/info', adcoreController.info);

module.exports = router;