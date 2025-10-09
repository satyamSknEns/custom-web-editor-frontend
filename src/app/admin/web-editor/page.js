"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiSettings, FiGrid, FiTrash2, FiEyeOff, FiEye } from "react-icons/fi";
import { MdOutlineAnnouncement, MdOutlineMail } from "react-icons/md";
import { RiImageCircleAiLine } from "react-icons/ri";
import { BsCollection } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { TbSlideshow } from "react-icons/tb";
import { BsDatabaseAdd, BsImages } from "react-icons/bs";
import { GoPlusCircle } from "react-icons/go";
import { RxDragHandleDots2, RxSection } from "react-icons/rx";
import {
  ImageTextPreview,
  GalleryPreview,
  SliderBannerPreview,
  CollectionListPreview,
  CustomCollectionPreview,
  AnnouncementBarPreview,
  HeaderPreview,
  FooterPreview,
  NewsletterPreview
} from "../../components/sectionPreviews";
import { schema as HeaderSchema } from "../../components/sectionPreviews/headerPreview";
import { schema as ImageTextSchema } from "../../components/sectionPreviews/imageTextPreview";
import { schema as GallerySchema } from "../../components/sectionPreviews/galleryPreview";
import { schema as SliderBannerSchema } from "../../components/sectionPreviews/sliderBannerPreview";
import { schema as CollectionListSchema } from "../../components/sectionPreviews/collectionListPreview";
import { schema as CustomCollectionSchema } from "../../components/sectionPreviews/customCollectionPreview";
import { schema as AnnouncementSchema } from "../../components/sectionPreviews/announcementBarPreview";
import { schema as FooterSchema } from "../../components/sectionPreviews/footerPreview";
import { schema as NewsletterSchema } from "../../components/sectionPreviews/newsletterPreview";
import Header from "./header/header";
import SectionEditorForm from "./formEditor/sectionEditorForm";
import { apiurl } from "../../../config/config";
import axios from "axios";

