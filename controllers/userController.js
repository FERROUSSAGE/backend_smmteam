const ApiError = require("../error/apiError");
const bcrypt = require('bcrypt');
const { User } = require('../models');

class UserController {
    async registration(req, res, next) {
        const { name, login, password, roleId } = req.body;

        if(!login || !name || !password || !roleId)
            return next(ApiError.internal('Заполните все поля ввода!'));
        
        try{
            const candidate = await User.findOne({where: { login }});
            if(candidate)
                return next(ApiError.badRequest('Пользователь с таким логином существует!'));

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ name, login, password: hashPassword, roleId });
            return res.json({ status: true, response: [user] });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }
    async login(req, res, next){
        const {login, password } = req.body;
        if(!login || !password)
            return next(ApiError.internal('Заполните все поля ввода!'));
        
        try{
            const user = await User.findOne({where: { login }});
            if(!user)
                return next(ApiError.badRequest('Логин либо пароль не верны!'));

            const comparePassword = bcrypt.compareSync(password, user.password);
            if(!comparePassword)
                return next(ApiError.badRequest('Логин либо пароль не верны!'));

            const result = {
                id: user.id,
                name: user.name,
                password, 
                roleId: user.roleId
            }
            return res.json({ status: true, response: [result] });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }
    async getAll(req, res, next){
        try{
            const user = await User.findAll();
            res.json({ status: true, response: user });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }

    async getById(req, res, next){
        const { id } = req.params;
        try{
            const user = await User.findOne({ where: { id } });
            if(user)
                return res.json({ status: true,response: user })
        } catch(e){
            return next(ApiError.internal(e));
        }
    }
    
    async deleteUser(req, res, next){
        const { id } = req.params;
        if(!id)
            return next(ApiError.internal('Не был передан параметр -id-'));

        try{
             const orderDelete = await User.destroy({ where: { id } });
            if(orderDelete)
                res.json({ status: true, message: 'Удаление прошло успешно!' });
            else 
                res.json({ status: false, message: 'Произошла ошибка в удалении' });
        } catch(e){
            return next(ApiError.internal(e));
        }
    }

}

module.exports = new UserController();