"use client";
import React, { useState, useMemo } from "react";
// import Layout from "../../components/layout";
import { AiOutlineCheck, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoMdArrowRoundBack, IoIosArrowDown } from "react-icons/io";
import { RxCopy } from "react-icons/rx";
import { GoPlusCircle } from "react-icons/go";
import { MdDragIndicator } from "react-icons/md";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DynamicLoader } from "../../../components/loader";
import { useMenusApi } from "./useMenusApi";
import DeleteMenuItemModal from "./deleteMenuItemModal";
import DeleteMenuModal from "./deleteMenuModal";
import DuplicateMenuModal from "./duplicateMenuModal";

const createHandle = (name) => {
    if (!name) return "";
    let handle = name.toLowerCase().trim();

    handle = handle.replace(/[^a-z0-9\s]/g, ''); 
    handle = handle.replace(/\s+/g, '_');
    handle = handle.replace(/^_+|_+$/g, '');
    return handle;

};

const updateItemInTree = (items, id, updater) => {
    return items.map(item => {
        if (item.id === id) {
            return updater(item);
        }
        if (item.children && item.children.length > 0) {
            return {
                ...item,
                children: updateItemInTree(item.children, id, updater)
            };
        }
        return item;
    });
};

const findItemAndCountChildren = (items, id) => {
    let count = 0;
    let foundItem = null;

    const traverse = (currentItems) => {
        for (const item of currentItems) {
            if (item.id === id) {
                foundItem = item;
                count = 1;
                if (item.children) {
                    const countChildren = (children) => {
                        let total = 0;
                        children.forEach(child => {
                            total++;
                            if (child.children) {
                                total += countChildren(child.children);
                            }
                        });
                        return total;
                    };
                    count += countChildren(item.children);
                }
                return;
            }
            if (item.children) {
                traverse(item.children);
                if (foundItem) return;
            }
        }
    };
    traverse(items);
    return { foundItem, count };
};

