const ApiError = require('../../error/apiError');
const { Answer } = require('../../models');

class AnswerController{
    async getAll(req, res, next){
        try {
            const answers = await Answer.findAll();
            if(answers)
                return res.json({ status: true, response: answers });
        } catch (e) {
            return next(ApiError.internal(e));
        }
    }

    async createAnswer(req, res, next){
        const { text } = req.body;

        if(!text)
            return next(ApiError.internal('Заполните все поля!'));

        try {
            const answer = await Answer.create({ text });
            if(answer)
                return res.json({ status: true, response: answer });
        } catch (e) {
            return next(ApiError.internal(e));
        }

    }

    async updateAnswer(req, res, next){
        const { text } = req.body,
            { id } = req.params;

        if(!id || !text)
            return next(ApiError.internal('Заполните все поля!'));

        try {
            const updateAnswer = await Answer.update({ text },{ where: { id } });
            if(updateAnswer)
                res.json({ status: true, message: 'Обновление прошло успешно!' });
            else res.json({ status: false, message: 'Произошла ошибка в обновлении!' });
        } catch (e) {
            return next(ApiError.internal(e));
        }
    }

    async deleteAnswer(req, res, next){
        const { id } = req.params;

        if(!id)
            return next(ApiError.internal('Не был передан параметр -id-'));
        
        try {
            const deleted = await Answer.destroy({ where: { id } });
            if(deleted)
                res.json({ status: true, message: 'Удаление прошло успешно!' });
            else res.json({ status: false, message: 'Произошла ошибка в удалении!' });
        } catch (e) {
            return next(ApiError.internal(e));
        }
    }

}

module.exports = new AnswerController();