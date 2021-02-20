const Router = require('express');
const router = new Router();
const answerController = require('../../controllers/qaControllers/answerController');

router.get('/', answerController.getAll);
router.post('/', answerController.createAnswer);
router.patch('/:id', answerController.updateAnswer);
router.delete('/:id', answerController.deleteAnswer);

module.exports = router;