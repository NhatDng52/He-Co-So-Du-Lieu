const { sql } = require('../db');

// Lấy danh sách phim
const getAllMovies = async () => {
  try {
    const result = await sql.query`SELECT * FROM PHIM`;
    return result.recordset;
  } catch (error) {
    throw new Error('Lỗi khi truy vấn cơ sở dữ liệu: ' + error.message);
  }
};

const getMovieById = async (id) => {
  try {
    const result = await sql.query`
      SELECT * FROM PHIM WHERE Ma_phim = ${id}
    `;
    return result.recordset[0]; // Chỉ lấy một phim
  } catch (error) {
    throw new Error('Lỗi khi truy vấn phim: ' + error.message);
  }
};

// Thêm phim mới
const addMovie = async (title, ageRating, releaseYear, rating, duration, posterLink, filmLink, description, ratingIndex) => {
  try {
    const result = await sql.query`
      INSERT INTO PHIM (Ten_phim, Do_tuoi, Nam_san_xuat, Rating, Thoi_luong, Link_poster, Link_phim, Mo_ta, Nhan_phim)
      VALUES (${title}, ${ageRating}, ${releaseYear}, ${rating}, ${duration}, ${posterLink}, ${filmLink}, ${description}, ${ratingIndex})
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw new Error('Lỗi khi thêm phim vào cơ sở dữ liệu: ' + error.message);
  }
};

// Cập nhật thông tin phim
const updateMovie = async (id, title, ageRating, releaseYear, rating, duration, posterLink, filmLink, description, ratingIndex) => {
  try {
    const result = await sql.query`
      UPDATE PHIM 
      SET Ten_phim = ${title}, Do_tuoi = ${ageRating}, Nam_san_xuat = ${releaseYear}, Rating = ${rating}, 
          Thoi_luong = ${duration}, Link_poster = ${posterLink}, Link_phim = ${filmLink}, Mo_ta = ${description}, Nhan_phim = ${ratingIndex}
      WHERE Ma_phim = ${id}
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw new Error('Lỗi khi cập nhật phim: ' + error.message);
  }
};

// Xóa phim
const deleteMovie = async (id) => {
  try {
    const result = await sql.query`
      DELETE FROM PHIM WHERE Ma_phim = ${id}
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw new Error('Lỗi khi xóa phim: ' + error.message);
  }
};

// Tìm kiếm phim theo tên
const searchMovies = async (searchTerm) => {
  try {
    const result = await sql.query`
      SELECT * FROM PHIM WHERE Ten_phim LIKE ${'%' + searchTerm + '%'}
    `;
    return result.recordset;
  } catch (error) {
    throw new Error('Lỗi khi tìm kiếm phim: ' + error.message);
  }
};

// Lấy phim và suất chiếu trong ngày cụ thể
const getMoviesByDate = async (date) => {
  try {
    const result = await sql.query`
      EXEC GetMoviesByDate @Date = ${date}
    `;
    return result.recordset;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách phim theo ngày: ' + error.message);
  }
};

// Thêm đạo diễn vào phim
const addDirector = async (movieId, directorName) => {
  try {
    const result = await sql.query`
      INSERT INTO DAO_DIEN (Ma_phim, Dao_dien) 
      VALUES (${movieId}, ${directorName})
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw new Error('Lỗi khi thêm đạo diễn: ' + error.message);
  }
};

// Xóa đạo diễn của phim
const deleteDirector = async (movieId, directorName) => {
  try {
    const result = await sql.query`
      DELETE FROM DAO_DIEN WHERE Ma_phim = ${movieId} AND Dao_dien = ${directorName}
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw new Error('Lỗi khi xóa đạo diễn: ' + error.message);
  }
};

// Thêm diễn viên chính vào phim
const addMainActor = async (movieId, actorName) => {
  try {
    const result = await sql.query`
      INSERT INTO DIEN_VIEN_CHINH (Ma_phim, Dien_vien_chinh)
      VALUES (${movieId}, ${actorName})
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw new Error('Lỗi khi thêm diễn viên chính: ' + error.message);
  }
};

// Xóa diễn viên chính của phim
const deleteMainActor = async (movieId, actorName) => {
  try {
    const result = await sql.query`
      DELETE FROM DIEN_VIEN_CHINH WHERE Ma_phim = ${movieId} AND Dien_vien_chinh = ${actorName}
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw new Error('Lỗi khi xóa diễn viên chính: ' + error.message);
  }
};

// Thêm thể loại cho phim
const addGenre = async (movieId, genre) => {
  try {
    const result = await sql.query`
      INSERT INTO THE_LOAI (Ma_phim, The_loai)
      VALUES (${movieId}, ${genre})
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw new Error('Lỗi khi thêm thể loại: ' + error.message);
  }
};

// Xóa thể loại của phim
const deleteGenre = async (movieId, genre) => {
  try {
    const result = await sql.query`
      DELETE FROM THE_LOAI WHERE Ma_phim = ${movieId} AND The_loai = ${genre}
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw new Error('Lỗi khi xóa thể loại: ' + error.message);
  }
};

// Thêm suất chiếu cho phim
const addShowtime = async (movieId, time, date, roomNumber, branchId) => {
  try {
    const result = await sql.query`
      INSERT INTO SUAT_CHIEU (Ma_phim, Gio, Ngay_thang, So_phong, Ma_chi_nhanh)
      VALUES (${movieId}, ${time}, ${date}, ${roomNumber}, ${branchId})
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw new Error('Lỗi khi thêm suất chiếu: ' + error.message);
  }
};

// Xóa suất chiếu của phim
const deleteShowtime = async (movieId, phimId) => {
  try {
    const result = await sql.query`
      DELETE FROM SUAT_CHIEU WHERE Ma_phim = ${movieId} AND Ma_suat_chieu = ${phimId}
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw new Error('Lỗi khi xóa suất chiếu: ' + error.message);
  }
};

const getDirectorsByMovieId = async (movieId) => {
  try {
    const result = await sql.query`
      SELECT Dao_dien FROM DAO_DIEN WHERE Ma_phim = ${movieId}
    `;
    return result.recordset;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách đạo diễn: ' + error.message);
  }
};

// Lấy danh sách diễn viên chính theo mã phim
const getMainActorsByMovieId = async (movieId) => {
  try {
    const result = await sql.query`
      SELECT Dien_vien_chinh FROM DIEN_VIEN_CHINH WHERE Ma_phim = ${movieId}
    `;
    return result.recordset;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách diễn viên chính: ' + error.message);
  }
};

// Lấy danh sách thể loại theo mã phim
const getGenresByMovieId = async (movieId) => {
  try {
    const result = await sql.query`
      SELECT The_loai FROM THE_LOAI WHERE Ma_phim = ${movieId}
    `;
    return result.recordset;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách thể loại: ' + error.message);
  }
};

// Lấy danh sách suất chiếu theo mã phim
const getShowtimesByMovieId = async (movieId) => {
  try {
    const result = await sql.query`
      SELECT * FROM SUAT_CHIEU WHERE Ma_phim = ${movieId}
    `;
    return result.recordset;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách suất chiếu: ' + error.message);
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  getDirectorsByMovieId,
  getMainActorsByMovieId,
  getGenresByMovieId,
  getShowtimesByMovieId,
  addMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
  getMoviesByDate,
  addDirector,
  deleteDirector,
  addMainActor,
  deleteMainActor,
  addGenre,
  deleteGenre,
  addShowtime,
  deleteShowtime
};