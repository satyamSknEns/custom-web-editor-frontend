import React from "react";

const GalleryPopUp = ({ currentHeading, itemsToDisplay }) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-md bg-white w-full h-56 p-4 shadow-md`}
    >
      {currentHeading && currentHeading !== "" && (
        <h3 className={`text-center mb-4 text-xs`}>{currentHeading}</h3>
      )}
      <div className="flex flex-col sm:flex-row sm:gap-2 gap-3 w-full items-center justify-center py-2">
        {itemsToDisplay.map((item, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-md border border-slate-300 w-1/3 aspect-[4/3]`}
          >
            <img
              src={item.image || "image/placeholder.jpg"}
              alt={`Gallery item ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 opacity-80"
            />

          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPopUp;
