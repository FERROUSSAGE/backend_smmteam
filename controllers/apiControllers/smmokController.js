const ApiError = require('../../error/apiError');
const axios = require('axios');
const toUrlEncoded = require('../../utils/toUrlEncoded');
const { SMMOK_URL, SMMOK_KEY } = require('../../utils/consts');

class SmmokController{
    async getBalance(req, res, next){
        try{
            const request = await axios({
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: toUrlEncoded({ api_key: SMMOK_KEY }),
                url: `${SMMOK_URL}getAccountDetails`
            }); 
            const { respond: { customer_balance: balance }, status } = request.data;
            if(status === 200)
                res.json({ status: true, response: { balance } });
        } catch(e){
            return next(ApiError.internal(e));
        }
    };

    async create(req, res, next){
        
        const { link: action_url, type: action_type, idSmmcraft: campaing_title,
            countOrdered: offerts_q, offerts_per_day = 50, 
            filter_age = 0, filter_sex = 0, filter_friends = 0 } = req.body;
        
        if(!action_url || !action_type || !campaing_title || !offerts_q)
            return next(ApiError.internal('Заполните все поля ввода!'));  
        try{
            const request = await axios({
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: toUrlEncoded({ 
                    action_url, action_type, campaing_title, offerts_q, offerts_per_day,
                    filter_age, filter_sex, filter_sex, api_key: SMMOK_KEY }),
                url: `${SMMOK_URL}addCampaign`
            }); 

            const { error, respond: { id, user_balance: balance } = {}, extra = null,  } = request.data;
            
            if(id && balance)
                return res.json({ status: true, response: { id, balance } });

                else if(extra){
                    const editRequest = await axios({
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        data: toUrlEncoded({ 
                            project_id: extra, offerts_q, offerts_per_day:offerts_q,
                            filter_age, filter_sex, filter_sex, api_key: SMMOK_KEY }),
                        url: `${SMMOK_URL}editCampaign`
                    });
                    
                    const { status, error, respond: { user_balance: balance } } = editRequest.data;
                    if(status == 200)
                        return res.json({ status: true, response: { id: extra, balance } });
                    else if(error)
                        return res.json({ status: false, response: { msg: erorr } });
                }
            else if(error)
                return res.json({ status: false, response: { msg: error } });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async info(req, res, next){
        const { idProject: project_id } = req.body;

        if(!project_id)
            return next(ApiError.internal('Заполните все поля ввода!'));  
        try{
            const request = await axios({
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: toUrlEncoded({ project_id, api_key: SMMOK_KEY }),
                url: `${SMMOK_URL}getCampaign`
            });

            const { status, error, respond: { total_offers: countOrdered, 
                complete_offers: count } = {} } = request.data;

            const countInfo = {
                performed: count,
                total:countOrdered
            }

            if(status === 200)
                return res.json({ status: true, response: countInfo });
            else return res.json({ status: false, response: { msg: error } });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }
}

module.exports = new SmmokController();