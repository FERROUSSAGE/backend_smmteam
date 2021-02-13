const ApiError = require('../error/apiError');

module.exports = function(err, req, res, next){
    if(err instanceof ApiError){
        return res.status(err.status).json({ status: false, err});
    }
    
    return res.status(500).json({ status: false, message: 'Ошибка была непредвиденной!' });
}