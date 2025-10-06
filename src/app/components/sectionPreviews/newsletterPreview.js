import React from "react";
import NewsletterPopUp from "../popupPreviews/newsletterPopup";

export const schema = {
  name: "Newsletter",
  settings: [
    {
      type: "text",
      id: "heading_text",
      label: "Heading",
      default: "Subscribe to our newsletter",
    },
    {
      type: "textarea",
      id: "subheading_text",
      label: "Subheading",
      default: "Promotions, new products and sales. Directly to your inbox.",
    },
    {
      type: "text",
      id: "button_label",
      label: "Button Label",
      default: "Subscribe",
    },

    {
      type: "color",
      id: "button_color",
      label: "Button Color",
      default: "#de3c3a",
    },
    {
      type: "color",
      id: "background_color",
      label: "Background Color",
      default: "#ffffff",
    },
    {
      type: "color",
      id: "text_color",
      label: "Text Color",
      default: "#1f2937",
    },
  ],
};

const NewsletterPreview = ({ content, viewType }) => {
  const getDefault = (id) => schema.settings.find((s) => s.id === id)?.default;
  const getVal = (id) => content?.[id] ?? getDefault(id);

  const isPopup = viewType === "popup_view";

  const headingText = getVal("heading_text");
  const subheadingText = getVal("subheading_text");
  const buttonLabel = getVal("button_label");
  const buttonColor = getVal("button_color");
  const backgroundColor = getVal("background_color");
  const textColor = getVal("text_color");

  if (isPopup) {
    return (
      <NewsletterPopUp
        headingText={headingText}
        subheadingText={subheadingText}
        buttonLabel={buttonLabel}
        buttonColor={buttonColor}
        backgroundColor={backgroundColor}
        textColor={textColor}
      />
    );
  }

  return (
    <div
      style={{ backgroundColor: backgroundColor, color: textColor }}
      className={`flex flex-col items-center justify-center sm:p-8 p-4 w-full`}
    >
      {headingText && (
        <h2
          className="md:text-2xl sm:text-xl text-lg text-center font-bold mb-2 uppercase"
          style={{ color: textColor }}
        >
          {headingText}
        </h2>
      )}

      {subheadingText && (
        <p
          className="sm:text-lg text-base text-center max-w-lg"
          style={{ color: textColor }}
        >
          {subheadingText}
        </p>
      )}

      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 w-full md:max-w-lg sm:max-w-md items-center overflow-hidden mt-6">
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full sm:w-auto flex-grow p-2 rounded-md sm:rounded-l-md sm:rounded-r-none outline-none border sm:border-r-0 text-gray-800"
        />
        <button
          type="submit"
          className={`w-full sm:w-auto text-white py-2 px-3 rounded-md sm:rounded-r-md sm:rounded-l-none border border-[${buttonColor}] sm:border-l-0`}
          style={{ backgroundColor: buttonColor }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default NewsletterPreview;
