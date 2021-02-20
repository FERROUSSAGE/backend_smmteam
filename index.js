require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app)

module.exports = require('socket.io')(http);

const bot = require('./bot').bot;

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
