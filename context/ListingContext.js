import React, { createContext, useState, useContext } from 'react';
import { mockListings } from '../data/mockData';

const ListingContext = createContext();

export const useListings = () => useContext(ListingContext);

export const ListingProvider = ({ children }) => {
  // Start with a mutable copy of mockListings
  const [listings, setListings] = useState([...mockListings]);

  const addListing = (newListing) => {
    setListings(prev => [...prev, newListing]);
  };

  const updateListing = (id, updatedFields) => {
    setListings(prev =>
      prev.map(l => (l.id === id ? { ...l, ...updatedFields } : l))
    );
  };

  return (
    <ListingContext.Provider value={{ listings, addListing, updateListing }}>
      {children}
    </ListingContext.Provider>
  );
};