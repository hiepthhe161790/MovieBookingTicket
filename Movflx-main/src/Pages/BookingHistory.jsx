import React, { useEffect, useState } from "react";

const BookingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [ticketLoading, setTicketLoading] = useState(false);


  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;


  const [filterDate, setFilterDate] = useState("");

  const accountId = JSON.parse(localStorage.getItem("user"))?.accountId;

  useEffect(() => {
    if (!accountId) return;
    fetch(`http://localhost:8080/api/booking/history?accountId=${accountId}`)
      .then(res => res.json())
      .then(data => {
        setHistory((data || []).reverse());
        setLoading(false);
      });
  }, [accountId]);


  const uniqueDates = Array.from(new Set(history.map(item => item.bookingDate?.slice(0, 10))));

  // Lọc theo ngày
  const filtered = filterDate
    ? history.filter(item => item.bookingDate?.slice(0, 10) === filterDate)
    : history;

  // Tính toán phân trang
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedHistory = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleShowTicket = (invoiceId) => {
    setTicketLoading(true);
    setShowModal(true);
    fetch(`http://localhost:8080/api/booking/ticket/${invoiceId}`)
      .then(res => res.json())
      .then(data => {
        setTicket(data);
        setTicketLoading(false);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTicket(null);
  };

  if (!accountId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
          <h2 className="text-2xl mb-4">Bạn cần đăng nhập để xem lịch sử đặt vé!</h2>
        </div>
      </div>
    );
  }

  return (
    <section className="results-sec">
      <div className="container">
        <div className="section-title">
          <h5 className="sub-title">Lịch sử đặt vé</h5>
          <h2 className="title">Booking History</h2>
        </div>
        <div className="min-h-screen bg-gray-900 p-8 flex justify-center items-start">
          <div className="w-full max-w-3xl">
            {/* Bộ lọc theo ngày */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <label className="text-white mr-2">Lọc theo ngày:</label>
                <select
                  className="rounded px-3 py-2 bg-gray-900 text-white border border-gray-700"
                  value={filterDate}
                  onChange={e => {
                    setFilterDate(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Tất cả</option>
                  {uniqueDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
              <div className="text-gray-400 text-sm">
                Trang {currentPage} / {totalPages || 1}
              </div>
            </div>
            {loading ? (
              <div className="text-white text-center">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="bg-gray-800 text-white rounded-lg p-8 text-center shadow-xl">
                <h3 className="text-xl font-medium mb-2">Bạn chưa có lịch sử đặt vé nào.</h3>
                <p className="text-gray-400">Hãy đặt vé để trải nghiệm phim tại Movflx!</p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {pagedHistory.map(item => (
                    <div
                      key={item.invoiceId}
                      className="bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{item.movieName}</h3>
                        <div className="flex flex-wrap gap-4 text-gray-300 text-sm mb-2">
                          <span>
                            <i className="ri-calendar-2-line text-yellow-400 mr-1"></i>
                            {new Date(item.bookingDate).toLocaleString("vi-VN")}
                          </span>
                          <span>
                            <i className="ri-time-line text-yellow-400 mr-1"></i>
                            {item.scheduleShow}
                          </span>
                          <span>
                            <i className="ri-vip-crown-2-line text-yellow-400 mr-1"></i>
                            Ghế: <span className="text-white font-semibold">{item.seat}</span>
                          </span>
                        </div>
                        <span className="text-green-400 font-semibold">
                          {item.totalMoney.toLocaleString("vi-VN")} VND
                        </span>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col gap-2 items-end">
                        <span
                          className={`px-4 py-2 rounded-full font-bold text-xs ${
                            item.status
                              ? "bg-emerald-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {item.status ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                        <button
                          className="mt-2 px-4 py-2 bg-[#e4d804] hover:bg-[#cfc200] text-black rounded-full font-semibold transition"
                          onClick={() => handleShowTicket(item.invoiceId)}
                        >
                          Xem vé
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 font-semibold disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <span>
                      Trang {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 font-semibold disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Modal giữ nguyên như cũ */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 shadow-2xl w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            {ticketLoading ? (
              <div className="text-white text-center">Đang tải vé...</div>
            ) : ticket ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Chi tiết vé</h2>
                <div className="mb-2 flex justify-between text-gray-300">
                  <span>Tên phim:</span>
                  <span className="font-bold text-white">{ticket.movieName}</span>
                </div>
                {/* ...giữ nguyên các dòng chi tiết vé... */}
                <div className="mb-2 flex justify-between text-gray-300">
                  <span>Phiên bản:</span>
                  <span className="font-bold text-white">{ticket.version}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-300">
                  <span>Suất chiếu:</span>
                  <span className="font-bold text-white">{ticket.scheduleShow}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-300">
                  <span>Giờ chiếu:</span>
                  <span className="font-bold text-white">{ticket.scheduleShowTime}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-300">
                  <span>Ngày đặt:</span>
                  <span className="font-bold text-white">{new Date(ticket.bookingDate).toLocaleString("vi-VN")}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-300">
                  <span>Phòng chiếu:</span>
                  <span className="font-bold text-white">{ticket.cinemaRoomName}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-300">
                  <span>Ghế:</span>
                  <span className="font-bold text-white">{ticket.seat}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-300">
                  <span>Tổng tiền:</span>
                  <span className="font-bold text-green-400">{ticket.totalMoney?.toLocaleString("vi-VN")} VND</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-300">
                  <span>Trạng thái:</span>
                  <span className={`font-bold ${ticket.status ? "text-emerald-400" : "text-red-400"}`}>
                    {ticket.status ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-white text-center">Không tìm thấy vé.</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default BookingHistory;