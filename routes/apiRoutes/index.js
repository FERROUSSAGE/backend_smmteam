const { request } = require('express');
const Router = require('express');
const router = new Router();

const adcoreRouter = require('./adcoreRouter'),
    vktargetRouter = require('./vktargetRouter'),
    smmokRouter = require('./smmokRouter'),
    spanelRouter = require('./spanelRouter');

router.use('/adcore', adcoreRouter);
router.use('/vktarget', vktargetRouter);
router.use('/smmok', smmokRouter);
router.use('/spanel', spanelRouter);

module.exports = router;