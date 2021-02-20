const ApiError = require('../../error/apiError');
const { Question } = require('../../models');

class QuestionController{
    async getAll(req, res, next){
        try {
            const questions = await Answer.findAll();
            if(questions)
                return res.json({ status: true, response: questions });
        } catch (e) {
            return next(ApiError.internal(e));
        }
    }
    
    async createQuestion(req, res, next){
        const { title, answerId } = req.body;

        if(!title || !answerId)
            return next(ApiError.internal('Заполните все поля!'));

        try {
            const question = await Question.create({ title, answerId });
            if(question)
                res.json({ status: true, response: question });
        } catch (e) {
            return next(ApiError.internal(e));
        }
    }

    async updateQuestion(req, res, next){
        const { title, answerId } = req.body,
            { id } = req.params;

        if(!title || !id || !answerId)
            return next(ApiError.internal('Заполните все поля!'));

        try {
            const updateQuestion = await Question.update({ title, answerId }, { where: { id } });
            if(updateQuestion)
                res.json({ status: true, message: 'Обновление прошло успешно!' });
            else res.json({ status: false, message: 'Произошла ошибка в обновлении!' });
        } catch (e) {
            return next(ApiError.internal(e));
        }
    }

    async deleteQuestion(req, res, next){
        const { id } = req.params;

        if(!id)
            return next(ApiError.internal('Не был передан параметр -id-'));

        try {
            const deleted = await Question.destroy({ where: { id} });
            if(deleted)
                res.json({ status: true, message: 'Удаление прошло успешно!' });
            else res.json({ status: false, message: 'Произошла ошибка в удалении!' });
        } catch (e) {
            return next(ApiError.internal(e));
        }
    }
}

module.exports = new QuestionController();