const Router = require('express');
const router = new Router();

const spreadsheetRouter = require('./spreadsheetRouter');

router.use('/spreadsheet', spreadsheetRouter);

module.exports = router;