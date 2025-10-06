
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomCollectionPopUp from "../popupPreviews/customCollectionPopup";

export const schema = {
  name: "Custom Collection",
  max_items: 7,
  min_items: 2,
  default_items: 3,
  settings: [
    {
      type: "text",
      id: "section_heading",
      label: "Section Heading",
      default: "Our Collections",
    },
    {
      type: "select",
      id: "desktop_layout",
      label: "Desktop Layout",
      default: "rows",
      options: [
        { label: "Carousel", value: "carousel", },
        { label: "Rows", value: "rows", },
      ],
    },
    {
      type: "range",
      id: "desktop_slides_to_show",
      label: "Desktop Slides to Show",
      default: 5,
      min: 3,
      max: 6,
      step: 1,
      unit: "slides",
      when: { id: "desktop_layout", value: "carousel" },
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
      type: "checkbox",
      id: "desktop_autoplay_enabled",
      label: "Desktop Auto Rotate",
      default: true,
    },
    {
      type: "select",
      id: "mobile_layout",
      label: "Mobile/Tablet Layout",
      default: "grid",
      options: [
        { label: "Carousel", value: "carousel", },
        { label: "Grid", value: "grid", },
      ],
    },
    {
      type: "range",
      id: "mobile_slides_to_show",
      label: "Mobile Slides to Show",
      default: 2,
      min: 1,
      max: 3,
      step: 1,
      unit: "slides",
      when: { id: "mobile_layout", value: "carousel" },
    },
    {
      type: "range",
      id: "tablet_slides_to_show",
      label: "Tablet Slides to Show",
      default: 4,
      min: 3,
      max: 5,
      step: 1,
      unit: "slides",
      when: { id: "mobile_layout", value: "carousel" },
    },
    {
      type: "checkbox",
      id: "mobile_autoplay_enabled",
      label: "Mobile Auto Rotate",
      default: true,
    },
    {
      type: "array",
      id: "items",
      label: "Collections",
      name: "Custom Collection",
      tag: "custom_collection",
      itemFields: [
        {
          type: "checkbox",
          id: "is_visible",
          label: "Show this collection",
          default: true,
        },
        {
          type: "image",
          id: "collection_image",
          label: "Select Image",
          default: "image/placeholder.jpg",
        },
        {
          type: "url",
          id: "collection_link",
          label: "Collection Link (URL)",
        },
        {
          type: "text",
          id: "collection_title",
          label: "Collection Title",
          default: "Collection's name",
        },
        {
          type: "text",
          id: "collection_type",
          label: "Collection Type",
          info: "Collection type - Skin , Face"
        },
        {
          type: "text",
          id: "collection_tag",
          label: "Collection Tag",
          info: "Tags like - hare_care, face"
        },
      ],
    },
  ],
};

