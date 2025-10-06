import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const SectionsRenderer = ({
  addedSections,
  hiddenSections,
  sectionContent,
  selectedSection,
  hoveredSectionInMainView,
  fieldLoadingStatus,
  sectionRefs,
  onDragEnd,
  setSelectedSection,
  setHoveredSectionInMainView,
  renderSectionPreview,
  formatSectionLabel,
}) => {

  const handleDragEnd = (result) => {
    onDragEnd(result);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="section-list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="h-full border border-blue-100 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white"
            style={{ minHeight: "100vh" }}
          >
            {addedSections?.map(({ id, sectionId }, index) => {
              const isHidden = hiddenSections.includes(id);
              const currentSectionContent = sectionContent[id];
              const isHeaderSticky = sectionId === "header_section" && currentSectionContent?.show_sticky_header;
              const isSelected = selectedSection && selectedSection.id === id;
              const isHovered = hoveredSectionInMainView === id;
              const sectionLoadingFields = fieldLoadingStatus[id] || {};

              if (isHidden) return null;

              return (
                <Draggable
                  key={`${id}-${index}`}
                  draggableId={`${id}-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={(el) => {
                        provided.innerRef(el);
                        if (sectionRefs && sectionRefs.current) {
                          sectionRefs.current[id] = el;
                        }
                      }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        display: isHidden ? "none" : undefined,
                        cursor: "pointer",
                        ...provided.draggableProps.style,
                      }}
                      
                      className={`rounded border-2 relative ${
                        snapshot.isDragging ? "shadow-lg" : ""
                      } ${
                        isSelected || (isHovered && !snapshot.isDragging)
                          ? "border-blue-500"
                          : "border-transparent"
                      } ${isSelected ? "shadow-md ring-2 ring-blue-200" : ""}${isHeaderSticky && "sticky -top-0.5 z-50"} `}
                      onClick={() => setSelectedSection({ id, sectionId })}
                      onMouseEnter={() => setHoveredSectionInMainView(id)}
                      onMouseLeave={() => setHoveredSectionInMainView(null)}
                    >
                      {(isHovered || isSelected) && !snapshot.isDragging && (
                        <span
                          className={`absolute left-0 bg-blue-500 text-white text-xs px-2 py-0.5 z-50 ${
                            index === 0
                              ? "top-0"
                              : "-top-5 rounded-tl-md rounded-tr-md"
                          }`}
                        >
                          {formatSectionLabel(sectionId)}
                        </span>
                      )}
                      {renderSectionPreview(
                        sectionId,
                        currentSectionContent,
                        "main_view",
                        () => setSelectedSection({ id, sectionId }),
                        sectionLoadingFields
                      )}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SectionsRenderer;