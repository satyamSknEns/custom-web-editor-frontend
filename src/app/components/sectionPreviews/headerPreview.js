import React, { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoMdNotificationsOutline, IoMdNotifications } from "react-icons/io";
import { FaRegUser, FaUser, FaHeart, FaRegHeart, FaSignOutAlt } from "react-icons/fa";
import { BsHandbag, BsHandbagFill } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";
import axios from 'axios';
import { apiurl } from '../../../config/config';
import HeaderPopUp from '../popupPreviews/headerPopup';

export const schema = {
  name: 'Header Section',
  max_items: 7,
  min_items: 4,
  default_items: 4,
  settings: [
    {
      type:"header_menus",
      id:"selected_menu",
      label:"Select Menu",
      default:"Header Menu",
    },
    {
      type: "select",
      id: "layout_style",
      label: "Layout Style",
      default: "layout1",
      options: [
        { value: "layout1", label: "Layout 1" },
        { value: "layout2", label: "Layout 2" },
      ],
    },
    {
      type: "image",
      id: "logo_image",
      label: "Logo Image",
      default: "/image/placeholder.jpg",
    },
    {
      type: "range",
      id: "logo_width",
      label: "Logo Width (px)",
      min: 50,
      max: 300,
      step: 5,
      default: 120,
    },
    {
      type: "select",
      id: "icon_style",
      label: "Icon Style",
      default: "normal",
      options: [
        { value: "normal", label: "Normal" },
        { value: "filled", label: "Filled" },
      ],
    },
    {
      type: "checkbox",
      id: "show_search_bar",
      label: "Show Search Bar",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_notification_icon",
      label: "Show Notification Icon",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_user_icon",
      label: "Show User Icon",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_wishlist_icon",
      label: "Show Wishlist Icon",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_cart_icon",
      label: "Show Cart Icon",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_sticky_header",
      label: "Sticky Header",
      default: false,
    },
    {
      type: "color",
      id: "icon_background_color",
      label: "Icon Background Color",
      default: "transparent",
    },
    {
      type: "color",
      id: "icon_color",
      label: "Icon Color",
      default: "#4a5568",
    },
    {
      type: "color",
      id: "search_bar_border_color",
      label: "Search Bar Border Color",
      default: "#e5e7eb",
    },
    {
      type: "select",
      id: "search_bar_border_radius",
      label: "Search Bar Border Radius",
      default: "rounded-full",
      options: [
        { value: "rounded-none", label: "None" },
        { value: "rounded-sm", label: "Small" },
        { value: "rounded-md", label: "Medium" },
        { value: "rounded-lg", label: "Large" },
        { value: "rounded-full", label: "Full" },
      ],
    },
  ],
};

