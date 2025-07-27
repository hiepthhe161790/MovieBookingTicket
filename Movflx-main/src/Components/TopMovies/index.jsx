import React, { useEffect, useState } from 'react';
import MovieCard from '../MovieCard';
import './style.css';

const TopMovies = ({ filterCtg, setFilterCtg, topMovies, setWatchList, watchList }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/types")
      .then(res => res.json())
      .then(data => setTypes(data))
      .catch(() => setTypes([]));
  }, []);

  const handleFilterCtg = (typeName) => {
    setFilterCtg(typeName);
  };

  return (
    <section className='new-sec top-rated-sec' id='movies'>
      <div className='container'>
        <div className='section-title'>
          <h5 className='sub-title'>ONLINE STREAMING</h5>
          <h2 className='title'>Top Rated Movies</h2>
        </div>
        <div className='btns-div categories-btns'>
          {types.map(type => (
            <button
              key={type.typeId}
              className={
                filterCtg === type.typeName
                  ? 'btn category-btn active'
                  : 'btn category-btn'
              }
              onClick={() => handleFilterCtg(type.typeName)}
            >
              {type.typeName}
            </button>
          ))}
        </div>
        <div className='row movies-grid'>
          {
            topMovies
              ? topMovies.map(movie => (
                <MovieCard movie={movie} key={movie.imdbID} setWatchList={setWatchList} watchList={watchList} />
              ))
              : null
          }
        </div>
      </div>
    </section>
  );
};

export default TopMovies;