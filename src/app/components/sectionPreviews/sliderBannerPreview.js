"use client";
import React, { useState, useEffect, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SliderBannerPopUp from "../popupPreviews/sliderBannerPopup";

export const schema = {
  name: "Slider Banner",
  max_items: 6,
  settings: [
    {
      type: "select",
      id: "section_height",
      label: "Section Height",
      default: "medium",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
    },
    {
      type: "checkbox",
      id: "autoplay_enabled",
      label: "Auto Rotate Slides",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_arrows",
      label: "Navigation Arrows",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_dots",
      label: "Navigation Dots",
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
      type: "array",
      id: "slides",
      label: "Slides",
      name: "Slide",
      itemFields: [
        {
          type: "checkbox",
          id: "show_overlay",
          label: "Show Overlay",
          default: true,
        },
        {
          type: "checkbox",
          id: "visible",
          label: "Slide Visible",
          default: true,
        },
        {
          type: "image",
          id: "desktop_image",
          label: "Desktop Image",
          default: "https://storage.googleapis.com/ens-ondc/1753878149552_banner_placeholder.png",
        },
        {
          type: "image",
          id: "mobile_image",
          label: "Mobile Image",
          default: "https://storage.googleapis.com/ens-ondc/1753878149552_banner_placeholder.png",
        },
        {
          type: "select",
          id: "text_alignment",
          label: "Text Alignment",
          default: "middle center",
          options: [
            { value: "top left", label: "Top Left" },
            { value: "top center", label: "Top Center" },
            { value: "top right", label: "Top Right" },
            { value: "middle left", label: "Middle Left" },
            { value: "middle center", label: "Middle Center" },
            { value: "middle right", label: "Middle Right" },
            { value: "bottom left", label: "Bottom Left" },
            { value: "bottom center", label: "Bottom Center" },
            { value: "bottom right", label: "Bottom Right" },
          ],
        },
        {
          type: "text",
          id: "heading",
          label: "Heading",
          default: "Image Slide",
        },
        {
          type: "text",
          id: "subheading",
          label: "Subheading",
          default: "Tell your brand's story through images",
        },
        {
          type: "text",
          id: "button_label",
          label: "Button Label",
          default: "Shop Now",
        },
        {
          type: "url",
          id: "button_link",
          label: "Button Link",
          info: "URL link for the button",
        },
      ],
    },
  ],
};

const SliderBannerPreview = ({ content, viewType, isLoadingFields }) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const isPopup = viewType === "popup_view";

  const getDefault = (id) => schema.settings.find((s) => s.id === id)?.default;
  const getVal = (id) => content?.[id] ?? getDefault(id);

  const currentSlideDuration = getVal("slide_duration");
  const currentAutoplayEnabled = getVal("autoplay_enabled");
  const currentShowArrows = getVal("show_arrows");
  const currentShowDots = getVal("show_dots");
  const currentSectionHeight = getVal("section_height");

  const bannerItemFieldDefinition = schema.settings.find(
    (field) => field.id === "slides" && field.type === "array"
  );
  
  const getDefaultItemField = (id) => bannerItemFieldDefinition?.itemFields.find(f => f.id === id)?.default;

  const defaultSlideValues = {
    desktop_image: getDefaultItemField("desktop_image"),
    mobile_image: getDefaultItemField("mobile_image"),
    heading: getDefaultItemField("heading"),
    subheading: getDefaultItemField("subheading"),
    button_label: getDefaultItemField("button_label"),
    button_link: getDefaultItemField("button_link"),
    show_overlay: getDefaultItemField("show_overlay"),
    visible: getDefaultItemField("visible"),
    text_alignment: getDefaultItemField("text_alignment"),
  };

  const numDefaultSlides = schema.max_items || 6;
  const hydratedSlides =
    content?.slides && content.slides.length > 0
      ? content.slides.map((slide) => ({ ...defaultSlideValues, ...slide }))
      : Array.from({ length: numDefaultSlides }).map(() => ({
          ...defaultSlideValues,
        }));

  const slidesToDisplay = hydratedSlides
    .filter((slide) => slide.visible)
    .slice(0, numDefaultSlides);

  const CustomPrevArrow = ({ onClick }) => (
    <button
      className="custom-slick-arrow custom-slick-prev absolute top-1/2 left-4 z-20 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer focus:outline-none transition-colors"
      onClick={onClick}
      aria-label="Previous Slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button
      className="custom-slick-arrow custom-slick-next absolute top-1/2 right-4 z-20 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer focus:outline-none transition-colors"
      onClick={onClick}
      aria-label="Next Slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );

  const handleAfterChange = useCallback((currentSlide) => {
    setActiveSlideIndex(currentSlide);
  }, []);

  const settings = {
    dots: currentShowDots,
    infinite: slidesToDisplay.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: currentAutoplayEnabled,
    autoplaySpeed: currentSlideDuration * 1000,
    arrows: slidesToDisplay.length > 1 && currentShowArrows,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    afterChange: handleAfterChange,
    customPaging: (i) => (
      <div
        className={`w-[13px] h-3 bg-white rounded-full cursor-pointer border-[1px] hover:bg-[#de3c3a] list_items border-[#de3c3a]`}
        style={{ margin: "0 5px" }}
      />
    ),
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: sliderWidth > 640 ?'20px' : '2px',
          left: 0,
          right: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul
          style={{
            margin: "0px",
            padding: "0px",
            display: "flex",
            justifyContent: "center",
          }}
          className={`custom-slick-dots`}
        >
          {dots}
        </ul>
      </div>
    ),
    responsive: [
      {
        breakpoint: 640,
        settings: {
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  const getAlignmentClasses = (alignment) => {
    switch (alignment) {
      case "top left":
        return "top-0 left-0 text-left";
      case "top center":
        return "top-0 left-1/2 -translate-x-1/2 text-center";
      case "top right":
        return "top-0 right-0 text-right";
      case "middle left":
        return "top-1/2 left-0 -translate-y-1/2 text-left";
      case "middle center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center";
      case "middle right":
        return "top-1/2 right-0 -translate-y-1/2 text-right";
      case "bottom left":
        return `${currentSectionHeight === 'small' ? 'bottom-[13%]' : 'bottom-[11%]'} left-0 text-left`;
      case "bottom center":
        return `${currentSectionHeight === 'small' ? 'bottom-[13%]' : 'bottom-[11%]'} left-1/2 -translate-x-1/2 text-center`;
      case "bottom right":
        return `${currentSectionHeight === 'small' ? 'bottom-[13%]' : 'bottom-[11%]'} right-0 text-right`;
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center";
    }
  };

  const getHeightClasses = (height) => {
    switch (height) {
      case "small":
        return "h-60 max-h-96 lg:h-96";
      case "medium":
        return "h-[275px] max-h-[500px] lg:h-[500px]";
      case "large":
        return "h-80 max-h-[600px] lg:h-[600px]";
      default:
        return "h-60 max-h-96 lg:h-96";
    }
  };
  const sectionHeightClass = getHeightClasses(currentSectionHeight);

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

  if (isPopup) {
    return <SliderBannerPopUp slidesToDisplay={slidesToDisplay} />;
  }

  return (
    <div className={`bannerImage relative w-full overflow-hidden bg-white sm:pb-8 ${sectionHeightClass}`}>
      {slidesToDisplay.length > 0 ? (
        <Slider {...settings} className="h-auto w-full">
          {slidesToDisplay.map((slide, index) => {
            const alignmentClasses = getAlignmentClasses(slide.text_alignment);
            const isCurrentSlide = index === activeSlideIndex;
            return (
              <div key={index} className={`relative w-full ${sectionHeightClass}`}>
                <img
                  src={sliderWidth > 767 ? slide.desktop_image : slide.mobile_image}
                  alt="Homepage-Slide"
                  width={1920}
                  height={sliderWidth > 767 ? 440 : 200}
                  className="absolute inset-0 w-full h-full transition-transform duration-300"
                />
                <div className={`absolute inset-0 ${slide.show_overlay ? 'bg-black/20' : ''} text-white z-10 w-full flex justify-center items-center`}>
                  <div className={`absolute w-full max-w-4xl px-4 py-2 ${alignmentClasses}`}>
                    <TextAnimationWrapper
                      key={index}
                      isAnimating={isCurrentSlide}
                      slide={slide}
                      isPopup={isPopup}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      ) : (
        <div className={`flex items-center justify-center w-full h-full text-gray-500 ${sectionHeightClass}`}>
          No slides configured or active. Please add some slides
        </div>
      )}
    </div>
  );
};

export const TextAnimationWrapper = ({ isAnimating, slide, isPopup }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    setShouldAnimate(false);
    if (isAnimating) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div className={`${shouldAnimate ? "textSlideTop" : "slideTop-initial"}`}>
      {slide.heading && (
        <p className={`font-semibold mb-2 ${isPopup ? "text-lg" : "text-2xl sm:text-4xl"}`}>
          {slide.heading}
        </p>
      )}
      {slide.subheading && (
        <p className={`mb-4 ${isPopup ? "text-xs" : "text-base sm:text-2xl"}`}>
          {slide.subheading}
        </p>
      )}
      {slide.button_label && slide.button_link && (
        <a
          href={slide.button_link}
          className={`bg-[#de3c3a] text-white text-xs rounded hover:bg-[#f14745] transition-colors inline-block ${isPopup ? "px-2 py-1" : "sm:px-6 p-2 sm:py-2 sm:text-lg"}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {slide.button_label}
        </a>
      )}
    </div>
  );
};

export default SliderBannerPreview;