import Image from "next/image";

const CollectionListPopUp = ({ collectionsToDisplay, currentMainHeading }) => {
  return (
    <div className="collection_list_section w-full max-h-full h-56 p-4 shadow-md bg-white flex flex-col items-center justify-center rounded-lg">
      <h2 className="mb-4 text-xs">{currentMainHeading}</h2>
      {collectionsToDisplay.length > 0 ? (
        <div className="flex items-center justify-center gap-2 w-full">
          {collectionsToDisplay.map((collection, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center justify-between border border-gray-200 rounded-md overflow-hidden shadow-sm aspect-[1/1] w-1/3 flex-shrink-0 bg-black/[0.05]"
            >
              <Image
                src={
                  `/image/collection${index + 1}.svg` ||
                  collection.collection_image
                }
                alt={collection.collection_title}
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />
              <p className="absolute w-full bottom-0 h-6 flex items-center justify-center transition-all duration-300 ease-in-out bg-black/70 text-white text-[10px] font-medium text-center px-4">
                {collection.collection_title || `Collection's name`}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-500">
          No collections configured or visible.
        </div>
      )}
    </div>
  );
};

export default CollectionListPopUp;
