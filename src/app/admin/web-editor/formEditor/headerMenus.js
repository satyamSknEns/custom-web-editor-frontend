"use client";
import { useEffect, useState } from "react";
import { apiurl } from "../../../../config/config.js";
import axios from "axios";

const HeaderMenus = ({ id, label, value, onValueChange, uniqueHtmlId }) => {
  const [availableMenus, setAvailableMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get(`${apiurl}/webMenu/menu`);
        if (response.data?.success) {
          setAvailableMenus(response.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch menus:", err);
      } finally {
        setLoadingMenus(false);
      }
    };
    fetchMenus();
  }, []);
  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const selectedMenu = availableMenus.find((menu) => menu._id === selectedId);
    onValueChange(selectedMenu);
  };

  return (
    <select
      id={uniqueHtmlId}
      className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
      value={loadingMenus ? "" : value?._id || ""}
      onChange={handleSelectChange}
    >
      {loadingMenus ? (
        <option value="" disabled>
          Loading...
        </option>
      ) : (
        <>
          <option value="" disabled>
            Select a menu
          </option>
          {availableMenus.map((menu) => (
            <option key={menu._id} value={menu._id}>
              {menu.title}
            </option>
          ))}
        </>
      )}
    </select>
  );
};

export default HeaderMenus;
