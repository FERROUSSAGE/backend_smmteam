const ApiError = require('../../error/apiError');
const { GMAIL, GPASSWORD } = require('../../utils/consts');

const nodemailer = require('nodemailer');

class NodemailerController{
    async send(req, res, next){

        const { mail, idSmmcraft, text = null, subject } = req.body;

        if(!mail || !idSmmcraft || !text || !subject)
            return next(ApiError.internal('Заполните все поля ввода!'));

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: GMAIL,
                    pass: GPASSWORD,
                },
            });

            const result = await transporter.sendMail({
                from: '"smmcraft.ru" <team@smmcraft.ru>',
                to: mail,
                subject,
                html: '',
            });

            console.log(result);

        } catch (e) {
            return next(ApiError.internal(e));
        }

    }
}

module.exports = new NodemailerController();