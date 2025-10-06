"use client";
import { useRef, useCallback, useState, useEffect } from "react";
import { apiurl } from "../../../../config/config.js";
import axios from "axios";
import CollectionField from "./collectionField";
import FooterMenus from "./footerMenus";
import HeaderMenus from "./headerMenus";

const ImageInputField = ({
  id,
  label,
  displayValue,
  onValueChange,
  onLoadingChange,
  uniqueHtmlId,
}) => {
  const fileInputRef = useRef(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (displayValue) {
      setLocalPreviewUrl(displayValue);
    } else {
      setLocalPreviewUrl(null);
    }
  }, [displayValue]);

  const ImageHandler = async (e) => {
    setError(null);
    const files = e.target.files;

    if (!files || files.length === 0) {
      
      return;
    }

    const file = files[0];
    const objectUrl = URL.createObjectURL(file);

    setLocalPreviewUrl(objectUrl);
    setIsLoading(true);
    onLoadingChange(true);

    try {
      const formData = new FormData();
      formData.append("files", file);

      const { data } = await axios.post(`https://ondc.0clik.com/products/upload`, formData);

      if (data?.success && data.urls && data.urls.length > 0) {
        const uploadedImageUrl = data.urls[0];
        // console.log("Uploaded URL:", uploadedImageUrl);
        onValueChange(uploadedImageUrl);
        URL.revokeObjectURL(objectUrl);
        setLocalPreviewUrl(uploadedImageUrl);
      } else {
        console.error("Image upload failed: No URL returned or success was false.");
        setError("Image upload failed. Please try again.");
        setLocalPreviewUrl(displayValue || null);
      }
    } catch (exception) {
      console.error("Error uploading image:", exception);
      setError("Upload failed. Please try again.");
      setLocalPreviewUrl(displayValue || null);
    } finally {
      setIsLoading(false);
      onLoadingChange(false);
    }
  };

  return (
    <div className="flex items-center flex-col space-x-2 w-full">
    
      <input
        type="file"
        id={uniqueHtmlId}
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={ImageHandler}
      />

      {localPreviewUrl ? (
        <div className="relative w-full overflow-hidden rounded-lg group">
          <img
            src={localPreviewUrl}
            alt={`Preview for ${label}`}
            width={100}
            height={100}
            className="w-full h-auto object-cover rounded-lg border border-slate-200"
            style={{ maxHeight: "100px" }}
          />

          <div
            className="absolute inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {isLoading ? "Uploading..." : "Change Image"}
            <div className="absolute top-2 right-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <button
            type="button"
            className="flex-shrink-0 text-black bg-[#f1f1f1] hover:bg-[#ebebeb] text-sm px-4 py-2 mr-0.5 rounded-tl-md rounded-bl-md transition-colors focus:outline-none cursor-pointer outline-none"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Select"}
          </button>
          <button
            type="button"
            className="flex-shrink-0 text-gray-500 bg-[#f1f1f1] hover:bg-[#ebebeb] hover:text-gray-700 p-2 rounded-tr-md rounded-br-md transition-colors focus:outline-none cursor-pointer outline-none"
            onClick={() => fileInputRef.current?.click()}
            title="Select image"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
    </div>
  );
};

const SectionEditorForm = ({
  instanceId,
  sectionSchema,
  content,
  onContentChange,
  onFieldLoadingChange,
}) => {
  
  const [availableMenus, setAvailableMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get(`${apiurl}/webMenu/menu`);
        if (response.data?.success) {
          setAvailableMenus(response.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch menus:", err);
      } finally {
        setLoadingMenus(false);
      }
    };
    fetchMenus();
  }, []);

  
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`${apiurl}/api/productCollection/userlist`);
        if (response.data?.success && Array.isArray(response.data.data)) {
          setCollections(response.data.data);
        } else {
          setError('Failed to fetch collections: Invalid data structure.');
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Failed to fetch collections from the API.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);


  const handleInputChange = useCallback(
    (fieldId, value) => {
      const updatedContent = {
        ...content,
        [fieldId]: value,
      };
      onContentChange(instanceId, updatedContent);
    },
    [content, instanceId, onContentChange]
  );

  const handleArrayItemChange = useCallback(
    (arrayFieldId, itemIndex, subFieldId, value) => {
      const currentArray = content[arrayFieldId] || [];
      const updatedArray = [...currentArray];
      // console.log("subFieldId",subFieldId);
      if (!updatedArray[itemIndex]) {
        const defaultItem = {};
        sectionSchema.settings
          .find(s => s.id === arrayFieldId)
          .itemFields.forEach(subField => {
            defaultItem[subField.id] = subField.default;
          });
        updatedArray[itemIndex] = { ...defaultItem };
      }

      if (typeof value === 'object' && value !== null && subFieldId === 'select_footer_menu') {
        updatedArray[itemIndex] = {
          ...updatedArray[itemIndex],
          ...value
        };
      } else if ((typeof value === 'object' && value !== null) && (subFieldId === 'collection_select')) {
        updatedArray[itemIndex] = {
          ...updatedArray[itemIndex],
          ...value,
          is_visible: updatedArray[itemIndex].is_visible ?? (itemIndex < sectionSchema.default_items),
        };
      }  else {
        updatedArray[itemIndex] = {
          ...updatedArray[itemIndex],
          [subFieldId]: value,
        };
      }
      onContentChange(instanceId, { ...content, [arrayFieldId]: updatedArray });
    },
    [content, instanceId, onContentChange, sectionSchema.settings]
  );

  const handleFieldLoadingChange = useCallback(
    (fieldId, isLoading) => {
      if (onFieldLoadingChange) {
        onFieldLoadingChange(instanceId, fieldId, isLoading);
      }
    },
    [instanceId, onFieldLoadingChange]
  );

  const handleArrayItemLoadingChange = useCallback(
    (arrayFieldId, itemIndex, subFieldId, isLoading) => {
      if (onFieldLoadingChange) {
        onFieldLoadingChange(instanceId, `${arrayFieldId}-${itemIndex}-${subFieldId}`, isLoading);
      }
    },
    [instanceId, onFieldLoadingChange]
  );

  const renderField = useCallback(
    (field, currentContent, prefixId = "") => {
      const uniqueId = `${prefixId}${field.id}`;
      let fieldValue = currentContent[field.id];
      let displayValue;
      if (field.type === "header_menus"  || field.type === "footer_menus" || (field.type === "image" && field?.tag !== 'custom_collection') ) {
        displayValue = fieldValue;
      } else if (field.type === "checkbox") {
        displayValue = Boolean(fieldValue ?? field.default);
      } else if (field.type === "number" || field.type === "range") {
        displayValue = Number(fieldValue ?? field.default ?? 0); 
      } else {
        displayValue = String(fieldValue !== undefined ? fieldValue : field.default || "");
      }

      switch (field.type) {
        case "header":
          return(
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm font-medium">{field.label}</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          )
        case "text":
        case "url":
          return (
            <input
              type={field.type === "url" ? "url" : "text"}
              id={uniqueId}
              className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
              value={displayValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.label}
            />
          );
        case "textarea":
          return (
            <textarea
              id={uniqueId}
              className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
              rows={6}
              value={displayValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.label}
            />
          );
        case "select":
          return (
            <select
              className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
              id={uniqueId}
              value={displayValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        case "image":
          return (
            <ImageInputField
              id={field.id}
              label={field.label}
              displayValue={displayValue}
              onValueChange={(value) => handleInputChange(field.id, value)}
              onLoadingChange={(isLoading) => handleFieldLoadingChange(field.id, isLoading)}
              uniqueHtmlId={uniqueId}
            />
          );
        case "number":
          return (
            <input
              type="number"
              id={uniqueId}
              className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
              value={displayValue}
              onChange={(e) =>
                handleInputChange(field.id, Number(e.target.value))
              }
              placeholder={field.label}
            />
          );
        case "range": 
          return (
            <div className="flex items-center gap-2 w-full justify-center">
              <input
                type="range"
                id={uniqueId}
                min={field.min}
                max={field.max}
                step={field.step}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-600 outline-none"
                value={displayValue} 
                onChange={(e) =>
                  handleInputChange(field.id, Number(e.target.value))
                }
                placeholder={field.label}
              />
              <span className="text-sm text-gray-600 min-w-[60px] min-h-[30px] flex items-center justify-center border border-slate-300 rounded-md text-right">
                {displayValue}
              </span>
            </div>
          );
        case "checkbox":
          return (
            <label
              htmlFor={uniqueId}
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id={uniqueId}
                className="sr-only peer"
                checked={displayValue}
                onChange={(e) => handleInputChange(field.id, e.target.checked)}
              />
              <div
                className="w-10 h-5 bg-gray-200 peer-focus:outline-none  dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
            </label>
          );
        case "color":
          return (
            <div className="flex items-center gap-2 w-full relative">
              <div
                className="flex items-center justify-between w-full border border-slate-300 rounded-md py-1 px-2 text-sm text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border border-slate-300"
                    style={{ backgroundColor: displayValue }}
                  ></div>
                  <span>{displayValue}</span>
                </div>
              </div>
              <input
                type="color"
                id={uniqueId}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={displayValue}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
              />
            </div>
          );
        case "header_menus":
          return (
              <HeaderMenus
                id={field.id}
                label={field.label}
                uniqueHtmlId={uniqueId}
                value={displayValue}
                onValueChange={(value) => handleInputChange(field.id, value)}
              />
          );
        default:
          return (
            <p className="text-red-500">Unknown field type: {field.type}</p>
          );
      }
    },
    [handleInputChange,handleFieldLoadingChange]
  );

  return (
    <div className="mt-4 space-y-3 w-full">
      {sectionSchema.settings.map((field) => {
        if (field.type === "array" && field.itemFields) {
          const numItemsToRender = field.max_items || sectionSchema.max_items || 1;
          const currentArrayContent = (content[field.id] || []).slice( 0, numItemsToRender );

          const populatedArrayContent = Array.from(
            { length: numItemsToRender },
            (_, itemIndex) => {
              const existingItem = currentArrayContent[itemIndex] || {};
              const defaultItem = {};
              field.itemFields.forEach((subField) => {
                if (subField.id === 'is_visible') {
                  defaultItem[subField.id] = itemIndex < sectionSchema.default_items;
                } else if (subField.id === 'menu_title') {
                  defaultItem[subField.id] = subField.default;
                } else if (subField.id === 'select_footer_menu') {
                  defaultItem[subField.id] = subField.default;
                } else {
                  defaultItem[subField.id] = subField.default;
                }
              });
              return { ...defaultItem, ...existingItem };
            }
          );

          return (
            <div
              key={field.id}
              className="border border-slate-300 rounded-lg p-3 my-4 bg-gray-50"
            >
              <h4 className="font-semibold mb-3 text-gray-800 text-sm">
                {field.label}
              </h4>
              {populatedArrayContent.map((itemContent, itemIndex) => {
                const repeatImageNumber = (itemIndex % 3) + 1;
                const imageSrc = itemContent?.collection_image || `/image/collection${repeatImageNumber}.svg`;
                return (
                  <div
                    key={`${field.id}-${itemIndex}`}
                    className="mb-4 p-3 border border-slate-200 rounded-md bg-white shadow-sm"
                  >
                    <h5 className="font-medium mb-2 text-gray-700 text-sm">
                      {itemContent.menu_title || `Item ${itemIndex + 1}`}
                    </h5>
                    {field.itemFields &&
                      field?.itemFields.map((subField) => {
                        const subUniqueId = `${instanceId}-${field.id}-${itemIndex}-${subField.id}`;
                        let subFieldValue = itemContent[subField.id]; 

                        let subDisplayValue;
                        if (subField.type === "checkbox") {
                          subDisplayValue = Boolean(subFieldValue ?? subField.default);
                        } else if (subField.type === "number" || subField.type === "range") {
                          subDisplayValue = Number(subFieldValue ?? subField.default ?? 0);
                        } else {
                          subDisplayValue = subFieldValue;
                        }

                        return (
                          <div key={subUniqueId} className={`mb-3 ${subField.type === 'checkbox' ? 'flex items-center justify-between ' : ''}`}>
                            <label
                              htmlFor={subUniqueId}
                              className="text-xs text-gray-600 block mb-1"
                            >
                              {subField.label}
                              {subField.info && (
                                <span className="ml-1 text-gray-400 text-[10px]">
                                  ({subField.info})
                                </span>
                              )}
                            </label>
                            {(() => {
                              switch (subField.type) {
                                case "text":
                                case "url":
                                  return ( <input type={ subField.type === "url" ? "url" : "text" } id={subUniqueId} className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm" value={subDisplayValue} onChange={(e) => handleArrayItemChange( field.id, itemIndex, subField.id, e.target.value ) } placeholder={subField.label} /> );
                                case "textarea":
                                  return ( <textarea id={subUniqueId} className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 h-16 outline-none focus:border-slate-500 transition-all text-sm" value={subDisplayValue} onChange={(e) => handleArrayItemChange( field.id, itemIndex, subField.id, e.target.value ) } placeholder={subField.label} /> );
                                case "select":
                                  return ( <select id={subUniqueId} className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm" value={subDisplayValue} onChange={(e) => handleArrayItemChange( field.id, itemIndex, subField.id, e.target.value ) } > {subField.options?.map((option) => ( <option key={option.value} value={option.value} > {option.label} </option> ))} </select> );
                                case "image":
                                  return ( <ImageInputField id={subField.id} label={subField.label} displayValue={field?.tag === 'custom_collection' ? imageSrc : subDisplayValue} onValueChange={(value) => handleArrayItemChange( field.id, itemIndex, subField.id, value )} onLoadingChange={(isLoading) => handleArrayItemLoadingChange( field.id, itemIndex, subField.id, isLoading )} uniqueHtmlId={subUniqueId} /> );
                                case "number":
                                  return ( <input type="number" id={subUniqueId} className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm" value={subDisplayValue} onChange={(e) => handleArrayItemChange( field.id, itemIndex, subField.id, Number(e.target.value) ) } placeholder={subField.label} /> );
                                case "range": 
                                  return ( <div className="flex items-center gap-2 w-full"> <input type="range" id={subUniqueId} min={subField.min} max={subField.max} step={subField.step} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" value={subDisplayValue} onChange={(e) => handleArrayItemChange( field.id, itemIndex, subField.id, Number(e.target.value) ) } /> <span className="text-sm text-gray-600 min-w-[30px] text-right"> {subDisplayValue} </span> </div> );
                                case "checkbox": 
                                  return ( <label htmlFor={subUniqueId} className="relative inline-flex items-center cursor-pointer" > <input type="checkbox" id={subUniqueId} className="sr-only peer" checked={subDisplayValue} onChange={(e) => handleArrayItemChange( field.id, itemIndex, subField.id, e.target.checked ) } /> <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none  dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" ></div> </label> );
                                case "color":
                                  return ( <div className="flex items-center gap-2 w-full relative"> <div className="flex items-center justify-between w-full border border-slate-300 rounded-md py-1 px-2 text-sm text-gray-600" > <div className="flex items-center gap-2"> <div className="w-6 h-6 rounded-full border border-slate-300" style={{ backgroundColor: subDisplayValue }} ></div> <span>{subDisplayValue}</span> </div> </div> <input type="color" id={subUniqueId} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" value={subDisplayValue} onChange={(e) => handleArrayItemChange( field.id, itemIndex, subField.id, e.target.value ) } /> </div> );
                                case "collection_select":
                                  return ( <CollectionField id={subField.id} label={subField.label} uniqueHtmlId={subUniqueId} value={itemContent} onValueChange={(fullCollectionData) => { handleArrayItemChange( field.id, itemIndex, 'collection_select', fullCollectionData ); }} collection={collections}  isLoading={isLoading} error={error} /> );
                                case "footer_menus":
                                  return ( <FooterMenus id={subField.id} label={subField.label} uniqueHtmlId={subUniqueId} value={itemContent} onValueChange={(value) => handleArrayItemChange( field.id, itemIndex, 'select_footer_menu', value )} menus={availableMenus} isLoading={loadingMenus} /> );
                                default:
                                  return (
                                    <p className="text-red-500 text-xs">
                                      Unknown sub-field type: {subField.type}
                                    </p>
                                  );
                              }
                            })()}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          );
        } else {
          return (
            <div key={field?.id} className={`mb-4 ${field.type === 'checkbox' ? 'flex items-center justify-between' : ''}`}>
              {field.type !== 'header' && (
                <label
                  htmlFor={`${instanceId}-${field.id}`}
                  className="text-sm text-gray-700 block mb-1"
                >
                  {field.label}
                  {field.info && (
                    <span className="ml-1 text-gray-400 text-xs">
                      ({field.info})
                    </span>
                  )}
                </label>
              )}
              {renderField(field, content, `${instanceId}-`)}
            </div>
          );
        }
      })}
    </div>
  );
};

export default SectionEditorForm;