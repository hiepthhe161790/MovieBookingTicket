import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import defaultPoster from '../../images/default_poster.jpg';
import { useNavigate } from 'react-router-dom';
import './style.css';
import MovieReview from '../MovieReview';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch(`http://localhost:8080/api/movies/${id}`, { signal })
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
      });

    return () => {
      controller.abort();
    };
  }, [id]);

  if (!movie) return null;

  // Lấy ảnh poster
  const poster =
    movie.largeImage ||
    movie.smallImage ||
    defaultPoster;

  // Lấy loại phim (types)
  const types = Array.isArray(movie.types) ? movie.types.join(', ') : '';

  // Lấy ngày chiếu
  const fromDate = movie.fromDate ? new Date(movie.fromDate).toLocaleDateString() : '';
  const toDate = movie.toDate ? new Date(movie.toDate).toLocaleDateString() : '';

  return (
    <>
    <header className='page-header movie-details-header'>
      <div className='container'>
        <div className='movie-details'>
          <div className='movie-poster'>
            <img src={poster} alt={movie.movieNameEnglish} />
          </div>
          <div className='details-content'>
            {movie.director && (
              <h5 className='director'>{movie.director}</h5>
            )}
            <h2 className='title'>
              {movie.movieNameEnglish}
              <span style={{ color: '#e4d804', marginLeft: 8 }}>
                {movie.movieNameVn ? `(${movie.movieNameVn})` : ''}
              </span>
            </h2>
            <div className='banner-meta'>
              <ul>
                <li className='vid'>
                  <span className='type'>{types}</span>
                  <span className='quality'>HD</span>
                </li>
                <li className='category'>
                  <span>{movie.cinemaRoomName}</span>
                </li>
                <li className='time'>
                  <span>
                    <i className='ri-calendar-2-line'></i>
                    {fromDate} - {toDate}
                  </span>
                  <span>
                    <i className='ri-time-line'></i>
                    {movie.duration} mins
                  </span>
                </li>
              </ul>
            </div>
            <p className='desc'>{movie.content}</p>
            <div style={{ marginBottom: 12, color: "#fff" }}>
              <strong style={{ color: "#e4d804" }}>Actor:</strong> {movie.actor}
            </div>
            <div style={{ marginBottom: 12, color: "#fff" }}>
              <strong style={{ color: "#e4d804" }}>Version:</strong> {movie.version}
            </div>
            <div style={{ marginBottom: 12, color: "#fff" }}>
              <strong style={{ color: "#e4d804" }}>Production Company:</strong> {movie.movieProductionCompany}
            </div>
             <div style={{ margin: "24px 0" }}>
              <button
                className="btn watch-btn"
                onClick={() => navigate(`/showtimes/${movie.movieId}`)}
                style={{ fontSize: 18, padding: "12px 32px" }}
              >
                Đặt phim
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div className='container'>
      <div className='movie-details-content'>
        <MovieReview movieId={movie.movieId} />
      </div>
    </div>
    </>
  );
};

export default MovieDetails;