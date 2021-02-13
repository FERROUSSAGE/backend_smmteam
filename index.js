require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);
const cors = require('cors');

const sequelize = require('./db');
const models = require('./models');

const router = require('./routes');
const errorHandler = require('./middleware/errorMiddleware');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/', router);

app.use(errorHandler);

io.on('connection', (socket) => {
    console.log(`connected ${socket.id}`);
    socket.on('hello', (msg) => {
        console.log(msg);
        socket.broadcast.emit('hello', 'hello ' + msg + '. Твой id' + socket.id);
    })

    socket.on('disconnect', () => {
      console.log(`disconnected ${socket.id}`);
    });
    
});


const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        http.listen(PORT, () => {
            console.log(`Server is running as port - ${PORT}`);
        })
    } catch(e) {
        console.log(e);
    }
}

start();