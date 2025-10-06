import React from "react";

const HeaderPopUp = ({ content, getIcon, defaultNavLinks }) => {
  const isMobile = window.innerWidth <= 640;

  return (
    <div className="flex items-center justify-between sm:px-2 py-1 gap-1.5">
      <div className="bg-slate-100 px-2 py-0.5 rounded">
        <span className="text-slate-600 font-medium text-sm">LOGO</span>
      </div>
      <nav className="flex items-center justify-center px-1.5 relative">
        <ul className="flex items-center justify-center space-x-2">
          {defaultNavLinks &&
            defaultNavLinks?.length > 0 &&
            defaultNavLinks.map((navItem, index) => (
              <li key={index} className="group py-2">
                <div className="cursor-pointer text-[10px] font-medium text-black hover:text-slate-600 transition-colors flex items-center justify-center">
                  {navItem.name}
                </div>
              </li>
            ))}
        </ul>
      </nav>
      <div className="flex items-center space-x-1 my-2 gap-0.5">
        {!isMobile && (
          <div
            className={`flex items-center border px-2 py-[3px] rounded-full transition-colors`}
          >
            <span className="text-gray-500"> {getIcon("search", 10)} </span>
            <input
              type="search"
              placeholder={`Search for Product, Brands and More...`}
              className="w-[70px] ml-1 outline-none text-xs py-2 sm:py-1"
            />
          </div>
        )}
        <span className="text-gray-500"> {getIcon("notification", 10)} </span>
        <span className="text-gray-500"> {getIcon("user", 10)} </span>
        <span className="text-gray-500"> {getIcon("wishlist", 10)} </span>
        <span className="text-gray-500"> {getIcon("cart", 10)} </span>
      </div>
    </div>
  );
};

export default HeaderPopUp;
