import React, { useEffect, useState } from "react";
import MovieCard from "../MovieCard";
import "../TopMovies/style.css";

const ComingSoonMovies = ({ setWatchList, watchList }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/movies/coming-soon")
      .then(res => res.json())
      .then(data => setMovies(data.Search || data || []));
  }, []);

  if (!movies.length)
    return (
      <div className="text-white text-center py-8">
        Không có phim sắp chiếu.
      </div>
    );

  return (
    <section className="new-sec top-rated-sec" id="coming-soon">
      <div className="container">
        <div className="section-title">
          <h5 className="sub-title">COMING SOON</h5>
          <h2 className="title">Phim Sắp Chiếu</h2>
        </div>
        <div
          className="row movies-grid"
          style={{
            flexWrap: "nowrap",
            overflowX: "auto",
            gap: "24px",
            paddingBottom: "8px",
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.movieId}
              style={{
                minWidth: 290,
                maxWidth: 320,
                flex: "0 0 auto",
                margin: "0 0 4rem 0",
              }}
              className="single-movie"
            >
              <MovieCard
                movie={movie}
                setWatchList={setWatchList}
                watchList={watchList}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComingSoonMovies;