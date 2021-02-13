const Router = require('express');
const router = new Router();
const resellerTypeController = require('../controllers/resellerTypeController');

router.get('/', resellerTypeController.getTypes);
router.post('/', resellerTypeController.createType);
router.patch('/:id', resellerTypeController.updateType);
router.delete('/:id', resellerTypeController.deleteType);

module.exports = router;