"use client";
import { useState, useEffect } from 'react';
import { apiurl } from '../../../config/config.js';
import axios from 'axios';

export const useMenusApi = () => {
    const [menus, setMenus] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getMenus = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${apiurl}/webMenu/menu`);
            if (response.data?.success) {
                setMenus(response.data.data || []);
            }
        } catch (err) {
            setError(err);
            console.error("Error fetching menus:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const createMenu = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${apiurl}/webMenu/create_menu`, data);
            await getMenus();
            return response.data;
        } catch (err) {
            setError(err);
            console.error("Error creating menu:", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateMenu = async (menuId, data) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${apiurl}/webMenu/menu/${menuId}`, data);
            await getMenus();
            return response.data;
        } catch (err) {
            setError(err);
            console.error("Error updating menu:", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteMenu = async (menuId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.delete(`${apiurl}/webMenu/menu/${menuId}`);
            await getMenus();
            return response.data;
        } catch (err) {
            setError(err);
            console.error("Error deleting menu:", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        getMenus();
    }, []);

    return { menus, isLoading, error, createMenu, updateMenu, getMenus, deleteMenu };
};