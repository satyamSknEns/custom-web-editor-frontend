import React from 'react';
import { MdClear } from "react-icons/md";

const DeleteMenuModal = ({ show, menuToDelete, onConfirm, onCancel }) => {
    if (!show || !menuToDelete) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-40">
            <div className="flex flex-col items-center justify-center relative border w-[95%] lg:w-1/2 sm:w-3/4 shadow-lg rounded-md bg-white">
                <div className="w-full flex items-center justify-between bg-gray-100 p-4 border-b">
                    <h4 className="text-lg leading-6 font-medium text-gray-600">
                        Delete Menu
                    </h4>
                    <MdClear onClick={onCancel} size={27} className="cursor-pointer text-gray-700 rounded-md p-1 hover:bg-gray-200" />
                </div>
                <div className="w-full mt-2 p-4 border-b">
                    <p className="text-slate-500">
                        Are you sure you want to delete the menu &quot;<span className="font-semibold">{menuToDelete.title}</span>&quot;? This action cannot be undone.
                    </p>
                </div>
                <div className="items-center p-3">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-24 mr-2 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteMenuModal;