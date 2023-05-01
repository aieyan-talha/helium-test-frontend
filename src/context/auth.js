/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from "react";

const defaultValues = {
  id: "",
};

export const AuthContext = createContext(defaultValues);

export const AuthContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (userData) {
      setIsAuthenticated(true);
    }
  }, [userData?.id]);

  return (
    <AuthContext.Provider value={{ userData, setUserData, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
