const Router = require('express');
const router = new Router();
const resellerController = require('../controllers/resellerController');

router.get('/', resellerController.getAll);
router.post('/', resellerController.createReseller);
router.patch('/:id', resellerController.updateReseller);
router.delete('/:id', resellerController.deleteReseller);

module.exports = router;