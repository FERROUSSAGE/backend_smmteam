const Router = require('express');
const router = new Router();

const nodemailerController = require('../../controllers/googleControllers/nodemailerController');

router.post('/', nodemailerController.send);

module.exports = router;