const Router = require('express');
const router = new Router();
const questionController = require('../../controllers/qaControllers/questionController');

router.get('/', questionController.getAll);
router.post('/', questionController.createQuestion);
router.patch('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;