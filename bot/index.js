const { Telegraf } = require('telegraf');
const { Message, Answer, Question } = require('../models');

const bot = new Telegraf(process.env.BOT_TOKEN);

let state = {};
let qa = {};

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

const messageAddHandler = async (ctx) => {
    const { message: { text, chat: { first_name: firstname, last_name: lastname, id: chatId } } } = ctx;
    
    try {
        await Message.create({text, nickName: `${firstname} ${lastname}`, chatId}); 
    } catch (e) { console.log(e); }

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

bot.on('text', async (ctx) => state.connection ? messageAddHandler(ctx) : qaHandler(ctx));

bot.on('callback_query', ctx => {

    switch(ctx.callbackQuery.data){
        case 'openConnection': 
            state.connection = true;
            ctx.reply('✅ Соединение установлено!');
        break;
        case 'closeConnection':
            state.connection = false;
            ctx.reply('👋 Соединение закрыто!');
        break;

    }
})

module.exports = {
    bot, 
    messageSendHandler
};