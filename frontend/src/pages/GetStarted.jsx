import React, { useEffect, useContext } from 'react';
import { Box, Typography, Grid2, Paper, Button } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import image from '../assets/petCat.png';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const stats = [
   {
      icon: <ShoppingCartIcon sx={{ fontSize: 60, color: '#ff9800' }} />,
      title: '10,000+ Items Sold Today',
      description: 'Join our growing marketplace of buyers and sellers.',
   },
   {
      icon: <PeopleIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
      title: '5 Million Happy Users',
      description: 'Trusted by millions around the globe.',
   },
   {
      icon: <EmojiEventsIcon sx={{ fontSize: 60, color: '#2196f3' }} />,
      title: 'Top-Rated Platform',
      description: 'Rated 4.8/5 by our satisfied customers.',
   },
];
   
const Statistics = () => (
   <div>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
         Why Choose Us?
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
         We're here to make buying and selling seamless and rewarding.
      </Typography>

      <Grid2 container spacing={4} justifyContent="center" sx={{ marginTop: 4 }}>
         {stats.map((stat, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={index}>
               <Paper
               elevation={3}
               sx={{
                  padding: 4,
                  textAlign: 'center',
                  borderRadius: 2,
                  '&:hover': { boxShadow: '0px 4px 20px rgba(0,0,0,0.2)' },
               }}
               >
               {stat.icon}
               <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, marginTop: 2 }}
               >
                  {stat.title}
               </Typography>
               <Typography variant="body2" color="textSecondary">
                  {stat.description}
               </Typography>
               </Paper>
            </Grid2>
         ))}
      </Grid2>
   </div>
)

const Main = () => {
   const { user, setUser } = useContext(UserDataContext);
   const navigate = useNavigate();

   useEffect(() => {
      if (user) {
         navigate("/home"); // no need to login or sign up again
      }
   }, [user]);

   return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <Grid2 container sx={{ padding: 4 }} spacing={4}>
            {/* Left Section (Text) */}
            <Grid2 item xs={12} md={6}>
               <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography 
                     variant="h2" 
                     gutterBottom 
                     sx={{
                        fontWeight: 700, 
                        color: '#333', 
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, 
                        lineHeight: 1.2
                     }}
                  >
                     Start buying and selling today.
                  </Typography>
                  <Typography 
                     variant="h6" 
                     sx={{ 
                        color: '#666', 
                        maxWidth: '600px', 
                        marginBottom: 3, 
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        lineHeight: 1.5
                     }}
                  >
                     A trusted platform where buyers and sellers thrive together. Explore a wide variety of products and get the best deals on the go.
                  </Typography>
                  <Link to="/signup" style={{ textDecoration: 'none' }}>
                     <Button 
                        variant="contained" 
                        color="primary" 
                        size="large" 
                        sx={{ 
                           padding: '12px 36px', 
                           fontSize: '16px', 
                           '&:hover': { backgroundColor: '#1976d2' } 
                        }}
                        >
                        Get Started
                     </Button>
                  </Link>
               </Box>
            </Grid2>
         <Grid2 item xs={12} md={6}>
            <Box 
               sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
               }}
            >
               <img 
                  src={image} 
                  alt="Trade Trail" 
                  style={{ 
                     maxWidth: '100%',  
                     maxHeight: '400px', 
                     objectFit: 'cover' 
                  }} 
               />
            </Box>
         </Grid2>
      </Grid2>
      </div>
   );
}


export default function GetStarted() {
   return (
      <>
         {/* <GetStartedNav /> */}
         <Main />
         <Box sx={{ padding: 4 }}>
            <Statistics />
         </Box>
      </>
   );
}
