import React, { createContext, useState } from 'react';

export const AuthContext = createContext({ isAuth: false, login: () => {} });

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginHandler = () => setIsAuthenticated(true);

  return (
    <AuthContext.Provider
      value={{ login: loginHandler, isAuth: isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
