const Router = require('express');
const router = new Router();

const spanelController = require('../../controllers/apiControllers/spanelController');

router.get('/balance', spanelController.balance);
router.post('/create', spanelController.create);
router.post('/info', spanelController.info);

module.exports = router;