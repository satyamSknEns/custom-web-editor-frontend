import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TextAnimationWrapper } from "../sectionPreviews/sliderBannerPreview";
import { useCallback, useState } from "react";
import Image from "next/image";

const SliderBannerPopUp = ({ slidesToDisplay }) => {
  const CustomPrevArrow = ({ onClick }) => (
    <button
      className="custom-slick-arrow custom-slick-prev absolute top-1/2 left-1 z-20 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full w-6.5 h-6.5 flex items-center justify-center cursor-pointer focus:outline-none transition-colors"
      onClick={onClick}
      aria-label="Previous Slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
  const CustomNextArrow = ({ onClick }) => (
    <button
      className="custom-slick-arrow custom-slick-next absolute top-1/2 right-2 z-20 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full w-6.5 h-6.5 flex items-center justify-center cursor-pointer focus:outline-none transition-colors"
      onClick={onClick}
      aria-label="Next Slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleAfterChange = useCallback((currentSlide) => {
    setActiveSlideIndex(currentSlide);
  }, []);
  const settings = {
    dots: true,
    infinite: slidesToDisplay.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
    afterChange: handleAfterChange,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    customPaging: (i) => (
      <div
        className="w-[9px] h-2 bg-white rounded-full cursor-pointer border-[1px] hover:bg-[#de3c3a] list_items border-[#de3c3a]"
        style={{ margin: "0 5px" }}
      />
    ),
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "-5px",
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
          className="custom-slick-dots"
        >
          {dots}
        </ul>
      </div>
    ),
  };

  return (
    <div className="bannerImage relative w-full overflow-hidden bg-white h-[152px] shadow-md">
      {slidesToDisplay.length > 0 ? (
        <Slider {...settings} className="h-full w-full">
          {slidesToDisplay.map((slide, index) => {
            const isCurrentSlide = index === activeSlideIndex;
            return (
              <div key={index} className="relative w-full h-full">
                <Image
                  src={slide.desktop_image}
                  height={1000}
                  width={1000}
                  alt="slider-placeholder"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 text-white z-10 w-full flex justify-center items-center">
                  <div className="absolute w-full max-w-4xl px-4 py-2 text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <TextAnimationWrapper
                      key={index}
                      isAnimating={isCurrentSlide}
                      slide={slide}
                      isPopup={true}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-500 max-h-40 h-40">
          No slides configured or active. Please add some slides
        </div>
      )}
    </div>
  );
};

export default SliderBannerPopUp;
