import { Box, Typography, Grid2, Button, TextField, Container, Paper } from '@mui/material';
import bgImage from '../assets/SignUpBackground.jpg';
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from '../context/UserContext';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("")
   const { user, setUser } = useContext(UserDataContext);

   const navigate = useNavigate();

   useEffect(() => {
      if (user) {
         navigate("/home");
      }
   }, [user]);

   const handleSubmit = async (event) => {
      event.preventDefault();
      try {
         const userData = { email: email, password: password };
         // console.log("userdata: ", userData);
   
         const path = `${process.env.REACT_APP_BASE_URL}/user/login`;
         const response = await axios.post(path, userData);
         if (response.status === 201) {
            const data = response.data;
            setUser(data.user);
            // console.log("User in signin after setuser: ", user);
            // console.log("Useremail in signin after setuser: ", user.email);
            if (data.user) {
               navigate("/home");
            }
            else {
               console.error("User data is missing from response ", data.error);
               toast.error("Something went wrong. Please try again later.");
            }
            localStorage.setItem("token", data.token);
            // console.log("set user in local storage in SIGNIN: ", data.user);
         }         
      } catch (err) {
         console.error("Error in SignIn: ", err);
         toast.error("Error in login, please try again later.");
      }
      setEmail("");
      setPassword("");
   };


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
         <Box
            sx={{
               backgroundImage: `url(${bgImage})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               filter: 'blur(4px)',
               position: 'absolute',
               top: 0, left: 0, right: 0, bottom: 0,
               zIndex: -1,
            }}
         />
         <Box
            sx={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               minHeight: '100vh',
               position: 'relative',
               zIndex: 1,
            }}
         >
            <Container component="main" maxWidth="xs">
               <Paper
                  elevation={10}
                  sx={{
                     position: 'relative',
                     padding: 4,
                     borderRadius: 3,
                     backgroundColor: 'rgba(255, 255, 255, 0.75)',
                     width: '100%',
                     maxWidth: '400px', 
                     margin: 'auto', 
                  }}
               >
                  <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 1 }}>
                     Log In
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                     <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        variant="outlined"
                        sx={{ mb: 1 }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                     <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        variant="outlined"
                        sx={{ mb: 1 }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                     <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, backgroundColor: 'primary.main', ':hover': { backgroundColor: 'primary.dark' } }}
                     >
                        Log In
                     </Button>
                     <Grid2 container>
                        <Grid2 item xs>
                           <Link to="/signup" variant="body2">
                              Don't have an account? Sign Up
                           </Link>
                        </Grid2>
                     </Grid2>
                  </Box>
               </Paper>
            </Container>
         </Box>
      </>
   );
}
