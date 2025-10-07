import { useState, useEffect, useRef } from "react";
import { apiurl } from "../../../config/config";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaPlus,
  FaMinus,
  FaChevronRight,
} from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import axios from "axios";
import FooterPopUp from "../popupPreviews/footerPopup";

export const schema = {
  name: "Footer",
  settings: [
    {
      type: "color",
      id: "background_color",
      label: "Background Color",
      default: "#1c1819",
    },
    {
      type: "color",
      id: "text_color",
      label: "Text Color",
      default: "#ffffff",
    },
    {
      type: "color",
      id: "link_color",
      label: "Link Color",
      default: "#ffffff",
    },
    {
      type: "header",
      label: "Logo & Description",
    },
    {
      type: "checkbox",
      id: "is_logo",
      label: "Show Logo",
      default: true,
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
      default: 160,
    },
    {
      type: "checkbox",
      id: "is_description",
      label: "Show Description",
      default: true,
    },
    {
      type: "textarea",
      id: "description",
      label: "Description Text",
      default: "A short description about your brand.",
    },
    {
      type: "header",
      label: "Footer Menus",
    },
    {
      type: "color",
      id: "quick_link_color",
      label: "Quick Links Color",
      default: "#ffffff",
    },
    {
      type: "array",
      id: "selected_menu",
      label: "Menu Columns",
      max_items: 4,
      default_items: 4,
      itemFields: [
        {
          type: "checkbox",
          id: "is_visible",
          label: "Show Menu Column",
          default: true,
        },
        {
          type: "text",
          id: "menu_title",
          label: "Menu Title",
          default: "Quick Links",
        },
        {
          type: "footer_menus",
          id: "select_footer_menu",
          label: "Select Menu",
        },
      ],
    },
    {
      type: "header",
      label: "Social Media",
    },
    {
      type: "checkbox",
      id: "is_social_icons",
      label: "Show Social Media Icons",
      default: true,
    },
    {
      type: "color",
      id: "social_icon_color",
      label: "Social Icon Color",
      default: "#cccccc",
    },
    {
      type: "url",
      id: "facebook_url",
      label: "Facebook URL",
      default: "/",
    },
    {
      type: "url",
      id: "instagram_url",
      label: "Instagram URL",
      default: "/",
    },
    {
      type: "url",
      id: "twitter_url",
      label: "Twitter URL",
      default: "/",
    },
    {
      type: "url",
      id: "linkedin_url",
      label: "LinkedIn URL",
      default: "/",
    },
    {
      type: "url",
      id: "youtube_url",
      label: "Youtube URL",
      default: "/",
    },
    {
      type: "header",
      label: "Newsletter",
    },
    {
      type: "checkbox",
      id: "is_newsletter",
      label: "Show Newsletter Signup",
      default: true,
    },
    {
      type: "text",
      id: "newsletter_heading",
      label: "Newsletter Heading",
      default: "Join Our Newsletter",
    },
    {
      type: "text",
      id: "newsletter_button_text",
      label: "Button Text",
      default: "Subscribe",
    },
    {
      type: "color",
      id: "newsletter_heading_color",
      label: "Heading Color",
      default: "#ffffff",
    },
    {
      type: "color",
      id: "newsletter_button_color",
      label: "Button Color",
      default: "#1f2937",
    },
    {
      type: "header",
      label: "Copyright Text",
    },
    {
      type: "checkbox",
      id: "is_copyright",
      label: "Show Copyright",
      default: true,
    },
    {
      type: "color",
      id: "copyright_text_color",
      label: "Text Color",
      default: "#ffffff",
    },
    {
      type: "color",
      id: "copyright_bg_color",
      label: "Background Color",
      default: "#1c1819",
    },
    {
      type: "text",
      id: "copyright_text",
      label: "Copyright Text",
      default: "©2025 Your Company. All Rights Reserved.",
    },
  ],
};

