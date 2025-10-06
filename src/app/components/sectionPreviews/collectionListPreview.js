import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CollectionListPopUp from "../popupPreviews/collectionListPopup";

export const schema = {
  name: "Collection List",
  max_items: 8,
  min_items: 2,
  default_items: 3,
  settings: [
    {
      type: "text",
      id: "main_heading",
      label: "Main Heading",
      default: "Collections List",
    },
    {
      type: "select",
      id: "desktop_layout",
      label: "Desktop Layout",
      default: "grid",
      options: [
        { label: "Grid", value: "grid", },
        { label: "Carousel", value: "carousel", },
      ],
    },
    {
      type: "range",
      id: "desktop_grid_cols",
      label: "Grid Columns on Desktop",
      default: 3,
      min: 2,
      max: 5,
      step: 1,
      unit: "columns",
      when: { id: "desktop_layout", value: "grid" },
    },
    {
      type: "range",
      id: "desktop_slides_to_show",
      label: "Desktop Slides to Show",
      default: 3,
      min: 2,
      max: 5,
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
      default: "carousel",
      options: [
        { label: "Carousel", value: "carousel", },
        { label: "Grid", value: "grid", },
      ],
    },
    {
      type: "range",
      id: "mobile_slides_to_show",
      label: "Mobile Slides to Show",
      default: 1,
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
      default: 3,
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
      name: "collection_list",
      tag: "collection_list",
      itemFields: [
        {
          type: "collection_select",
          id: "collection_select",
          label: "Select Collection",
        },
        {
          type: "checkbox",
          id: "is_visible",
          label: "Show this collection",
          default: true,
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

const formatCollectionTitleForUrl = (title) => {
  return title ? title.replace(/\s+/g, "-") : "";
};

const formatCollectionTitle = (title) => {
  return title ? title.split(" ")[0] : '';
}

const CollectionListPreview = ({ content, viewType }) => {
  const isPopup = viewType === "popup_view";
  const [sliderWidth, setSliderWidth] = useState(0);
  const getDefault = (id) => schema.settings.find((s) => s.id === id)?.default;
  const getVal = (id) => content?.[id] ?? getDefault(id);

  const isMobileView = sliderWidth < 980;
  const currentMainHeading = getVal("main_heading");
  const currentDesktopLayout = getVal("desktop_layout");
  const currentDesktopGridCols = getVal("desktop_grid_cols");
  const currentDesktopSlidesToShow = getVal("desktop_slides_to_show");
  const currentSlideDuration = getVal("slide_duration");
  const currentMobileLayout = getVal("mobile_layout");
  const currentMobileSlidesToShow = getVal("mobile_slides_to_show");
  const currentTabletSlidesToShow = getVal("tablet_slides_to_show");
  const currentDesktopAutoplayEnabled = getVal("desktop_autoplay_enabled");
  const currentMobileAutoplayEnabled = getVal("mobile_autoplay_enabled");
  const maxItemsInSchema = schema.max_items || 8;
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
      <div style={{ position: "absolute", bottom: "-20px", left: 0, right: 0, width: "100%", display: "flex", justifyContent: "center", }} >
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

  const getDesktopClasses = () => {
    if (currentDesktopLayout === "grid") {
      let colsClass = `grid-cols-${currentDesktopGridCols}`;
      return `grid ${colsClass} gap-4`;
    } else {
      return "flex items-center justify-between gap-4";
    }
  };

  const getMobileClasses = () => { return "grid grid-cols-1 md:grid-cols-3 gap-4"; };

  const renderCollections = (layoutClasses) => (
    <div className={`w-full grid grid-cols-1 sm:grid-cols-3 gap-4`}>
      {collectionsToDisplay.map((collection, index) => {
        const repeatImageNumber = (index % 3) + 1;
        const imageSrc = collection.collection_image || `/image/collection${repeatImageNumber}.svg`;
        return (
          <a key={index} href={`/collections/${formatCollectionTitleForUrl(collection.collection_title)}`} className={`relative flex flex-col items-center justify-between border border-gray-200 rounded-md overflow-hidden shadow-sm aspect-[1/1] w-full group`}>
            <img
              src={imageSrc}
              alt={collection.collection_title}
              width={1000}
              height={1000}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 opacity-80 group-hover:scale-110 group-hover:-rotate-3`}
            />
            <div className={`absolute w-full bottom-0 md:h-10 sm:h-8 h-10 overflow-hidden group-hover:h-3/4 transition-all duration-500 ease-in-out bg-black/80 text-white text-center px-3 py-1 lg:text-2xl sm:text-sm`}>
              <p className={`font-medium lg:text-lg sm:text-sm text-lg mb-2`}>{formatCollectionTitle(collection.collection_title) || `Collection's name`}</p>
              <p className={`text-xs`}>{collection.collection_description || `Collection's description`}</p>
            </div>
          </a>
        )
      })}
    </div>
  );

  const renderCarouselSlides = () => (
    collectionsToDisplay.map((collection, index) => (
      <div key={index} className="px-1 outline-none">
        <a href={`/collections/${formatCollectionTitleForUrl(collection.collection_title)}`} className="relative flex flex-col items-center justify-between border border-gray-200 rounded-md overflow-hidden shadow-sm aspect-[1/1] group">
          <img
            src={collection.collection_image || "image/placeholder.jpg"}
            alt={collection.collection_title}
            width={1000}
            height={1000}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 opacity-80"
          />
          {!isMobileView ? (
            <div className={`absolute w-full bottom-0 overflow-hidden h-10 group-hover:h-3/4 transition-all duration-500 ease-in-out bg-black/80 text-white text-center px-3 py-1 lg:text-2xl sm:text-sm`}>
              <p className={`font-medium lg:text-lg sm:text-base text-sm mb-2`}>{formatCollectionTitle(collection.collection_title) || `Collection's name`}</p>
              <p className={`text-xs`}>{collection.collection_description || `Collection's description`}</p>
            </div>
          ) : (
            <div className={`absolute w-full bottom-0 overflow-hidden transition-all duration-500 ease-in-out bg-black/80 text-white text-center px-3 py-1 lg:text-2xl sm:text-sm`}>
              <p className={`font-medium lg:text-lg sm:text-base text-sm`}>{formatCollectionTitle(collection.collection_title) || `Collection's name`}</p>
            </div>
          )}
        </a>
      </div>
    ))
  );

   if (isPopup) {
    return (
      <CollectionListPopUp 
        collectionsToDisplay={collectionsToDisplay}
        currentMainHeading={currentMainHeading}
      />
    );
  }

  return (
    <div className={`collection_list_section w-full max-h-full md:p-8 sm:p-5 p-3 mb-4 bg-white flex flex-col items-center justify-center rounded-lg px-3`}>

      <h2 className={`mb-4 text-2xl sm:text-3xl font-bold`}>
        {currentMainHeading}
      </h2>

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
          currentDesktopLayout === "carousel" ? (
            <div className="w-full relative">
              <Slider {...desktopCarouselSettings}>
                {renderCarouselSlides()}
              </Slider>
            </div>
          ) : (renderCollections(getDesktopClasses()))
        )
      ) : (
        <div className={`flex items-center justify-center w-full h-full text-gray-500`}>
          No collections configured or visible.
        </div>
      )}
    </div>
  );
};

export default CollectionListPreview;