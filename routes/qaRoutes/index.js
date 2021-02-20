const Router = require('express');
const router = new Router();

const answerRouter = require('./answerRouter'),
    questionRouter = require('./questionRouter');

router.use('/answer', answerRouter);
router.use('/question', questionRouter);

module.exports = router;