import React, { createContext, useState, useEffect, useCallback } from 'react';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventsRes, categoriesRes, usersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/events`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/users`)
      ]);

      const eventsData = await eventsRes.json();
      const categoriesData = await categoriesRes.json();
      const usersData = await usersRes.json();

      setEvents(eventsData);
      setCategories(categoriesData);
      setUsers(usersData);
    } catch (error) {
      console.error("Fout bij ophalen data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <EventContext.Provider value={{ events, categories, users, loading, fetchAllData }}>
      {children}
    </EventContext.Provider>
  );
};