const SortableItem = ({ item, handleItemChange, openDeleteModal, handleAddSubMenuItem, handleToggleEdit, handleToggleCollapse, depth = 0 }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginLeft: `${depth * 20}px`
    };

    return (
        <div ref={setNodeRef} style={style} className={`flex items-end gap-3 px-3 border border-gray-200 rounded-md shadow-sm ${item.isEditing ? 'bg-white py-2.5' : 'hover:bg-gray-50 py-0.5'} ${item.isExpanded && item.children.length > 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="flex items-center justify-center cursor-grab hover:bg-slate-100 p-1 mb-1 rounded-md text-slate-400 hover:text-slate-700">
                <MdDragIndicator size={24} {...attributes} {...listeners} className="outline-none" />
            </div>

            {item.isEditing ? (
                <>
                    <div className="w-full">
                        <label htmlFor={`item-name-${item.id}`} className="block text-sm font-medium text-gray-700"> Name </label>
                        <input
                            type="text"
                            id={`item-name-${item.id}`}
                            value={item.name}
                            onChange={(e) => handleItemChange(e, item.id, "name")}
                            placeholder="e.g., Contact Us"
                            className={`mt-1 block w-full px-3 py-1.5 border text-gray-900 rounded-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 ${item.nameError ? "border-red-500" : "border-gray-300"}`}
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor={`item-link-${item.id}`} className="block text-sm font-medium text-gray-700"> Link </label>
                        <input
                            type="text"
                            id={`item-link-${item.id}`}
                            value={item.link}
                            onChange={(e) => handleItemChange(e, item.id, "link")}
                            placeholder="e.g., /pages/contact"
                            className={`mt-1 block w-full px-3 py-1.5 text-gray-900 border rounded-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 ${item.linkError ? "border-red-500" : "border-gray-300"}`}
                        />
                    </div>
                </>
            ) : (
                <div onClick={() => handleToggleEdit(item.id, false)} className="w-full flex items-center gap-2 cursor-pointer p-2 rounded-md">
                    {item.children && item.children.length > 0 && (
                        <span onClick={(e) => { e.stopPropagation(); handleToggleCollapse(item.id); }}>
                            <IoIosArrowDown size={20} className={`text-gray-500 transition-all duration-700 ease-in-out ${item.isExpanded ? '-rotate-180' : 'rotate-0'}`} />
                        </span>
                    )}
                    <span className="text-gray-900 font-medium">{item.name}</span>
                </div>
            )}

            <div className="flex gap-2 pb-1.5">
                <GoPlusCircle onClick={() => handleAddSubMenuItem(item.id)} size={28} className="p-1 rounded-md text-slate-400 cursor-pointer hover:bg-slate-200 hover:text-slate-700 bg-slate-50 border border-slate-200" />
                {item.isEditing ? (
                    <AiOutlineCheck
                        onClick={() => handleToggleEdit(item.id, true)}
                        size={28}
                        className="p-1 rounded-md text-green-400 cursor-pointer hover:bg-green-400 hover:text-white bg-green-50 border border-green-200"
                    />
                ) : (
                    <AiOutlineEdit
                        onClick={() => handleToggleEdit(item.id, false)}
                        size={28}
                        className="p-1 rounded-md text-blue-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200"
                    />
                )}
                <AiOutlineDelete
                    onClick={() => openDeleteModal(item.id)}
                    size={28}
                    className="p-1 rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200"
                />
            </div>
        </div>
    );
};

const MenuTree = ({ items, handleItemChange, openDeleteModal, handleAddSubMenuItem, handleToggleEdit, handleToggleCollapse, depth = 0 }) => {
    return (
        <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
        >
            {items.map((item) => (
                <div key={item.id} className="space-y-2">
                    <SortableItem
                        item={item}
                        handleItemChange={handleItemChange}
                        openDeleteModal={openDeleteModal}
                        handleAddSubMenuItem={handleAddSubMenuItem}
                        handleToggleEdit={handleToggleEdit}
                        handleToggleCollapse={handleToggleCollapse}
                        depth={depth}
                    />
                    <div
                        className={`transition-all duration-700 ease-in-out overflow-hidden ${item.isExpanded ? "h-[90%] max-h-full" : "max-h-0"}`}
                    >
                        {item.children && item.children.length > 0 && (
                            <div className="mt-2 pl-6">
                                <MenuTree
                                    items={item.children}
                                    handleItemChange={handleItemChange}
                                    openDeleteModal={openDeleteModal}
                                    handleAddSubMenuItem={handleAddSubMenuItem}
                                    handleToggleEdit={handleToggleEdit}
                                    handleToggleCollapse={handleToggleCollapse}
                                    depth={depth + 1}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </SortableContext>
    );
};

const addUiProperties = (items) => {
    if (!items) return [];
    return items.map(item => ({
        ...item,
        isEditing: false,
        isExpanded: false,
        nameError: false,
        linkError: false,
        children: addUiProperties(item.children)
    }));
};

const Menus = () => {
    const { menus, isLoading, error, createMenu, updateMenu, deleteMenu } = useMenusApi();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newMenuName, setNewMenuName] = useState("");
    const [newMenuItems, setNewMenuItems] = useState([]);
    const [validationError, setValidationError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });
    const [editingMenuId, setEditingMenuId] = useState(null);
    const [editingMenuHandle, setEditingMenuHandle] = useState("");
    const [editingMenuTitle, setEditingMenuTitle] = useState("");
    const [showFullMenuDeleteModal, setShowFullMenuDeleteModal] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc'); 
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [saveOperation, setSaveOperation] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleSort = () => {
        setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
    };

    const sortedMenus = useMemo(() => {
        if (!menus) return [];

        const sortableMenus = [...menus];
        sortableMenus.sort((a, b) => {
            const aValue = a.title || '';
            const bValue = b.title || '';
            return sortDirection === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        return sortableMenus;
    }, [menus, sortDirection]);

    const handleNameChange = (e) => {
        const name = e.target.value;
        setNewMenuName(name);
        if (name.trim() !== "") {
            setValidationError("");
        }
    };

    const handleCreateMenuClick = () => {
        setEditingMenuId(null);
        setNewMenuName("");
        setNewMenuItems([]);
        setValidationError("");
        setShowCreateForm(true);
        setEditingMenuHandle("");
        setEditingMenuTitle("");
    };

    const handleCancelClick = () => {
        setShowCreateForm(false);
        setEditingMenuId(null);
        setEditingMenuHandle("");
        setEditingMenuTitle("");
        setFeedbackMessage({ type: '', text: '' }); 
    };

    const handleEditClick = (menu) => {
        if (!menu || !menu._id) {
            setFeedbackMessage({
                type: 'error',
                text: 'Cannot edit menu: Menu ID is missing.'
            });
            console.error("Error: Attempted to edit a menu item without a valid ID.", menu);
            return;
        }
        setEditingMenuId(menu._id);
        setNewMenuName(menu.title);
        setNewMenuItems(addUiProperties(menu.menuItems));
        setShowCreateForm(true);
        setEditingMenuHandle(menu.handle);
        setEditingMenuTitle(menu.title);
        setFeedbackMessage({ type: '', text: '' }); 
    };

    const generateUniqueId = (prefix) => {
        return `${prefix}_${Math.random().toString(36).substring(2, 8)}`;
    };

    const handleAddMenuItem = () => {
        if (newMenuName.trim() === "") {
            setValidationError("Name is required.");
            return;
        }
        setValidationError("");

        setNewMenuItems((prevItems) => [
            ...prevItems,
            {
                id: generateUniqueId("menu_item"),
                name: "",
                link: "",
                children: [],
                isEditing: true,
                isExpanded: true
            },
        ]);
    };

    const handleAddSubMenuItem = (parentId) => {
        setNewMenuItems(prevItems => {
            const newItem = {
                id: generateUniqueId("submenu_item"),
                name: "",
                link: "",
                children: [],
                isEditing: true,
                isExpanded: true
            };

            const updateItemInTree = (items) => {
                return items.map(item => {
                    if (item.id === parentId) {
                        return { ...item, children: [...(item.children || []), newItem], isExpanded: true };
                    }
                    if (item.children && item.children.length > 0) {
                        return { ...item, children: updateItemInTree(item.children) };
                    }
                    return item;
                });
            };

            return updateItemInTree(prevItems);
        });
    };

    const handleItemChange = (e, id, field) => {
        const { value } = e.target;
        setNewMenuItems(prevItems => updateItemInTree(prevItems, id, item => ({ ...item, [field]: value })));
    };

    const handleToggleEdit = (id, isSaveAttempt) => {
        setNewMenuItems(prevItems => {
            return updateItemInTree(prevItems, id, item => {
                if (isSaveAttempt) {
                    const nameValid = item.name && item.name.trim() !== "";
                    const linkValid = item.link && item.link.trim() !== "";

                    if (!nameValid || !linkValid) {
                        return { ...item, isEditing: true, nameError: !nameValid, linkError: !linkValid };
                    }
                    return { ...item, isEditing: false, nameError: false, linkError: false };
                }
                return { ...item, isEditing: true };
            });
        });
    };

    const handleToggleCollapse = (id) => {
        setNewMenuItems(prevItems => {
            return updateItemInTree(prevItems, id, item => ({
                ...item,
                isExpanded: !item.isExpanded,
            }));
        });
    };

    const openDeleteModal = (id) => {
        const { foundItem, count } = findItemAndCountChildren(newMenuItems, id);
        if (foundItem) {
            setItemToDelete({ ...foundItem, count });
            setShowDeleteModal(true);
        }
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const confirmDeleteItem = () => {
        if (itemToDelete) {
            const removeItems = (items) => {
                return items.filter((item) => {
                    if (item.id === itemToDelete.id) {
                        return false;
                    }
                    if (item.children && item.children.length > 0) {
                        item.children = removeItems(item.children);
                    }
                    return true;
                });
            };
            setNewMenuItems(removeItems(newMenuItems));
            closeDeleteModal();
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        setNewMenuItems(prevItems => {
            const updateTree = (items) => {
                const activeIndex = items.findIndex(item => item.id === active.id);
                const overIndex = items.findIndex(item => item.id === over.id);

                if (activeIndex !== -1 && overIndex !== -1) {
                    return arrayMove(items, activeIndex, overIndex);
                }

                return items.map(item => {
                    if (item.children && item.children.length > 0) {
                        const updatedChildren = updateTree(item.children);
                        if (updatedChildren !== item.children) {
                            return { ...item, children: updatedChildren };
                        }
                    }
                    return item;
                });
            };

            return updateTree(prevItems);
        });
    };

    const cleanMenuItems = (items) => {
        return items.map(item => {
            const cleanedItem = {
                id: item.id,
                name: item.name,
                link: item.link,
                children: [],
            };

            if (item.children && item.children.length > 0) {
                cleanedItem.children = cleanMenuItems(item.children);
            }

            return cleanedItem;
        });
    };

    const recursivelyAssignNewIds = (items, prefix = "menu_item") => {
        return items.map(item => {
            const newItem = {
                ...item,
                id: `${prefix}_${Math.random().toString(36).substring(2, 8)}`,
                isEditing: false,
                isExpanded: false,
                nameError: false,
                linkError: false,
            };

            if (item.children && item.children.length > 0) {
                newItem.children = recursivelyAssignNewIds(item.children, prefix);
            }

            return newItem;
        });
    };

    const handleSaveMenu = async () => {
        setFeedbackMessage({ type: '', text: '' });

        if (newMenuName.trim() === "") {
            setValidationError("Menu name is required.");
            return;
        }

        let hasErrors = false;

        const validateAndSetExpanded = (items) => {
            return items.map(item => {
                const nameValid = item.name && item.name.trim() !== "";
                const linkValid = item.link && item.link.trim() !== "";

                let shouldExpand = false;
                let updatedChildren = item.children;

                if (item.children && item.children.length > 0) {
                    updatedChildren = validateAndSetExpanded(item.children);
                    shouldExpand = updatedChildren.some(child => child.isExpanded);
                }

                const hasDirectError = !nameValid || !linkValid;

                if (hasDirectError) {
                    hasErrors = true;
                    shouldExpand = true;
                }

                return {
                    ...item,
                    isEditing: hasDirectError,
                    nameError: !nameValid,
                    linkError: !linkValid,
                    isExpanded: shouldExpand,
                    children: updatedChildren
                };
            });
        };

        const updatedMenuItems = validateAndSetExpanded(newMenuItems);
        setNewMenuItems(updatedMenuItems);

        if (hasErrors) {
            setFeedbackMessage({ type: 'error', text: 'Please fix the highlighted errors before saving.' });
            return;
        }

        const operationType = editingMenuId ? 'update' : 'create';
        setSaveOperation(operationType);
        setIsSaving(true);

        const dataToSend = {
            title: newMenuName,
            handle: editingMenuId ? editingMenuHandle : createHandle(newMenuName),
            menuItems: cleanMenuItems(updatedMenuItems)
        };

        try {
            if (editingMenuId) {
                await updateMenu(editingMenuId, dataToSend);
                setFeedbackMessage({ type: 'success', text: 'Menu updated successfully!' });
            } else {
                await createMenu(dataToSend);
                setFeedbackMessage({ type: 'success', text: 'Menu created successfully!' });
            }
            setShowCreateForm(false);
            setEditingMenuId(null);
            setEditingMenuHandle("");
            setEditingMenuTitle("");
        } catch (error) {
            let errorMessage = 'An unexpected error occurred.';
            if (error.response) {
                errorMessage = error.response.data.message || `Server responded with status: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No response received from server. Please check your network connection.';
            } else {
                errorMessage = error.message;
            }
            setFeedbackMessage({ type: 'error', text: `Error: ${errorMessage}` });
        } finally {
            setIsSaving(false);
            setSaveOperation('');
        }
    };

    const handleDuplicateMenuClick = () => {
        if (editingMenuTitle) { setShowDuplicateModal(true); }
    };

    const closeDuplicateModal = () => { setShowDuplicateModal(false); };

    const confirmDuplicateMenu = async (newTitle, newHandle) => {
        closeDuplicateModal();
        setFeedbackMessage({ type: '', text: '' });
        setSaveOperation('duplicate');
        setIsSaving(true);

        const itemsWithNewIds = recursivelyAssignNewIds(newMenuItems, "dup_item");
        const cleanItems = cleanMenuItems(itemsWithNewIds);

        const dataToSend = {
            title: newTitle,
            handle: newHandle,
            menuItems: cleanItems
        };

        try {
            await createMenu(dataToSend);
            setFeedbackMessage({ type: 'success', text: `Menu "${newTitle}" duplicated successfully!` });

            setShowCreateForm(false);
            setEditingMenuId(null);
            setEditingMenuHandle("");
            setEditingMenuTitle("");
        } catch (error) {
            let errorMessage = 'An unexpected error occurred during duplication.';
            if (error.response) {
                errorMessage = error.response.data.message || `Server responded with status: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No response received from server. Please check your network connection.';
            } else {
                errorMessage = error.message;
            }
            setFeedbackMessage({ type: 'error', text: `Duplication Error: ${errorMessage}` });
        } finally {
            setIsSaving(false);
            setSaveOperation('');
        }
    };

    const openFullMenuDeleteModal = (menu) => {
        setMenuToDelete(menu);
        setShowFullMenuDeleteModal(true);
    };

    const closeFullMenuDeleteModal = () => {
        setShowFullMenuDeleteModal(false);
        setMenuToDelete(null);
    };

    const confirmDeleteMenu = async () => {
        closeFullMenuDeleteModal();
        if (menuToDelete) {
            setSaveOperation('delete');
            setIsSaving(true);
            setFeedbackMessage({ type: '', text: '' });
            try {
                await deleteMenu(menuToDelete._id);
                setFeedbackMessage({ type: 'success', text: 'Menu deleted successfully!' });
            } catch (error) {
                let errorMessage = 'An unexpected error occurred.';
                if (error.response) {
                    errorMessage = error.response.data.message || `Server responded with status: ${error.response.status}`;
                } else if (error.request) {
                    errorMessage = 'No response received from server. Please check your network connection.';
                } else {
                    errorMessage = error.message;
                }
                setFeedbackMessage({ type: 'error', text: `Error: ${errorMessage}` });
            } finally {
                setIsSaving(false);
                setSaveOperation('');
            }
        }
    };

    return (
        <>
            <div className="bg-white/100 relative rounded-2xl p-4 h-full">
                {(isLoading || isSaving) && (
                    <DynamicLoader 
                        maintext={
                            isSaving 
                                ? (saveOperation === 'create' ? "Creating Menu..." :
                                saveOperation === 'update' ? "Updating Menu..." :
                                saveOperation === 'delete' ? "Deleting Menu..." :
                                saveOperation === 'duplicate' ? "Duplicating Menu..." :
                                "Saving Menu...") 
                                : "Loading Menus..."
                        } 
                        subtext="" 
                    />
                )}
                <div className={`flex ${showCreateForm ? "justify-between" : "justify-between"} items-center`}>
                    {showCreateForm ? (
                        <div className="flex items-center justify-center gap-5">
                            <div onClick={handleCancelClick} className="flex items-center justify-center border border-slate-300 rounded-md w-8 h-8 cursor-pointer" >
                                <IoMdArrowRoundBack className="text-slate-500" />
                            </div>
                            <h1 className="text-2xl text-slate-500 font-bold m-0"> {editingMenuId ? "Edit Menu" : "Add Menu"} </h1>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl text-slate-500 font-bold m-0">Menus</h1>
                            <button onClick={handleCreateMenuClick} className="px-4 py-2 text-base bg-orange-500 text-white border-0 rounded-md cursor-pointer hover:bg-orange-600 transition-colors duration-200" > Create Menu </button>
                        </>
                    )}
                    {showCreateForm && editingMenuId && (
                        <button 
                            onClick={handleDuplicateMenuClick} 
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 text-base bg-orange-500 text-white border-0 rounded-md cursor-pointer hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                        > 
                            <RxCopy size={18} /> Duplicate
                        </button>
                    )}
                </div>

                {showCreateForm ? (
                    <div className="mt-5 p-6 pt-1 bg-gray-50 rounded-lg shadow-inner overflow-y-auto h-[90%]">
                        <h2 className="text-lg font-bold text-gray-700 mb-4">{editingMenuId ? editingMenuTitle : 'New Menu'}</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-full relative">
                                <label htmlFor="menu-name" className="flex items-center" >
                                    <span className="text-sm font-medium text-gray-700">Name</span>
                                    {validationError && (
                                        <span className="absolute right-1 text-red-500 text-sm mt-1"> {validationError} </span>
                                    )}
                                </label>
                                <input type="text" id="menu-name" value={newMenuName} onChange={handleNameChange} placeholder="e.g., Header menu" className={`mt-1 block w-full px-3 py-1.5 bg-white border text-gray-900 ${validationError ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500`} />
                            </div>
                            <div className="w-full">
                                <label htmlFor="menu-handle" className="block text-sm font-medium text-gray-700" > Handle </label>
                                <input type="text" id="menu-handle" value={editingMenuId ? editingMenuHandle : createHandle(newMenuName)} readOnly disabled className="mt-1 block w-full px-3 py-1.5 bg-gray-50 border text-gray-900 border-gray-300 rounded-md shadow-sm cursor-not-allowed focus:outline-none focus:ring-slate-400 focus:border-slate-400" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <h2 className={`text-lg font-bold text-gray-700 mb-4`}> Menu Items </h2>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <div className="mx-auto space-y-1.5">
                                    <MenuTree items={newMenuItems} handleItemChange={handleItemChange} openDeleteModal={openDeleteModal} handleAddSubMenuItem={handleAddSubMenuItem} handleToggleEdit={handleToggleEdit} handleToggleCollapse={handleToggleCollapse} />
                                </div>
                            </DndContext>
                            <button
                                onClick={handleAddMenuItem}
                                className={`flex items-center justify-center gap-2 w-full px-4 py-2 text-base text-blue-700 bg-white border border-gray-300 rounded-md cursor-pointer hover:text-orange-600 hover:border-orange-600 transition-colors duration-200 ${newMenuItems.length === 0 ? "mt-0" : "mt-3"} outline-none`}
                            >
                                <GoPlusCircle /> <span>Add menu item</span>
                            </button>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={handleCancelClick} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 outline-none cursor-pointer" > Cancel </button>
                            <button onClick={handleSaveMenu} className="px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-md shadow-sm hover:bg-orange-700 outline-none cursor-pointer" disabled={isSaving}>{editingMenuId ? 'Update' : 'Save'}</button>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-y-auto shadow-md sm:rounded-lg mt-5 h-[90%]">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">SN.</th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={handleSort}>
                                        <div className="flex items-center gap-1">
                                            <span>Menu</span>
                                            <span className="text-gray-900">
                                                {sortDirection === 'asc' ? '▲' : '▼'}
                                            </span>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">Menu Items</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMenus.length > 0 ? (
                                    sortedMenus.map((menu, index) => (
                                        <tr key={menu.handle} className="bg-white border-b border-gray-200 cursor-pointer hover:bg-slate-100" >
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">{menu?.title}</td>
                                            <td className="px-6 py-4">
                                                {menu.menuItems.map((item, index) => (
                                                    <span key={item.id}>
                                                        {item?.name}
                                                        {index < menu?.menuItems?.length - 1 && ", "}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 text-2xl">
                                                    <AiOutlineEdit onClick={() => handleEditClick(menu)} className="p-1 rounded-md text-blue-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200" />
                                                    <AiOutlineDelete onClick={() => openFullMenuDeleteModal(menu)} className="p-1 rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-gray-500">
                                            No menus found. Click &quot;Create Menu&quot; to add one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <DeleteMenuItemModal
                show={showDeleteModal}
                itemToDelete={itemToDelete}
                onConfirm={confirmDeleteItem}
                onCancel={closeDeleteModal}
            />

            <DeleteMenuModal
                show={showFullMenuDeleteModal}
                menuToDelete={menuToDelete}
                onConfirm={confirmDeleteMenu}
                onCancel={closeFullMenuDeleteModal}
            />
            
            <DuplicateMenuModal
                show={showDuplicateModal}
                menuTitle={editingMenuTitle}
                onConfirm={confirmDuplicateMenu}
                onCancel={closeDuplicateModal}
                createHandle={createHandle}
            />

        
        </>
    );
};

export default Menus;