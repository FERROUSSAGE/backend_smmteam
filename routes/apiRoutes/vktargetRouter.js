const Router = require('express');
const router = new Router();

const vktargetController = require('../../controllers/apiControllers/vktargetController');

router.post('/create', vktargetController.create);
router.post('/info', vktargetController.info);
router.get('/balance', vktargetController.getBalance);

module.exports = router;