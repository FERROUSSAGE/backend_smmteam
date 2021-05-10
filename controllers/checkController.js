const ApiError = require('../error/apiError');
const { Order } = require('../models');

class CheckController{
    async checkOrder(req, res, next){
        const { idSmmcraft } = req.body;
        console.log(idSmmcraft);
        if( !idSmmcraft )
            return next(ApiError.internal('Заполните все поля ввода!'));
        
        try{
            const candidate = await Order.findOne({ where: { idSmmcraft } });
            if(candidate)
                res.json({ status: false, response: { msg: 'Заказ с таким ID существует' } })
            res.json({ status: true, response: null });
        } catch(e) { return next(ApiError.internal(e)); }
    }
}

module.exports = new CheckController();