require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app)

const io = require('socket.io')(http);
module.exports = io;

const { bot, state, ioAddMessage } = require('./bot');
const { ioResponse } = require('./controllers/streamboosterController');

const cors = require('cors');

const sequelize = require('./db');
require('./models');

const router = require('./routes');
const errorHandler = require('./middleware/errorMiddleware');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/', router);

app.use(errorHandler);

io.on('connection', (socket) => {
    console.log(`connected ${socket.id}`);

    socket.on('STREAM_STARTED', ioResponse);
    socket.on('MESSAGE_ADD', ioAddMessage);

    socket.on('disconnect', () => {
        console.log(`disconnect ${socket.id}`);
        if(state.connection){
            bot.telegram.sendMessage(state.chatId, '👋 Соединение закрыто!' + '\n' + 'Оператор вне сети!');
        }
    })
});


const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        http.listen(PORT, () => {
            console.log(`Server is running as port - ${PORT}`);
        });

        bot.launch();
    } catch(e) {
        throw e;
    }
}

start();
