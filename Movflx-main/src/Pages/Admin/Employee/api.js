import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:8080/api";

const handleResponse = async (res) => {
    if (res.ok) {
        return res.json();
    }
    const errorText = await res.text();
    console.error("API error response:", errorText, "Status:", res.status);
    toast.error(errorText || `Request failed with status: ${res.status}`);
    throw new Error(errorText || `Request failed with status: ${res.status}`);
};

export const fetchEmployeesApi = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/employees`, {
            method: "GET",
            credentials: "include", // Ensures cookies are sent with the request
        });
        return handleResponse(res);
    } catch (error) {
        throw error;
    }
};

export const addEmployeeApi = async (employeeData) => {
    try {
        const res = await fetch(`${API_BASE_URL}/employees`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // <-- Include credentials here
            body: JSON.stringify(employeeData),
        });
        return handleResponse(res);
    } catch (error) {
        throw error;
    }
};

export const editEmployeeApi = async (id, employeeData) => {
    try {
        const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(employeeData),
        });
        return handleResponse(res);
    } catch (error) {
        throw error;
    }
};

export const deleteEmployeeApi = async (id) => {
    try {
        const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!res.ok) {
            const errorText = await res.text();
            toast.error(errorText || `Delete failed with status: ${res.status}`);
            throw new Error(errorText || `Delete failed with status: ${res.status}`);
        }
        return true;
    } catch (error) {
        throw error;
    }
};
