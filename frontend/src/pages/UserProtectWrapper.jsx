import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProtectWrapper = ({ children }) => {
   const token = localStorage.getItem('token');
   const navigate = useNavigate();
   const { user, setUser } = useContext(UserDataContext);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (!token) {
         navigate('/login');
         return;
      }
      const path = `${process.env.REACT_APP_BASE_URL}/user/profile`;
      axios.get(path, {
         headers: {
            Authorization: `Bearer ${token}`
         }
      }).then(response => {
         if (response.status === 200) {
            // console.log(response.data.user);
            setUser(response.data.user);
            // console.log("User is set in UserProtectWrapper: ", user);
            setIsLoading(false)
         }
      }).catch((err) => { 
         console.log("Error in UserProtectWrapper: ", err);
         localStorage.removeItem('token')
         navigate('/login')
      })
   }, [token, navigate]);

   if (isLoading) {
      return <div>Loading...</div>;
   }

   return (
      <>
         {children}
      </>
   );
};

export default UserProtectWrapper;