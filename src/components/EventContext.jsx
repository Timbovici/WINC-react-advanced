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
        fetch('http://localhost:3000/events'),
        fetch('http://localhost:3000/categories'),
        fetch('http://localhost:3000/users')
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
      setTimeout(() => {
        setLoading(false);
      }, 800);
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