const FooterPreview = ({ content, viewType }) => {
  const isPopup = viewType === "popup_view";
  const [menus, setMenus] = useState([]);
  const [deviceWidth, setDeviceWidth] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const fetchedMenuIds = useRef({});
  const characterLimit = 50;

  const getDefault = (id) => schema.settings.find((s) => s.id === id)?.default;
  const getVal = (id) => content?.[id] ?? getDefault(id);
  const is_social_icons = getVal("is_social_icons");
  const is_newsletter = getVal("is_newsletter");
  const is_copyright = getVal("is_copyright");
  const copyright_text = getVal("copyright_text");
  const description = getVal("description");
  const isLongDescription = description.length > characterLimit;

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

  const isMobile = deviceWidth <= 640;
  const isTablet = deviceWidth >= 641 && deviceWidth < 1024;
  const isDesktop = deviceWidth >= 1024;

  useEffect(() => {
    if (!content?.selected_menu) {
      setMenus([]);
      return;
    }

    const promisesToRun = [];

    content.selected_menu.forEach((menuItem) => {
      const menuData = menuItem.menuItems;
      const menuId = menuData?._id;
      const menuTitle = menuItem.menu_title;

      if (menuData) {
        promisesToRun.push(
          Promise.resolve({
            title: menuTitle,
            items: menuData,
          })
        );
      } else if (menuId && !fetchedMenuIds.current[menuId]) {
        promisesToRun.push(
          axios
            .get(`${apiurl}/webMenu/menu/${menuId}`)
            .then((response) => {
              const fetchedData = {
                title: menuTitle,
                items: response.data.data?.menuItems || [],
              };
              fetchedMenuIds.current[menuId] = fetchedData;
              return fetchedData;
            })
            .catch((err) => {
              console.error("Error fetching menu:", err);
              return { title: menuTitle, items: [] };
            })
        );
      } else if (menuId) {
        const cachedData = fetchedMenuIds.current[menuId];
        promisesToRun.push(
          Promise.resolve({
            title: menuTitle,
            items: cachedData?.items || [],
          })
        );
      } else {
        promisesToRun.push(Promise.resolve({ title: menuTitle, items: [] }));
      }
    });

    Promise.all(promisesToRun).then((results) => {
      setMenus(results);
    });
  }, [content?.selected_menu]);

  const filteredMenus = menus.filter((menu, index) => menu && content?.selected_menu && content.selected_menu[index]?.is_visible);

  const footerStyle = {
    backgroundColor: getVal("background_color"),
    color: getVal("text_color"),
  };

  const styles = {
    footer: {
      backgroundColor: getVal("background_color"),
      color: getVal("text_color"),
    },
    link: { color: getVal("link_color") },
    copyright: {
      color: getVal("copyright_text_color"),
      backgroundColor: getVal("copyright_bg_color"),
    },
  };

  const MenuItemList = ({ items }) => (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.link}
            className={`${isMobile ? 'text-xs' : 'text-sm'} hover:underline uppercase flex items-center space-x-3`}
            style={styles.link}
          >
            {isDesktop && <FaChevronRight size={13} />} <span>{item.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );

  const SocialIcons = () => {
    const icons = [
      { url: getVal("facebook_url"), Icon: FaFacebook },
      { url: getVal("instagram_url"), Icon: FaInstagram },
      { url: getVal("twitter_url"), Icon: FaTwitter },
      { url: getVal("linkedin_url"), Icon: FaLinkedin },
      { url: getVal("youtube_url"), Icon: IoLogoYoutube },
    ];

    return (
      <div
        className={`flex items-center space-x-4 sm:my-2 my-3.5 ${
          isTablet ? "justify-start" : isMobile ? "justify-center" : ""
        }`}
      >
        {icons.map(({ url, Icon }, i) =>
          url && url !== "#" ? (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              <Icon size={24} style={{ color: getVal("social_icon_color") }} />
            </a>
          ) : null
        )}
      </div>
    );
  };

  const Newsletter = () => (
    <div
      // className={`w-full sm:w-1/2 ${!is_social_icons ? "mb-4 sm:mb-0" : ""}`}
      className={`w-full sm:w-1/2 ${!isMobile ? 'mb-0' : 'my-3'}`}
    >
      <h4
        className="font-semibold mb-2"
        style={{ color: getVal("newsletter_heading_color") }}
      >
        {getVal("newsletter_heading")}
      </h4>
      <form className="flex flex-col sm:flex-row space-y-1 sm:space-y-0">
        <input
          type="email"
          placeholder="Enter your email address"
          className="flex-grow p-2 rounded-md sm:rounded-l-md sm:rounded-r-none outline-none text-gray-800"
        />
        <button
          type="submit"
          className="text-white p-2 rounded-md sm:rounded-r-md sm:rounded-l-none"
          style={{ backgroundColor: getVal("newsletter_button_color") }}
        >
          {getVal("newsletter_button_text")}
        </button>
      </form>
    </div>
  );

  const Copyright = () =>
    copyright_text && copyright_text?.trim() ? (
      <p className={`text-center font-medium ${isMobile ? 'py-3' : 'py-4'} border-y border-gray-700`} style={styles.copyright}>
        {copyright_text}
      </p>
    ) : null;

  const toggleAccordion = (i) => setOpenAccordion(openAccordion === i ? null : i);
  const alignmentClass = is_copyright ? is_social_icons && is_newsletter ? "justify-between" : !is_social_icons && !is_newsletter ? "justify-center" : !is_newsletter || !is_social_icons ? "justify-between" : "justify-center" : !is_newsletter || !is_social_icons ? "justify-center" : "justify-between";
  const desktopTabletClass = (is_social_icons && !is_newsletter) || (!is_social_icons && is_newsletter) ? isTablet ? "py-3" : "py-3.5" : !is_copyright ? "py-3.5" : "";
  const isCopyRight = ((is_social_icons && is_newsletter) || (!is_social_icons && !is_newsletter)) && is_copyright && copyright_text && copyright_text.trim().length > 0;
  const isDesktopTabCopyright = ((is_social_icons && !is_newsletter) || (!is_social_icons && is_newsletter)) && is_copyright && copyright_text && copyright_text.trim().length > 0;

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  if(isPopup){
    return(
      <FooterPopUp content={content} />
    )
  }

  return (
    <footer className={`pt-8 w-full`} style={footerStyle}>
      <div className="mx-auto">
        {isDesktop ? (
          <>
            <div className={`flex items-start justify-between gap-8 mb-4 px-4`}>
              <div className="md:col-span-1">
                {getVal("is_logo") && getVal("logo_image") && (
                  <img
                    src={getVal("logo_image")}
                    alt="Logo"
                    width={getVal("logo_width")}
                    height="auto"
                    className="mb-4"
                  />
                )}
                {getVal("is_description") && (
                  <div className="relative">
                    <p
                      className={`text-sm transition-all duration-1000 ease-in-out overflow-hidden ${
                        showFullDescription ? "max-h-full" : "max-h-12"
                      }`}
                      style={styles.link}
                    >
                      {showFullDescription || !isLongDescription
                        ? description
                        : `${description.substring(0, characterLimit)}... `}
                      {isLongDescription && !showFullDescription && (
                        <span
                          onClick={toggleDescription}
                          className="font-semibold cursor-pointer"
                        >
                          More
                        </span>
                      )}
                      {isLongDescription && showFullDescription && (
                        <span
                          onClick={toggleDescription}
                          className="mt-2 text-sm font-semibold hover:underline"
                          style={styles.link}
                        >
                          Show Less
                        </span>
                      )}
                    </p>
                    
                  </div>
                )}
              </div>
              {filteredMenus.map((menu, index) => (
                <div key={index} className="md:col-span-1">
                  <h4
                    className="font-semibold text-lg mb-4"
                    style={{ color: getVal("quick_link_color") }}
                  >
                    {menu.title}
                  </h4>
                  <MenuItemList items={menu.items} />
                </div>
              ))}
            </div>
            {(is_social_icons || is_newsletter) && (
                <div
                className={`p-4 flex items-center lg:flex-row flex-col ${((is_social_icons || is_newsletter) && is_copyright) ? 'border-t border-gray-700' : 'border-y border-gray-700'} ${desktopTabletClass} ${alignmentClass}`}
                >
                    {is_social_icons && <SocialIcons />}
                    {isDesktopTabCopyright && (
                        <p className="text-center font-medium py-2" style={styles.link}>
                        {copyright_text}
                        </p>
                    )}
                    {is_newsletter && <Newsletter />}
                </div>
            )}
            {isCopyRight && <Copyright />}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-3 mb-4 px-4">
              <div className="md:col-span-1">
                {getVal("is_logo") && getVal("logo_image") && (
                  <img
                    src={getVal("logo_image")}
                    alt="Logo"
                    width={getVal("logo_width")}
                    height="auto"
                    className="mb-4"
                  />
                )}
                {getVal("is_description") &&
                  <p className="text-sm" style={styles.link}>
                    {getVal("description")}
                  </p>
                }
              </div>
              {filteredMenus.map((menu, index) => (
                <div key={index} className="md:col-span-1">
                  <button
                    className="flex justify-between items-center w-full py-2 transition-all duration-700 ease-in-out"
                    onClick={() => toggleAccordion(index)}
                  >
                    <h4
                      className="font-semibold"
                      style={{ color: getVal("quick_link_color") }}
                    >
                      {menu.title}
                    </h4>
                    {openAccordion === index ? (
                      <FaMinus size={18} className="text-white" />
                    ) : (
                      <FaPlus size={18} className="text-white" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${
                      openAccordion === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <MenuItemList items={menu.items} />
                  </div>
                </div>
              ))}
            </div>
            {isTablet ? (
              <>
              {(is_social_icons || is_newsletter) && (
                <div
                  className={`px-4 flex sm:items-end items-center sm:flex-row flex-col ${((is_social_icons || is_newsletter) && is_copyright) ? 'border-t border-gray-700 py-3' : 'border-y border-gray-700'} ${desktopTabletClass} ${alignmentClass}`}
                >
                  {is_social_icons && <SocialIcons />}
                  {isDesktopTabCopyright && (
                    <p
                      className={`${
                        is_social_icons
                          ? "text-right"
                          : is_newsletter
                          ? "text-left"
                          : "text-center"
                      }  w-full sm:w-1/2 font-medium py-2`}
                      style={styles.link}
                    >
                      {copyright_text}
                    </p>
                  )}
                  {is_newsletter && <Newsletter />}
                </div>
              )}
                {isCopyRight && <Copyright />}
              </>
            ) : (
              <>
              {(is_social_icons || is_newsletter) && (
                <div
                  className={`px-4 flex sm:items-end items-center sm:flex-row flex-col ${((is_social_icons || is_newsletter) && is_copyright) ? "border-t border-gray-700" : "border-y border-gray-700" } ${alignmentClass}`}
                >
                  {is_newsletter && <Newsletter />}
                  {is_social_icons && <SocialIcons />}
                </div>
              )}
                {is_copyright &&
                  copyright_text &&
                  copyright_text.trim().length > 0 && <Copyright />}
              </>
            )}
          </>
        )}
      </div>
    </footer>
  );
};

export default FooterPreview;