const sectionComponents = {
  announcement_bar: {
    component: AnnouncementBarPreview,
    schema: AnnouncementSchema,
    defaultContent: (() => {
      const isEnabledField = AnnouncementSchema.settings.find( (f) => f.id === "is_enabled" );
      const announcementsArrayField = AnnouncementSchema.settings.find( (f) => f.id === "announcements" );
      const slideDurationField = AnnouncementSchema.settings.find( (f) => f.id === "slide_duration" );
      const slideDirectionField = AnnouncementSchema.settings.find( (f) => f.id === "slide_direction" );

      const defaultAnnouncements = Array.from({ length: AnnouncementSchema.min_items || 1, }).map(() => {
        const textDefault = announcementsArrayField?.itemFields.find( (f) => f.id === "announcement_text" )?.default || "";
        const linkDefault = announcementsArrayField?.itemFields.find( (f) => f.id === "announcement_link" )?.default || "#";
        const isVisibleDefault = announcementsArrayField?.itemFields.find((f) => f.id === "is_visible")?.default || true;
        return {
          announcement_text: textDefault,
          announcement_link: linkDefault,
          is_visible: isVisibleDefault,
        };
      });

      return {
        is_enabled: isEnabledField?.default ?? true,
        slide_duration: slideDurationField?.default ?? 3,
        slide_direction: slideDirectionField?.default ?? "horizontal",
        announcements: defaultAnnouncements,
      };
    })(),
  },
  header_section: {
    component: HeaderPreview,
    schema: HeaderSchema,
    defaultContent: (() => {
      const defaultLayoutStyle = HeaderSchema.settings.find((f) => f.id === "layout_style")?.default || "layout1";
      const defaultLogo = HeaderSchema.settings.find((f) => f.id === "logo_image")?.default || "https://storage.googleapis.com/ens-ondc/placeholder-logo.svg";
      const defaultLinks = ["Home", "Catalog", "Blogs", "Contact"];
      const defaultNavLinks = Array.from({ length: HeaderSchema.default_items, }).map((_, index) => ({
        name: defaultLinks[index],
        link: "#",
        is_visible: true,
      }));

      return {
        layout_style: defaultLayoutStyle,
        logo_image: defaultLogo,
        nav_links: defaultNavLinks,
      };
    })(),
  },
  image_text_section: {
    component: ImageTextPreview,
    schema: ImageTextSchema,
    defaultContent: {
      imageUrl: ImageTextSchema.settings.find((f) => f.id === "imageUrl")?.default || "",
      heading_text: ImageTextSchema.settings.find((f) => f.id === "heading_text")?.default || "",
      description_text: ImageTextSchema.settings.find((f) => f.id === "description_text")?.default || "",
      image_alignment: ImageTextSchema.settings.find((f) => f.id === "image_alignment")?.default || "",
      button_lable: ImageTextSchema.settings.find((f) => f.id === "button_lable")?.default || "",
      button_link: ImageTextSchema.settings.find((f) => f.id === "button_link")?.default || "",
    },
  },
  gallery_sections: {
    component: GalleryPreview,
    schema: GallerySchema,
    defaultContent: (() => {
      const headingField =
        GallerySchema.settings.find((f) => f.id === "gallery_title")?.default ||
        "Our Featured Work";
      const itemsFieldDefinition = GallerySchema.settings.find(
        (field) => field.id === "items" && field.type === "array"
      );
      const defaultImage =
        itemsFieldDefinition?.itemFields.find((f) => f.id === "image")
          ?.default || "/assets/placeholder.jpg";
      const defaultLink =
        itemsFieldDefinition?.itemFields.find((f) => f.id === "link")
          ?.default || "";
      const defaultCaptionText =
        itemsFieldDefinition?.itemFields.find((f) => f.id === "caption_text")
          ?.default || "";
      const maxItems = GallerySchema.max_items;

      return {
        gallery_title: headingField,
        items: Array.from({ length: maxItems }).map(() => ({
          image: defaultImage,
          link: defaultLink,
          caption_text: defaultCaptionText,
        })),
      };
    })(),
  },
  slider_banner_section: {
    component: SliderBannerPreview,
    schema: SliderBannerSchema,
    defaultContent: (() => {
      const slidesFieldDefinition = SliderBannerSchema.settings.find(
        (field) => field.id === "slides" && field.type === "array"
      );
      const defaultDesktopImage =
        slidesFieldDefinition?.itemFields.find((f) => f.id === "desktop_image")
          ?.default ||
        "https://storage.googleapis.com/ens-ondc/1753685673886_desktop_banner_placeholder.jpg";
      const defaultMobileImage =
        slidesFieldDefinition?.itemFields.find((f) => f.id === "mobile_image")
          ?.default ||
        "https://storage.googleapis.com/ens-ondc/1753685748019_mobile_banner_placeholder.jpg";
      const defaultHeading =
        slidesFieldDefinition?.itemFields.find((f) => f.id === "heading")
          ?.default || "Image Slide";
      const defaultSubHeading =
        slidesFieldDefinition?.itemFields.find((f) => f.id === "subheading")
          ?.default || "New Arrivals";
      const defaultButtonLable =
        slidesFieldDefinition?.itemFields.find((f) => f.id === "button_lable")
          ?.default || "Shop Now";
      const defaultButtonLink =
        slidesFieldDefinition?.itemFields.find((f) => f.id === "button_link")
          ?.default || "#";
      const defaultShowOverlay =
        slidesFieldDefinition?.itemFields.find((f) => f.id === "show_overlay")
          ?.default || true;
      const defaultVisiblity =
        slidesFieldDefinition?.itemFields.find((f) => f.id === "visible")
          ?.default || true;
      const defaultTextAlignment =
        slidesFieldDefinition?.itemFields.find((f) => f.id === "text_alignment")
          ?.default || "middle center";
      const maxSlides = SliderBannerSchema.max_items || 3;

      return {
        autoplay_enabled:
          SliderBannerSchema.settings.find((f) => f.id === "autoplay_enabled")
            ?.default || false,
        slide_duration:
          SliderBannerSchema.settings.find((f) => f.id === "slide_duration")
            ?.default || 3,
        slides: Array.from({ length: maxSlides }).map(() => ({
          desktop_image: defaultDesktopImage,
          mobile_image: defaultMobileImage,
          heading: defaultHeading,
          subheading: defaultSubHeading,
          button_lable: defaultButtonLable,
          button_link: defaultButtonLink,
          show_overlay: defaultShowOverlay,
          visible: defaultVisiblity,
          text_alignment: defaultTextAlignment,
        })),
      };
    })(),
  },
  collection_list_section: {
    component: CollectionListPreview,
    schema: CollectionListSchema,
    defaultContent: (() => {
      const headingField =
        CollectionListSchema.settings.find((f) => f.id === "main_heading")
          ?.default || "Collection List";
      const desktoplayoutField =
        CollectionListSchema.settings.find((f) => f.id === "desktop_layout")
          ?.default || "grid";
      const mobilelayoutField =
        CollectionListSchema.settings.find((f) => f.id === "mobile_layout")
          ?.default || "grid";
      const maxItems = CollectionListSchema.max_items || 3;

      return {
        main_heading: headingField,
        desktop_layout: desktoplayoutField,
        mobile_layout: mobilelayoutField,
        items: Array.from({ length: maxItems }).map(() => ({
          collection_id: "",
          collection_tag: "",
          collection_type: "",
          collection_image: "",
          collection_title: "",
          collection_status: "",
          collection_description: "",
        })),
      };
    })(),
  },
  custom_collection: {
    component: CustomCollectionPreview,
    schema: CustomCollectionSchema,
    defaultContent: (() => {
      const headingField =
        CustomCollectionSchema.settings.find((f) => f.id === "section_heading")
          ?.default || "Custom Collection";
      const desktopLayoutField =
        CustomCollectionSchema.settings.find((f) => f.id === "desktop_layout")
          ?.default || "rows";
      const mobilelayoutField =
        CustomCollectionSchema.settings.find((f) => f.id === "mobile_layout")
          ?.default || "grid";
      const collectionFields = CustomCollectionSchema.settings.find(
        (f) => f.id === "items" && f.type === "array"
      );
      // const defaultCollectionImage = collectionFields.itemFields.find((f) => f.id === 'collection_image')?.default || '';
      const defaultCollectionTitle =
        collectionFields.itemFields.find((f) => f.id === "collection_title")
          ?.default || "";
      const maxItems = CustomCollectionSchema.max_items || 3;

      return {
        section_heading: headingField,
        desktop_layout: desktopLayoutField,
        mobile_layout: mobilelayoutField,
        items: Array.from({ length: maxItems }).map(() => ({
          collection_id: "",
          collection_tag: "",
          collection_type: "",
          collection_image: "",
          collection_title: defaultCollectionTitle,
          collection_link: "#",
        })),
      };
    })(),
  },
  footer_section: {
    component: FooterPreview,
    schema: FooterSchema,
    defaultContent: (() => {
      const defaultLinks = [
        { id: "home", name: "Home", link: "/" },
        { id: "collection", name: "Collection", link: "/collection" },
        { id: "about", name: "About", link: "/about" },
        { id: "contact", name: "Contact Us", link: "/contact" },
      ];

      const menusFieldDefinition = FooterSchema.settings.find(
        (f) => f.id === "selected_menu" && f.type === "array"
      );
      const menuTitleDefault = menusFieldDefinition?.itemFields.find((f) => f.id === "menu_title")?.default || "Quick Links";
      const menuIsVisible = menusFieldDefinition?.itemFields.find((f) => f.id === "is_visible")?.default || true;
      const selectedMenuDefault = defaultLinks;
      const maxMenus = FooterSchema.max_items || 4;

      return {
        background_color: FooterSchema.settings.find((f) => f.id === "background_color")?.default ?? "#1c1819",
        text_color: FooterSchema.settings.find((f) => f.id === "text_color")?.default ?? "#ffffff",
        link_color: FooterSchema.settings.find((f) => f.id === "link_color")?.default ?? "#cccccc",
        logo_image: FooterSchema.settings.find((f) => f.id === "logo_image")?.default ?? "image/placeholder.jpg",
        description: FooterSchema.settings.find((f) => f.id === "description")?.default ?? "A short description about your brand.",
        show_social_icons: FooterSchema.settings.find((f) => f.id === "show_social_icons")?.default ?? true,
        show_newsletter: FooterSchema.settings.find((f) => f.id === "show_newsletter")?.default ?? true,
        newsletter_heading: FooterSchema.settings.find((f) => f.id === "newsletter_heading")?.default ?? "Join Our Newsletter",
        newsletter_button_text: FooterSchema.settings.find((f) => f.id === "newsletter_button_text")?.default ?? "Subscribe",
        newsletter_button_color: FooterSchema.settings.find((f) => f.id === "newsletter_button_color")?.default ?? "#1f2937",
        selected_menu: Array.from({ length: maxMenus }).map((_, index) => ({
          menu_title: `${menuTitleDefault} ${index+1}`.trim(),
          is_visible: menuIsVisible,
          menuItems: selectedMenuDefault,
        })),
      };
    })(),
  },
  newsletter_section: { 
    component: NewsletterPreview,
    schema: NewsletterSchema,
    defaultContent: {
      heading_text: NewsletterSchema.settings.find((f) => f.id === "heading_text")?.default,
      subheading_text: NewsletterSchema.settings.find((f) => f.id === "subheading_text")?.default,
      button_label: NewsletterSchema.settings.find((f) => f.id === "button_label")?.default,
    },
  },
};

