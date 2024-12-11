// // models/ticket.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Ve = sequelize.define('Ve', {
//   ma_ve: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     field: 'ma_ve'
//   },
//   trang_thai: {
//     type: DataTypes.ENUM('mua', 'chua_mua'),
//     allowNull: false,
//     defaultValue: 'chua_mua',
//     field: 'trang_thai'
//   },
//   ma_giao_dich: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'TongVe',  // Reference to the sumTicket table
//       key: 'ma_giao_dich',
//     },
//     field: 'ma_giao_dich'
//   },
//   so_ghe: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     field: 'so_ghe'
//   },
//   so_phong: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     field: 'so_phong'
//   },
//   ma_chi_nhanh: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     field: 'ma_chi_nhanh'
//   },
//   ma_suat_chieu: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     field: 'ma_suat_chieu'
//   }
// }, {
//   tableName: 've',
//   timestamps: false
// });

// module.exports = Ve;