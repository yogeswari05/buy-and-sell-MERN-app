import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartItem = ({ itemid, name, description, price, category, seller, setCartItems }) => {
   const { user } = useContext(UserDataContext);
   const notify = (message) => toast.error(message);
   const removeItem = async () => {
      try {
         const token = localStorage.getItem('token');
         const path = `${process.env.REACT_APP_BASE_URL}/user/removeitemfromcart/${itemid}`;
         const response = await axios.delete(path, {
            headers: {
               Authorization: `Bearer ${token}`
            },
            data: {
               userid: user._id,
            },
         });
         if (response.status === 200) {
            setCartItems(cartItems => cartItems.filter((item) => item._id !== itemid));
            // setAvailableItems(prevItems => [...prevItems, { _id: itemid, name, description, price, category, seller }]); // Re-add item to available items
            notify("Item removed from cart!");
         }
      } catch (err) {
         console.error("Error in removing item from cart: ", err);
         notify("Error in removing item from cart, please try again later.");
      }
   }
   return (
      <>
         <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
         />
         <Card
            sx={{
               maxWidth: 345,
               borderRadius: 3,
               boxShadow: 3,
               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
               '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
               },
               padding: '10px', 
            }}
         >
            <CardContent>
               <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                  {name}
               </Typography>

               <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, textAlign: 'center' }}>
                  {description}
               </Typography>

               <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ${price}
               </Typography>

               <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Category:</strong> {category}
               </Typography>

               <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Seller:</strong> {seller}
               </Typography>

               <Box sx={{ textAlign: 'center' }}>
                  <Button variant="text" color="primary">
                     More Details
                  </Button>
                  <Button variant="text" color="error" onClick={removeItem}>
                     Remove
                  </Button>
               </Box>
            </CardContent>
         </Card>
      </>
   );
}

export default CartItem;