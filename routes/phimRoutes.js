const express = require('express');
const phimModel = require('../models/phimModel');
const router = express.Router();
const moment = require('moment');

// Lấy tất cả danh sách phim và render ra trang movie.ejs
router.get('/phim', async (req, res) => {

  // const {searchTerm,date} = req

  try {
    const movies = await phimModel.getAllMovies();
    res.render('movie', { movies });
  } catch (error) {
    res.status(500).send('Lỗi khi truy vấn cơ sở dữ liệu: ' + error.message);
  }
});

// Thêm phim mới
router.get('/phim/add', (req, res) => {
  res.render('addMovie');  // Render ra form thêm phim
}); 

router.post('/phim', async (req, res) => {
    const { title, ageRating, releaseYear, rating, duration, posterLink, filmLink, description, ratingIndex } = req.body;
  
    // Kiểm tra các trường bắt buộc
    if (!title || !ageRating || !releaseYear || !rating || !duration) {
      return res.status(400).send('Thiếu thông tin bắt buộc: Tiêu đề, độ tuổi, năm sản xuất, rating, và thời lượng là bắt buộc');
    }
  
    try {
      // Gọi model để thêm phim vào cơ sở dữ liệu
      const success = await phimModel.addMovie(title, ageRating, releaseYear, rating, duration, posterLink, filmLink, description, ratingIndex);
  
      if (success) {
        // Sau khi thêm phim thành công, chuyển hướng về danh sách phim
        res.redirect('/api/phim');  
      } else {
        // Trường hợp không thể thêm phim
        res.status(400).send('Không thể thêm phim vào cơ sở dữ liệu');
      }
    } catch (error) {
      // Nếu có lỗi khi thực hiện thêm phim
      console.error(error);  // Log lỗi ra console để dễ dàng theo dõi
      res.status(500).send('Lỗi khi thêm phim vào cơ sở dữ liệu: ' + error.message);
    }
  });
  

// Cập nhật thông tin phim
router.get('/phim/edit/:id', async (req, res) => {
    const movieId = req.params.id;
  
    try {
      const movie = await phimModel.getMovieById(movieId);  // Sửa lại hàm để lấy phim theo ID
      if (movie) {
        res.render('editMovie', { movie });
      } else {
        res.status(404).send('Không tìm thấy phim');
      }
    } catch (error) {
      res.status(500).send('Lỗi khi truy vấn cơ sở dữ liệu: ' + error.message);
    }
  });
  

  router.post('/phim/edit/:id', async (req, res) => {
    const { title, ageRating, releaseYear, rating, duration, posterLink, filmLink, description, ratingIndex } = req.body;
    const movieId = req.params.id;
  
    // Kiểm tra dữ liệu đầu vào
    if (!title || !ageRating || !releaseYear || !rating || !duration) {
      return res.status(400).send('Thiếu thông tin cần thiết');
    }
  
    try {
      const success = await phimModel.updateMovie(movieId, title, ageRating, releaseYear, rating, duration, posterLink, filmLink, description, ratingIndex);
      if (success) {
        res.redirect('/api/phim');
      } else {
        res.status(400).send('Không thể cập nhật phim');
      }
    } catch (error) {
      res.status(500).send('Lỗi khi cập nhật phim: ' + error.message);
    }
  });
  

// Xóa phim
router.get('/phim/delete/:id', async (req, res) => {
    const movieId = req.params.id;
  
    try {
      const success = await phimModel.deleteMovie(movieId);
      if (success) {
        res.redirect('/api/phim');
      } else {
        req.flash('error', 'Không thể xóa phim vì có suất chiếu liên quan.');
        res.redirect('/api/phim');
      }
    } catch (error) {
      req.flash('error', 'Lỗi khi xóa phim: ' + error.message);
      res.redirect('/api/phim');
    }
  });
  

// Tìm kiếm phim theo tên
// router.get('/phim/search', async (req, res) => {
//   const { searchTerm } = req.query;

//   if (!searchTerm) {
//     return res.status(400).send('Thiếu từ khóa tìm kiếm');
//   }

