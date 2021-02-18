const Router = require('express');
const router = new Router();

const orderRouter = require('./orderRouter'),
    resellerRouter = require('./resellerRouter'),
    resellerTypeRouter = require('./resellerTypeRouter'),
    userRouter = require('./userRouter'),
    apiRoutes = require('./apiRoutes'),
    googleRoutes = require('./googleRoutes');


router.use('/user', userRouter);
router.use('/order', orderRouter);
router.use('/reseller', resellerRouter);
router.use('/type', resellerTypeRouter);
router.use('/api', apiRoutes);
router.use('/google', googleRoutes);

module.exports = router;