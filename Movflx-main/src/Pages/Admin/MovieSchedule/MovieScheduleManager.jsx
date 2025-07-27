import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const API_BASE = "http://localhost:8080/api";

export default function MovieScheduleManager() {
    const navigate = useNavigate();
    const [movieDates, setMovieDates] = useState([]);
    const [movieSchedules, setMovieSchedules] = useState([]);
    const [showDates, setShowDates] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [movies, setMovies] = useState([]);
    const [form, setForm] = useState({
        movieId: "",
        showDateId: "",
        scheduleId: "",
    });
    const [showDateModal, setShowDateModal] = useState(false);
    const [scheduleModal, setScheduleModal] = useState(false);
    const [newShowDate, setNewShowDate] = useState({ dateName: "", showDate: "" });
    const [newSchedule, setNewSchedule] = useState({ scheduleTime: "" });
    const [deleteShowDateId, setDeleteShowDateId] = useState(null);
    const [deleteScheduleId, setDeleteScheduleId] = useState(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const selectedMovieId = params.get("movieId") || "";
    const [filterShowDateId, setFilterShowDateId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // Fetch all data
    const fetchAll = () => {
        axios.get(`${API_BASE}/movies`).then(res => setMovies(res.data));
        axios.get(`${API_BASE}/movie-dates`).then(res => setMovieDates(res.data));
        axios.get(`${API_BASE}/movie-schedules`).then(res => setMovieSchedules(res.data));
        axios.get(`${API_BASE}/show-dates`).then(res => setShowDates(res.data));
        axios.get(`${API_BASE}/schedules`).then(res => setSchedules(res.data));
    };
    useEffect(fetchAll, []);

    useEffect(() => {
        if (selectedMovieId) {
            setForm(f => ({ ...f, movieId: selectedMovieId }));
        }
    }, [selectedMovieId]);
    useEffect(() => {
        if (selectedMovieId && filterShowDateId) {
            axios
                .get(`${API_BASE}/schedules/by-movie-date`, {
                    params: { movieId: selectedMovieId, showDateId: filterShowDateId }
                })
                .then(res => setSchedules(res.data))
                .catch(() => setSchedules([]));
        } else {
            // Nếu không lọc thì lấy toàn bộ giờ chiếu
            axios.get(`${API_BASE}/schedules`).then(res => setSchedules(res.data));
        }
    }, [selectedMovieId, filterShowDateId]);
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // MovieDate CRUD
    const handleCreateMovieDate = async e => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/movie-dates`, {
                id: { movieId: form.movieId, showDateId: Number(form.showDateId) },
                movie: { movieId: form.movieId },
                showDates: { showDateId: Number(form.showDateId) }
            });
            toast.success("Thêm ngày chiếu cho phim thành công!");
            fetchAll();
        } catch (err) {
            toast.error("Thêm ngày chiếu cho phim thất bại!");
        }
    };
    const handleDeleteMovieDate = async (movieId, showDateId) => {
        try {
            await axios.delete(`${API_BASE}/movie-dates/${movieId}/${showDateId}`);
            toast.success("Xóa ngày chiếu khỏi phim thành công!");
            fetchAll();
        } catch (err) {
            toast.error("Xóa ngày chiếu khỏi phim thất bại!");
        }
    };

    // MovieSchedule CRUD
    const handleCreateMovieSchedule = async e => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/movie-schedules`, {
                id: { movieId: form.movieId, scheduleId: Number(form.scheduleId) },
                movie: { movieId: form.movieId },
                schedule: { scheduleId: Number(form.scheduleId) }
            });
            toast.success("Thêm suất chiếu cho phim thành công!");
            fetchAll();
        } catch (err) {
            toast.error("Thêm suất chiếu cho phim thất bại!");
        }
    };
    const handleDeleteMovieSchedule = async (movieId, scheduleId) => {
        try {
            await axios.delete(`${API_BASE}/movie-schedules/${movieId}/${scheduleId}`);
            toast.success("Xóa suất chiếu khỏi phim thành công!");
            fetchAll();
        } catch (err) {
            toast.error("Xóa suất chiếu khỏi phim thất bại!");
        }
    };

    // ShowDate CRUD
    const handleAddShowDate = async e => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/show-dates`, newShowDate);
            setShowDateModal(false);
            setNewShowDate({ dateName: "", showDate: "" });
            toast.success("Thêm ngày chiếu mới thành công!");
            fetchAll();
        } catch (err) {
            toast.error("Thêm ngày chiếu mới thất bại!");
        }
    };
    const handleDeleteShowDate = async id => {
        try {
            await axios.delete(`${API_BASE}/show-dates/${id}`);
            setDeleteShowDateId(null);
            toast.success("Xóa ngày chiếu thành công!");
            fetchAll();
        } catch (err) {
            toast.error("Xóa ngày chiếu thất bại!");
        }
    };

    // Schedule CRUD
    const handleAddSchedule = async e => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/schedules`, newSchedule);
            setScheduleModal(false);
            setNewSchedule({ scheduleTime: "" });
            toast.success("Thêm giờ chiếu thành công!");
            fetchAll();
        } catch (err) {
            toast.error("Thêm giờ chiếu thất bại!");
        }
    };
    const handleDeleteSchedule = async id => {
        try {
            await axios.delete(`${API_BASE}/schedules/${id}`);
            setDeleteScheduleId(null);
            toast.success("Xóa giờ chiếu thành công!");
            fetchAll();
        } catch (err) {
            alert("Giờ chiếu này đã được sử dụng, không thể xóa!");
            setDeleteScheduleId(null);
            toast.error("Xóa giờ chiếu thất bại!");
        }
    };

    // Filter & Pagination
    const filteredMovieDates = selectedMovieId
        ? movieDates.filter(md => md.movieId === selectedMovieId)
        : movieDates;
    const filteredMovieSchedules = selectedMovieId
        ? movieSchedules.filter(ms => ms.movieId === selectedMovieId)
        : movieSchedules;
    const filteredByShowDate = filterShowDateId
        ? filteredMovieSchedules.filter(ms => String(ms.showDateId) === String(filterShowDateId))
        : filteredMovieSchedules;
    const totalPages = Math.ceil(filteredByShowDate.length / pageSize);
    const paginatedSchedules = filteredByShowDate.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    useEffect(() => { setCurrentPage(1); }, [filterShowDateId, selectedMovieId]);
    const handleMovieSelect = (e) => {
        const movieId = e.target.value;
        setForm({ ...form, movieId });
        const params = new URLSearchParams(location.search);
        if (movieId) {
            params.set("movieId", movieId);
        } else {
            params.delete("movieId");
        }
        // Sử dụng navigate để cập nhật URL, React sẽ re-render
        navigate(`${location.pathname}?${params.toString()}`);
    };
    return (
        <>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
                    Quản lý lịch chiếu phim
                    {selectedMovieId && (
                        <span className="block text-base text-indigo-400 mt-2">
                            Movie ID: {selectedMovieId}
                        </span>
                    )}
                </h2>
                {/* Movie Date Form */}
                <form onSubmit={handleCreateMovieDate} className="mb-8 bg-indigo-50 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-600">Thêm ngày chiếu cho phim</h3>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <select
                            name="movieId"
                            value={form.movieId}
                            onChange={handleMovieSelect}
                            required
                            className="border rounded px-3 py-2 w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            disabled={!!selectedMovieId}
                        >
                            <option value="">Chọn phim</option>
                            {movies.map(m => (
                                <option key={m.movieId} value={m.movieId}>
                                    {m.movieNameEnglish || m.movieNameVn}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center gap-2 w-full md:w-60">
                            <select
                                name="showDateId"
                                value={form.showDateId}
                                onChange={handleChange}
                                required
                                className="border rounded px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">Chọn ngày chiếu</option>
                                {showDates.map(sd => (
                                    <option key={sd.showDateId} value={sd.showDateId}>
                                        {sd.dateName} ({sd.showDate})
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                onClick={() => setShowDateModal(true)}
                                title="Thêm ngày chiếu"
                            >+</button>
                            <button
                                type="button"
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                onClick={() => setDeleteShowDateId(form.showDateId)}
                                title="Xóa ngày chiếu"
                                disabled={!form.showDateId}
                            >-</button>
                        </div>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition ml-4"
                        >
                            Thêm MovieDate
                        </button>
                    </div>
                </form>
                {/* Modal thêm ngày chiếu */}
                {showDateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <form
                            onSubmit={handleAddShowDate}
                            className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md"
                        >
                            <h3 className="text-lg font-bold mb-4">Thêm ngày chiếu mới</h3>
                            <input
                                className="border rounded px-3 py-2 w-full mb-3"
                                placeholder="Tên ngày (ví dụ: Thứ 2)"
                                value={newShowDate.dateName}
                                onChange={e => setNewShowDate({ ...newShowDate, dateName: e.target.value })}
                                required
                            />
                            <input
                                className="border rounded px-3 py-2 w-full mb-3"
                                placeholder="Ngày (yyyy-MM-dd)"
                                type="date"
                                value={newShowDate.showDate}
                                onChange={e => setNewShowDate({ ...newShowDate, showDate: e.target.value })}
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowDateModal(false)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Thêm</button>
                            </div>
                        </form>
                    </div>
                )}
                {/* Modal xác nhận xóa ngày chiếu */}
                {deleteShowDateId && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">Xóa ngày chiếu?</h3>
                            <p>Bạn có chắc chắn muốn xóa ngày chiếu này?</p>
                            <div className="flex justify-end gap-2 mt-4">
                                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setDeleteShowDateId(null)}>Hủy</button>
                                <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => handleDeleteShowDate(deleteShowDateId)}>Xóa</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Movie Dates List */}
                <div className="mb-10">
                    <h4 className="font-semibold mb-2 text-indigo-500">Danh sách ngày chiếu:</h4>
                    <ul className="space-y-2">
                        {filteredMovieDates.map(md => (
                            <li
                                key={md.movieId + "-" + md.showDateId}
                                className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded shadow-sm hover:bg-indigo-50"
                            >
                                <span className="font-medium">{md.movieName} - {md.dateName} <span className="text-gray-500">({md.showDate})</span></span>
                                <button
                                    onClick={() => handleDeleteMovieDate(md.movieId, md.showDateId)}
                                    className="text-red-600 hover:text-white hover:bg-red-600 px-3 py-1 rounded transition"
                                >
                                    Xóa
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Movie Schedule Form */}
                <form onSubmit={handleCreateMovieSchedule} className="mb-8 bg-indigo-50 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-600">Thêm suất chiếu cho phim</h3>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <select
                            name="movieId"
                            value={form.movieId}
                            onChange={handleChange}
                            required
                            className="border rounded px-3 py-2 w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            disabled={!!selectedMovieId}
                        >
                            <option value="">Chọn phim</option>
                            {movies.map(m => (
                                <option key={m.movieId} value={m.movieId}>
                                    {m.movieNameEnglish || m.movieNameVn}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center gap-2 w-full md:w-60">
                            <select
                                name="scheduleId"
                                value={form.scheduleId}
                                onChange={handleChange}
                                required
                                className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">Chọn giờ chiếu</option>
                                {schedules.map(sc => (
                                    <option key={sc.scheduleId} value={sc.scheduleId}>
                                        {sc.scheduleTime}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                onClick={() => setScheduleModal(true)}
                                title="Thêm giờ chiếu"
                            >+</button>
                            <button
                                type="button"
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                onClick={() => setDeleteScheduleId(form.scheduleId)}
                                title="Xóa giờ chiếu"
                                disabled={!form.scheduleId}
                            >-</button>
                        </div>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                        >
                            Thêm MovieSchedule
                        </button>
                    </div>
                </form>
                {/* Modal thêm giờ chiếu */}
                {scheduleModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <form
                            onSubmit={handleAddSchedule}
                            className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md"
                        >
                            <h3 className="text-lg font-bold mb-4">Thêm giờ chiếu mới</h3>
                            <input
                                className="border rounded px-3 py-2 w-full mb-3"
                                placeholder="Giờ chiếu (hh:mm)"
                                type="time"
                                value={newSchedule.scheduleTime}
                                onChange={e => setNewSchedule({ ...newSchedule, scheduleTime: e.target.value })}
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setScheduleModal(false)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Thêm</button>
                            </div>
                        </form>
                    </div>
                )}
                {/* Modal xác nhận xóa giờ chiếu */}
                {deleteScheduleId && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">Xóa giờ chiếu?</h3>
                            <p>Bạn có chắc chắn muốn xóa giờ chiếu này?</p>
                            <div className="flex justify-end gap-2 mt-4">
                                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setDeleteScheduleId(null)}>Hủy</button>
                                <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => handleDeleteSchedule(deleteScheduleId)}>Xóa</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter by show date */}
                <div className="mb-4 flex items-center gap-4">
                    <label className="font-medium text-indigo-600">Lọc theo ngày chiếu:</label>
                    <select
                        value={filterShowDateId}
                        onChange={e => setFilterShowDateId(e.target.value)}
                        className="border rounded px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">Tất cả ngày</option>
                        {showDates.map(sd => (
                            <option key={sd.showDateId} value={sd.showDateId}>
                                {sd.dateName} ({sd.showDate})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Movie Schedules List */}
                <div>
                    <h4 className="font-semibold mb-2 text-indigo-500">Danh sách suất chiếu:</h4>
                    <ul className="space-y-2">
                        {(filterShowDateId
                            ? schedules // khi lọc thì dùng schedules từ API lọc
                            : paginatedSchedules // không lọc thì dùng phân trang từ movieSchedules
                        ).map((ms, idx) => (
                            <li
                                key={ms.movieId ? ms.movieId + "-" + ms.scheduleId : ms.scheduleId}
                                className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded shadow-sm hover:bg-indigo-50"
                            >
                                <span className="font-medium">
                                    {ms.movieName ? ms.movieName + " - " : ""}
                                    <span className="text-gray-600">{ms.scheduleTime}</span>
                                    {ms.dateName && (
                                        <span className="ml-2 text-gray-400 text-sm">
                                            ({ms.dateName} - {ms.showDate})
                                        </span>
                                    )}
                                </span>
                                <button
                                    onClick={() =>
                                        handleDeleteMovieSchedule(
                                            ms.movieId || form.movieId,
                                            ms.scheduleId
                                        )
                                    }
                                    className="text-red-600 hover:text-white hover:bg-red-600 px-3 py-1 rounded transition"
                                >
                                    Xóa
                                </button>
                            </li>
                        ))}
                    </ul>
                    {/* Pagination chỉ hiển thị khi không lọc */}
                    {!filterShowDateId && (
                        <div className="flex justify-center items-center gap-2 mt-6">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 font-semibold disabled:opacity-50"
                            >
                                Trước
                            </button>
                            <span>
                                Trang {currentPage} / {totalPages || 1}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 font-semibold disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}