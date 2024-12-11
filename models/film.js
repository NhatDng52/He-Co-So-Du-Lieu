// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Phim = sequelize.define('Phim', {
//   ma_phim: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     field: 'ma_phim'
//   },
//   ten_phim: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     field: 'ten_phim'
//   },
//   do_tuoi: {
//     type: DataTypes.STRING,
//     field: 'do_tuoi'
//   },
//   nam_san_xuat: {
//     type: DataTypes.INTEGER,
//     field: 'nam_san_xuat'
//   },
//   rating: {
//     type: DataTypes.FLOAT,
//     field: 'rating'
//   },
//   duration: {
//     type: DataTypes.INTEGER,
//     field: 'thoi_luong'
//   },
//   link_poster: {
//     type: DataTypes.STRING,
//     field: 'link_poster'
//   },
//   link_phim: {
//     type: DataTypes.STRING,
//     field: 'link_phim'
//   },
//   mo_ta: {
//     type: DataTypes.TEXT,
//     field: 'mo_ta'
//   },
//   nhan_phim: {
//     type: DataTypes.STRING,
//     field: 'nhan_phim'
//   }
// }, {
//   tableName: 'phim',
//   timestamps: false
// });

// module.exports = Phim;