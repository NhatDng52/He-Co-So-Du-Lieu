// models/sumTicket.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TongVe = sequelize.define('TongVe', {
  ma_giao_dich: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ma_giao_dich'
  },
  gia_tong: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'gia_tong'
  },
  ma_so_nguoi: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'ma_so_nguoi'
  }
}, {
  tableName: 'tong_ve',
  timestamps: false
});

module.exports = TongVe;