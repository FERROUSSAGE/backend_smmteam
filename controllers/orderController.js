const ApiError = require('../error/apiError');
const { Order, User, Reseller, ResellerType } = require('../models');

class OrderController{
    async getAll(req, res, next){
        let { limit, page } = req.query,
            offset = 0;
        page = page || 1;
        limit = limit || 9;
        offset = (page * limit) - limit;
        try{
            const order = await Order.findAndCountAll({ 
                include: [ { model: User, attributes: ['name'] }, 
                { model: Reseller, attributes: ['name']}, 
                ResellerType ],
                limit,
                offset
            });
            res.json({ status: true, response: order })
        } catch(e){
            return next(ApiError.internal(e));
        }
    }
    
    async getById(req, res, next){
        const { id } = req.params;
        try{
            const order = await Order.findOne({ where: { id }});
            res.json({ status: true, response: order });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async createOrder(req, res, next){
        const { idSmmcraft, idProject, socialNetwork, link, cost, spend, countOrdered,
            countViews, payment, resellerId, resellerTypeId, userId } = req.body;

        if( !idSmmcraft || !socialNetwork || !cost || !spend )
            return next(ApiError.internal('Заполните все поля ввода!'));
        
        try{

            const candidate = await Order.findOne({ where: { idSmmcraft } });
            if(candidate)
                return next(ApiError.badRequest('Заказ с таким ID существует.'));

            const order = await Order.create({ idSmmcraft, idProject, socialNetwork, link, cost, spend, countOrdered,
                countViews, payment, resellerId, resellerTypeId, userId });
            if(order)
                res.json({ status: true, response: order });
        } catch(e){
            return next(ApiError.internal(e));
        }

    }

    async updateOrder(req, res, next){
        const { idSmmcraft, idProject, socialNetwork, link, cost, spend, countOrdered,
            countViews, payment, date, resellerId, resellerTypeId, userId } = req.body,
            { id } = req.params;

        if( !idSmmcraft || !socialNetwork || !cost || !spend || !countOrdered )
            return next(ApiError.internal('Заполните все поля ввода!'));
        
        if(!id)
            return next(ApiError.internal('Не был передан параметр -id-'));
            
        try{

            const orderUpdate = await Order.update({ idSmmcraft, idProject, socialNetwork, link, cost, spend, countOrdered,
                countViews, payment, date, resellerId, resellerTypeId, userId }, { where: { id } });
            if(orderUpdate)
                res.json({ status: true, message: 'Обновление прошно успешно!' });
            else 
                res.json({ status: false, message: 'Произошла ошибка в обновлении!' });

        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async deleteOrder(req, res, next){
        const { id } = req.params;
        if(!id)
            return next(ApiError.internal('Не был передан параметр -id-'));

        try{
            const orderDelete = await Order.destroy({ where: { id } });
            if(orderDelete)
                res.json({ status: true, message: 'Удаление прошло успешно!' });
            else 
                res.json({ status: false, message: 'Произошла ошибка в удалении' });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }
}

module.exports = new OrderController();