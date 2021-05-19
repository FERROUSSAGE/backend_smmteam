const axios = require('axios');
const toUrlEncoded = require('../../utils/toUrlEncoded');
const { ADCORE_URL, ADCORE_KEY } = require('../../utils/consts');
const ApiError = require('../../error/apiError');

class AdcoreController{
    async getBalance(req, res, next){
        try{
            const request = await axios({
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: toUrlEncoded({ method: 'getMoney', apiKey: ADCORE_KEY }),
                url: ADCORE_URL
            });

            const { status, money: balance, msg } = request.data;
            if(status)
                return res.json({ status: true, response: { balance }});
            else return res.json({ status: false, response: { msg } });

        } catch(e){
            return next(ApiError.internal(e));
        }

        
    }

    async create(req, res, next){
        const { type: typ, link: url, countOrdered: cnt, price: user_price } = req.body;

        if(!typ || !url || !cnt || !user_price)
            return next(ApiError.internal('Заполните все поля ввода!'));
        
        try{
            const request = await axios({
                method: 'POST', 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: toUrlEncoded({ method: 'ads', action: 'add', typ, url, cnt, user_price, apiKey: ADCORE_KEY }),
                url: ADCORE_URL
            });

            const { status, msg, id: idProject = null } = request.data;
            if(status)
                return res.json({ status: true, response: { msg, idProject }});
            else return res.json({ status: false, response: { msg } });

        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async info(req, res, next){
        const { idProject: id, countOrdered } = req.body;

        if(!id || !countOrdered)
            return next(ApiError.internal('Заполните все поля ввода!'));

        try{
            const request = await axios({
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: toUrlEncoded({ method: 'ads', action: 'stats', id, apiKey: ADCORE_KEY }),
                url: ADCORE_URL
            });
            const { status, msg, data } = request.data;

            if(status){
                const countInfo = {
                    performed: Object.values(data).reduce((acc, value) => acc + value, 0),
                    total: countOrdered,
                }
                return res.json({ status: true, response: countInfo });
            }
            else return res.json({ status: false, response: { msg } });

        } catch(e){
            return next(ApiError.internal(e));
        } 
    }
}

module.exports = new AdcoreController();