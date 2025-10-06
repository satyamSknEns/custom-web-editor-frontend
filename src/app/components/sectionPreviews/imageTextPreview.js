import React from "react";
import ImageTextPopUp from "../popupPreviews/imageTextPopup";

export const schema = {
  name: "Image With Text",
  settings: [
    {
      type: "image",
      id: "imageUrl",
      label: "Select Image",
      default: "/image/placeholder.jpg",
    },
    {
      type: "select",
      id: "image_alignment",
      label: "Position Your Image",
      options: [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
      ],
      default: "left",
    },
    {
      type: "text",
      id: "heading_text",
      label: "Write Your Heading",
      default: "Image With Text",
    },
    {
      type: "textarea",
      id: "description_text",
      label: "Write Description",
      default:
        "Pair large text with an image to give focus to your chosen product, collection, or blog post. Add details on availability, style, or even provide a review.",
    },
    {
      type: "text",
      id: "button_lable",
      label: "Button Label",
      default: "Read More",
    },
    {
      type: "url",
      id: "button_link",
      label: "Button Link",
      info: "Url link for button",
    },
  ],
};

const ImageTextPreview = ({ content, viewType }) => {
  const getDefault = (id) => schema.settings.find((s) => s.id === id)?.default;
  const getVal = (id) => content?.[id] ?? getDefault(id);
  const isPopup = viewType === "popup_view";
  const imageUrl = getVal("imageUrl");
  const headingText = getVal("heading_text");
  const descriptionText = getVal("description_text");
  const imageAlignment = getVal("image_alignment");
  const buttonLabel = getVal("button_lable");
  const buttonLink = getVal("button_link");

  if (isPopup) {
    return (
      <ImageTextPopUp
        imageUrl={imageUrl}
        headingText={headingText}
        descriptionText={descriptionText}
        buttonLabel={buttonLabel}
        buttonLink={buttonLink}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center flex-col rounded-md overflow-hidden bg-white md:p-8 sm:p-5 p-3`}
    >
      <div
        className={`flex items-center flex-col sm:flex-row justify-center ${
          imageAlignment === "right" ? "flex col sm:flex-row-reverse" : ""
        }`}
      >
        <div
          className={`w-full sm:w-1/2 bg-gray-100 flex items-center justify-center border border-slate-400`}
        >
          <img
            src={imageUrl || "/image/placeholder.jpg"}
            alt="Image-With-Text"
            width={1000}
            height={1000}
            className={`w-full transition-transform duration-300`}
          />
        </div>
        <div
          className={`w-full sm:w-1/2 flex flex-col items-center justify-center py-3 sm:p-4 ${
            imageAlignment === "right" ? "sm:pl-0" : "sm:pr-0"
          }`}
        >
          {headingText !== "" && (
            <p
              className={`mb-2 text-center text-xl lg:text-3xl sm:text-2xl font-medium`}
            >
              {headingText}
            </p>
          )}
          {descriptionText !== "" && (
            <p
              className={`text-gray-600 text-justify lg:line-clamp-6 sm:line-clamp-4 text-sm sm:text-lg px-1 sm:px-0`}
            >
              {descriptionText}
            </p>
          )}
          {buttonLabel && buttonLink && (
            <a
              href={buttonLink}
              className={`mt-4 px-4 py-2 bg-[#de3c3a] text-white rounded hover:bg-[#f14745] transition-colors`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {buttonLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageTextPreview;