const CustomPrevArrow = ({ onClick }) => (
  <button className="custom-slick-arrow custom-slick-prev absolute top-1/2 left-4 z-20 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer focus:outline-none transition-colors" onClick={onClick} aria-label="Previous Slide" >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button className="custom-slick-arrow custom-slick-next absolute top-1/2 right-4 z-20 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer focus:outline-none transition-colors" onClick={onClick} aria-label="Next Slide" >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

const CustomCollectionPreview = ({ content, viewType }) => {
  const isPopup = viewType === "popup_view";
  const [sliderWidth, setSliderWidth] = useState(0);
  const getDefault = (id) => schema.settings.find((s) => s.id === id)?.default;
  const getVal = (id) => content?.[id] ?? getDefault(id);
  // const customCollectionsItemsField = schema.settings.find((s) => s.id === 'items' && s.type === "array" )?.itemFields;
  // const getItemDefault = (id) => customCollectionsItemsField.find(f => f.id === id)?.default;

  const isMobileView = sliderWidth < 980;
  const currentSectionHeading = getVal("section_heading");
  const currentDesktopLayout = getVal("desktop_layout");
  const currentDesktopSlidesToShow = getVal("desktop_slides_to_show");
  const currentSlideDuration = getVal("slide_duration");
  const currentMobileLayout = getVal("mobile_layout");
  const currentMobileSlidesToShow = getVal("mobile_slides_to_show");
  const currentTabletSlidesToShow = getVal("tablet_slides_to_show");
  const currentDesktopAutoplayEnabled = getVal("desktop_autoplay_enabled");
  const currentMobileAutoplayEnabled = getVal("mobile_autoplay_enabled");
  const maxItemsInSchema = schema.max_items || 7;
  const numVisibleDefault = 3;

  const hydratedItems = Array.from({ length: maxItemsInSchema }, (_, index) => {
    const itemContent = content?.items?.[index] || {};
    const isVisible = itemContent.is_visible ?? (index < numVisibleDefault);
    return {
      ...itemContent,
      is_visible: isVisible,
    };
  });
  
  const collectionsToDisplay = hydratedItems
    .filter((item) => item.is_visible)
    .slice(0, maxItemsInSchema);

    useEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => {
        setSliderWidth(window.innerWidth);
      };
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => {
        window.removeEventListener("resize", updateWidth);
      };
    }
  }, []);

  const mobileCarouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: currentMobileAutoplayEnabled,
    autoplaySpeed: currentSlideDuration * 1000,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    customPaging: (i) => (
      <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full cursor-pointer border-[1px] hover:bg-[#de3c3a] list_items border-[#de3c3a]`} style={{ margin: "0 5px" }} />
    ),
    appendDots: (dots) => (
      <div style={{ position: "absolute", bottom: '-20px', left: 0, right: 0, width: "100%", display: "flex", justifyContent: "center", }} >
        <ul style={{ margin: "0px", padding: "0px", display: "flex", justifyContent: "center", }} className={`custom-slick-dots`} >
          {dots}
        </ul>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: currentTabletSlidesToShow,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: currentMobileSlidesToShow,
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  const disableDesktopCarousel = collectionsToDisplay.length <= currentDesktopSlidesToShow;

  const desktopCarouselSettings = {
    dots: !disableDesktopCarousel,
    infinite: !disableDesktopCarousel,
    speed: 500,
    slidesToShow: currentDesktopSlidesToShow,
    slidesToScroll: 1,
    autoplay: currentDesktopAutoplayEnabled,
    autoplaySpeed: currentSlideDuration * 1000,
    arrows: !disableDesktopCarousel,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    customPaging: (i) => (
      <div className={`w-[12px] h-3 bg-white rounded-full cursor-pointer border-[1px] hover:bg-[#de3c3a] list_items border-[#de3c3a]`} style={{ margin: "0 5px" }} />
    ),
    appendDots: (dots) => (
      <div style={{ position: "absolute", bottom: '-20px', left: 0, right: 0, width: "100%", display: "flex", justifyContent: "center", }} >
        <ul style={{ margin: "0px", padding: "0px", display: "flex", justifyContent: "center", }} className={`custom-slick-dots`} >
          {dots}
        </ul>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: currentTabletSlidesToShow,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: currentMobileSlidesToShow,
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  const getMobileClasses = () => { return "grid grid-cols-2 sm:grid-cols-3 gap-4"; };

  const renderCollections = (layoutClasses) => (
    <div className={`w-full ${layoutClasses}`}>
      {collectionsToDisplay.map((collection, index) => {
        const repeatImageNumber = (index % 3) + 1;
        const imageSrc = collection.collection_image || `image/collection${repeatImageNumber}.svg`;
        const content = (
          <>
            <img 
              src={imageSrc} 
              alt={collection.collection_title} 
              width={1000} height={1000} 
              className={`w-full h-full transition-transform duration-500 opacity-80 rounded-full`} 
            />
            <p className={`font-medium lg:text-lg sm:text-base text-sm my-2 text-[#222] text-center`}>{collection.collection_title || `Collection's name`}</p>
          </>
        )
        if (collection.collection_link && collection.collection_link !== "#") {
          return (
            <a key={index} href={collection?.collection_link} className={`relative flex flex-col items-center justify-between outline-none rounded-md aspect-[1/1] w-full group`}>
              {content}
            </a>
          )
        }
        else {
          return (
            <div key={index} className={`relative flex flex-col items-center justify-between  rounded-md aspect-[1/1] w-full group`}>
              {content}
            </div>
          )
        }
      })}
    </div>
  );

  const renderCarouselSlides = () => (
    collectionsToDisplay.map((collection, index) => {
      const repeatImageNumber = (index % 3) + 1;
      const imageSrc = collection.collection_image || `image/collection${repeatImageNumber}.svg`;

      const content = (
        <>
          <img
            src={imageSrc}
            alt={collection.collection_title}
            width={1000}
            height={1000}
            className={`w-full h-full transition-transform duration-500 opacity-80 rounded-full`}
          />
          <p className={`font-medium lg:text-lg sm:text-base text-sm my-2 text-[#222] text-center`}>{collection.collection_title || `Collection's name`}</p>
        </>
      )
      if (collection.collection_link && collection.collection_link !== "#") {
        return (
          <a key={index} href={collection?.collection_link} className={`relative flex flex-col items-center justify-between outline-none rounded-md aspect-[1/1] w-full group`}>
            {content}
          </a>
        )
      }
      else {
        return (
          <div key={index} className={`relative flex flex-col items-center justify-between  rounded-md aspect-[1/1] w-full group`}>
            {content}
          </div>
        )
      }
    })
  );

  const renderRowsCollections = () => (
    <div className={`w-full flex items-center justify-between gap-2`}>
      {collectionsToDisplay.map((collection, index) => {
        const repeatImageNumber = (index % 3) + 1;
        const imageSrc = collection.collection_image || `/image/collection${repeatImageNumber}.svg`;

        const content = (
          <>
            <img
              src={imageSrc}
              alt={collection.collection_title}
              width={1000}
              height={1000}
              className={`w-full h-full transition-transform duration-500 opacity-80 rounded-full`}
            />
            <p className={`font-medium lg:text-base sm:text-sm text-sm mb-2 text-[#222] text-center`}>{collection.collection_title || `Collection's name`}</p>
          </>
        )
        if (collection.collection_link && collection.collection_link !== "#") {
          return (
            <a key={index} href={collection?.collection_link} className={`relative flex flex-col items-center justify-between outline-none rounded-md aspect-[1/1] w-full group`}>
              {content}
            </a>
          )
        }
        else {
          return (
            <div key={index} className={`relative flex flex-col items-center justify-between  rounded-md aspect-[1/1] w-full group`}>
              {content}
            </div>
          )
        }
      })}
    </div>
  );

  if (isPopup) {
      return (
        <CustomCollectionPopUp 
          collectionsToDisplay={collectionsToDisplay}
          currentMainHeading={currentSectionHeading}
        />
      );
    }

  return (
    <div className={`collection_list_section w-full max-h-full md:p-8 sm:p-5 px-2 mb-4 bg-white flex flex-col items-center justify-center rounded-lg`}>

      <h2 className={`mb-4 text-2xl sm:text-3xl font-bold`}> {currentSectionHeading} </h2>

      {collectionsToDisplay.length > 0 ? (
        isMobileView ? (
          currentMobileLayout === "carousel" ? (
            <div className="w-full relative">
              <Slider {...mobileCarouselSettings}>
                {renderCarouselSlides()}
              </Slider>
            </div>
          ) : (renderCollections(getMobileClasses()))
        ) : (
          currentDesktopLayout === 'rows' ? (
            renderRowsCollections()
          ) : (
            <div className="w-full relative">
              <Slider {...desktopCarouselSettings}>
                {renderCarouselSlides()}
              </Slider>
            </div>
          )
        )
      ) : (
        <div className={`flex items-center justify-center w-full h-full text-gray-500`}>
          No collections configured or visible.
        </div>
      )}
    </div>
  );
};

export default CustomCollectionPreview;