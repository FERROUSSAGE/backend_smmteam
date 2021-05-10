const ApiError = require('../../error/apiError');
const { GMAIL, GPASSWORD } = require('../../utils/consts');

const nodemailer = require('nodemailer');

class NodemailerController{
    async send(req, res, next){

        const { mail, subject, html } = req.body;

        if(!mail || !html)
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

            try {
                const sent = await transporter.sendMail({
                    from: '"smmcraft.ru" <team@smmcraft.ru>',
                    to: mail,
                    subject: subject ? subject : 'Вам письмо от smmcraft.ru',
                    html,
                });
                console.log(sent);

                return res.json({ status: true, response: { toMail: mail, msg: 'Сообщение успешно отправлено!' } });
    
            } catch (e) {
                return next(ApiError.internal(e));
            }

        } catch (e) {
            return next(ApiError.internal(e));
        }

    }
}

module.exports = new NodemailerController();