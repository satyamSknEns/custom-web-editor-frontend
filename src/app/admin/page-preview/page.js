"use client";
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
          console.log("Received preview data:", data);
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
      console.log("No destination, drop aborted");
      return;
    }
    if (destination.index === source.index) {
      console.log("Same index, no change");
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
    isLoadingFields = {}
  ) => {
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
      );
    }
    return (
      <div className="text-red-600 p-4">
        Error: Component not found for {sectionId}
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