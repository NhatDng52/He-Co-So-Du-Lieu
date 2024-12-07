// Thực hiện tìm kiếm phim
function searchMovies() {
    const searchQuery = document.getElementById('searchInput').value;
    
    fetch(`/api/phim/search?query=${searchQuery}`)
        .then(response => response.json())
        .then(movies => {
            renderMovies(movies);
        })
        .catch(error => console.log('Lỗi khi tìm kiếm phim:', error));
}

// Hiển thị danh sách phim
function renderMovies(movies) {
    const tableBody = document.getElementById('movieTableBody');
    tableBody.innerHTML = '';  // Xóa nội dung hiện tại của bảng

    movies.forEach((movie, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${movie.Title}</td>
            <td>${movie.AgeRating}</td>
            <td>${movie.ReleaseYear}</td>
            <td>${movie.Rating}</td>
            <td>
                <button onclick="editMovie(${movie.ID})">Cập nhật</button>
                <button onclick="deleteMovie(${movie.ID})">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Thêm phim mới
function addMovie(event) {
    event.preventDefault();  // Ngừng form từ việc reload trang

    const movieTitle = document.getElementById('movieTitle').value;
    const ageRating = document.getElementById('ageRating').value;
    const releaseYear = document.getElementById('releaseYear').value;
    const rating = document.getElementById('rating').value;

    const movieData = {
        Title: movieTitle,
        AgeRating: ageRating,
        ReleaseYear: releaseYear,
        Rating: rating
    };

    fetch('/api/phim', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Phim đã được thêm thành công!');
        searchMovies();  // Tìm kiếm lại để cập nhật danh sách
    })
    .catch(error => console.log('Lỗi khi thêm phim:', error));
}

// Cập nhật thông tin phim
function editMovie(movieId) {
    // Bạn có thể tạo một form chỉnh sửa để cập nhật thông tin phim, 
    // hoặc mở một modal chứa các thông tin cần chỉnh sửa
    alert('Chức năng cập nhật phim đang được triển khai!');
}

// Xóa phim
function deleteMovie(movieId) {
    if (confirm('Bạn có chắc chắn muốn xóa phim này?')) {
        fetch(`/api/phim/${movieId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Phim đã được xóa!');
            searchMovies();  // Tìm kiếm lại để cập nhật danh sách
        })
        .catch(error => console.log('Lỗi khi xóa phim:', error));
    }
}

// Load danh sách phim khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    searchMovies();  // Tải danh sách phim mặc định khi trang vừa tải
});
