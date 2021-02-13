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
        allowNull: false
    }
})

const ResellerType = sequelize.define('reseller_type', {
  name: {
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
  }
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
    allowNull: false
  },
  countOrdered: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  countViews: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  payment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
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
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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

module.exports = {
    User, 
    Reseller,
    ResellerType,
    Order,
    Message
}