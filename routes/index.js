const Router = require('express');
const router = new Router();

const orderRouter = require('./orderRouter'),
    resellerRouter = require('./resellerRouter'),
    resellerTypeRouter = require('./resellerTypeRouter'),
    userRouter = require('./userRouter'),
    apiRoutes = require('./apiRoutes'),
    googleRoutes = require('./googleRoutes'),
    qaRoutes = require('./qaRoutes'),
    telegramRouter = require('./telegramRouter'),
    streamboosterRouter = require('./streamboosterRouter'),
    check = require('./check');


router.use('/user', userRouter);
router.use('/order', orderRouter);
router.use('/reseller', resellerRouter);
router.use('/type', resellerTypeRouter);
router.use('/api', apiRoutes);
router.use('/google', googleRoutes);
router.use('/qa', qaRoutes);
router.use('/telegram', telegramRouter);
router.use('/streambooster', streamboosterRouter);

module.exports = router;