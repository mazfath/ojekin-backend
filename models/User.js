const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role: {
    type: DataTypes.ENUM('customer', 'driver', 'admin'),
    allowNull: false,
    defaultValue: 'customer',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  foto_profile: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'users',
  timestamps: true, // createdAt dan updatedAt otomatis
  underscored: true, // kolom: created_at, updated_at
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  },
});

// Validasi password saat login
User.prototype.validPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
