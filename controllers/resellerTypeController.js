const ApiError = require('../error/apiError');
const { ResellerType } = require('../models');

class resellerTypeController{
    async getTypes(req, res, next){
        try{
            const types = await ResellerType.findAll();
            res.json({ status: true, response: types
            });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async createType(req, res, next){
        const { name, price, description, resellerId } = req.body;
        if(!name || !price || !description || !resellerId)
            return next(ApiError.internal('Заполните все поля ввода!'));

        try{
            const type = await ResellerType.create({ name, price, description, resellerId });
            if(type)
                res.json({ status: true, response: type });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async updateType(req, res, next){
        const { name, price, description, resellerId } = req.body,
            { id } = req.params;

        if(!name || !price || !description || !resellerId)
            return next(ApiError.internal('Заполните все поля ввода!'));

        if(!id)
            return next(ApiError.internal('Не был передан параметр -id-'));
            
        try{
            const updateType = await ResellerType.update({ name, price, description, resellerId }, { where: { id } });
            if(updateType)
                res.json({ status: true, message: 'Обновление прошло успешно!' });
            else 
                res.json({ status: false, message: 'Произошла ошибка в обновлении!' });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async deleteType(req, res, next){
        const { id } = req.params;
        if(!id)
            return next(ApiError.internal('Не был передан параметр -id-'));
        try{
            const deleted = await ResellerType.destroy({ where: { id } });
            if(deleted)
                res.json('Удаление прошло успешно!')
            else 
                res.json('Произошла ошибка при удалении!');
        } catch(e){
            return next(ApiError.internal(e));
        }
    }
}

module.exports = new resellerTypeController();