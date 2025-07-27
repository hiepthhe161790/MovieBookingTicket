import React, { useState, useEffect, useMemo } from "react";
import { FiPlusCircle, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const MovieDashboard = () => {

    const [movies, setMovies] = useState([
        {
            id: "MOV001",
            englishName: "The Shawshank Redemption",
            vietnameseName: "Nhà tù Shawshank",
            director: "Frank Darabont",
            actor: "Tim Robbins",
            duration: 142,
            fromDate: "2024-01-01",
            toDate: "2024-02-01",
            types: ["Drama", "Crime"],
            image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1"
        }
    ]);

    //     [
    //     {
    //         "cinemaRoomId": 1,
    //         "roomName": "Phòng 1",
    //         "capacity": 120,
    //         "description": "Phòng chiếu tiêu chuẩn với âm thanh Dolby Digital"
    //     },
    //   ]
    // [
    //     {
    //         "typeId": 1,
    //         "typeName": "Action"
    //     },
    //     {
    //         "typeId": 2,
    //         "typeName": "Comedy"
    //     }
    // ]
    const [cinemaRooms, setCinemaRooms] = useState([]);
    const [movieTypes, setMovieTypes] = useState([]);
    const [currentMovie, setCurrentMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const navigate = useNavigate();
    useEffect(() => {
        fetch("http://localhost:8080/api/movies")
            .then(res => res.json())
            .then(data => {
                // Map backend fields to frontend fields
                const mapped = data.map(movie => ({
                    id: movie?.movieId,
                    englishName: movie?.movieNameEnglish,
                    vietnameseName: movie?.movieNameVn,
                    director: movie?.director,
                    actor: movie?.actor,
                    duration: movie?.duration,
                    fromDate: movie?.fromDate,
                    toDate: movie?.toDate,
                    types: movie?.types || [],
                    image: movie?.largeImage || movie?.smallImage || "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
                    cinemaRoomId: movie?.cinemaRoomId, // thêm dòng này
                    cinemaRoomName: movie?.cinemaRoomName, // nếu cần hiển thị tên phòng
                    version: movie?.version,
                    movieProductionCompany: movie?.movieProductionCompany,
                    content: movie?.content
                }));
                setMovies(mapped);
            })
            .catch(err => console.error(err));
    }, []);
    useEffect(() => {
        fetch("http://localhost:8080/api/cinema-rooms")
            .then(res => res.json())
            .then(data => {
                // Map backend fields to frontend fields
                const mapped = data.map(room => ({
                    cinemaRoomId: room?.cinemaRoomId,
                    roomName: room?.roomName,
                    capacity: room?.capacity,
                    description: room?.description
                }));
                setCinemaRooms(mapped);
            })
            .catch(err => console.error(err));
    }, []);
    // const movieTypes = ["All", "Action", "Drama", "Comedy", "Horror", "Romance"];
    useEffect(() => {
        fetch("http://localhost:8080/api/types")
            .then(res => res.json())
            .then(data => {
                // Lưu cả object type
                setMovieTypes([{ typeId: 0, typeName: "All" }, ...data]);
            })
            .catch(err => console.error(err));
    }, []);

    const filteredMovies = useMemo(() => {
        let selectedTypeName = "All";
        if (selectedType !== "All") {
            const found = movieTypes.find(t => t.typeId === Number(selectedType));
            selectedTypeName = found ? found.typeName : "All";
        }
        return movies.filter(movie => {
            const matchesSearch = movie?.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.vietnameseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.actor.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = selectedType === "All" || movie.types.includes(selectedTypeName);

            return matchesSearch && matchesType;
        });
    }, [movies, searchTerm, selectedType, movieTypes]);

    const handleAddMovie = (formData) => {
        const movieData = {
            movieId: formData.movieId,
            actor: formData.actor,
            cinemaRoom: { cinemaRoomId: Number(formData.cinemaRoomId) },
            content: formData.content,
            director: formData.director,
            duration: Number(formData.duration),
            fromDate: formData.fromDate,
            movieProductionCompany: formData.movieProductionCompany,
            toDate: formData.toDate,
            version: formData.version,
            movieNameEnglish: formData.englishName,
            movieNameVn: formData.vietnameseName,
            largeImage: formData.image || null,
            smallImage: formData.image || null,
            types: formData.types
        };
        fetch("http://localhost:8080/api/movies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movieData)
        })
            .then(res => {
                if (!res.ok) throw new Error("Thêm phim thất bại");
                return res.json();
            })
            .then(newMovie => {
                toast.success("Thêm phim thành công!");
                setIsModalOpen(false);
                // Reload movies to get correct mapping
                return fetch("http://localhost:8080/api/movies")
                    .then(res => res.json())
                    .then(data => {
                        const mapped = data.map(movie => ({
                            id: movie?.movieId,
                            englishName: movie?.movieNameEnglish,
                            vietnameseName: movie?.movieNameVn,
                            director: movie?.director,
                            actor: movie?.actor,
                            duration: movie?.duration,
                            fromDate: movie?.fromDate,
                            toDate: movie?.toDate,
                            types: movie?.types || [],
                            image: movie?.largeImage || movie?.smallImage || "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
                            cinemaRoomId: movie?.cinemaRoomId,
                            cinemaRoomName: movie?.cinemaRoomName,
                            version: movie?.version,
                            movieProductionCompany: movie?.movieProductionCompany,
                            content: movie?.content
                        }));
                        setMovies(mapped);
                    });
            })
            .catch(() => toast.error("Thêm phim thất bại!"));
    };

    const handleEditMovie = (formData) => {
        const movieData = {
            movieId: formData.movieId,
            actor: formData.actor,
            cinemaRoom: { cinemaRoomId: Number(formData.cinemaRoomId) },
            content: formData.content,
            director: formData.director,
            duration: Number(formData.duration),
            fromDate: formData.fromDate,
            movieProductionCompany: formData.movieProductionCompany,
            toDate: formData.toDate,
            version: formData.version,
            movieNameEnglish: formData.englishName,
            movieNameVn: formData.vietnameseName,
            largeImage: formData.image || null,
            smallImage: formData.image || null,
            types: formData.types
        };
        fetch(`http://localhost:8080/api/movies/${formData.movieId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movieData)
        })
            .then(res => {
                if (!res.ok) throw new Error("Cập nhật phim thất bại");
                return res.json();
            })
            .then((updatedMovie) => {
                toast.success("Cập nhật phim thành công!");
                setIsModalOpen(false);
                // Reload movies to get correct mapping
                return fetch("http://localhost:8080/api/movies")
                    .then(res => res.json())
                    .then(data => {
                        const mapped = data.map(movie => ({
                            id: movie?.movieId,
                            englishName: movie?.movieNameEnglish,
                            vietnameseName: movie?.movieNameVn,
                            director: movie?.director,
                            actor: movie?.actor,
                            duration: movie?.duration,
                            fromDate: movie?.fromDate,
                            toDate: movie?.toDate,
                            types: movie?.types || [],
                            image: movie?.largeImage || movie?.smallImage || "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
                            cinemaRoomId: movie?.cinemaRoomId,
                            cinemaRoomName: movie?.cinemaRoomName,
                            version: movie?.version,
                            movieProductionCompany: movie?.movieProductionCompany,
                            content: movie?.content
                        }));
                        setMovies(mapped);
                    });
            })
            .catch(() => toast.error("Cập nhật phim thất bại!"));
    };

    const handleDeleteMovie = (id) => {
        fetch(`http://localhost:8080/api/movies/${id}`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) throw new Error("Xóa phim thất bại");
                setMovies(prev => prev.filter(movie => movie.id !== id));
                setIsDeleteModalOpen(false);
                toast.success("Xóa phim thành công!");
            })
            .catch(() => toast.error("Xóa phim thất bại!"));
    };
    const MovieModal = ({ movie, onSave, onClose }) => {
        const [formData, setFormData] = useState(movie || {
            movieId: "",
            englishName: "",
            vietnameseName: "",
            director: "",
            actor: "",
            duration: 0,
            fromDate: "",
            toDate: "",
            types: [],
            image: "",
            cinemaRoomId: "",
            content: "",
            version: "",
            movieProductionCompany: ""
        });
        useEffect(() => {
            if (movie) {
                setFormData({
                    movieId: movie.id,
                    englishName: movie.englishName,
                    vietnameseName: movie.vietnameseName,
                    director: movie.director,
                    actor: movie.actor,
                    duration: movie.duration,
                    fromDate: movie.fromDate ? movie.fromDate.slice(0, 10) : "",
                    toDate: movie.toDate ? movie.toDate.slice(0, 10) : "",
                    types: movie.types
                        ? movie.types
                            .map(typeName =>
                                movieTypes.find(t => t.typeName === typeName)?.typeId
                            )
                            .filter(typeId => typeId !== undefined)
                        : [],
                    image: movie.image || "",
                    cinemaRoomId: movie.cinemaRoomId || "",
                    content: movie.content || "",
                    version: movie.version || "",
                    movieProductionCompany: movie.movieProductionCompany || ""
                });
            }
        }, [movie, movieTypes]);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                    <h2 className="text-2xl font-bold mb-4">{movie ? "Edit Movie" : "Add New Movie"}</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        onSave(formData);
                    }}>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                className="border p-2 rounded"
                                placeholder="Movie ID"
                                value={formData.movieId}
                                onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                                required
                                disabled={!!movie}
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder="English Name"
                                value={formData.englishName}
                                onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                                required
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder="Vietnamese Name"
                                value={formData.vietnameseName}
                                onChange={(e) => setFormData({ ...formData, vietnameseName: e.target.value })}
                                required
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder="Director"
                                value={formData.director}
                                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                                required
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder="Actor"
                                value={formData.actor}
                                onChange={(e) => setFormData({ ...formData, actor: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                className="border p-2 rounded"
                                placeholder="Duration (minutes)"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={formData.fromDate}
                                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={formData.toDate}
                                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                                required
                            />
                            <select
                                className="border p-2 rounded"
                                value={formData.cinemaRoomId}
                                onChange={(e) => setFormData({ ...formData, cinemaRoomId: e.target.value })}
                                required
                            >
                                <option value="">Select Cinema Room</option>
                                {cinemaRooms.map(room => (
                                    <option key={room.cinemaRoomId} value={room.cinemaRoomId}>{room.roomName}</option>
                                ))}
                            </select>
                            <input
                                className="border p-2 rounded"
                                placeholder="Version"
                                value={formData.version}
                                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                required
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder="Production Company"
                                value={formData.movieProductionCompany}
                                onChange={(e) => setFormData({ ...formData, movieProductionCompany: e.target.value })}
                                required
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder="Content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            />
                            <select
                                multiple
                                className="border p-2 rounded"
                                value={formData.types}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        types: Array.from(e.target.selectedOptions, option => Number(option.value))
                                    })
                                }
                                required
                            >
                                {movieTypes.filter(type => type.typeName !== "All").map(type => (
                                    <option key={type.typeId} value={type.typeId}>{type.typeName}</option>
                                ))}
                            </select>
                            <input
                                className="border p-2 rounded"
                                placeholder="Image URL"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const DeleteModal = ({ movieId, onConfirm, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this movie?</p>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(movieId)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Movie Management</h1>
                    <button
                        onClick={() => {
                            setCurrentMovie(null);
                            setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                    >
                        <FiPlusCircle /> Add Movie
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search movies..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <select
                        className="border rounded-lg px-4 py-2"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        {movieTypes.map(type => (
                            <option key={type.typeId} value={type.typeId}>{type.typeName}</option>
                        ))}
                    </select>
                </div>

                {/* Movie Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMovies?.map(movie => (
                        <div key={movie?.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={movie?.image}
                                alt={movie?.englishName}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728";
                                }}
                            />
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2">{movie?.englishName}</h3>
                                <p className="text-gray-600 mb-2">{movie?.vietnameseName}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{movie?.director}</span>
                                    <span>{movie?.duration} mins</span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    {movie?.types.map(type => (
                                        <span
                                            key={type}
                                            className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                                        >
                                            {type}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setCurrentMovie(movie);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCurrentMovie(movie);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-full text-red-500"
                                    >
                                        <FiTrash2 />
                                    </button>
                                     <button
                                    onClick={() => navigate(`/admin/movie-schedule?movieId=${movie.id}`)}
                                    className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600"
                                    title="Thêm/Lịch chiếu"
                                >
                                    <FiCalendar />
                                </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Modals */}
            {isModalOpen && (
                <MovieModal
                    movie={currentMovie}
                    onSave={currentMovie ? handleEditMovie : handleAddMovie}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteModal
                    movieId={currentMovie?.id}
                    onConfirm={handleDeleteMovie}
                    onClose={() => setIsDeleteModalOpen(false)}
                />
            )}
        </>
    );
};

export default MovieDashboard;