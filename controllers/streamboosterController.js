const ApiError = require('../error/apiError');
const io = require('../index');

let sendResponse = {};

const ioResponse = (data) => {
    data = JSON.parse(data);
    if(data.success)
        return sendResponse.json({ status: true, response: { msg: 'Запуск произошел успешно!', uuid: data.uuid } });
    else return sendResponse.json({ status: false, response: { msg: 'Произошла ошибка при запуске!' } });
}

class StreamboosterController{

    async start(req, res, next){
        const { uuid, threads, service, timer } = req.body;

        if(!uuid || !threads || !service)
            return next(ApiError.internal('Заполните все поля ввода!'));

        try {
            io.emit('STREAM_START', JSON.stringify({ uuid, threads, service, timer }))
            sendResponse = res;
        } catch (e) { 
            return next(ApiError.internal(e));
        }
    }
}

module.exports = {
    streamboosterController: new StreamboosterController(),
    ioResponse
}