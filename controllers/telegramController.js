const ApiError = require('../error/apiError');
const { Message } = require('../models');

class TelegramController{

    async getMessages(req, res, next){
        try {
            const messages = JSON.parse(JSON.stringify(await Message.findAll()));
            const response = Object.values([...messages]
                .reduce((acc, { chatId, nickName, message }) => {
                    if (!acc[chatId]) acc[chatId] = { chatId, nickName, messages: [] };
                    acc[chatId].messages.push(message);
                    return acc;
                }, {}));
            
            return res.json({ status: true, response });
        } catch (e) {
            return next(ApiError.internal(e));
        }

    }

}

module.exports = new TelegramController();