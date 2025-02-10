import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserLogOut = () => {
   const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem('token');
      console.log("Token in UserLogOut: ", token); 

      const logout = async () => {
         try {
            const path = `${process.env.REACT_APP_BASE_URL}/user/logout`; 
            const response = await axios.get(path, {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            });
            if (response.status === 200) {
               localStorage.removeItem('token');
               console.log("REMOVED user in local storage inside logout: ", user);
               console.log("removed token");
               navigate('/');
            }
         }
         catch (error) {
            console.error("Error during logout: ", error); 
            toast.error("Error during logout, please try again later.");
         }
      };
      logout();
   }, [navigate]);

   return (
      <div>UserLogOut</div>
   )
}

export default UserLogOut