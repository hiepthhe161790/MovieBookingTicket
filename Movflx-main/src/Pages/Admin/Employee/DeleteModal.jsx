import React from "react";

const DeleteModal = ({ employeeId, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this employee?</p>
            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onConfirm(employeeId)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
);

export default DeleteModal;