const HeaderPreview = ({ content, viewType }) => {
  const isPopup = viewType === "popup_view";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeMenuPath, setActiveMenuPath] = useState([]);
  const [transitionDirection, setTransitionDirection] = useState('forward');
  const searchInputRef = useRef(null);
  const headerRef = useRef(null);
  const cartFooterRef = useRef(null);
  const cartHeaderRef = useRef(null);
  const cartUserPanelRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState([]);

  useEffect(() => {
    if (cartHeaderRef.current && cartUserPanelRef.current && cartFooterRef.current) {
      const totalHeight = cartHeaderRef.current.offsetHeight + cartUserPanelRef.current.offsetHeight + cartFooterRef.current.offsetHeight;
      setHeaderHeight(totalHeight);
    }
  }, [cartHeaderRef, cartUserPanelRef, cartFooterRef]);

  const toggleSidebar = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSearch = (e) => {
    e.stopPropagation();
    setIsMobileSearchVisible(!isMobileSearchVisible);
  };
  const clearSearch = () => {
    setSearchValue('');
    searchInputRef.current.focus();
  };

  const [deviceWidth, setDeviceWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => {
        setDeviceWidth(window.innerWidth);
      };
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileSearchVisible && headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMobileSearchVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileSearchVisible]);
  
  useEffect(() => {
    if (isMobileSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchVisible]);

  useEffect(() => {
    if (!isSidebarOpen) {
        setActiveMenuPath([]);
        setTransitionDirection(null);
    }
}, [isSidebarOpen]);

  const isMobile = deviceWidth <= 640;
  const isTablet = deviceWidth >= 641 && deviceWidth < 1024;
  // const isDesktop = deviceWidth >= 1024;

  const getFieldDefault = (fieldId) => {
    const field = schema.settings.find(s => s.id === fieldId);
    return field ? field.default : undefined;
  };

  const layout_style = content?.layout_style ?? getFieldDefault("layout_style");
  const logo_image = content?.logo_image ?? getFieldDefault("logo_image");
  const logo_width = content?.logo_width ?? getFieldDefault("logo_width");
  const icon_style = content?.icon_style ?? getFieldDefault("icon_style");
  const show_search_bar = content?.show_search_bar ?? getFieldDefault("show_search_bar");
  const show_notification_icon = content?.show_notification_icon ?? getFieldDefault("show_notification_icon");
  const show_user_icon = content?.show_user_icon ?? getFieldDefault("show_user_icon");
  const show_wishlist_icon = content?.show_wishlist_icon ?? getFieldDefault("show_wishlist_icon");
  const show_cart_icon = content?.show_cart_icon ?? getFieldDefault("show_cart_icon");
  const show_sticky_header = content?.show_sticky_header ?? getFieldDefault("show_sticky_header");
  const icon_background_color = content?.icon_background_color ?? getFieldDefault("icon_background_color");
  const icon_color = content?.icon_color ?? getFieldDefault("icon_color");
  const search_bar_border_color = content?.search_bar_border_color ?? getFieldDefault("search_bar_border_color");
  const search_bar_border_radius = content?.search_bar_border_radius ?? getFieldDefault("search_bar_border_radius");
  const defaultNavLinks = content?.nav_links;
  const isLayout1 = layout_style === "layout1";
  const isFilled = icon_style === "filled";

  const getIcon = (iconName, size = 20) => {
    if (isFilled) {
      switch (iconName) {
        case 'search': return <FiSearch size={size} />;
        case 'notification': return <IoMdNotifications size={25} />;
        case 'user': return <FaUser size={20} />;
        case 'wishlist': return <FaHeart size={size} />;
        case 'cart': return <BsHandbagFill size={size} />;
        default: return null;
      }
    } else {
      switch (iconName) {
        case 'search': return <FiSearch size={size} />;
        case 'notification': return <IoMdNotificationsOutline size={isPopup ? 14 : 25} />;
        case 'user': return <FaRegUser size={isPopup ? 10 : 23} />;
        case 'wishlist': return <FaRegHeart size={size} />;
        case 'cart': return <BsHandbag size={size} />;
        default: return null;
      }
    }
  };

  const icons = [
    { id: 'search', component: getIcon('search'), isVisible: (show_search_bar && isMobile) || (show_search_bar && !isLayout1), onClick: toggleMobileSearch },
    { id: 'notification', component: getIcon('notification'), isVisible: show_notification_icon },
    { id: 'user', component: getIcon('user'), isVisible: show_user_icon },
    { id: 'wishlist', component: getIcon('wishlist'), isVisible: show_wishlist_icon },
    { id: 'cart', component: getIcon('cart'), isVisible: show_cart_icon },
    { id: 'sidebar', component: <HiOutlineBars3 size={25} />, isVisible: isMobile || isTablet, onClick: toggleSidebar }
  ].filter(icon => icon.isVisible);

  const currentMenuId = content?.selected_menu?._id;

  const getSelectedMenu = async (menu_id) => {
      try {
          const response = await axios.get(`${apiurl}/webMenu/menu/${menu_id}`);
          if (response.data?.success) {
              setSelectedMenu(response.data.data || []);
          }
      } catch (err) {
          console.error("Error fetching menus:", err);
      } finally {
      }
  };
  useEffect(()=>{
    if(currentMenuId){
      getSelectedMenu(currentMenuId);
    }
  },[content?.selected_menu?._id,currentMenuId]);

  const getLinksToRender = () => {
    if (selectedMenu && selectedMenu?.menuItems?.length > 0) {
      return selectedMenu.menuItems;
    }
    if (!content?.selected_menu?._id && content?.nav_links) {
      return content.nav_links.filter(link => link.is_visible !== false);
    }
    return [];
  };

  const filteredNavLinks = getLinksToRender();

  const iconStyle = {
    color: icon_color,
    backgroundColor: icon_background_color,
  };

  const headerClasses = `bg-white text-gray-800 border-b border-[#ddd] w-full mt-0 ${show_sticky_header ? 'sticky top-0 z-[9999]' : ''}`;
  const isLoggedIn = false;
  const user = { firstName: 'J', lastName: 'D', fullName: 'John Doe', email: 'john.doe@example.com' };

  const handleNavigation = (menuItem) => {
    if (menuItem.children && menuItem.children.length > 0) {
      setTransitionDirection('forward');
      setActiveMenuPath(prevPath => [...prevPath, menuItem]);
    } else {
      toggleSidebar();
    }
  };

  const handleBack = () => {
    setTransitionDirection('backward');
    setActiveMenuPath(prevPath => prevPath.slice(0, -1));
  };

  const currentMenuItems = activeMenuPath.length > 0
    ? activeMenuPath[activeMenuPath.length - 1].children
    : filteredNavLinks;

  const renderSubMenu = (items) => {
    return items.map((subItem) => (
      <div key={subItem.id}>
      {subItem.link && subItem.link !== "#" ? (
        <a href={subItem.link} className="font-semibold text-sm text-black mb-2">{subItem.name}</a>
        ) :(
          <div className="font-semibold text-sm text-black mb-2">{subItem.name}</div>
        )}
        {subItem.children.length > 0 && (
          <ul className="space-y-1">
            {subItem.children.map((childItem) => (
              <li key={childItem.id} link={childItem?.link}>
                {childItem.link && childItem.link !== "#" ? (
                  <a href={childItem.link} className="font-medium text-xs hover:text-red-600">{childItem.name}</a>
                ) :(
                  <div className="font-medium text-xs hover:text-red-600">{childItem.name}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    ));
  };
  
  const MenuList = ({ items, onNavigate }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      setIsAnimating(true);
    }, [items]);

    return (
      <div className={`list-none relative top-0 left-0 right-0 bottom-0 transition-transform duration-500 ease-in-out ${isAnimating ? (transitionDirection === 'forward' ? 'translate-x-0' : 'translate-x-0') : (transitionDirection === 'forward' ? 'translate-x-full' : transitionDirection === 'backward' ? '-translate-x-full' : 'transition-none translate-x-0')}`}>
        {activeMenuPath.length > 0 &&
          <div className='px-3 flex items-center border-b border-[#dee2e6]'>
            <button onClick={handleBack} className="w-7 text-gray-500 hover:text-gray-700">
              <MdArrowBackIos size={16} />
            </button>
            <div className="border-l text-base py-2.5 pl-2">{activeMenuPath[activeMenuPath.length - 1].name}</div>
          </div>}
          {items.map((link) => (
              <li key={link.id} className="border-b border-[#dee2e6]">
                <a
                  href={link?.children && link?.children?.length > 0 ? '#' : link?.link}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(link);
                  }}
                  className="w-full inline-flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
                >
                  {link.name}
                  {link?.children && link?.children.length > 0 && <MdOutlineArrowForwardIos size={14} />}
                </a>
              </li>
          ))}
      </div>
    );
  };

  return (
    <header className={headerClasses} ref={headerRef}>
    {isPopup ? <HeaderPopUp content={content} getIcon={getIcon} defaultNavLinks={defaultNavLinks} />  : (
      <>
        {isSidebarOpen && (
          <div className={`fixed top-0 left-0 h-screen w-screen bg-black ${isSidebarOpen ? 'opacity-50' : 'opacity-0'}`} onClick={(e) => { toggleMobileSearch(e) }}></div>
        )}
        <div className={`z-[999] fixed inset-y-0 right-0 lg:w-[440px] sm:w-1/2 w-3/4 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`} onClick={e => e.stopPropagation()}>
          <div className={`flex items-center px-2 border-b border-[#dee2e6] ${!isLoggedIn ? 'justify-between' : ' justify-end'}`} ref={cartHeaderRef}>
            {logo_image && !isLoggedIn && <img src={logo_image} alt="Logo" width={logo_width} height="auto" />}
            <button onClick={(e) => { toggleSidebar(e) }} className="text-gray-500 hover:text-gray-700 ml-auto">
              <IoCloseOutline size={isMobile ? 30 : 36} />
            </button>
          </div>

          <div className="cartBody">
            <div className="flex items-center gap-4 p-3 border-b border-[#dee2e6]" ref={cartUserPanelRef}>
              {isLoggedIn ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{user.fullName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <FaRegUser size={24} />
                  <span className="font-semibold"><span className='underline'>Login</span> / <span className='underline'>SignUp</span></span>
                </div>
              )}
            </div>
            <nav className="relative overflow-x-hidden h-[calc(100vh-var(--header-height))] overflow-y-auto" style={{ '--header-height': `${headerHeight}px` }}>
              <MenuList
                key={activeMenuPath.length}
                items={currentMenuItems}
                onNavigate={handleNavigation}
              />
            </nav>
            {!isLoggedIn && (
              <div className="cartFooter flex items-center justify-end px-3 py-2.5" ref={cartFooterRef}>
                <div className="inline-flex items-center justify-center gap-1 text-white px-2 py-1 rounded-sm" style={{backgroundColor: icon_color}}><span>Log Out</span> <FaSignOutAlt /> </div>
              </div>
            )}
          </div>
        </div>

        {isLayout1 ? (
          <>
            <div className="flex items-center justify-between sm:px-5 py-2 gap-4">
              <div className="flex-shrink-0">
                {logo_image && <img src={logo_image} alt="Logo" width={logo_width} height="auto" />}
              </div>

              {!isMobile && !isTablet && (
                <nav className="flex items-center justify-center xl:px-4 lg:px-2 relative">
                  <ul className="flex items-center justify-center space-x-6 lg:space-x-10">
                    {filteredNavLinks && filteredNavLinks?.length >0 && filteredNavLinks.map((navItem,index) => (
                      <li
                        key={navItem.id}
                        className="group py-2"
                        onMouseEnter={() => setActiveSubMenu(navItem.id)}
                        onMouseLeave={() => setActiveSubMenu(null)}
                      >
                        {navItem.link && navItem.link !== "#" ? (
                          <a href={navItem.link} className='text-xs sm:text-sm hover:underline font-medium text-black hover:text-red-600 transition-colors flex items-center justify-center'>
                            {navItem.name}
                          </a>
                        ) : (
                          <div className='cursor-pointer text-xs sm:text-sm font-medium text-black hover:text-red-600 transition-colors flex items-center justify-center'>
                            {navItem.name}
                          </div>
                        )}
                        {navItem?.children?.length > 0 && activeSubMenu === navItem.id && (
                          <div className="absolute top-full left-0 w-[650px] p-8 bg-white shadow rounded-b-lg border border-gray-200 flex items-start justify-between gap-4 h-[50vh] overflow-y-auto z-[9999]" style={{scrollbarWidth: "none"}}>
                            {renderSubMenu(navItem.children)}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <div className="flex items-center space-x-1 my-2 gap-0.5">
                {show_search_bar && !isMobile && (
                  <div className={`w-full flex md:flex items-center ${search_bar_border_radius} xl:px-4 px-2.5 py-[3px] focus-within:border-[#de3c3a] transition-colors`} style={{ border: `1px solid ${search_bar_border_color}` }}>
                    <span className="text-gray-500"> {getIcon('search', 16)} </span>
                    <input
                      type="search"
                      placeholder={`Search for Product, Brands and More...`}
                      className="border-[#de3c3a] ml-2 max-w-full outline-none text-base xl:py-2 sm:py-1"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                )}
                {icons.map(icon => (
                  <span key={icon.id} onClick={icon.onClick} className={`cursor-pointer transition-colors rounded-3xl p-1 flex items-center justify-center`} style={iconStyle}>
                    {icon.component}
                  </span>
                ))}
              </div>
            </div>

            {isMobileSearchVisible && show_search_bar && (
              <div className="px-4 py-1 md:hidden relative">
                <div className={`flex items-center ${search_bar_border_radius} px-4 py-1.5 focus-within:border-gray-500 transition-colors`} style={{ border: `1px solid ${search_bar_border_color}` }}>
                  <span className="text-gray-500">
                    {getIcon('search', 16)}
                  </span>
                  <input
                    type="text"
                    ref={searchInputRef}
                    placeholder={`Search for Product, Brands and More...`}
                    className="ml-2 w-full outline-none text-sm"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  {searchValue && (
                    <button onClick={clearSearch} className="transition-all duration-700 ease-in-out ml-2 text-gray-500">
                      <IoCloseOutline size={20} />
                    </button>
                  )}
                </div>
                {!searchValue && (
                  <button onClick={(e) => { toggleMobileSearch(e) }} className="absolute transition-all duration-700 ease-in-out ml-2 text-gray-500 top-2.5 right-0">
                    <IoCloseOutline size={20} />
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="relative mx-auto md:p-3 flex items-center justify-center">
              <div className={`flex-shrink-0 ${isSidebarOpen && '-z-10'}`}>
                {logo_image && <img src={logo_image} alt="Logo" width={logo_width} height="auto" />}
              </div>

              <div className="absolute flex items-center space-x-1 top-7 right-4">
                {icons.map(icon => (
                  <span key={icon.id} onClick={icon.onClick} className={`cursor-pointer transition-colors rounded-3xl p-1 flex items-center justify-center`} style={iconStyle}>
                    {icon.component}
                  </span>
                ))}
              </div>
            </div>

            <nav className={`flex justify-center ${(isMobileSearchVisible && show_search_bar) ? 'py-2 pb-1' : 'md:p-3 py-2 pb-3'}`}>
              <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:space-x-8 relative">
                {filteredNavLinks && filteredNavLinks?.length >0 && filteredNavLinks.map((navItem) => (
                  <li
                    key={navItem.id}
                    className="group py-2"
                    onMouseEnter={() => setActiveSubMenu(navItem.id)}
                    onMouseLeave={() => setActiveSubMenu(null)}
                  >
                    {navItem.link && navItem.link !== "#" ? (
                      <a href={navItem.link} className='text-xs sm:text-sm hover:underline font-medium text-black hover:text-red-600 transition-colors flex items-center justify-center'>
                        {navItem.name}
                      </a>
                    ) : (
                      <div className='cursor-pointer text-xs sm:text-sm font-medium text-black hover:text-red-600 transition-colors flex items-center justify-center'>
                        {navItem.name}
                      </div>
                    )}
                    {navItem?.children?.length > 0 && activeSubMenu === navItem.id && (
                      <div className="absolute top-full left-0 w-[650px] p-8 bg-white shadow rounded-b-lg border border-gray-200 flex items-start justify-between gap-4 h-[50vh] overflow-y-auto z-[9999]" style={{scrollbarWidth: "none"}}>
                        {renderSubMenu(navItem.children)}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            {isMobileSearchVisible && show_search_bar && (
              <div className={`w-full flex items-center justify-center px-4 py-2 transition-all duration-700 ease-in-out`}>
                <div className={`w-3/5 flex items-center justify-center pr-4 pt-3 pb-2.5 focus-within:border-gray-500 transition-colors relative border-b ${isSidebarOpen && '-z-10'} `} style={{ borderColor: search_bar_border_color }}>
                  <span className="text-gray-500">
                    {getIcon('search', 20)}
                  </span>
                  <input
                    type="text"
                    ref={searchInputRef}
                    placeholder={`Search for Product, Brands and More...`}
                    className="ml-2 w-full outline-none text-lg h-9"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  {searchValue && (
                    <button onClick={clearSearch} className="transition-all duration-700 ease-in-out ml-2 text-gray-500">
                      <IoCloseOutline size={23} />
                    </button>
                  )}
                  {!searchValue && (
                    <button onClick={(e) => { toggleMobileSearch(e) }} className="absolute transition-all duration-700 ease-in-out ml-2 text-gray-500 top-6 -right-1">
                      <IoCloseOutline size={25} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </>
    )}
    </header>
  );
};

export default HeaderPreview;