import React, { useState, useEffect } from "react";
import { FiPlusCircle, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
const TypeDashboard = () => {
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/types")
      .then(res => res.json())
      .then(data => setTypes(data))
      .catch(err => console.error(err));
  }, []);

  const filteredTypes = types.filter(type =>
    type.typeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddType = (formData) => {
    fetch("http://localhost:8080/api/types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ typeName: formData.typeName })
    })
      .then(res => {
        if (!res.ok) throw new Error("Thêm loại phim thất bại");
        return res.json();
      })
      .then(() => {
        toast.success("Thêm loại phim thành công!");
        setIsModalOpen(false);
        return fetch("http://localhost:8080/api/types")
          .then(res => res.json())
          .then(data => setTypes(data));
      })
      .catch(() => toast.error("Thêm loại phim thất bại!"));
  };

  const handleEditType = (formData) => {
    fetch(`http://localhost:8080/api/types/${formData.typeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ typeName: formData.typeName })
    })
      .then(res => {
        if (!res.ok) throw new Error("Sửa loại phim thất bại");
        return res.json();
      })
      .then(() => {
        toast.success("Cập nhật loại phim thành công!");
        setIsModalOpen(false);
        return fetch("http://localhost:8080/api/types")
          .then(res => res.json())
          .then(data => setTypes(data));
      })
      .catch(() => toast.error("Cập nhật loại phim thất bại!"));
  };

  const handleDeleteType = (id) => {
    fetch(`http://localhost:8080/api/types/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Xóa loại phim thất bại");
        setTypes(prev => prev.filter(type => type.typeId !== id));
        setIsDeleteModalOpen(false);
        toast.success("Xóa loại phim thành công!");
      })
      .catch(() => toast.error("Xóa loại phim thất bại!"));
  };

  const TypeModal = ({ type, onSave, onClose }) => {
    const [formData, setFormData] = useState(type || { typeName: "" });

    useEffect(() => {
      if (type) setFormData(type);
    }, [type]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">{type ? "Edit Type" : "Add New Type"}</h2>
          <form onSubmit={e => { e.preventDefault(); onSave(formData); }}>
            <input
              className="border p-2 rounded w-full mb-4"
              placeholder="Type Name"
              value={formData.typeName}
              onChange={e => setFormData({ ...formData, typeName: e.target.value })}
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

  const DeleteModal = ({ typeId, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this type?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(typeId)}
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
          <h1 className="text-2xl font-bold">Type Management</h1>
          <button
            onClick={() => {
              setCurrentType(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FiPlusCircle /> Add Type
          </button>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search types..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredTypes.map((type, index) => (
  <div key={type.typeId} className="bg-white rounded-lg shadow-md overflow-hidden p-4 flex flex-col justify-between">
    <div>
      <h3 className="font-bold text-lg mb-2">{type.typeName}</h3>
      <p className="text-gray-500 text-sm">STT: {index + 1}</p>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setCurrentType(type);
                    setIsModalOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => {
                    setCurrentType(type);
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
        <TypeModal
          type={currentType}
          onSave={currentType ? handleEditType : handleAddType}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          typeId={currentType?.typeId}
          onConfirm={handleDeleteType}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
};

export default TypeDashboard;