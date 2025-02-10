import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const Sell = () => {
   const categories = [
      { category: "Automobile" },
      { category: "Books" },
      { category: "Clothing" },
      { category: "Electronics" },
      { category: "Fashion" },
      { category: "Furniture" },
      { category: "Gadgets" },
      { category: "Medical" },
      { category: "Photography" },
      { category: "Sports" },
      { category: "Wearables" },
   ];

   const [itemName, setItemName] = useState('');
   const [itemDescription, setItemDescription] = useState('');
   const [itemPrice, setItemPrice] = useState('');
   const [category, setCategory] = useState('');
   const { user } = useContext(UserDataContext);
   // console.log(user);
   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!itemName || !itemDescription || !itemPrice || !category) {
         toast.error("All fields are required!");
         return;
      }
      if (isNaN(itemPrice) || parseFloat(itemPrice) <= 0) {
         toast.error("Please enter a valid cost!");
         return;
      }

      const newItem = {
         name: itemName,
         description: itemDescription,
         price: parseFloat(itemPrice),
         category: category,
         sellerid: user._id,
      };

      try {
         const path = `${process.env.REACT_APP_BASE_URL}/item/insert`;
         const response = await axios.post(path, newItem);
         if (response.status === 201) {
            toast.success(`Item "${itemName}" under ${category} is now listed for sale at $${itemPrice}!`);
            setItemName('');
            setItemDescription('');
            setItemPrice('');
            setCategory('');
         }
      }
      catch (error) {
         toast.error("Failed to list the item for sale. Please try again.");
      }
   };

   return (
      <>
      <Container component="main" maxWidth="md" sx={{ mt: 5 }}>
         <ToastContainer
         position="top-right"
         autoClose={3000}
         hideProgressBar={false}
         newestOnTop={false}
         closeOnClick
         pauseOnFocusLoss
         draggable
         pauseOnHover
         theme="light"
         />
         <Paper
            elevation={10}
            sx={{
               padding: 4,
               borderRadius: 3,
               backgroundColor: 'rgba(255, 255, 255, 0.85)',
               boxShadow: 4,
               textAlign: 'center',
               transition: 'all 0.3s ease',
               '&:hover': {
                  boxShadow: 12,
                  transform: 'translateY(-5px)',
               },
            }}
         >
         <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
            Got Something to Sell? Let's Make It Happen!
         </Typography>

         <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               gap: 2,
            }}
         >
            <TextField
               label="Item Name"
               variant="outlined"
               fullWidth
               value={itemName}
               onChange={(e) => setItemName(e.target.value)}
               sx={{ mb: 2 }}
            />
            <TextField
               label="Item Description"
               variant="outlined"
               fullWidth
               multiline
               rows={4}
               value={itemDescription}
               onChange={(e) => setItemDescription(e.target.value)}
               sx={{ mb: 2 }}
            />
            <TextField
               label="Item Cost"
               variant="outlined"
               fullWidth
               type="number"
               value={itemPrice}
               onChange={(e) => setItemPrice(e.target.value)}
               sx={{ mb: 3 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
               <InputLabel>Category</InputLabel>
               <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
               >
                  {categories.map((item) => (
                     <MenuItem key={item.category} value={item.category}>
                        {item.category}
                     </MenuItem>
                  ))}
               </Select>
            </FormControl>
            <Button
               type="submit"
               variant="contained"
               color="primary"
               sx={{
                  padding: '10px 20px', fontWeight: 'bold',
                  borderRadius: 2,
                  boxShadow: 2,
                  '&:hover': {
                  boxShadow: 5,
                  transform: 'scale(1.05)',
                  },
               }}
            >
               List Item for Sale
            </Button>
         </Box>
         </Paper>
         </Container>
      </>
   );
};

export default Sell;
