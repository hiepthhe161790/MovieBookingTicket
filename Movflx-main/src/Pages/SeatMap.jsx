import { useEffect, useState } from "react";
import { FaCouch } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
const VIP_PRICE = 200000;
const NORMAL_PRICE = 150000;

const SeatMap = () => {
  const navigate = useNavigate();
  const { movieId, showDateId, scheduleId } = useParams();
  const [seatRows, setSeatRows] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movieName, setMovieName] = useState("");
  const [scheduleShow, setScheduleShow] = useState(""); // Lưu showDate
  const [scheduleShowTime, setScheduleShowTime] = useState("");

  useEffect(() => {
    // Lấy thông tin ghế
    fetch(`http://localhost:8080/api/booking/seat-status?movieId=${movieId}&showDateId=${showDateId}&scheduleId=${scheduleId}`)
      .then(res => res.json())
      .then(data => {
        const rows = {};
        data.forEach(seat => {
          if (!rows[seat.rowLabel]) rows[seat.rowLabel] = [];
          rows[seat.rowLabel].push(seat);
        });
        const seatRowsArr = Object.entries(rows).map(([rowId, seats]) => ({
          rowId,
          seats: seats.sort((a, b) => a.seatNumber - b.seatNumber)
        }));
        seatRowsArr.sort((a, b) => a.rowId.localeCompare(b.rowId));
        setSeatRows(seatRowsArr);
      });

    // Lấy thông tin phim
    fetch(`http://localhost:8080/api/movies/${movieId}`)
      .then(res => res.json())
      .then(data => {
        setMovieName(data.movieNameEnglish || data.movieNameVn || "Unknown Movie");
      });

    // Lấy thông tin lịch chiếu
   fetch(`http://localhost:8080/api/booking/showtimes/${movieId}`)
    .then(res => res.json())
    .then(data => {
      // Tìm showDate object theo showDateId từ params
      const showDateObj = data.find(
        s => String(s.showDateId) === String(showDateId)
      );
      let showDateStr = "Unknown Date";
      if (showDateObj && showDateObj.showDate) {
        // Định dạng ngày cho đẹp (yyyy-MM-dd)
        const date = new Date(showDateObj.showDate);
        showDateStr = date.toISOString().slice(0, 10);
      }
      setScheduleShow(showDateStr);

      // Lấy giờ chiếu theo scheduleId
      const show = data.find(
        s => String(s.scheduleId) === String(scheduleId) && String(s.showDateId) === String(showDateId)
      );
      setScheduleShowTime(show?.scheduleTime || "Unknown Time");
    });
  }, [movieId, showDateId, scheduleId]);

  const handleSeatClick = (seat) => {
    if (seat.status === "BOOKED" || seat.active === false) return;
    if (selectedSeats.includes(seat.seatCode)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.seatCode));
    } else {
      setSelectedSeats([...selectedSeats, seat.seatCode]);
    }
  };

  const getSeatStyles = (type, status, active, isSelected) => {
    let baseStyles = "flex items-center justify-center w-12 h-12 m-1 rounded transition-all duration-300 cursor-pointer relative group";
    if (status === "BOOKED" || active === false) {
      return `${baseStyles} bg-red-500 text-white cursor-not-allowed opacity-70`;
    }
    if (type === "VIP") {
      return `${baseStyles} ${isSelected ? "bg-green-500" : "bg-amber-50"} border-2 border-amber-400 hover:opacity-80`;
    }
    return `${baseStyles} ${isSelected ? "bg-green-500" : "bg-gray-100"} border border-gray-300 hover:bg-gray-200`;
  };

  const getTooltipText = (seat) =>
    `Seat: ${seat.seatCode}\nType: ${seat.seatType}\nStatus: ${seat.status}`;

  const calculateTotalPrice = () => {
    let total = 0;
    selectedSeats.forEach(seatCode => {
      const seat = seatRows.flatMap(row => row.seats).find(s => s.seatCode === seatCode);
      total += seat?.seatType === "VIP" ? VIP_PRICE : NORMAL_PRICE;
    });
    return total;
  };

  const handleContinue = () => {
  if (selectedSeats.length === 0) {
    alert("Please select at least one seat");
    return;
  }
  const bookingInfo = {
    addScore: 10,
    bookingDate: new Date().toISOString().slice(0, 16),
    movieName: movieName,
    scheduleShow: scheduleShow, // Chứa showDate
    scheduleShowTime: scheduleShowTime, // Chứa scheduleTime
    status: true,
    totalMoney: calculateTotalPrice(),
    useScore: 0,
    seat: selectedSeats.join(", ")
  };
  const accountId = JSON.parse(localStorage.getItem("user"))?.accountId || 1;
  // Lưu bookingInfo vào localStorage
  localStorage.setItem("bookingInfo", JSON.stringify({ ...bookingInfo, accountId }));
  navigate(`/confirm-booking/${accountId}`, { state: bookingInfo });
};

  return (
    <section className='results-sec'>
      <div className='container'>
        <div className='section-title'>
          <h5 className='sub-title'>{movieName}</h5>
          <h2 className='title'> Select Your Seats</h2>
          <p className='desc text-white'>  {scheduleShow} | {scheduleShowTime}</p>
        </div>
        <div className='row movies-grid'></div>
        <div className="min-h-screen bg-gray-900 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
              <div className="w-full h-8 bg-gradient-to-b from-gray-400 to-transparent mb-12 rounded-t-lg text-center text-sm text-gray-200">
                Screen
              </div>
              <div className="flex flex-col items-center space-y-4">
                {seatRows.map((row) => (
                  <div key={row.rowId} className="flex items-center">
                    <span className="w-8 text-gray-400 text-sm">{row.rowId}</span>
                    <div className="flex">
                      {row.seats.map((seat) => {
                        const isSelected = selectedSeats.includes(seat.seatCode);
                        return (
                          <div
                            key={seat.seatCode}
                            className={getSeatStyles(seat.seatType, seat.status, seat.active, isSelected)}
                            onClick={() => handleSeatClick(seat)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Seat ${seat.seatCode} - ${seat.seatType} - ${seat.status}`}
                          >
                            <FaCouch
                              className={`text-2xl ${seat.status === "BOOKED" || seat.active === false
                                  ? "text-white"
                                  : isSelected
                                    ? "text-white"
                                    : "text-gray-700"
                                }`}
                            />
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 rounded bg-black text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-pre z-10">
                              {`Seat: ${seat.seatCode}\nType: ${seat.seatType}\nStatus: ${seat.status}\n${seat.active === false ? "Không hoạt động" : "Hoạt động"}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                  <span>Normal</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-amber-50 border-2 border-amber-400 rounded mr-2"></div>
                  <span>VIP</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
                  <span>Selected</span>
                </div>
              </div>
              <div className="mt-8 border-t border-gray-700 pt-6">
                <div className="text-gray-300 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Selected Seats:</p>
                      <p>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Total Amount:</p>
                      <p className="text-xl text-green-400">
                        {calculateTotalPrice().toLocaleString("vi-VN")} VND
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleContinue}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                    disabled={selectedSeats.length === 0}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeatMap;