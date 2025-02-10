import React, { useEffect, useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import image from '../assets/dashboard.jpg'; // Replace with your image
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ItemDetails = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [item, setItem] = useState(null);

   useEffect(() => {
      const itemDetails = async () => {
         try {
            const path = `${process.env.REACT_APP_BASE_URL}/item/${id}`;
            const response = await axios.get(path);
            if (response.status === 200) {
               setItem(response.data.item);
               console.log("Item details: ", response.data.item);
            }
         } catch (err) {
            console.error("Error in fetching item details: ", err);
            toast.error("Error in fetching item details, please try again later.");
         }
      };
      itemDetails();
   }, [id]);

   if (!item) {
      console.log("Item not found");
      return <div>Loading...</div>;
   } 

   return (
      <Container>
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
         <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '60vh',
            overflow: 'hidden',
            width: '100%',
            padding: '2rem',
            boxSizing: 'border-box'
         }}>
            <Box sx={{
               flex: 1,
               display: 'flex',
               justifyContent: 'center',
               overflow: 'hidden',
            }}>
               <img 
                  src={image} 
                  alt="Product" 
                  style={{ 
                     width: '75%', 
                     height: 'auto', 
                     borderRadius: '8px' 
                  }} 
                  sx={{maxWidth: {xs: '80%', md: '60%', lg: '50%'}}}
               />
            </Box>

            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 }, overflow: 'hidden' }}>
               <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {item.name}
               </Typography>
               
               <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 2 }}>
                  {item.description}
               </Typography>
               
               <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Price: ${item.price}
               </Typography>

               <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Seller:</strong> {item.sellerid.firstname + ' ' + item.sellerid.lastname}
               </Typography>

               <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Category:</strong> {item.category}
               </Typography>

               <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => navigate('/search')}
                  sx={{ mb: 2, display: 'block' }}
               >
                  Go back
               </Button>
            </Box>
         </Box>
      </Container>
   );
};

export default ItemDetails;
