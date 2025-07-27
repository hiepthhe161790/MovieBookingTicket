import React, { useState, useEffect, useMemo } from "react";
import { FiPlusCircle, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import EmployeeModal from "./EmployeeModal";
import DeleteModal from "./DeleteModal";
import {
  fetchEmployeesApi,
  addEmployeeApi,
  editEmployeeApi,
  deleteEmployeeApi,
} from "./api";
import { toast } from "react-toastify";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [employeeToDeleteId, setEmployeeToDeleteId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await fetchEmployeesApi();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  const handleAddEmployee = async (formData) => {
    try {
      const requestData = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        name: formData.name,
        birthday: formData.birthday,
        gender: formData.gender,
        identityCard: formData.identityCard,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      };
      await addEmployeeApi(requestData);
      toast.success("Employee added!");
      setIsModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleEditEmployee = async (formData) => {
    // Use employeeId from currentEmployee
    const employeeIdToUpdate = currentEmployee?.employeeId;
    if (!employeeIdToUpdate) {
      toast.error("Employee ID not found for update.");
      return;
    }
    try {
      const requestData = {
        username: formData.username,
        password: formData.password || null,
        email: formData.email,
        name: formData.name,
        birthday: formData.birthday,
        gender: formData.gender,
        identityCard: formData.identityCard,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      };
      await editEmployeeApi(employeeIdToUpdate, requestData);
      toast.success("Employee updated!");
      setIsModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await deleteEmployeeApi(id);
      setIsDeleteModalOpen(false);
      setEmployees((prev) => prev.filter((emp) => emp.employeeId !== id));
      toast.success("Employee deleted!");
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(
        (emp) =>
            emp.account?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.account?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.account?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.account?.identityCard.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.account?.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  return (
      <>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Employee Management</h1>
            <button
                onClick={() => {
                  setCurrentEmployee(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <FiPlusCircle /> Add Employee
            </button>
          </div>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search employees..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                    <div
                        key={emp.employeeId}
                        className="bg-white rounded-lg shadow-md overflow-hidden p-4 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-bold text-lg mb-2">
                          {emp.account?.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Email: {emp.account?.email}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Username: {emp.account?.username}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Birthday:{" "}
                          {emp.account?.birthday
                              ? emp.account.birthday.substring(0, 10)
                              : "N/A"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Gender: {emp.account?.gender}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Identity Card: {emp.account?.identityCard}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Phone: {emp.account?.phoneNumber}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Address: {emp.account?.address}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => {
                              setCurrentEmployee(emp);
                              setIsModalOpen(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                            onClick={() => {
                              setCurrentEmployee(emp);
                              setEmployeeToDeleteId(emp.employeeId);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full text-red-500"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                ))
            ) : (
                <p className="col-span-full text-center text-gray-600">
                  No employees found.
                </p>
            )}
          </div>
        </div>
        {isModalOpen && (
            <EmployeeModal
                employee={currentEmployee}
                onSave={currentEmployee ? handleEditEmployee : handleAddEmployee}
                onClose={() => setIsModalOpen(false)}
            />
        )}
        {isDeleteModalOpen && (
            <DeleteModal
                employeeId={employeeToDeleteId}
                onConfirm={handleDeleteEmployee}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        )}
      </>
  );
};

export default EmployeeDashboard;