//   try {
//     const movies = await phimModel.searchMovies(searchTerm);
//     res.render('movie', { movies });
//   } catch (error) {
//     res.status(500).send('Lỗi khi tìm kiếm phim: ' + error.message);
//   }
// });
// Tìm kiếm phim theo tên và ngày (nếu có ngày trong query)
router.get('/phim/search', async (req, res) => {
  const { searchTerm, date } = req.query;

  console.log(searchTerm,date)

  if (!searchTerm) {
    return res.status(400).send('Thiếu từ khóa tìm kiếm');
  }


  try {
    let movies;
    if (date) {
      // Nếu có ngày thì tìm kiếm phim theo tên và ngày
      movies = await phimModel.searchMoviesByNameAndDate(searchTerm, date);
    } else {
      // Nếu không có ngày thì tìm kiếm theo tên phim
      movies = await phimModel.searchMovies(searchTerm);
    }
    
    res.render('movie', { movies });  // Truyền danh sách phim vào view
  } catch (error) {
    res.status(500).send('Lỗi khi tìm kiếm phim: ' + error.message);
  }
});

// Tìm kiếm phim theo tên và ngày
router.get('/phim/searchByNameAndDate', async (req, res) => {

  // console.log(req.query)
  let { searchTerm, date } = req.query; // Nhận cả 'searchTerm' và 'date' từ query string
  console.log("CO du lieu search",searchTerm)
  console.log("CO  du lieu date",date)
  
  // Kiểm tra xem có thiếu tham số không
  if (!searchTerm && !date) {
    return res.status(400).send('Thiếu từ khóa tìm kiếm hoặc ngày để truy vấn');
  }


  try {
    const movies = await phimModel.searchMoviesByNameAndDate(searchTerm, date);  // Gọi hàm model tìm kiếm
    res.render('movie', { movies });  // Truyền danh sách phim tìm thấy vào view
  } catch (error) {
    res.status(500).send('Lỗi khi tìm kiếm phim theo tên và ngày: ' + error.message);
  }
});

// Lấy phim và suất chiếu trong ngày cụ thể
router.get('/phim/date', async (req, res) => {
    const { date } = req.query;  // Sử dụng req.query thay vì req.params
  
    if (!date) {
      return res.status(400).send('Thiếu ngày để truy vấn');
    }
  
    try {
      const movies = await phimModel.getMoviesByDate(date);  // Lấy phim theo ngày từ model
      res.render('movie', { movies });  // Truyền danh sách phim vào view
    } catch (error) {
      res.status(500).send('Lỗi khi lấy danh sách phim theo ngày: ' + error.message);
    }
  });




  // Thêm đạo diễn vào phim
