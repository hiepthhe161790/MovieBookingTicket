import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {FiCheckCircle, FiChevronUp, FiChevronDown } from "react-icons/fi";
const POINT_TO_MONEY = 1000; // 1 điểm = 1000 VND

const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accountId } = useParams();

  let bookingInfo = location.state;
  if (!bookingInfo) {
    try {
      bookingInfo = JSON.parse(localStorage.getItem("bookingInfo"));
    } catch {
      bookingInfo = null;
    }
  }

  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [useScore, setUseScore] = useState(0);
  const [error, setError] = useState("");

  // Lấy điểm từ API
  useEffect(() => {
    if (accountId) {
      fetch(`http://localhost:8080/api/member/points/${accountId}`)
        .then(res => res.json())
        .then(data => setPoints(data.points || 0));
    }
  }, [accountId]);

  // Validate điểm nhập vào
  const handleUseScoreChange = (e) => {
    const value = Number(e.target.value);
    if (value < 0) {
      setUseScore(0);
      setError("Điểm sử dụng phải lớn hơn hoặc bằng 0");
    } else if (value > points) {
      setUseScore(points);
      setError("Không được dùng quá số điểm hiện có");
    } else if (value * POINT_TO_MONEY > bookingInfo.totalMoney) {
      setUseScore(Math.floor(bookingInfo.totalMoney / POINT_TO_MONEY));
      setError("Không được dùng quá số tiền cần thanh toán");
    } else {
      setUseScore(value);
      setError("");
    }
  };

  // Tính tổng tiền sau khi trừ điểm
  const totalAfterDiscount = Math.max(
    bookingInfo.totalMoney - useScore * POINT_TO_MONEY,
    0
  );

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/booking/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingInfo,
          accountId: accountId,
          useScore: useScore,
          totalMoney: totalAfterDiscount,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.paymentUrl;
      } else {
        alert("Không thể tạo link thanh toán!");
      }
    } catch (err) {
      alert("Có lỗi xảy ra!");
    }
    setLoading(false);
  };
useEffect(() => {
  if (bookingInfo) {
    const updated = { 
      ...bookingInfo, 
      useScore, 
      totalMoney: Math.max(bookingInfo.totalMoney - useScore * POINT_TO_MONEY, 0)
    };
    localStorage.setItem("bookingInfo", JSON.stringify(updated));
  }
}, [useScore]);

  if (!bookingInfo || !bookingInfo.movieName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
          <h2 className="text-2xl mb-4">Không có thông tin đặt vé!</h2>
          <button
            className="bg-blue-600 px-6 py-2 rounded text-white"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
      {`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}
    </style>
    <section className="results-sec">
      <div className="container">
        <div className="section-title">
          <h5 className="sub-title">Xác nhận đặt vé</h5>
          <h2 className="title">Thông tin đặt vé</h2>
        </div>
        <div className="min-h-screen bg-gray-900 p-8 flex justify-center items-center">
          <div className="max-w-lg w-full bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-700">
            <FiCheckCircle className="mx-auto text-emerald-400 mb-4" size={48} />
            <div className="mb-8 space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Tên phim:</span>
                <span className="font-bold text-white">{bookingInfo.movieName}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Suất chiếu:</span>
                <span className="font-bold text-white">{bookingInfo.scheduleShow} | {bookingInfo.scheduleShowTime}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Ngày đặt:</span>
                <span className="font-bold text-white">
                  {bookingInfo.bookingDate
                    ? (() => {
                        const d = new Date(bookingInfo.bookingDate);
                        const dateStr = d.toISOString().slice(0, 10);
                        const timeStr = d.toTimeString().slice(0, 5);
                        return `${dateStr} | ${timeStr}`;
                      })()
                    : ""}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Ghế:</span>
                <span className="font-bold text-white">{bookingInfo.seat}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tổng tiền gốc:</span>
                <span className="font-bold text-green-400 text-lg">{bookingInfo.totalMoney?.toLocaleString("vi-VN")} VND</span>
              </div>
              <div className="flex justify-between text-gray-300 items-center">
                <span>Điểm hiện có:</span>
                <span className="font-bold text-yellow-400">{points}</span>
              </div>
              <div className="flex justify-between text-gray-300 items-center">
  <span>Dùng điểm (1 điểm = 1.000đ):</span>
  <div className="flex items-center gap-2">
    <button
      type="button"
      className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-yellow-300"
      onClick={() => handleUseScoreChange({ target: { value: useScore - 1 } })}
      disabled={useScore <= 0}
      tabIndex={-1}
    >
      <FiChevronDown size={18} />
    </button>
    <input
      type="number"
      min={0}
      max={Math.min(points, Math.floor(bookingInfo.totalMoney / POINT_TO_MONEY))}
      value={useScore}
      onChange={handleUseScoreChange}
      className="w-16 px-2 py-1 rounded bg-gray-700 text-yellow-300 font-bold text-center border-none outline-none"
      style={{ MozAppearance: "textfield" }}
    />
    <button
      type="button"
      className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-yellow-300"
      onClick={() => handleUseScoreChange({ target: { value: useScore + 1 } })}
      disabled={useScore >= Math.min(points, Math.floor(bookingInfo.totalMoney / POINT_TO_MONEY))}
      tabIndex={-1}
    >
      <FiChevronUp size={18} />
    </button>
  </div>
</div>
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <div className="flex justify-between text-gray-300">
                <span>Thành tiền sau giảm:</span>
                <span className="font-bold text-green-400 text-lg">{totalAfterDiscount.toLocaleString("vi-VN")} VND</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Điểm cộng:</span>
                <span className="font-bold text-emerald-400">{bookingInfo.addScore}</span>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              disabled={loading || !!error}
              className="w-full bg-[#e4d804] hover:bg-[#cfc200] text-black font-bold py-3 px-6 rounded-full transition duration-200 text-lg"
            >
              {loading ? "Đang chuyển sang thanh toán..." : "Thanh toán VNPay"}
            </button>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default ConfirmBooking;