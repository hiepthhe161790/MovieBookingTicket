import React, { useEffect, useState } from 'react';
import MovieCard from '../Components/MovieCard';
import NoData from '../Components/Search/noData';
import Subscribe from '../Components/Subscribe';
import Pagination from '../Components/Pagination';
import "../Components/TopMovies/style.css";
const MOVIES_PER_PAGE = 6;

const Movies = ({ setWatchList, watchList }) => {
    const [allMovies, setAllMovies] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDate, setShowDate] = useState('');
    const [dateFilterActive, setDateFilterActive] = useState(false);
    const [showDates, setShowDates] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/types')
            .then(res => res.json())
            .then(data => setTypes([{ typeId: 0, typeName: 'All' }, ...data]));
        // Lấy danh sách ngày chiếu
        fetch('http://localhost:8080/api/show-dates')
            .then(res => res.json())
            .then(data => setShowDates(data));
    }, []);

    useEffect(() => {
        if (dateFilterActive && showDate) {
            fetch(`http://localhost:8080/api/movies/showtimes-by-date?date=${showDate}`)
                .then(res => res.json())
                .then(data => {
                    setAllMovies(data.Search || []);
                    setCurrentPage(1);
                });
        } else {
            const url =
                selectedType === 'All'
                    ? `http://localhost:8080/api/movies/search`
                    : `http://localhost:8080/api/movies/search?type=${selectedType}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.Search) {
                        setAllMovies(data.Search);
                    } else if (Array.isArray(data)) {
                        setAllMovies(data);
                    } else {
                        setAllMovies([]);
                    }
                    setCurrentPage(1);
                });
        }
    }, [selectedType, showDate, dateFilterActive]);

    const filteredMovies = allMovies.filter(movie =>
        (movie.Title || movie.movieNameEnglish || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil(filteredMovies.length / MOVIES_PER_PAGE)));
        if (currentPage > Math.ceil(filteredMovies.length / MOVIES_PER_PAGE)) {
            setCurrentPage(1);
        }
    }, [filteredMovies, currentPage]);

    const startIdx = (currentPage - 1) * MOVIES_PER_PAGE;
    const pagedMovies = filteredMovies.slice(startIdx, startIdx + MOVIES_PER_PAGE);

    const handleTypeChange = (typeName) => {
        setSelectedType(typeName);
        setDateFilterActive(false);
        setShowDate('');
        setCurrentPage(1);
    };

    const handleShowDateClick = (date) => {
        setShowDate(date);
        setDateFilterActive(true);
        setSelectedType('All');
        setCurrentPage(1);
    };

    // const handleDateChange = (e) => {
    //     setShowDate(e.target.value);
    //     setDateFilterActive(!!e.target.value);
    //     setSelectedType('All');
    //     setCurrentPage(1);
    // };
    const today = new Date();
    const futureShowDates = showDates.filter(dateObj => {
        return new Date(dateObj.showDate) >= today;
    });
    return (
        <>
            <section className='results-sec'>
                <div className='container' style={{ display: 'flex', alignItems: 'flex-start' }}>
                    {/* Sidebar */}
                    <aside className="sidebar" style={{ width: 220, background: '#171d22', padding: 24, borderRadius: 12, marginRight: 32, marginTop: 118 }}>
                        <div style={{ marginBottom: 24 }}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: 6,
                                    border: '1.5px solid #e4d804',
                                    fontSize: 14,
                                    background: '#171d22',
                                    color: '#fff',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <h3 style={{ color: '#e4d804', marginBottom: 16 }}>Categories</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {types.map(type => (
                                <li key={type.typeId} style={{ marginBottom: 12 }}>
                                    <button
                                        style={{
                                            background: selectedType === type.typeName ? '#e4d804' : 'transparent',
                                            color: selectedType === type.typeName ? '#171d22' : '#fff',
                                            border: 'none',
                                            padding: '10px 18px',
                                            borderRadius: 6,
                                            width: '100%',
                                            textAlign: 'left',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleTypeChange(type.typeName)}
                                    >
                                        {type.typeName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>
                    {/* Movie List */}
                    <div style={{ flex: 1 }}>
                        <div className='section-title'>
                            <h5 className='sub-title'>ONLINE STREAMING</h5>
                            <h2 className='title'>All Movies</h2>
                        </div>
                        {/* Lọc theo ngày chiếu - ngang và scroll */}
                        <div
                            style={{
                                position: "relative",
                                margin: "24px 0 32px 0",
                                maxWidth: 1100,
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <div
                                className="row movies-grid"
                                style={{
                                    flexWrap: "nowrap",
                                    overflowX: "auto",
                                    gap: "8px",
                                    paddingBottom: 8,
                                    width: "100%",
                                    cursor: "grab",
                                    scrollbarWidth: "thin",
                                }}
                            >
                                {futureShowDates.map(date => (
                                    <button
                                        key={date.showDateId}
                                        style={{
                                            background: showDate === date.showDate ? '#e4d804' : '#23272b',
                                            color: showDate === date.showDate ? '#171d22' : '#fff',
                                            border: 'none',
                                            borderRadius: 6,
                                            padding: '10px 16px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            minWidth: 90,
                                            boxShadow: showDate === date.showDate ? "0 2px 8px #e4d80444" : "none",
                                            transition: "background 0.2s, color 0.2s, box-shadow 0.2s"
                                        }}
                                        onClick={() => handleShowDateClick(date.showDate)}
                                    >
                                        {date.dateName} <br />
                                        <span style={{ fontSize: 12 }}>{date.showDate}</span>
                                    </button>
                                ))}
                            </div>
                            {showDate && (
                                <button
                                    style={{
                                        marginLeft: 16,
                                        background: '#e4d804',
                                        color: '#171d22',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '10px 18px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        minWidth: 90,
                                        boxShadow: "0 2px 8px #e4d80444",
                                        transition: "background 0.2s, color 0.2s",
                                        whiteSpace: "nowrap"
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = "#cfc200"}
                                    onMouseOut={e => e.currentTarget.style.background = "#e4d804"}
                                    onClick={() => { setShowDate(''); setDateFilterActive(false); }}
                                >
                                    Xóa lọc ngày
                                </button>
                            )}
                        </div>
                        <div className='row movies-grid'>
                            {pagedMovies.length ? (
                                pagedMovies.map(movie => (
                                    <MovieCard
                                        movie={movie}
                                        key={movie.imdbID || movie.movieId}
                                        setWatchList={setWatchList}
                                        watchList={watchList}
                                    />
                                ))
                            ) : (
                                <NoData />
                            )}
                        </div>
                        {totalPages > 1 && (
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        )}
                    </div>
                </div>
            </section>
            <Subscribe />
        </>
    );
};

export default Movies;