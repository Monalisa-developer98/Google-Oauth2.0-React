import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ username: '', role: '', picture: '' });

  const baseUrl = 'http://localhost:9090/';
  const login = (userData) => {
    // setUser(userData);

    let pictureUrl = userData.picture;

    if (userData.picture && !userData.picture.startsWith('http')) {
      pictureUrl = `${baseUrl}${userData.picture.replace(/\\/g, '/')}`;
    }
  
    // console.log('User picture URL:', pictureUrl);
    setUser({ ...userData, picture: pictureUrl });
  };

  const logout = () => {
    setUser({ username: '', role: '', picture: '' });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);