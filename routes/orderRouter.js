const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAll);
router.post('/', orderController.createOrder);
router.post('/text', orderController.getByText);
router.get('/:id', orderController.getById);
router.get('/check/:idSmmcraft', orderController.checkOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;