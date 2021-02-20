const ApiError = require('../error/apiError');
const { Reseller } = require('../models');

class ResellerController{
    async getAll(req, res){
        try{
            const reseller = await Reseller.findAll();
            res.json({ status: true, response: reseller });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async createReseller(req, res, next){
        const { name, api_key} = req.body;
        if(!name || !api_key)
            return next(ApiError.internal('Заполните все поля ввода!'));

        try{
            const reseller = await Reseller.create({name, api_key});
            res.json({ status: true, response: reseller });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async updateReseller(req, res, next){
        const { name, api_key } = req.body,
            { id } = req.params;
 
        if(!name || !api_key || !id)
            return next(ApiError.internal('Заполните все поля ввода!'));
        try{
            const resellerUpdate = await Reseller.update({ name, api_key }, { where: { id } });
            if(resellerUpdate)
                res.json({ status: true, message: 'Обновление прошло успешно!' });
            else
                res.json({ status: false, message: 'Произошла ошибка в обновлении!' });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async deleteReseller(req, res, next){
        const { id } = req.params;

        if(!id)
            return next(ApiError.internal('Не был передан -id-'));

        try{
            const deleted = await Reseller.destroy({ where: { id } });
            if(deleted)
                res.json({ status: true, message: 'Удаление прошла успешно!' });
            else 
                res.json({ status: false, message: 'Произошла ошибка в удалении!' });
        } catch(e){
            return next(ApiError.internal(e))
        }

    }

}

module.exports = new ResellerController();