
const CustomCollectionPopUp = ({
  collectionsToDisplay,
  currentMainHeading,
}) => {
  return (
    <div className="collection_list_section w-full max-h-full h-56 p-4 shadow-md bg-white flex flex-col items-center justify-center rounded-lg">
      <h2 className="text-xs">{currentMainHeading}</h2>
      {collectionsToDisplay.length > 0 ? (
        <div className="flex items-center justify-center gap-2 w-full">
          {collectionsToDisplay.map((collection, index) => {
            const repeatImageNumber = (index % 3) + 1;
            const imageSrc =
              collection.collection_image ||
              `/image/collection${repeatImageNumber}.svg`;

            const content = (
              <>
                <img
                  src={imageSrc}
                  alt={collection.collection_title}
                  width={400}
                  height={400}
                  className={`w-full h-full transition-transform duration-500 opacity-80 rounded-full`}
                />
                <p className={`text-xs`}>
                  {collection.collection_title || `Collection's name`}
                </p>
              </>
            );
            if (
              collection.collection_link &&
              collection.collection_link !== "#"
            ) {
              return (
                <a
                  key={index}
                  href={collection?.collection_link}
                  className={`relative flex flex-col items-center justify-between outline-none rounded-md aspect-[1/1] w-full group`}
                >
                  {content}
                </a>
              );
            } else {
              return (
                <div
                  key={index}
                  className={`relative flex flex-col items-center justify-between  rounded-md aspect-[1/1] w-full group`}
                >
                  {content}
                </div>
              );
            }
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-500">
          No collections configured or visible.
        </div>
      )}
    </div>
  );
};

export default CustomCollectionPopUp;
