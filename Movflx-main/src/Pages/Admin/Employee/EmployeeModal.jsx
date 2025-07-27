import React, { useState, useEffect } from "react";

const defaultForm = {
  username: "",
  password: "",
  email: "",
  name: "",
  birthday: "",
  gender: "MALE",
  identityCard: "",
  phoneNumber: "",
  address: "",
};

const EmployeeModal = ({ employee, onSave, onClose }) => {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (employee) {
      setFormData({
        username: employee.account?.username || "",
        email: employee.account?.email || "",
        name: employee.account?.name || "",
        birthday: employee.account?.birthday
            ? employee.account.birthday.substring(0, 10)
            : "",
        gender: employee.account?.gender || "MALE",
        identityCard: employee.account?.identityCard || "",
        phoneNumber: employee.account?.phoneNumber || "",
        address: employee.account?.address || "",
        password: "",
      });
    } else {
      setFormData(defaultForm);
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">
            {employee ? "Edit Employee" : "Add New Employee"}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
                className="border p-2 rounded w-full mb-2"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            {!employee && (
                <input
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            )}
            <input
                className="border p-2 rounded w-full mb-2"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
            />
            <input
                className="border p-2 rounded w-full mb-2"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                className="border p-2 rounded w-full mb-2"
                placeholder="Birthday"
                name="birthday"
                type="date"
                value={formData.birthday}
                onChange={handleChange}
                required
            />
            <select
                className="border p-2 rounded w-full mb-2"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <input
                className="border p-2 rounded w-full mb-2"
                placeholder="Identity Card"
                name="identityCard"
                value={formData.identityCard}
                onChange={handleChange}
                required
            />
            <input
                className="border p-2 rounded w-full mb-2"
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
            />
            <input
                className="border p-2 rounded w-full mb-4"
                placeholder="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
            />
            <div className="flex justify-end gap-2 mt-4">
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

export default EmployeeModal;