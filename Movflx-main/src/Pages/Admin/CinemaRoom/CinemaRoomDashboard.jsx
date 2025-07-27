import React, { useState, useEffect } from "react";
import { FiPlusCircle, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
const CinemaRoomDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/cinema-rooms")
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error(err));
  }, []);

  const filteredRooms = rooms.filter(room =>
    room.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRoom = (formData) => {
    fetch("http://localhost:8080/api/cinema-rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomName: formData.roomName,
        capacity: Number(formData.capacity),
        description: formData.description
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Thêm phòng chiếu thất bại");
        return res.json();
      })
      .then(() => {
        toast.success("Thêm phòng chiếu thành công!");
        setIsModalOpen(false);
        return fetch("http://localhost:8080/api/cinema-rooms")
          .then(res => res.json())
          .then(data => setRooms(data));
      })
      .catch(() => toast.error("Thêm phòng chiếu thất bại!"));
  };

  const handleEditRoom = (formData) => {
    fetch(`http://localhost:8080/api/cinema-rooms/${formData.cinemaRoomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomName: formData.roomName,
        capacity: Number(formData.capacity),
        description: formData.description
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Cập nhật phòng chiếu thất bại");
        return res.json();
      })
      .then(() => {
        toast.success("Cập nhật phòng chiếu thành công!");
        setIsModalOpen(false);
        return fetch("http://localhost:8080/api/cinema-rooms")
          .then(res => res.json())
          .then(data => setRooms(data));
      })
      .catch(() => toast.error("Cập nhật phòng chiếu thất bại!"));
  };

  const handleDeleteRoom = (id) => {
    fetch(`http://localhost:8080/api/cinema-rooms/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Xóa phòng chiếu thất bại");
        setRooms(prev => prev.filter(room => room.cinemaRoomId !== id));
        setIsDeleteModalOpen(false);
        toast.success("Xóa phòng chiếu thành công!");
      })
      .catch(() => toast.error("Xóa phòng chiếu thất bại!"));
  };

  const RoomModal = ({ room, onSave, onClose }) => {
    const [formData, setFormData] = useState(
      room || { roomName: "", capacity: "", description: "" }
    );

    useEffect(() => {
      if (room) setFormData(room);
    }, [room]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">{room ? "Edit Room" : "Add New Room"}</h2>
          <form onSubmit={e => { e.preventDefault(); onSave(formData); }}>
            <input
              className="border p-2 rounded w-full mb-4"
              placeholder="Room Name"
              value={formData.roomName}
              onChange={e => setFormData({ ...formData, roomName: e.target.value })}
              required
            />
            <input
              type="number"
              className="border p-2 rounded w-full mb-4"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={e => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
            <input
              className="border p-2 rounded w-full mb-4"
              placeholder="Description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <div className="flex justify-end gap-2">
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

  const DeleteModal = ({ roomId, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this room?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(roomId)}
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
          <h1 className="text-2xl font-bold">Cinema Room Management</h1>
          <button
            onClick={() => {
              setCurrentRoom(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FiPlusCircle /> Add Room
          </button>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, index) => (
            <div key={room.cinemaRoomId} className="bg-white rounded-lg shadow-md overflow-hidden p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">{room.roomName}</h3>
                <p className="text-gray-500 text-sm">STT: {index + 1}</p>
                <p className="text-gray-500 text-sm">Capacity: {room.capacity}</p>
                <p className="text-gray-500 text-sm">Description: {room.description}</p>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setCurrentRoom(room);
                    setIsModalOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => {
                    setCurrentRoom(room);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full text-red-500"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <RoomModal
          room={currentRoom}
          onSave={currentRoom ? handleEditRoom : handleAddRoom}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          roomId={currentRoom?.cinemaRoomId}
          onConfirm={handleDeleteRoom}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
};

export default CinemaRoomDashboard;