const { Telegraf } = require('telegraf');
const { Message, Answer, Question } = require('../models');
const io = require('../index');

const bot = new Telegraf(process.env.BOT_TOKEN);

let state = {};
let qa = {};
let socketIO = null;

const qaHandler = (ctx) => {
    Object.values(qa)
        .forEach(item => {
            if(ctx.message.text.toLowerCase().match(item.title.toLowerCase()))
                ctx.reply(item.answer.text);
        })
};

const messageSendHandler = async (obj) => {
    const { chatId, text } = obj;
    try{
        return await bot.telegram.sendMessage(chatId, text);
    } catch(e){ return false; }
};

const ioAddMessage = (data) => {
    const { text, chatId, nickName } = JSON.parse(data);
    Message.create({ text: `Оператор: ${text}`, nickName, chatId })
        .then(() => messageSendHandler({ text, nickName, chatId })); 
}

const messageHandler = async (ctx) => {
    const { message: { text, chat: { first_name: firstname, last_name: lastname, id: chatId } } } = ctx;
    const nickName = `${firstname} ${lastname}`;
    
    state.chatId = chatId;

    try {
        Message.create({text: `${nickName}: ${text}`, nickName, chatId})
            .then(() => {
                io.emit('MESSAGE_SEND', {text: `${nickName}: ${text}`, nickName, chatId});
            });
              
    } catch (e) { throw e; }

};

bot.start(async (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id,
        'Бот - SMMCraft, предназначен для работы непосредственно с клиентами, который будет отвечать на вопросы касающиеся по работе сайта.'
        + '\n\n' +
        'Нажав на кнопку "Связаться с оператором" будет установлено соединение с оператором, который ответит на нестандартные вопросы!', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Перейти на сайт', url: 'https://smmcraft.ru/' },
                    { text: 'Связаться с оператором', callback_data: 'openConnection' }
                ], 
                [
                    { text: 'Руководитель по работе с клиентами', url: 'https://teleg.run/Kuzminaa' },
                    { text: 'Закрыть соединение', callback_data: 'closeConnection' }
                ]
            ]
        }
    });

    qa = await Question.findAll({ include: [ Answer ] });
});

bot.on('callback_query', ctx => {
    switch(ctx.callbackQuery.data){
        case 'openConnection': 
            if(state.connection) return;
            state.connection = true;
            ctx.reply('✅ Соединение установлено!');
        break;
        case 'closeConnection':
            if(!state?.connection) return;
            state.connection = false;
            ctx.reply('👋 Соединение закрыто!');
        break;

    }
})
bot.on('text', async (ctx) => state?.connection ? messageHandler(ctx) : qaHandler(ctx));

module.exports = {
    bot, 
    state,
    ioAddMessage
};