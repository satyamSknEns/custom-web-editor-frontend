const CollectionField = ({
  id,
  label,
  value,
  onValueChange,
  uniqueHtmlId,
  collection,
  isLoading,
  error,
}) => {
  
  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const selectedCollection = collection?.find(
      (collection) => collection._id === selectedId
    );
    const newCollectionData = selectedCollection
      ? {
          collection_id: selectedCollection._id,
          collection_tag: selectedCollection.tag,
          collection_type: selectedCollection.collectionType,
          collection_image: selectedCollection.image,
          collection_title: selectedCollection.title,
          collection_status: selectedCollection.status,
          collection_description: selectedCollection.description,
          is_visible: value.is_visible,
        }
      : {
          collection_id: '',
          collection_image: '',
          collection_title: '',
          collection_status: '',
          collection_description: '',
          is_visible: value.is_visible,
        };

    onValueChange(newCollectionData);
  };

  if (isLoading) {
    return <div className="text-gray-500 text-sm">Loading collection...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }
  

  return (
    <select
      id={uniqueHtmlId}
      className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
      value={value.collection_id || ''}
      onChange={handleSelectChange}
    >
      <option value="" disabled>
        Select a collection
      </option>
      {collection.map((collection) => (
        <option key={collection._id} value={collection._id}>
          {collection.title}
        </option>
      ))}
    </select>
  );
};

export default CollectionField;