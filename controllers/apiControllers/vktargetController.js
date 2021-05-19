const axios = require('axios');
const toUrlEncoded = require('../../utils/toUrlEncoded');
const { VKTARGET_KEY, VKTARGET_URL } = require('../../utils/consts');

const ApiError = require('../../error/apiError');

class VktargetController{
    async create(req, res, next){
        const { link: url, type, min_fr = 50, sex = 0, min_age = 16, max_age = 50,
            countOrdered: quantity, town = 0, idSmmcraft: task_name } = req.body;
        
        if(!url || !type || !quantity || !task_name )
            return next(ApiError.internal('Заполните все поля ввода!'));    
        
        try{
            const request = await axios({
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: toUrlEncoded({ 
                    url,type,min_fr,sex,min_age,max_age,quantity,town,task_name,
                    api_key: VKTARGET_KEY
                }),
                url: `${VKTARGET_URL}newTask`
            })
            const { id: idProject, response, errors} = request.data.response;
            if(response)
                return res.json({ status: true, response: idProject });
            else return res.json({ status: false, response: { msg: errors }});

        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async info(req, res, next){
        const { idProject: tid } = req.body;
        
        if(!tid)
            return next(ApiError.internal('Заполните все поля ввода!'));    
        
        try{
            const request = await axios({
                method: 'POST', 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: toUrlEncoded({ tid, api_key: VKTARGET_KEY }),
                url: `${VKTARGET_URL}getTaskStat`
            });
            
            const obj = Object.values(request.data.response)[0];

            const { quantity: countOrdered, count, error } = obj;

            const countInfo = {
                performed: count,
                total: countOrdered
            };
            if(!error)
                res.json({ status: true, response: countInfo });
            else res.json({status: false, response: { msg: error }})
            

        } catch(e){
            return next(ApiError.internal(e));
        } 
    }

    async getBalance(req, res, next){
        try{
            const request = await axios({
                method: 'POST', 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: toUrlEncoded({ api_key: VKTARGET_KEY }),
                url: `${VKTARGET_URL}getBalance`
            });
            const { balance } = request.data.response; 
            if(balance)
                return res.json({ status: true, response: { balance } });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }
}

module.exports = new VktargetController();