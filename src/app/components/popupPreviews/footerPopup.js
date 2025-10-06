import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaChevronRight,
} from "react-icons/fa";

import { IoLogoYoutube } from "react-icons/io";

const FooterPopUp = ({ content }) => {
  console.log("FooterPopUp content:", content);

  const filteredMenus = content?.selected_menu;

  const MenuItemList = ({ items }) => (
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={item.id || index}>
          <a
            href={item.link || "#"}
            className="text-[10px] flex items-center space-x-1"
          >
            <FaChevronRight size={8} /> <span>{item.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );

  const SocialIcons = () => {
    const icons = [
      { url: "/", Icon: FaFacebook },
      { url: "/", Icon: FaInstagram },
      { url: "/", Icon: FaTwitter },
      { url: "/", Icon: FaLinkedin },
      { url: "/", Icon: IoLogoYoutube },
    ];

    return (
      <div className={`w-full flex items-end space-x-1 `}>
        {icons.map(({ url, Icon }, i) =>
          url && url !== "#" ? (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              <Icon size={16} />
            </a>
          ) : null
        )}
      </div>
    );
  };

  return (
    <footer className={`pt-8 w-full bg-black text-white`}>
      <div className="mx-auto">
        <>
          <div className={`grid grid-cols-${ filteredMenus.length + 1 } gap-2.5 mb-4 px-2`} >
            <div className="md:col-span-1">
              <img
                src={content?.logo_image}
                alt="Logo"
                width={50}
                height="auto"
                className="mb-4"
              />
              <p className={`text-[10px]`}>
                {content?.description || "Your website description here."}
              </p>
            </div>
            {filteredMenus.map((menu, index) => (
              <div key={index} className="md:col-span-1">
                <h4 className="font-semibold text-[11px] mb-4">
                  {menu?.menu_title || `Quick Links ` + (index + 1)}
                </h4>
                <MenuItemList items={menu?.menuItems} />
              </div>
            ))}
          </div>
          <div
            className={`p-2 flex items-center justify-between border-t border-gray-700`}
          >
            <SocialIcons />

            <div className={`w-full`}>
              <h4 className="font-semibold text-sm mb-2">News Letter</h4>
              <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="text-xs p-1 rounded-l-md rounded-r-none outline-none text-gray-800 bg-white"
                />
                <div className="flex items-center text-white text-xs px-2 border border-gray-700 rounded-r-md rounded-l-none">
                  Subscribe
                </div>
              </div>
            </div>
          </div>
          <p
            className={`text-center text-xs font-medium py-1.5 border-y border-gray-700`}
          >
            ©2025 Your Company. All Rights Reserved.
          </p>
        </>
      </div>
    </footer>
  );
};

export default FooterPopUp;
