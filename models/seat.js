const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Phong = require('./room');

const Ghe = sequelize.define('ghe', {
  so_ghe: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'so_ghe'
  },
  so_phong: {
    so_phong: DataTypes.INTEGER,
    references: {
      model: Phong,
      key: 'so_phong'
    },
    field: 'so_phong'
  },
  ma_chi_nhanh: {
    type: DataTypes.INTEGER,
    field: 'ma_chi_nhanh'
  },
  loai_ghe: {
    type: DataTypes.STRING,
    field: 'loai_ghe'
  },
  trang_thai: {
    type: DataTypes.STRING,
    field: 'trang_thai'
  },
  toa_do_x: {
    type: DataTypes.FLOAT,
    field: 'toa_do_x'
  },
  toa_do_y: {
    type: DataTypes.FLOAT,
    field: 'toa_do_y'
  },
  kich_thuoc: {
    type: DataTypes.STRING,
    field: 'kich_thuoc'
  },
  gia_ghe: {
    type: DataTypes.FLOAT,
    field: 'gia_ghe'
  }
}, {
  tableName: 'ghe',
  timestamps: false
});

Ghe.belongsTo(Phong, { foreignKey: 'so_phong' });

module.exports = Ghe;