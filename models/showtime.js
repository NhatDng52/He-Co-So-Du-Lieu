// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const Phim = require('./film'); // Import the Film model
// const Phong = require('./room')
// const ChiNhanh = require('./branch')
// const SuatChieu = sequelize.define('suat_chieu', {
//   ma_suat_chieu: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     field: 'ma_suat_chieu'
//   },
//   gio: {
//     type: DataTypes.TIME,
//     allowNull: false,
//     field: 'gio'
//   },
//   ngay_thang: {
//     type: DataTypes.DATEONLY,
//     allowNull: false,
//     field: 'ngay_thang'
//   },
//   ma_phim: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: Phim,
//       key: 'ma_phim'
//     },
//     field: 'ma_phim'
//   },
//   so_phong: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: Phong,
//       key: 'so_phong'
//     },
//     field: 'so_phong'
//   },
//   ma_chi_nhanh: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: ChiNhanh,
//       key: 'ma_chi_nhanh'
//     },
//     field: 'ma_chi_nhanh'
//   }
// }, {
//   tableName: 'suat_chieu',
//   timestamps: false
// });

// SuatChieu.belongsTo(Phim, { foreignKey: 'ma_phim' });
// SuatChieu.belongsTo(Phong, { foreignKey: 'so_phong' });
// SuatChieu.belongsTo(ChiNhanh, { foreignKey: 'ma_chi_nhanh' });
// module.exports = SuatChieu;