const Router = require('express');
const router = new Router();

const spreadsheetController = require('../../controllers/googleControllers/spreadsheetController');

router.post('/', spreadsheetController.accessSpreadsheet);

module.exports = router;

