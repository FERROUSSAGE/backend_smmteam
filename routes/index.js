const Router = require('express');
const router = new Router();

const orderRouter = require('./orderRouter'),
    resellerRouter = require('./resellerRouter'),
    resellerTypeRouter = require('./resellerTypeRouter'),
    userRouter = require('./userRouter'),
    apiRoutes = require('./apiRoutes');


router.use('/user', userRouter);
router.use('/order', orderRouter);
router.use('/reseller', resellerRouter);
router.use('/type', resellerTypeRouter);
router.use('/api', apiRoutes);

module.exports = router;