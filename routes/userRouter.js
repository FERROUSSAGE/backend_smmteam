const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');



router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/registration', userController.registration);
router.post('/login', userController.login);

module.exports = router;