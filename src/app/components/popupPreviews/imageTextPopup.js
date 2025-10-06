import Image from "next/image";
import React from "react";

const ImageTextPopUp = ({
  imageUrl,
  headingText,
  descriptionText,
  buttonLabel,
  buttonLink,
}) => {
  return (
    <div className="h-56 p-4 shadow-md flex items-center justify-center flex-col rounded-md overflow-hidden bg-white">
      <div className="flex items-center flex-col sm:flex-row justify-center">
        <div className="w-full sm:w-1/2 bg-gray-100 flex items-center justify-center border border-slate-400">
          <Image
            src={imageUrl || "/image/placeholder.jpg"}
            alt="Image-With-Text"
            width={1000}
            height={1000}
            className="w-full transition-transform duration-300"
          />
        </div>
        <div className="w-full sm:w-1/2 flex flex-col items-center justify-center py-3 sm:p-4">
          {headingText !== "" && (
            <p className="mb-2 text-center text-xs">
              {headingText}
            </p>
          )}
          {descriptionText !== "" && (
            <p className="text-gray-600 text-justify text-[8px] lg:line-clamp-6 sm:line-clamp-4">
              {descriptionText}
            </p>
          )}
          {buttonLabel && buttonLink && (
            <a
              href={buttonLink}
              className="mt-4 bg-[#de3c3a] text-white rounded hover:bg-[#f14745] transition-colors text-[8px] px-2 py-1"
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

export default ImageTextPopUp;