const WebEditor = () => {
  const [activeTab, setActiveTab] = useState("content");
  const [showSectionPopup, setShowSectionPopup] = useState(false);
  const [addedSections, setAddedSections] = useState([]);
  const [hiddenSections, setHiddenSections] = useState([]);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [pages] = useState({
    home_page: "Home page",
    about: "About",
    contact: "Contact",
    product_page: "Product page",
    collection_page: "Collection page",
  });
  const [selectedPage, setSelectedPage] = useState("home_page");
  const [hoveredSectionInMainView, setHoveredSectionInMainView] =
    useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [deviceMode, setDeviceMode] = useState("desktop");
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const sidebarRef = useRef(null);
  const popupRef = useRef(null);
  const uniqueIdRef = React.useRef(0);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionContent, setSectionContent] = useState({});
  const [fieldLoadingStatus, setFieldLoadingStatus] = useState({});

  const generateUniqueId = () => {
    uniqueIdRef.current += 1;
    return `added-section-${uniqueIdRef.current}`;
  };

  const formatSectionLabel = (id) => {
    const formatedSection = id
      .replace(/_/g, " ")
      .replace(/\bsections?\b/i, "")
      .trim();
    return formatedSection.charAt(0).toUpperCase() + formatedSection.slice(1);
  };

  const pushToUndoStack = (prevState) => {
    setUndoStack((prev) => [...prev, prevState]);
    setRedoStack([]);
    setHasChanges(true);
  };

  const currentEditorState = () => ({
    addedSections,
    hiddenSections,
    sectionContent,
  });

  const handleAddSection = (sectionId) => {
    const newAddedSection = { id: generateUniqueId(), sectionId };
    const defaultContent = sectionComponents[sectionId]?.defaultContent || {};

    // Save current state for undo
    pushToUndoStack(currentEditorState());

    // Update all states in one go
    setSectionContent((prev) => ({
      ...prev,
      [newAddedSection.id]: JSON.parse(JSON.stringify(defaultContent)),
    }));
    setAddedSections((prev) => [...prev, newAddedSection]);
    setSelectedSection(newAddedSection); // This will trigger scroll via useEffect
    setShowSectionPopup(false);
    setHoveredSection(null);
  };

  const handleDeleteSection = (instanceId) => {
    pushToUndoStack(currentEditorState());
    setAddedSections((prev) =>
      prev.filter((section) => section.id !== instanceId)
    );
    setHiddenSections((prev) => prev.filter((id) => id !== instanceId));
    setSectionContent((prev) => {
      const newContent = { ...prev };
      delete newContent[instanceId];
      return newContent;
    });
  };

  const buttonRef = useRef(null);
  const ignoreNextClick = useRef(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef?.current && iframeRef?.current?.contentWindow) {
      const previewData = {
        source: "web-editor-preview", // Add unique identifier
        addedSections,
        hiddenSections,
        sectionContent,
        selectedSection,
        hoveredSectionInMainView,
        fieldLoadingStatus,
      };
      iframeRef.current.contentWindow.postMessage(previewData, "*");
    }
  }, [
    addedSections,
    hiddenSections,
    sectionContent,
    selectedSection,
    hoveredSectionInMainView,
    fieldLoadingStatus,
  ]);

  useEffect(() => {
    if (
      selectedSection &&
      iframeRef.current &&
      iframeRef.current.contentWindow
    ) {
      console.log("Preparing to send scroll to section:", selectedSection.id);
      // Add a slight delay to ensure iframe has rendered the new section
      setTimeout(() => {
        console.log("Sending scroll to section:", selectedSection.id);
        iframeRef.current.contentWindow.postMessage(
          {
            source: "web-editor-scroll",
            sectionId: selectedSection.id,
          },
          "*"
        );
      }, 100); // 100ms delay
    }
    if (selectedSection) {
      setActiveTab("content");
    }
  }, [selectedSection]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source === iframeRef?.current?.contentWindow) {
        if (event.data.source === "preview-page-select") {
          const { instanceId } = event.data;
          const section = addedSections.find((s) => s.id === instanceId);
          if (section) {
            console.log("Selecting section from iframe:", section.id);
            setSelectedSection(section);
            setActiveTab("content");
          } else {
            console.warn("No section found for instanceId:", instanceId);
          }
        } else if (event.data.source === "preview-page-drag-end") {
          const { addedSections: newSections } = event.data;
          console.log("Received drag-end update:", newSections);
          pushToUndoStack(currentEditorState());
          setAddedSections(newSections);
        } else if (event.data.source === "preview-ready") {
          // Iframe is ready - send current preview data
          console.log("Iframe ready, sending current preview data");
          if (iframeRef.current && iframeRef.current.contentWindow) {
            const previewData = {
              source: "web-editor-preview",
              addedSections,
              hiddenSections,
              sectionContent,
              selectedSection,
              hoveredSectionInMainView,
              fieldLoadingStatus,
            };
            iframeRef.current.contentWindow.postMessage(previewData, "*");
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [addedSections, currentEditorState, pushToUndoStack]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;

      if (buttonRef.current?.contains(target)) {
        ignoreNextClick.current = true;
        return;
      }

      if (popupRef.current && !popupRef.current.contains(target)) {
        setShowSectionPopup(false);
        setHoveredSection(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopup = (e) => {
    e.stopPropagation();
    setShowSectionPopup((prev) => !prev);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    pushToUndoStack(currentEditorState());
    const newSections = Array.from(addedSections);
    const [movedItem] = newSections.splice(source.index, 1);
    newSections.splice(destination.index, 0, movedItem);
    setAddedSections(newSections);
  };

  const handleFieldLoadingStatusChange = useCallback(
    (instanceId, fieldIdentifier, isLoading) => {
      setFieldLoadingStatus((prevStatus) => {
        const newStatus = { ...prevStatus };
        if (!newStatus[instanceId]) {
          newStatus[instanceId] = {};
        }
        newStatus[instanceId][fieldIdentifier] = isLoading;
        return newStatus;
      });
    },
    []
  );
  const renderSectionPreview = useCallback(
    (sectionId, content, viewType, onClick = null, isLoadingFields = {}) => {
      const SectionComponent = sectionComponents[sectionId]?.component;
      if (SectionComponent) {
        return (
          <div
            onClick={onClick}
            className="relative w-full h-full flex items-center justify-center"
          >
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
      return null;
    },
    []
  );

  const sectionIcon = (section) => {
    switch (section) {
      case "announcement_bar":
        return <MdOutlineAnnouncement />;
      case "header_section":
        return <RxSection />;
      case "image_text_section":
        return <BsImages />;
      case "slider_banner_section":
        return <TbSlideshow />;
      case "gallery_sections":
        return <GrGallery />;
      case "collection_list_section":
        return <BsCollection />;
      case "custom_collection":
        return <RiImageCircleAiLine />;
      case "footer_section":
        return <RxSection />;
      case "newsletter_section":
        return <MdOutlineMail />;
      default:
        return null;
    }
  };

  const handleHideSection = (instanceId) => {
    pushToUndoStack(currentEditorState());
    if (hiddenSections.includes(instanceId)) {
      setHiddenSections(hiddenSections.filter((id) => id !== instanceId));
    } else {
      setHiddenSections([...hiddenSections, instanceId]);
    }
  };

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, currentEditorState()]);
    setUndoStack((prev) => prev.slice(0, prev.length - 1));

    setAddedSections(previousState.addedSections);
    setHiddenSections(previousState.hiddenSections);
    setSectionContent(previousState.sectionContent);
    setHasChanges(true);
  }, [undoStack, currentEditorState]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, currentEditorState()]);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));

    setAddedSections(nextState.addedSections);
    setHiddenSections(nextState.hiddenSections);
    setSectionContent(nextState.sectionContent);
    setHasChanges(true);
  }, [redoStack, currentEditorState]);

  const handleSectionContentChange = useCallback(
    (instanceId, updatedContent) => {
      setSectionContent((prev) => {
        if (
          JSON.stringify(prev[instanceId]) !== JSON.stringify(updatedContent)
        ) {
          pushToUndoStack(currentEditorState());
          setHasChanges(true);
        }
        return {
          ...prev,
          [instanceId]: updatedContent,
        };
      });
    },
    [currentEditorState]
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target;
      if (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
      ) {
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;

      if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      } else if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleUndo, handleRedo]);

  const createPageSections = async (payload) => {
    setIsSaving(true);
    const config = {
      url: `${apiurl}/webEditor`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    };
    try {
      const response = await axios(config);
      if (response?.data?.success) {
        setTimeout(() => {
          setIsSaving(false);
          setHasChanges(false);
          fetchPageSections(selectedPage);
        }, 2000);
      }
      console.log("Save successful:", response.data);
    } catch (error) {
      setIsSaving(false);
      console.error("Error saving page sections:", error);
    }
  };

  const fetchPageSections = async (categoryName) => {
    setIsSaving(true);
    const config = {
      url: `${apiurl}/webEditor?categoryName=${categoryName}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios(config);
      console.log("Fetched data:", response.data);

      const pageData =
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
          ? response.data[0]
          : null;

      if (pageData && pageData.subCategories) {
        setIsSaving(false);
        const newAddedSections = [];
        const newHiddenSections = [];
        const newSectionContent = {};

        pageData.subCategories.forEach((subCategory) => {
          const instanceId = generateUniqueId();
          const sectionId = subCategory.subCategoryName;

          newAddedSections.push({ id: instanceId, sectionId: sectionId });

          if (subCategory.isHidden) {
            newHiddenSections.push(instanceId);
          }

          if (subCategory.settings && subCategory.settings.length > 0) {
            newSectionContent[instanceId] = subCategory.settings[0];
          } else {
            newSectionContent[instanceId] =
              sectionComponents[sectionId]?.defaultContent || {};
          }
        });

        setAddedSections(newAddedSections);
        setHiddenSections(newHiddenSections);
        setSectionContent(newSectionContent);

        setUndoStack([]);
        setRedoStack([]);
        setHasChanges(false);
      } else {
        setIsSaving(false);
        setAddedSections([]);
        setHiddenSections([]);
        setSectionContent({});
        setUndoStack([]);
        setRedoStack([]);
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Error fetching page sections:", error);
      setIsSaving(false);
      setAddedSections([]);
      setHiddenSections([]);
      setSectionContent({});
      setUndoStack([]);
      setRedoStack([]);
      setHasChanges(false);
    }
  };

  useEffect(() => {
    fetchPageSections(selectedPage);
  }, [selectedPage]);

  const handleSave = useCallback(() => {
    if (!hasChanges) {
      console.log("No changes to save.");
      return;
    }
    const pageData = {
      categoryName: selectedPage,
      subCategories: addedSections.map((sectionInstance) => ({
        subCategoryName: sectionInstance.sectionId,
        settings: [sectionContent[sectionInstance.id]],
        isHidden: hiddenSections.includes(sectionInstance.id),
      })),
    };
    createPageSections(pageData);
    console.log("Saving page data:", pageData);
  }, [selectedPage, addedSections, sectionContent, hiddenSections, hasChanges]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target;
      if (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
      ) {
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;

      if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      } else if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      } else if (e.key.toLowerCase() === "s") {
        e.preventDefault();

        if (hasChanges) {
          handleSave();
        } else {
          console.log("No changes to save (Ctrl+S).");
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleUndo, handleRedo, handleSave, hasChanges]);

  return (
    <>
      <div className="h-screen flex flex-col text-black w-full overflow-hidden">
        <Header
          pages={pages}
          selectedPage={selectedPage}
          onSelectPage={setSelectedPage}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSave={handleSave}
          isSaving={isSaving}
          undoStack={undoStack}
          redoStack={redoStack}
          hasChanges={hasChanges}
          deviceMode={deviceMode}
          setDeviceMode={setDeviceMode}
        />
        <div className="flex item-center justify-center h-[90vh]">
          <div
            ref={sidebarRef}
            className="w-[25%] flex items-start bg-white pb-4 relative"
          >
            <div className="flex items-center flex-col gap-4 border-r-[1px] p-12 border-slate-200 w-[25%] h-full">
              {["content", "components", "settings"].map((tab) => (
                <button
                  key={tab}
                  className={`flex items-center justify-center gap-2 cursor-pointer outline-none rounded-md max-w-8 max-h-8 ${
                    activeTab === tab
                      ? "bg-gray-200 shadow"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {" "}
                  {tab === "content" ? (
                    <BsDatabaseAdd className="m-2" />
                  ) : tab === "components" ? (
                    <FiGrid className="m-2" />
                  ) : (
                    <FiSettings className="m-2" />
                  )}{" "}
                </button>
              ))}
            </div>

            <div className="w-[75%] px-2 flex h-full mx-auto overflow-y-auto slide-to-top [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
              {activeTab === "content" && (
                <>
                  {selectedSection && sectionContent[selectedSection.id] ? (
                    <div className="mt-4 space-y-3 w-full">
                      <div className="flex items-center ">
                        {" "}
                        <span
                          className="p-1 hover:bg-gray-100 cursor-pointer mr-2 rounded-md"
                          onClick={() => setSelectedSection(null)}
                        >
                          {" "}
                          <IoIosArrowBack className="text-sm" />{" "}
                        </span>{" "}
                        <p className="text-sm cursor-pointer border border-white hover:border-slate-300 p-1 px-2 rounded-md">
                          {" "}
                          {formatSectionLabel(selectedSection.sectionId)}{" "}
                        </p>{" "}
                      </div>

                      <SectionEditorForm
                        sectionId={selectedSection.sectionId}
                        instanceId={selectedSection.id}
                        sectionSchema={
                          sectionComponents[selectedSection.sectionId]?.schema
                        }
                        content={sectionContent[selectedSection.id]}
                        onContentChange={handleSectionContentChange}
                        onFieldLoadingChange={handleFieldLoadingStatusChange}
                      />
                    </div>
                  ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="sidebar-section-list text-sm">
                        {(provided) => (
                          <div
                            className="w-full flex items-center flex-col justify-between"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            <div className="flex flex-col w-full text-xs">
                              {/* {addedSections.length === 0 ? ( */}
                              {!isIframeLoaded ? (
                                <div className="flex flex-col gap-2 animate-pulse">
                                  {[...Array(13)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="h-9 w-full rounded-lg border border-slate-200 bg-gray-100"
                                    ></div>
                                  ))}
                                </div>
                              ) : (
                                addedSections.map(
                                  ({ id, sectionId }, index) => {
                                    const isHidden =
                                      hiddenSections.includes(id);
                                      console.log("sectionId",sectionId);
                                    return (
                                      <Draggable
                                        key={`${id}-${index}`}
                                        draggableId={`sidebar-${id}-${index}`}
                                        index={index}
                                      >
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            // className={`flex items-center cursor-pointer justify-between gap-2 w-full p-2 rounded-lg border my-1 border-slate-300 transition-all duration-300 group ${
                                            //   snapshot.isDragging
                                            //     ? "bg-gray-200 shadow"
                                            //     : "hover:bg-gray-100"
                                            // }`}
                                            className={`flex items-center cursor-pointer justify-between gap-2 w-full p-2 rounded-lg border my-1 border-slate-300 transition-all duration-300 group ${
                                              snapshot.isDragging
                                                ? "bg-gray-200 shadow"
                                                : selectedSection?.id === id
                                                ? "bg-gray-200 shadow border-blue-500"
                                                : "hover:bg-gray-100"
                                            }`}
                                          >
                                            <div
                                              className="flex items-center justify-start w-3/4 cursor-pointer"
                                              onClick={() =>
                                                setSelectedSection({
                                                  id,
                                                  sectionId,
                                                })
                                              }
                                            >
                                              <span className="text-gray-500 block group-hover:hidden">
                                                {sectionIcon(sectionId)}
                                              </span>
                                              <span className="text-gray-500 hidden group-hover:block">
                                                <RxDragHandleDots2 />
                                              </span>
                                              <span className="cursor-pointer ml-1">
                                                {formatSectionLabel(sectionId)}
                                              </span>
                                            </div>

                                            <div className="flex items-center justify-center cursor-pointer w-1/4">
                                              {" "}
                                              <button
                                                onClick={() =>
                                                  handleDeleteSection(id)
                                                }
                                                className="hidden group-hover:block text-slate-500 hover:text-red-700 ml-auto cursor-pointer"
                                                aria-label="Delete section"
                                                title="Delete section"
                                                type="button"
                                              >
                                                {" "}
                                                <FiTrash2 size={15} />{" "}
                                              </button>{" "}
                                              <button
                                                onClick={() =>
                                                  handleHideSection(id)
                                                }
                                                className={`ml-2 cursor-pointer group-hover:block hover:bg-gray-100 ${
                                                  isHidden
                                                    ? "block text-gray-400 hover:text-gray-600"
                                                    : "hidden text-gray-500 hover:text-gray-700"
                                                }`}
                                                aria-label={
                                                  isHidden
                                                    ? "Show section"
                                                    : "Hide section"
                                                }
                                                title={
                                                  isHidden
                                                    ? "Show section"
                                                    : "Hide section"
                                                }
                                                type="button"
                                              >
                                                {" "}
                                                {isHidden ? (
                                                  <FiEyeOff size={15} />
                                                ) : (
                                                  <FiEye size={15} />
                                                )}{" "}
                                              </button>{" "}
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    );
                                  }
                                )
                              )}
                              {provided.placeholder}
                            </div>
                            <button
                              className="w-full hover:bg-gray-200 rounded-lg transition-all ease-in-out duration-300 border border-slate-200 flex items-center text-sm cursor-pointer outline-none gap-2 px-2 py-1.5 text-blue-700"
                              ref={buttonRef}
                              onClick={togglePopup}
                            >
                              {" "}
                              <GoPlusCircle /> Add section{" "}
                            </button>
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </>
              )}

              {activeTab === "settings" && (
                <p className="text-gray-600">Settings content goes here...</p>
              )}
              {activeTab === "components" && (
                <p className="text-gray-600">Component content goes here...</p>
              )}
            </div>

            {activeTab === "content" && showSectionPopup && (
              <div
                ref={popupRef}
                className={`mt-4 rounded-lg border-blue-400 shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:w-[690px] h-[400px] overflow-y-hidden flex z-50 absolute left-full bottom-1 right-0 ${
                  activeTab === "content" && showSectionPopup ? "slideTop" : ""
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="overflow-y-scroll h-full w-[35%] bg-white p-2">
                  <input
                    type="search"
                    placeholder="Search"
                    className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 text-sm outline-none focus:border-slate-500 transition-all"
                  />
                  <h4 className="text-sm font-semibold text-gray-700 my-3"> Sections </h4>
                  <ul className="space-y-1">
                    {Object.keys(sectionComponents).map((sectionIdKey) => {
                      const sectionSchema = sectionComponents[sectionIdKey]?.schema;
                      if (!sectionSchema) return null;

                      return (
                        <li key={sectionIdKey}>
                          <button
                            onClick={() => handleAddSection(sectionIdKey)}
                            onMouseEnter={() => setHoveredSection(sectionIdKey)}
                            className="w-full text-left px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-gray-100 flex justify-start items-center cursor-pointer outline-none"
                          >
                            <span className="w-4 h-4 pt-0.5">
                              {sectionIcon(sectionIdKey)}
                            </span>
                            <div className="flex items-center justify-between w-full">
                              <span className="ml-2">
                                {formatSectionLabel( sectionSchema.name || sectionIdKey )}
                              </span>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="rounded-r-lg bg-gray-200 w-[65%] flex justify-center items-center px-4 overflow-y-auto h-full cursor-pointer">
                  {hoveredSection ? (
                    renderSectionPreview(
                      hoveredSection,
                      sectionComponents[hoveredSection]?.defaultContent,
                      "popup_view",
                      () => hoveredSection && handleAddSection(hoveredSection)
                    )
                  ) : (
                    <p className="text-gray-500"> Select or hover over a section to preview. </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="w-[75%] relative h-full p-2 flex justify-center rounded-lg overflow-hidden">
            {!isIframeLoaded && (
              <div className="absolute inset-0 flex flex-col z-10 gap-1 p-2">
                <div className="h-12 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-2/4 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="h-24 bg-gray-200 animate-pulse flex justify-between items-center px-4">
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
                <div className="h-96 relative bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-full h-full bg-gray-200 rounded flex flex-col items-center justify-center">
                    <div className="w-48 h-8 bg-gray-300 rounded mb-2"></div>
                    <div className="w-64 h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="w-32 h-10 bg-gray-300 rounded"></div>
                  </div>
                  <div className="absolute left-4 bg-gray-300 bg-opacity-50 p-4 rounded-full "></div>
                  <div className="absolute right-4 bg-gray-300 bg-opacity-50 p-4 rounded-full "></div>
                </div>
                <div className="h-80 bg-gray-200 animate-pulse flex">
                  <div className="w-1/2 h-full bg-gray-300"></div>
                  <div className="w-1/2 p-8 flex flex-col justify-center">
                    <div className="w-3/4 h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-32 h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`relative w-full h-full overflow-hidden ${ deviceMode === "mobile" || deviceMode === "tablet" ? "flex justify-center" : "" }`}
            >
              <iframe
                ref={iframeRef}
                src="/admin/page-preview"
                onLoad={() => setIsIframeLoaded(true)}
                style={{
                  width:
                    deviceMode === "mobile"
                      ? "375px"
                      : deviceMode === "tablet"
                      ? "768px"
                      : "100%",
                  height: deviceMode === "desktop" ? "100%" : "100%",
                }}
                className="border-none transition-all duration-500 ease-in-out"
                title="Responsive Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WebEditor;
