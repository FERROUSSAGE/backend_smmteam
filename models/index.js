const sequelize = require('../db');
const { DataTypes, Sequelize} = require('sequelize');

const User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Role = sequelize.define('role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Reseller = sequelize.define('reseller', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    api_key: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

const ResellerType = sequelize.define('reseller_type', {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
})

const Order = sequelize.define('order', {
    idSmmcraft: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idProject: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    socialNetwork: {
      type: DataTypes.STRING,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cost: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    spend: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    countOrdered: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    countViews: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    payment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateCreate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING,
      defaultValue: new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' }),
      allowNull: true
    }
})

const Message = sequelize.define('message', {
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nickName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chatId: {
      type: DataTypes.INTEGER, 
      allowNull: false
    },
})

const Question = sequelize.define('question', {
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})

const Answer = sequelize.define('answer', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})

Reseller.hasMany(ResellerType);
ResellerType.belongsTo(Reseller);

Reseller.hasMany(Order);
Order.belongsTo(Reseller);

ResellerType.hasMany(Order);
Order.belongsTo(ResellerType);

User.hasMany(Order);
Order.belongsTo(User);

Role.hasMany(User);
User.belongsTo(Role);

Answer.hasMany(Question);
Question.belongsTo(Answer);

module.exports = {
    User, 
    Reseller,
    ResellerType,
    Order,
    Message,
    Question,
    Answer
}