import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdClear } from "react-icons/md";

const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const schema = {
  name: "Announcement Bar",
  max_items: 5,
  min_items: 1,
  default_items: 1,
  settings: [
    {
      type: "checkbox",
      id: "is_enabled",
      label: "Enable this section",
      default: true,
    },
    {
      type: "range",
      id: "slide_duration",
      label: "Slide Duration (seconds)",
      min: 2,
      max: 10,
      step: 1,
      default: 3,
    },
    {
      type: "select",
      id: "slide_direction",
      label: "Slide Direction",
      default: "horizontal",
      options: [
        { value: "horizontal", label: "Horizontal" },
        { value: "vertical", label: "Vertical" },
      ],
    },
    {
      type: "color",
      id: "background_color",
      label: "Background Color",
      default: "#000000",
    },
    {
      type: "color",
      id: "text_color",
      label: "Text Color",
      default: "#ffffff",
    },
    {
      type: "color",
      id: "close_icon_color",
      label: "Close Icon Color",
      default: "#ffffff",
    },
    {
      type: "select",
      id: "text_size_desktop",
      label: "Text Size (Desktop)",
      default: "base",
      options: [
        { value: "xs", label: "Extra Small" },
        { value: "sm", label: "Small" },
        { value: "base", label: "Base" },
        { value: "lg", label: "Large" },
        { value: "xl", label: "Extra Large" },
      ],
    },
    {
      type: "select",
      id: "text_size_mobile",
      label: "Text Size (Mobile)",
      default: "sm",
      options: [
        { value: "xs", label: "Extra Small" },
        { value: "sm", label: "Small" },
        { value: "base", label: "Base" },
        { value: "lg", label: "Large" },
        { value: "xl", label: "Extra Large" },
      ],
    },
    {
      type: "array",
      id: "announcements",
      label: "Announcements",
      name: "Announcement Bar",
      tag: "announcement_bar",
      itemFields: [
        {
          type: "text",
          id: "announcement_text",
          label: "Announcement Text",
          default: "Get 20% discount on every skin products!",
        },
        {
          type: "url",
          id: "announcement_link",
          label: "Announcement Link",
          default: "#",
        },
        {
          type: "checkbox",
          id: "is_visible",
          label: "Show this announcement",
          default: true,
        },
      ],
    },
  ],
};

const AnnouncementBarPreview = ({ content, viewType }) => {
  const isPopup = viewType === "popup_view";
  const COOKIE_NAME = 'announce_bar';
  const [isDismissed, setIsDismissed] = useState(() => {
    if (isPopup) { return false; }
    return !!getCookie(COOKIE_NAME);
  });

  const handleDismiss = () => {
    setCookie(COOKIE_NAME, "true", 1);
    setIsDismissed(true);
  };

  const getFieldDefault = (fieldId, arrayId = null) => {
    const settings = arrayId ? schema.settings.find(s => s.id === arrayId) : schema.settings;
    const field = arrayId ? settings.itemFields.find(f => f.id === fieldId) : settings.find(f => f.id === fieldId);
    return field ? field.default : undefined;
  };

  const isEnabled = content?.is_enabled ?? getFieldDefault("is_enabled");
  if (!isPopup && (isDismissed || !isEnabled)) {
    return null;
  }

  const createDefaultAnnouncements = () => {
    const defaultText = getFieldDefault("announcement_text", "announcements");
    const defaultLink = getFieldDefault("announcement_link", "announcements");
    const defaultVisible = getFieldDefault("is_visible", "announcements");

    return Array.from({ length: schema.min_items }, () => ({
      announcement_text: defaultText,
      announcement_link: defaultLink,
      is_visible: defaultVisible,
    }));
  };

  const hydratedAnnouncements = content?.announcements || createDefaultAnnouncements();

  const announcementsToDisplay = Array.isArray(hydratedAnnouncements)
    ? hydratedAnnouncements
      .filter(announcement => announcement?.is_visible)
      .slice(0, schema.max_items)
    : [];

  const slideDuration = content?.slide_duration ?? getFieldDefault("slide_duration");
  const slideDirection = content?.slide_direction ?? getFieldDefault("slide_direction");
  const backgroundColor = content?.background_color ?? getFieldDefault("background_color");
  const textColor = content?.text_color ?? getFieldDefault("text_color");
  const closeIconColor = content?.close_icon_color ?? getFieldDefault("close_icon_color");

  const desktopTextSize = content?.text_size_desktop ?? getFieldDefault("text_size_desktop");
  const mobileTextSize = content?.text_size_mobile ?? getFieldDefault("text_size_mobile");
  const textSizeClasses = `text-${mobileTextSize} md:text-${desktopTextSize}`;

  const sliderSettings = {
    infinite: announcementsToDisplay.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: announcementsToDisplay.length > 1,
    autoplaySpeed: slideDuration * 1000,
    vertical: slideDirection === "vertical",
    verticalSwiping: slideDirection === "vertical",
    arrows: false,
  };

  return (
    <div
      className={`w-full py-2 text-center overflow-hidden relative`}
      style={{ backgroundColor: isPopup ? "#fff" : backgroundColor, color: isPopup ? "#000" : textColor }}
    >
      {announcementsToDisplay.length > 0 ? (
        <Slider {...sliderSettings}>
          {announcementsToDisplay.map((announcement, index) => {
            const hasLink = announcement.announcement_link && announcement.announcement_link !== '#';
            const AnnouncementTag = hasLink ? 'a' : 'div';
            return (
              <AnnouncementTag
                key={index}
                {...(hasLink ? { href: announcement.announcement_link } : {})}
                className={`transition-colors duration-200 ease-in-out ${isPopup ? "text-xs" : textSizeClasses}`}
              >
                {announcement?.announcement_text}
              </AnnouncementTag>
            );
          })}
        </Slider>
      ) : (
        <span className="text-gray-500">No announcements are currently active.</span>
      )}
      <span onClick={!isPopup ? handleDismiss : undefined} className={`text-white absolute ${isPopup ? "top-3.5" : "top-2.5"} right-2 cursor-pointer`} style={{ color: isPopup ? "#000" : closeIconColor }}>
        <MdClear size={15} />
      </span>
    </div>
  );
};

export default AnnouncementBarPreview;