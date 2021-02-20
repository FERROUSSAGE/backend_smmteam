const { Telegraf } = require('telegraf');
const { Message, Answer, Question } = require('../models');
const io = require('../index');

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

const messageCreate = async (obj) => {
    const { message, nickName, chatId } = obj;
    try {
        const msg = await Message.create({ message, nickName, chatId });
        if(msg)
            return true;
    } catch (e) { return false;}
}

const messageSendHandler = async (obj) => {
    const { chatId, message } = obj;
    try{
        return await bot.telegram.sendMessage(chatId, message);
    } catch(e){ return false; }
};

const messageHandler = async (ctx, socket) => {
    const { message: { text: message, chat: { first_name: firstname, last_name: lastname, id: chatId } } } = ctx;
    const nickName = `${firstname} ${lastname}`;
    try {
        if(messageCreate({message: `${nickName}:${message}`, nickName, chatId}))
            socket.emit('MESSAGE_SEND', {message: `${nickName}:${message}`, nickName, chatId});
        
        socket.on('MESSAGE_ADD', (data) => {
            data = JSON.parse(data);
            if(messageCreate(data))
                messageSendHandler(data);
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
            state.connection = true;
            ctx.reply('✅ Соединение установлено!');
        break;
        case 'closeConnection':
            state.connection = false;
            ctx.reply('👋 Соединение закрыто!');
        break;

    }
})

io.on('connection', (socket) => {
    console.log(`connected ${socket.id}`);

    bot.on('text', async (ctx) => state.connection ? messageHandler(ctx, socket) : qaHandler(ctx));

    socket.on('disconnect', () => {
      console.log(`disconnected ${socket.id}`);
    });
});


module.exports = {
    bot, 
    messageSendHandler
};