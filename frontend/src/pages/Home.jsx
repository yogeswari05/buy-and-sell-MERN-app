import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import image from '../assets/dashboard.jpg'; 
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Home = () => {
   const navigate = useNavigate();

   return (
      <div>
         <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '80vh',
            padding: '2rem'
         }}>
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 } }}>
               <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Discover the best deals, buy and sell with ease!
               </Typography>
               <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 3 }}>
                  Our app helps you connect with buyers and sellers, offering a seamless experience for trading your items. Whether you want to sell something you no longer need or find your next great deal, we provide a user-friendly platform to make it happen.
               </Typography>
               
               <Box sx={{
                  display: 'flex', 
                  justifyContent: { xs: 'center', md: 'flex-start' }, 
                  gap: 2
               }}>
                  <Link to="/sell" >
                     <Button variant="contained" color="primary"
                        sx={{ 
                           width: '150px', 
                           backgroundColor: 'primary.main',
                           ':hover': { backgroundColor: 'primary.dark' }
                        }}
                     >
                        Sell
                     </Button>
                  </Link>
                  <Link to="/search" >
                     <Button variant="contained" color="secondary" sx={{ width: '150px', backgroundColor: 'secondary.main', ':hover': { backgroundColor: 'secondary.dark' } }}>
                        Buy
                     </Button>
                  </Link>
               </Box>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
               <img src={image} alt="Home" style={{ maxWidth: {xs: '80%', md: '70%'}, width: '100%', height: 'auto', borderRadius: '8px' }} />
            </Box>
         </Box>
      </div>
   );
};

export default Home;