const axios = require('axios');
const toUrlEncoded = require('../../utils/toUrlEncoded');
const rounded = require('../../utils/rounded');
const { SPANEL_URL, SPANEL_KEY, VALUTE_URL } = require('../../utils/consts');
const ApiError = require('../../error/apiError');

class SpanelController{
    async balance(req, res, next){
        const currencys = await axios.get(VALUTE_URL),
            { Valute: { USD: { Value: usd } } } = currencys.data;
        
        const request = await axios({
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: toUrlEncoded({ action: 'balance', key: SPANEL_KEY }),
            url: SPANEL_URL
        });

        const { balance, error } = request.data;
        if(balance)
            return res.json({ status: true, response: { balance: rounded(+usd * +balance) } });
        else return res.json({ status: false, response: { error } });
    }

    async create(req, res, next){
        const { type: service, link, countOrdered: quantity } = req.body;

        if(!service || !link || !quantity)
            return next(ApiError.internal('Заполните все поля ввода!'));
        
        try{
            const request = await axios({
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: toUrlEncoded({ action: 'add', service, link, quantity, key: SPANEL_KEY }),
                url: SPANEL_URL
            });

            const { order, error } = request.data;
            if(order)
                return res.json({ status: true, response: { idProject: order }});
            else return res.json({ status: false, response: { error }});

        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async info(req, res, next){
        const { idProject: order, countOrdered } = req.body;
        
        if(!order || !countOrdered)
            return next(ApiError.internal('Заполните все поля ввода!'));
        
        try{
            const request = await axios({
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: toUrlEncoded({ action: 'status', order, key: SPANEL_KEY }),
                url: SPANEL_URL
            });

            const { remains, error } = request.data;
            if(remains){
                const countInfo = {
                   performed: countOrdered - remains,
                   total: countOrdered 
                }

                return res.json({ status: true, response: countInfo })

            } else return res.json({ status: false, response: { error } });

        } catch (e){
            return next(ApiError.internal(e));
        }
    }
}

module.exports = new SpanelController();