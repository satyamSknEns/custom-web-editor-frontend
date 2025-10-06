import { useEffect, useState, useRef } from "react";
import SectionsRenderer from "../../components/sectionPreviews/sectionsRenderer";
import {
  AnnouncementBarPreview,
  HeaderPreview,
  ImageTextPreview,
  GalleryPreview,
  SliderBannerPreview,
  CollectionListPreview,
  CustomCollectionPreview,
  FooterPreview,
  NewsletterPreview
} from "../../components/sectionPreviews";
 
const sectionComponents = {
  announcement_bar: { component: AnnouncementBarPreview },
  header_section: { component: HeaderPreview },
  image_text_section: { component: ImageTextPreview },
  gallery_sections: { component: GalleryPreview },
  slider_banner_section: { component: SliderBannerPreview },
  collection_list_section: { component: CollectionListPreview },
  custom_collection: { component: CustomCollectionPreview },
  footer_section: { component: FooterPreview },
  newsletter_section: { component: NewsletterPreview },
};
 
export default function PreviewPage() {
  const [previewData, setPreviewData] = useState(null);
  const localSectionRefs = useRef({}); // Recreate sectionRefs locally
 
  useEffect(() => {
    const handler = (event) => {
      if (
        event.source === window.parent &&
        event.data.source === "web-editor-preview"
      ) {
        const data = event.data; // Direct data, no { data }
        if (data && data.addedSections && Array.isArray(data.addedSections)) {
          // console.log("Received preview data:", data);
          setPreviewData(data);
        }
      } else if (
        event.source === window.parent &&
        event.data.source === "web-editor-scroll"
      ) {
        const { sectionId } = event.data;
        if (sectionId && localSectionRefs.current[sectionId]) {
          localSectionRefs.current[sectionId].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    };
 
    window.addEventListener("message", handler);
 
    // Send ready signal to parent after listener is added
    window.parent.postMessage({ source: "preview-ready" }, "*");
 
    return () => window.removeEventListener("message", handler);
  }, []);
 
  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) {
      // console.log("No destination, drop aborted");
      return;
    }
    if (destination.index === source.index) {
      // console.log("Same index, no change");
      return;
    }
 
    const newSections = Array.from(previewData.addedSections);
    const [movedItem] = newSections.splice(source.index, 1);
    newSections.splice(destination.index, 0, movedItem);
 
    // Send updated sections to parent
    window.parent.postMessage(
      {
        source: "preview-page-drag-end",
        addedSections: newSections,
      },
      "*"
    );
  };
 
  const renderSectionPreview = (
    sectionId,
    content,
    viewType,
    onClick,
    isLoadingFields = {},
    isSkeleton = false
  ) => {
    if (isSkeleton) {
      switch (sectionId) {
        case "announcement_bar":
          return (
            <div className="h-8 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
            </div>
          );
        case "header_section":
          return (
            <div className="h-16 bg-gray-200 animate-pulse flex justify-between items-center px-4">
              <div className="w-32 h-8 bg-gray-300 rounded"></div>
              <div className="ml-auto flex space-x-4">
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="ml-auto flex space-x-4">
                <div className="w-40 h-4 bg-gray-300 rounded"></div>
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          );
        case "slider_banner_section":
          return (
            <div className="h-96 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-full h-full bg-gray-300 rounded flex flex-col items-center justify-center">
                <div className="w-48 h-8 bg-gray-400 rounded mb-2"></div>
                <div className="w-64 h-4 bg-gray-400 rounded mb-4"></div>
                <div className="w-32 h-10 bg-gray-400 rounded"></div>
              </div>
              <div className="absolute left-4 bg-gray-200 bg-opacity-50 p-4 rounded-full "></div>
              <div className="absolute right-4 bg-gray-200 bg-opacity-50 p-4 rounded-full "></div>
            </div>
          );
        case "image_text_section":
          return (
            <div className="h-80 bg-gray-200 animate-pulse flex">
              <div className="w-1/2 h-full bg-gray-300"></div>
              <div className="w-1/2 p-8 flex flex-col justify-center">
                <div className="w-3/4 h-6 bg-gray-400 rounded mb-4"></div>
                <div className="w-full h-4 bg-gray-400 rounded mb-2"></div>
                <div className="w-full h-4 bg-gray-400 rounded mb-2"></div>
                <div className="w-32 h-10 bg-gray-400 rounded"></div>
              </div>
            </div>
          );
        case "gallery_sections":
          return (
            <div className="h-96 bg-gray-200 animate-pulse p-4">
              <div className="w-48 h-6 bg-gray-300 rounded mx-auto mb-4"></div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          );
        case "collection_list_section":
          return (
            <div className="h-96 bg-gray-200 animate-pulse p-4">
              <div className="w-48 h-6 bg-gray-300 rounded mx-auto mb-4"></div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-gray-300 rounded flex flex-col"
                  >
                    <div className="h-48 bg-gray-400"></div>
                    <div className="p-2">
                      <div className="w-3/4 h-4 bg-gray-400 rounded mb-2"></div>
                      <div className="w-1/2 h-4 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case "custom_collection":
          return (
            <div className="h-96 bg-gray-200 animate-pulse p-4">
              <div className="w-48 h-6 bg-gray-300 rounded mx-auto mb-4"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-gray-300 rounded flex flex-col"
                  >
                    <div className="h-48 bg-gray-400"></div>
                    <div className="p-2">
                      <div className="w-3/4 h-4 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case "footer_section":
          return (
            <div className="h-64 bg-gray-200 animate-pulse p-4">
              <div className="flex justify-between">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1/5">
                    <div className="w-3/4 h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-full h-4 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="mt-8 w-1/2 h-4 bg-gray-300 rounded mx-auto"></div>
            </div>
          );
        default:
          return <div className="h-40 bg-gray-200 animate-pulse"></div>;
      }
    }
 
    const SectionComponent = sectionComponents[sectionId]?.component;
    if (SectionComponent) {
      return (
        <div onClick={onClick} className="relative w-full h-full">
          {Object.values(isLoadingFields).some((status) => status) &&
            viewType === "main_view" && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                <p className="ml-3 text-white">Uploading...</p>
              </div>
            )}
          <SectionComponent
            content={content}
            viewType={viewType}
            isLoadingFields={isLoadingFields}
          />
        </div>
      );f
    }
    return (
      <div className="text-red-600 p-4">
        {`Error: Component not found for ${sectionId}`}
      </div>
    );
  };
 
  const formatSectionLabel = (id) => {
    const formatted = id
      .replace(/_/g, " ")
      .replace(/\bsections\b/i, "")
      .trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };
 
  const handleSelectSection = (section) => {
    window.parent.postMessage(
      {
        source: "preview-page-select",
        instanceId: section.id,
      },
      "*"
    );
  };
 
  if (!previewData?.addedSections) {
    const placeholderSections = [
      { id: "placeholder-announcement", sectionId: "announcement_bar" },
      { id: "placeholder-header", sectionId: "header_section" },
      { id: "placeholder-slider", sectionId: "slider_banner_section" },
      { id: "placeholder-image-text", sectionId: "image_text_section" },
      { id: "placeholder-gallery", sectionId: "gallery_sections" },
      {
        id: "placeholder-collection-list",
        sectionId: "collection_list_section",
      },
      { id: "placeholder-custom-collection", sectionId: "custom_collection" },
      { id: "placeholder-footer", sectionId: "footer_section" },
    ];
 
    return (
      <SectionsRenderer
        addedSections={placeholderSections}
        hiddenSections={[]}
        sectionContent={{}}
        selectedSection={null}
        hoveredSectionInMainView={null}
        fieldLoadingStatus={{}}
        sectionRefs={localSectionRefs}
        onDragEnd={() => {}}
        setSelectedSection={() => {}}
        setHoveredSectionInMainView={() => {}}
        renderSectionPreview={(
          sectionId,
          content,
          viewType,
          onClick,
          isLoadingFields
        ) =>
          renderSectionPreview(
            sectionId,
            content,
            viewType,
            onClick,
            isLoadingFields,
            true
          )
        }
        formatSectionLabel={formatSectionLabel}
      />
    );
  }
 
  return (
    <SectionsRenderer
      addedSections={previewData?.addedSections}
      hiddenSections={previewData?.hiddenSections || []}
      sectionContent={previewData?.sectionContent || {}}
      selectedSection={previewData?.selectedSection}
      hoveredSectionInMainView={previewData?.hoveredSectionInMainView}
      fieldLoadingStatus={previewData?.fieldLoadingStatus || {}}
      sectionRefs={localSectionRefs} // Use local ref
      onDragEnd={handleDragEnd}
      setSelectedSection={handleSelectSection} // Sends message to parent
      setHoveredSectionInMainView={() => {}} // No-op
      renderSectionPreview={renderSectionPreview} // Recreated locally
      formatSectionLabel={formatSectionLabel} // Recreated locally
    />
  );
}
 