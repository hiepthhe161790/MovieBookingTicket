import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdEventAvailable, MdEventBusy } from "react-icons/md";

const Showtimes = () => {
  const { movieId } = useParams();
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredScheduleId, setHoveredScheduleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/api/booking/showtimes/${movieId}`)
      .then(res => res.json())
      .then(data => {
        setShowtimes(data);
        setLoading(false);
      });
  }, [movieId]);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

  // Group showtimes by date
  const grouped = showtimes.reduce((acc, curr) => {
    const date = curr.showDate.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {});

  return (
    <section className='results-sec'>
      <div className='container'>
        <div className='section-title'>
          <h5 className='sub-title'> Showtimes</h5>
          <h2 className='title'> List of Showtimes</h2>
        </div>
        <div className='row movies-grid'>
          {Object.keys(grouped).length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {Object.entries(grouped).map(([date, shows]) => {
                const hoveredShow = shows.find(show => show.scheduleId === hoveredScheduleId);
                return (
                  <div
                    key={date}
                    className="bg-gray-800 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                          {/* số ghế trống */}
                          {hoveredShow
                            ? `${hoveredShow.availableSeats} ghế trống`
                            : `${shows.reduce((acc, show) => acc + show.availableSeats, 0)} ghế trống`}
                        </p>
                      </div>
                      <MdEventAvailable className="text-emerald-400 text-2xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {shows.map(show => (
                        <button
                          key={show.scheduleId}
                          onClick={() => navigate(`/seat-map/${movieId}/${show.showDateId}/${show.scheduleId}`)}
                          onMouseEnter={() => setHoveredScheduleId(show.scheduleId)}
                          onMouseLeave={() => setHoveredScheduleId(null)}
                          className="py-2 px-4 rounded-md text-sm font-medium bg-gray-700 text-gray-300 hover:bg-emerald-500 hover:text-white transition-all duration-200"
                        >
                          {show.scheduleTime}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <MdEventBusy className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300">
                Không có suất chiếu nào
              </h3>
              <p className="text-gray-400 mt-2">
                Vui lòng quay lại sau để xem lịch chiếu mới nhất.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Showtimes;