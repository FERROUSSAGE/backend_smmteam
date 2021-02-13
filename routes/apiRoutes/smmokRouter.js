const Router = require('express');
const router = new Router();

const smmokController = require('../../controllers/apiControllers/smmokController');

router.get('/balance', smmokController.getBalance);
router.post('/create', smmokController.create);
router.post('/info', smmokController.info);

module.exports = router;