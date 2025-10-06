import React from "react";
import GalleryPopUp from "../popupPreviews/galleryPopup";
export const schema = {
  name: "Gallery Section",
  max_items: 3,
  settings: [
    {
      type: "text",
      id: "gallery_title",
      label: "Heading Title",
      default: "Our Featured Work",
    },
    {
      type: "select",
      id: "section_height",
      label: "Section Height",
      default: "medium",
      options: [
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
    },
    {
      type: "array",
      id: "items",
      label: "Gallery Items",
      name: "Image",
      itemFields: [
        {
          type: "image",
          id: "image",
          label: "Select Image",
          default: "/image/placeholder.jpg",
        },
        {
          type: "url",
          id: "link",
          label: "Item Link (URL)",
          info: "Optional link for the image/item",
        },
        {
          type: "text",
          id: "caption_text",
          label: "Caption Text",
          info: "Optional text overlay on the image",
        },
      ],
    },
  ],
};

const GalleryPreview = ({ content, viewType }) => {
  const isPopup = viewType === "popup_view";

  const getDefault = (id) => schema.settings.find((s) => s.id === id)?.default;
  const getVal = (id) => content?.[id] ?? getDefault(id);

  const itemsFieldDefinition = schema.settings.find(
    (field) => field.id === "items" && field.type === "array"
  );

  const getItemDefault = (id) =>
    itemsFieldDefinition?.itemFields.find((f) => f.id === id)?.default;

  const defaultItemValues = {
    image: getItemDefault("image"),
    link: getItemDefault("link"),
    caption_text: getItemDefault("caption_text"),
  };

  const currentHeading = getVal("gallery_title");
  const currentSectionHeight = getVal("section_height");

  const numDefaultItems = schema.max_items || 3;
  const hydratedItems =
    content?.items && content.items.length > 0
      ? content.items.map((item) => ({ ...defaultItemValues, ...item }))
      : Array.from({ length: numDefaultItems }).map(() => ({
          ...defaultItemValues,
        }));

  const itemsToDisplay = hydratedItems.slice(0, numDefaultItems);

  const getAspectRatioClass = (height) => {
    switch (height) {
      case "small":
        return "aspect-[16/9]";
      case "medium":
        return "aspect-[4/3]";
      case "large":
        return "aspect-[1/1]";
      default:
        return "aspect-[4/3]";
    }
  };

  const aspectRatioClass = getAspectRatioClass(currentSectionHeight);

  const getGalleryContainerHeightClass = (height) => {
    switch (height) {
      case "small":
        return "h-[300px]";
      case "medium":
        return "h-[400px]";
      case "large":
        return "h-[500px]";
      default:
        return "h-[400px]";
    }
  };

  const galleryContainerHeightClass =
    getGalleryContainerHeightClass(currentSectionHeight);

  if (isPopup) {
    return (
      <GalleryPopUp
        currentHeading={currentHeading}
        itemsToDisplay={itemsToDisplay}
      />
    );
  }
  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-md bg-white w-full sm:max-${galleryContainerHeightClass} sm:${galleryContainerHeightClass} md:p-8 sm:p-5 p-3`}
    >
      {currentHeading && currentHeading !== "" && (
        <h3 className={`text-center mb-4 text-3xl font-bold`}>
          {currentHeading}
        </h3>
      )}
      <div className="flex flex-col sm:flex-row sm:gap-2 gap-3 w-full items-center justify-center py-2">
        {itemsToDisplay.map((item, index) => {
          const itemContent = (
            <>
              <img
                src={item.image || "/image/placeholder.jpg"}
                alt={`Gallery item ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 opacity-80"
              />
              {item.caption_text && (
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out bg-black/40 ${
                    item.link && "group-hover:bg-black/70"
                  } text-white text-2xl font-semibold text-center px-4`}
                >
                  {item.caption_text}
                </div>
              )}
            </>
          );

          const baseItemClasses = `group relative overflow-hidden rounded-md border border-slate-300 w-full lg:w-1/3 ${aspectRatioClass}`;

          if (item.link && item.link !== "#") {
            return (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseItemClasses} ${
                  item.link ? "cursor-pointer" : ""
                }`}
                aria-label={`Link to ${item.caption_text || "gallery item"}`}
              >
                {itemContent}
              </a>
            );
          } else {
            return (
              <div key={index} className={baseItemClasses}>
                {itemContent}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default GalleryPreview;