router.post('/phim/:id/director', async (req, res) => {
    const { directorName } = req.body;
    const movieId = req.params.id;
  
    try {
      const success = await phimModel.addDirector(movieId, directorName);
      if (success) {
        res.redirect(`/api/phim/${movieId}`)
      } else {
        res.status(400).send('Không thể thêm đạo diễn');
      }
    } catch (error) {
      res.status(500).send('Lỗi khi thêm đạo diễn: ' + error.message);
    }
  });
  
  // Xóa đạo diễn của phim
  router.post('/phim/:id/delete/director', async (req, res) => {
    const { directorName } = req.body;
    const movieId = req.params.id;
  
    try {
      const success = await phimModel.deleteDirector(movieId, directorName);
      if (success) {
        res.redirect(`/api/phim/${movieId}`)
      } else {
        res.status(400).send('Không thể xóa đạo diễn');
      }
    } catch (error) {
      res.status(500).send('Lỗi khi xóa đạo diễn: ' + error.message);
    }
  });
  
  // Thêm diễn viên chính vào phim
  router.post('/phim/:id/actor', async (req, res) => {
    const { actorName } = req.body;
    const movieId = req.params.id;
  
    try {
      const success = await phimModel.addMainActor(movieId, actorName);
      if (success) {
        res.redirect(`/api/phim/${movieId}`)
      } else {
        res.status(400).send('Không thể thêm diễn viên chính');
      }
    } catch (error) {
      res.status(500).send('Lỗi khi thêm diễn viên chính: ' + error.message);
    }
  });
  
  // Xóa diễn viên chính của phim
  router.post('/phim/:id/delete/actor', async (req, res) => {
    const { actorName } = req.body;
    const movieId = req.params.id;
  
    try {
      const success = await phimModel.deleteMainActor(movieId, actorName);
      if (success) {
        res.redirect(`/api/phim/${movieId}`)
      } else {
        res.status(400).send('Không thể xóa diễn viên chính');
      }
    } catch (error) {
      res.status(500).send('Lỗi khi xóa diễn viên chính: ' + error.message);
    }
  });
  
  // Thêm thể loại cho phim
  router.post('/phim/:id/genre', async (req, res) => {
    const { genre } = req.body;
    const movieId = req.params.id;
  
    try {
      const success = await phimModel.addGenre(movieId, genre);
      if (success) {
        res.redirect(`/api/phim/${movieId}`)
      } else {
        res.status(400).send('Không thể thêm thể loại');
      }
    } catch (error) {
      res.status(500).send('Lỗi khi thêm thể loại: ' + error.message);
    }
  });
  
  // Xóa thể loại của phim
  router.post('/phim/:id/delete/genre', async (req, res) => {
    const { genre } = req.body;
    const movieId = req.params.id;
  
    try {
      const success = await phimModel.deleteGenre(movieId, genre);
      if (success) {
        res.redirect(`/api/phim/${movieId}`)
      } else {
        res.status(400).send('Không thể xóa thể loại');
      }
    } catch (error) {
      res.status(500).send('Lỗi khi xóa thể loại: ' + error.message);
    }
  });
  
  // Thêm suất chiếu cho phim
  router.post('/phim/:id/showtime', async (req, res) => {
    const { time, date, roomNumber, branchId } = req.body;
    const movieId = req.params.id;
    console.log(time)
    try {
      const success = await phimModel.addShowtime(movieId, time, date, roomNumber, branchId);
      if (success) {
        res.redirect(`/api/phim/${movieId}`)
    } else {
        res.status(400).send('Không thể thêm suất chiếu');
      }
    } catch (error) {
      res.status(500).send('Lỗi khi thêm suất chiếu: ' + error.message);
    }
  });

 router.post('/phim/:id/delete/showtime', async (req, res) => {
    const movieId = req.params.id;
    const showtimeId = req.body.showtimeId; // Mã suất chiếu cần xóa
    try {
      // Gọi hàm xóa suất chiếu từ model, truyền mã phim và mã suất chiếu
      const success = await phimModel.deleteShowtime(movieId, showtimeId);
      if (success) {
        // Lấy lại thông tin chi tiết phim và render lại trang với thông báo thành công
        const movie = await phimModel.getMovieById(movieId);
        const directors = await phimModel.getDirectorsByMovieId(movieId);
        const actors = await phimModel.getMainActorsByMovieId(movieId);
        const genres = await phimModel.getGenresByMovieId(movieId);
        const showtimes = await phimModel.getShowtimesByMovieId(movieId);
  
       res.redirect(`/api/phim/${movieId}`)
      } else {
        res.render('movie-detail', {
          movie,
          directors,
          actors,
          genres,
          showtimes,
          message: 'Không thể xóa suất chiếu' // Thông báo thất bại
        });
      }
    } catch (error) {
      res.status(500).send('Lỗi khi xóa suất chiếu: ' + error.message);
    }
  });
  
  
  
 router.get('/phim/:id', async (req, res) => {
  const movieId = req.params.id;

  try {
    // Lấy thông tin chi tiết của phim
    const movie = await phimModel.getMovieById(movieId);
    if (!movie) {
      return res.status(404).send('Phim không tồn tại');
    }

    // Lấy danh sách đạo diễn, diễn viên, thể loại, suất chiếu
    const directors = await phimModel.getDirectorsByMovieId(movieId);
    const actors = await phimModel.getMainActorsByMovieId(movieId);
    const genres = await phimModel.getGenresByMovieId(movieId);
    const showtimes = await phimModel.getShowtimesByMovieId(movieId);
    console.log(showtimes);
    const formattedShowtimes = showtimes.map(showtime => {
        // const formattedTime = moment.ist(showtime.Gio).local().format('HH:mm'); // Định dạng giờ theo 24h, múi giờ địa phương
        const formattedTime = moment(showtime.Gio, 'HH:mm:ss.SSSSSSS').format('HH:mm');
        const formattedDate = moment.utc(showtime.Ngay_thang).local().format('DD/MM/YYYY'); // Định dạng ngày theo kiểu DD/MM/YYYY
  return {
    ...showtime,
    Gio: formattedTime,
    Ngay_thang: formattedDate,
  };
      });

    // Trả về thông tin chi tiết phim
    res.render('movie-detail', {
      movie,
      directors,
      actors,
      genres,
      showtimes: formattedShowtimes
    });
  } catch (error) {
    res.status(500).send('Lỗi khi lấy thông tin phim: ' + error.message);
  }
});

module.exports = router;