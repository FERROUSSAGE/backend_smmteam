const ApiError = require('../error/apiError');
const { ResellerType, Reseller } = require('../models');

class resellerTypeController{
    async getTypes(req, res, next){
        try{
            const types = await ResellerType.findAll({ include: [ { model: Reseller, attributes: ['name']} ]});
            res.json({ status: true, response: types });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async createType(req, res, next){
        const { name, price, description, resellerId, type } = req.body;
        if(!name || !price || !description || !resellerId || !type)
            return next(ApiError.internal('Заполните все поля ввода!'));

        try{
            const t = await ResellerType.create({ type, price, description, resellerId, name });
            if(t)
                res.json({ status: true, response: [t] });
            else return res.json({ status: false, response: [{ msg: 'Произошла ошибка при создании типа!' }] })
        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async updateType(req, res, next){
        const { name, price, description, resellerId, type } = req.body,
            { id } = req.params;

        if(!name || !price || !description || !resellerId || !type)
            return next(ApiError.internal('Заполните все поля ввода!'));

        if(!id)
            return next(ApiError.internal('Не был передан параметр -id-'));
            
        try{
            const updateType = await ResellerType.update({ type, price, description, resellerId, name }, { where: { id } });
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
                return res.json({ status: true, response: [{ msg: 'Удаление прошло успешно!' }] })
            else 
                return res.json({ status: false, response: [{ msg: 'Произошла ошибка при удалении!' }] })
        } catch(e){
            return next(ApiError.internal(e));
        }
    }
}

module.exports = new resellerTypeController();