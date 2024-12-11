// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const ChiNhanh = require('./branch');
// const SuatChieu = require('./showtime');
// const Phong = sequelize.define('phong', {
//   so_phong: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     field: 'so_phong'
//   },
//   ma_chi_nhanh: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: ChiNhanh,
//       key: 'ma_chi_nhanh'
//     },
//     field: 'ma_chi_nhanh'
//   },
//   tong_so_ghe: {
//     type: DataTypes.INTEGER,
//     field: 'tong_so_ghe'
//   },
//   mo_ta: {
//     type: DataTypes.STRING,
//     field: 'mo_ta'
//   },
//   toa_do_x: {
//     type: DataTypes.INTEGER,
//     field: 'toa_do_x'
//   },
//   toa_do_y: {
//     type: DataTypes.INTEGER,
//     field: 'toa_do_y'
//   },
//   kich_thuoc: {
//     type: DataTypes.STRING,
//     field: 'kich_thuoc'
//   },
//   loai_phong: {
//     type: DataTypes.STRING,
//     field: 'loai_phong'
//   }
// }, {
//   tableName: 'phong',
//   timestamps: false
// });

// Phong.belongsTo(ChiNhanh, { foreignKey: 'ma_chi_nhanh' });
// module.exports = Phong;