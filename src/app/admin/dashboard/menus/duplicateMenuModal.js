"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

const DuplicateMenuModal = ({
  show,
  menuTitle,
  onConfirm,
  onCancel,
  createHandle,
}) => {
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuHandle, setNewMenuHandle] = useState("");

  useEffect(() => {
    if (show && menuTitle) {
      const defaultName = `${menuTitle} (copy)`;
      setNewMenuName(defaultName);
      setNewMenuHandle(createHandle(defaultName));
    }
  }, [show, menuTitle, createHandle]);

  if (!show) {
    return null;
  }

  const handleNameChange = (e) => {
    const name = e.target.value;
    setNewMenuName(name);
    setNewMenuHandle(createHandle(name));
  };

  const isNameEmpty = newMenuName.trim() === "";

  const handleConfirm = () => {
    if (isNameEmpty) {
      return;
    }
    onConfirm(newMenuName.trim(), newMenuHandle);
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full flex justify-center items-center z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col items-center justify-center relative border lg:w-1/2 sm:max-w-lg w-full shadow-lg rounded-md bg-white text-left sm:align-middle overflow-hidden transform transition-all sm:my-8 ">

        <div className="flex justify-between items-center px-4 py-3 border-b w-full">
            <h3
              className="text-lg leading-6 font-semibold text-gray-900"
              id="modal-title"
            >
              Duplicate menu
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 cursor-pointer"
              onClick={onCancel}
            >
              <AiOutlineClose size={20} />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 space-y-4 w-full">
            <div className="w-full">
              <label
                htmlFor="duplicate-name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="duplicate-name"
                value={newMenuName}
                onChange={handleNameChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none text-gray-900 focus:ring-slate-500 focus:border-slate-500 sm:text-sm ${
                  isNameEmpty ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Menu Name (copy)"
              />
              {isNameEmpty && (
                <p className="text-red-500 text-xs mt-1">
                  Menu name is required.
                </p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Handle
              </label>
              <input
                type="text"
                value={newMenuHandle}
                readOnly
                disabled
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 text-gray-900 rounded-md shadow-sm cursor-not-allowed sm:text-sm"
              />
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex gap-5 items-center justify-end w-full">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-sm cursor-pointer"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 hover:bg-orange-700 text-base font-medium text-white sm:w-auto sm:text-sm outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={handleConfirm}
              disabled={isNameEmpty}
            >
              Duplicate
            </button>
          </div>
      </div>
    </div>
  );
};

export default DuplicateMenuModal;
