import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
   const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
      const getUser = async () => {
         const token = localStorage.getItem('token');
         if (token) {
            try {
               const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/profile`, {
                  headers: {
                     Authorization: `Bearer ${token}`
                  },
               });
               setUser(response.data.user);
               setIsLoading(false);
            } catch (err) {
               console.error("Error in UserContext: ", err);
            }
         }
         else {
            setIsLoading(false);
         }
      };
      getUser();
   }, []);

   return (
      <UserDataContext.Provider value={{ user, setUser, isLoading }}>
         {children}
      </UserDataContext.Provider>
   );
};

export default UserContext;