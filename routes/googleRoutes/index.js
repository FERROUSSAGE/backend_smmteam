const Router = require('express');
const router = new Router();

const spreadsheetRouter = require('./spreadsheetRouter'),
    nodemailerRouter = require('./nodemailerRouter');

router.use('/spreadsheet', spreadsheetRouter);
router.use('/nodemailer', nodemailerRouter);

module.exports = router;