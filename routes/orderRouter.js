const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAll);
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getById)
router.get('/check/:id', orderController.checkOrder);
router.patch('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;