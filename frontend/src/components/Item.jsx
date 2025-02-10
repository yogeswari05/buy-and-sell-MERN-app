import React, { useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import { UserDataContext } from '../context/UserContext';
import { useContext } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Item = ({itemid, name, description, price, category, seller, removeItemFromList }) => {
   const { user } = useContext(UserDataContext);
   const token = localStorage.getItem('token');
   // console.log("user in Item: ", user);
   // console.log("userEmail in Item: ", user);

   const addToCart = async () => {
      try {
         const path = `${process.env.REACT_APP_BASE_URL}/user/additemtocart`;
         console.log("token in item: ", token);
         const response = await axios.post(path, null, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
            params: {
               itemid: itemid,
               email: user.email,
            },
         });
         if (response.status === 200) {
            console.log('Item added to cart:', response);
            toast.success('Item added to cart');
            removeItemFromList(itemid); // Remove item from the list
         }
         console.log(response);
      } catch (error) {
         console.error('Error adding item to cart:', error);
         toast.error('Error adding item to cart');
      }
   }

   return (
      <>
         <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
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
               padding: '10px', // Added padding for spacing
            }}
         >
            <CardContent>
               <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                  {name}
               </Typography>

               <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, textAlign: 'center' }}>
                  {description}
               </Typography>

               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                     ${price}
                  </Typography>
                  <Button variant="contained" color="primary" onClick={addToCart}>
                     Add to Cart
                  </Button>
               </Box>

               <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Category:</strong> {category}
               </Typography>

               <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Seller:</strong> {seller}
               </Typography>

               <Link to="/item-details">
               <Box sx={{ textAlign: 'center' }}>
                  <Button variant="text" color="primary"> 
                        <Link to={`/item-details/${itemid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                           View Details
                        </Link>
                  </Button>
                  </Box>
               </Link>
            </CardContent>
         </Card>
      </>
   );
}

export default Item;