import React, { useEffect, useState } from "react";
import { FaCouch, FaPlusCircle, FaEdit } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
const API_BASE = "http://localhost:8080/api";

const SeatDashboard = () => {
    const { cinemaRoomId } = useParams();
    const [seats, setSeats] = useState([]);
    const [cinemaRooms, setCinemaRooms] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [form, setForm] = useState({
        seatCode: "",
        rowLabel: "",
        seatNumber: "",
        seatType: "NORMAL",
        status: true,
        cinemaRoomId: cinemaRoomId || ""
    });
    const [editingId, setEditingId] = useState(null);

    // Fetch all seats and cinema rooms
    useEffect(() => {
        if (cinemaRoomId) {
            fetch(`${API_BASE}/seats/by-cinema-room/${cinemaRoomId}`)
                .then(res => res.json())
                .then(setSeats);
        } else {
            setSeats([]);
        }
        fetch(`${API_BASE}/cinema-rooms`)
            .then(res => res.json())
            .then(setCinemaRooms);
    }, [cinemaRoomId]);

    // Group seats by row
    const seatRows = React.useMemo(() => {
        const rows = {};
        seats.forEach(seat => {
            if (!rows[seat.rowLabel]) rows[seat.rowLabel] = [];
            rows[seat.rowLabel].push(seat);
        });
        return Object.entries(rows)
            .map(([rowId, seats]) => ({
                rowId,
                seats: seats.sort((a, b) => a.seatNumber - b.seatNumber),
            }))
            .sort((a, b) => a.rowId.localeCompare(b.rowId));
    }, [seats]);

    const openAddModal = (rowLabel = "") => {
        setForm({
            seatCode: "",
            rowLabel,
            seatNumber: "",
            seatType: "NORMAL",
            status: true,
            cinemaRoomId: cinemaRoomId || ""
        });
        setEditingId(null);
        setModalOpen(true);
    };

    const openEditModal = (seat) => {
        setForm({
            seatCode: seat.seatCode,
            rowLabel: seat.rowLabel,
            seatNumber: seat.seatNumber,
            seatType: seat.seatType || "NORMAL",
            status: seat.status ?? true,
            cinemaRoomId: seat.cinemaRoom?.cinemaRoomId || cinemaRoomId || ""
        });
        setEditingId(seat.seatId);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            seatCode: form.seatCode,
            rowLabel: form.rowLabel,
            seatNumber: Number(form.seatNumber),
            seatType: form.seatType,
            status: form.status,
            cinemaRoom: { cinemaRoomId: Number(form.cinemaRoomId) }
        };
        try {
            let res;
            if (editingId) {
                res = await fetch(`${API_BASE}/seats/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch(`${API_BASE}/seats`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }
            if (!res.ok) throw new Error(editingId ? "Cập nhật ghế thất bại!" : "Thêm ghế thất bại!");
            toast.success(editingId ? "Cập nhật ghế thành công!" : "Thêm ghế thành công!");
            setModalOpen(false);
            setEditingId(null);
            if (cinemaRoomId) {
                fetch(`${API_BASE}/seats/by-cinema-room/${cinemaRoomId}`)
                    .then(res => res.json())
                    .then(setSeats);
            }
        } catch (err) {
            toast.error(err.message || "Có lỗi xảy ra!");
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/seats/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Xóa ghế thất bại!");
            toast.success("Xóa ghế thành công!");
            setDeleteId(null);
            if (cinemaRoomId) {
                fetch(`${API_BASE}/seats/by-cinema-room/${cinemaRoomId}`)
                    .then(res => res.json())
                    .then(setSeats);
            }
        } catch (err) {
            toast.error(err.message || "Có lỗi xảy ra!");
        }
    };

    return (
        <>
            <div className="min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-black">Quản lý ghế</h2>
                        <button
                            className="bg-[#e4d804] text-black px-4 py-2 rounded font-semibold flex items-center gap-2"
                            onClick={() => openAddModal()}
                        >
                            <FaPlusCircle /> Thêm ghế
                        </button>
                    </div>
                    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
                        <div className="mb-6">
                            <label className="text-white font-semibold mr-2">Lọc phòng chiếu:</label>
                            <select
                                className="border rounded px-3 py-2"
                                value={cinemaRoomId || ""}
                                onChange={e => window.location.href = `/admin/seats/${e.target.value}`}
                            >
                                <option value="">Tất cả phòng</option>
                                {cinemaRooms.map(room => (
                                    <option key={room.cinemaRoomId} value={room.cinemaRoomId}>
                                        {room.roomName || `Phòng ${room.cinemaRoomId}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            {cinemaRoomId ? (
                                seatRows.map(row => (
                                    <div key={row.rowId} className="flex items-center">
                                        <span className="w-8 text-gray-400 text-sm">{row.rowId}</span>
                                        <div className="flex">
                                            {row.seats.map(seat => {

                                                let seatBg = "bg-gray-100 border border-gray-300";
                                                let seatIcon = "text-gray-700";
                                                if (seat.seatType === "VIP") {
                                                    seatBg = "bg-amber-50 border-2 border-amber-400";
                                                }
                                                if (seat.status === false) {
                                                    seatBg = "bg-red-400 border border-red-600 opacity-60";
                                                    seatIcon = "text-white";
                                                }
                                                return (
                                                    <div
                                                        key={seat.seatId}
                                                        className={`flex items-center justify-center w-12 h-12 m-1 rounded transition-all duration-300 cursor-pointer relative group ${seatBg} hover:bg-blue-200`}
                                                        onClick={() => seat.status !== false && openEditModal(seat)}
                                                        title={`Sửa ghế ${seat.seatCode}`}
                                                        style={seat.status === false ? { cursor: "not-allowed" } : {}}
                                                    >
                                                        <FaCouch className={`text-2xl ${seatIcon}`} />
                                                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 rounded bg-black text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-pre z-10">
                                                            {`Mã: ${seat.seatCode}\nHàng: ${seat.rowLabel}\nSố: ${seat.seatNumber}\nLoại: ${seat.seatType}\n${seat.status === false ? "Không hoạt động" : "Hoạt động"}`}
                                                        </span>
                                                        <FaEdit className="absolute top-1 right-1 text-blue-500 opacity-0 group-hover:opacity-100" />
                                                        <button
                                                            className="absolute top-1 left-1 text-red-500 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                            style={{ zIndex: 10 }}
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                setDeleteId(seat.seatId);
                                                            }}
                                                            title="Xóa ghế"
                                                            type="button"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                            {/* Icon thêm ghế cuối hàng */}
                                            <button
                                                className="flex items-center justify-center w-12 h-12 m-1 rounded bg-emerald-400 hover:bg-emerald-500 text-white transition-all duration-200"
                                                onClick={() => openAddModal(row.rowId)}
                                                title={`Thêm ghế vào hàng ${row.rowId}`}
                                            >
                                                <FaPlusCircle className="text-2xl" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-red-500 font-semibold text-lg mt-8">
                                    Vui lòng chọn phòng chiếu để quản lý ghế!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal thêm/sửa */}
                    {modalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <form
                                className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md"
                                onSubmit={handleSubmit}
                            >
                                <h3 className="text-xl font-bold mb-4">{editingId ? "Sửa ghế" : "Thêm ghế"}</h3>
                                <div className="mb-4">
                                    <label className="block mb-1 font-semibold">Hàng</label>
                                    <input
                                        className="border rounded px-3 py-2 w-full"
                                        value={form.rowLabel}
                                        onChange={e => setForm(f => ({
                                            ...f,
                                            rowLabel: e.target.value,
                                            seatCode: e.target.value && f.seatNumber ? `${e.target.value}${f.seatNumber}` : f.seatCode
                                        }))}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-semibold">Số thứ tự trong hàng</label>
                                    <input
                                        type="number"
                                        min={1}
                                        className="border rounded px-3 py-2 w-full"
                                        value={form.seatNumber}
                                        onChange={e => setForm(f => ({
                                            ...f,
                                            seatNumber: e.target.value,
                                            seatCode: f.rowLabel ? `${f.rowLabel}${e.target.value}` : f.seatCode
                                        }))}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-semibold">Mã ghế</label>
                                    <input
                                        className="border rounded px-3 py-2 w-full"
                                        value={form.seatCode}
                                        onChange={e => setForm(f => ({ ...f, seatCode: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-semibold">Loại ghế</label>
                                    <select
                                        className="border rounded px-3 py-2 w-full"
                                        value={form.seatType}
                                        onChange={e => setForm(f => ({ ...f, seatType: e.target.value }))}
                                    >
                                        <option value="NORMAL">Thường</option>
                                        <option value="VIP">VIP</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-semibold">Trạng thái</label>
                                    <select
                                        className="border rounded px-3 py-2 w-full"
                                        value={form.status}
                                        onChange={e => setForm(f => ({ ...f, status: e.target.value === "true" }))}
                                    >
                                        <option value="true">Hoạt động</option>
                                        <option value="false">Không hoạt động</option>
                                    </select>
                                </div>
                                <div className="mb-6">
                                    <label className="block mb-1 font-semibold">Phòng chiếu</label>
                                    <select
                                        className="border rounded px-3 py-2 w-full"
                                        value={form.cinemaRoomId}
                                        onChange={e => setForm(f => ({ ...f, cinemaRoomId: e.target.value }))}
                                        required
                                    >
                                        <option value="">Chọn phòng chiếu</option>
                                        {cinemaRooms.map(room => (
                                            <option key={room.cinemaRoomId} value={room.cinemaRoomId}>
                                                {room.roomName || `Phòng ${room.cinemaRoomId}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-200 rounded"
                                        onClick={() => setModalOpen(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-600 text-white rounded"
                                    >
                                        {editingId ? "Cập nhật" : "Thêm"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Modal xác nhận xóa */}
                    {deleteId && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
                                <h3 className="text-xl font-bold mb-4">Xóa ghế?</h3>
                                <p>Bạn có chắc chắn muốn xóa ghế này?</p>
                                <div className="flex justify-end gap-2 mt-6">
                                    <button
                                        className="px-4 py-2 bg-gray-200 rounded"
                                        onClick={() => setDeleteId(null)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded"
                                        onClick={() => handleDelete(deleteId)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SeatDashboard;