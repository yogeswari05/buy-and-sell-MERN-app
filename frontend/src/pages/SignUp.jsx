import React, { useEffect } from 'react';
import { Box, Typography, Grid2, Button, TextField, Container, Paper } from '@mui/material';
import bgImage from '../assets/SignUpBackground.jpg';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import { Link, useNavigate } from "react-router-dom";


export default function SignUp() {
   const [firstname, setFirstname] = useState("");
   const [lastname, setLastname] = useState("");
   const [email, setEmail] = useState("");
   const [age, setAge] = useState(null);
   const [contactnumber, setContactnumber] = useState("");
   const [password, setPassword] = useState("");
   const [captcha, setCaptcha] = useState(null);
   const { user, setUser } = React.useContext(UserDataContext);

   const navigate = useNavigate();

   useEffect(() => {
      if(user) navigate('/home');
   }, [user]);

   function onChange(value) {
      setCaptcha(value);
      console.log("Captcha value:", value);
   }

   const notify = (message) => toast(message);

   const handleSubmit = async (event) => {
      event.preventDefault();
      if (!captcha) {
         notify("Please verify the captcha!");
         return;
      }

      if (!email.endsWith("@students.iiit.ac.in") && !email.endsWith("@research.iiit.ac.in") && !email.endsWith("@faculty.iiit.ac.in")) {
         notify("Only IIIT emails are allowed!");
         return;
      }

      if (contactnumber.length !== 10) {
         notify("Contact Number must be 10 digits!");
         return;
      }

      const newUser = {
         firstname: firstname,
         lastname: lastname,
         email: email,
         age: age,
         contactnumber: contactnumber,
         password: password,
      };
      console.log(newUser);
      try {
         const path = `${process.env.REACT_APP_BASE_URL}/user/register`;
         console.log(path);
         const response = await axios.post(path, newUser);
         if (response.status === 201) {
            const data = response.data;
            setUser(data.user);
            console.log("User set signup in signup: ", user);
            localStorage.setItem('token', data.token); 
            navigate('/home');
         } else {
            notify("Signup failed. Please try again");
            navigate('/signup');
         }
      } catch (err) {
         console.error("Error in SignUp: ", err);
         notify("Signup failed. Please try again");
      }

      setFirstname('');
      setLastname('');
      setEmail('');
      setAge(null);
      setContactnumber(null);
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
         <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1, mt: 1, mb: 1 }}>
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
                  Sign Up
               </Typography>
               <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField
                     margin="normal"
                     required
                     fullWidth
                     id="firstname"
                     label="First Name"
                     name="firstname"
                     autoComplete="given-name"
                     variant="outlined"
                     autoFocus
                     sx={{ mb: 1 }}
                     value={firstname}
                     onChange={(e) => setFirstname(e.target.value)}
                  />                  
                  <TextField
                     margin="normal"
                     required
                     fullWidth
                     id="lastname"
                     label="Last Name"
                     name="lastname"
                     autoComplete="family-name"
                     variant="outlined"
                     sx={{ mb: 1 }}
                     value={lastname}
                     onChange={(e) => setLastname(e.target.value)}
                  />
                  <TextField
                     margin="normal"
                     required
                     fullWidth
                     id="email"
                     label="Email Address (Only IIIT Mails)"
                     name="email"
                     autoComplete="email"
                     variant="outlined"
                     sx={{ mb: 1 }}
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                     margin="normal"
                     required
                     fullWidth
                     id="age"
                     label="Age"
                     name="age"
                     type="number"
                     variant="outlined"
                     sx={{ mb: 1 }}
                     value={age}
                     onChange={(e) => setAge(e.target.value)}
                  />
                  <TextField
                     margin="normal"
                     required
                     fullWidth
                     id="contactnumber"
                     label="Contact Number (10 Digits)"
                     name="contactnumber"
                     type="tel"
                     variant="outlined"
                     slotProps={{
                        input: {
                           pattern: '[0-9]{10}', 
                           maxLength: 10, 
                        }
                     }}
                     sx={{ mb: 1 }}
                     value={contactnumber}
                     onChange={(e) => setContactnumber(e.target.value)}
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
                  <ReCAPTCHA
                     sitekey='6Lf4L7gqAAAAAPcN5tVz7Eo3L1TDUU_uipI0M21E'
                     onChange={onChange}
                     required
                  />
                  <Button
                     type="submit"
                     fullWidth
                     variant="contained"
                     sx={{ mt: 1, mb: 1, backgroundColor: 'primary.main', ':hover': { backgroundColor: 'primary.dark' } }}
                  >
                     Sign Up
                  </Button>
                  <Grid2 container>
                     <Grid2 item xs>
                        <Link to='/login' variant="body2">
                           Already have an account? Sign In
                        </Link>
                     </Grid2>
                  </Grid2>
               </Box>
            </Paper>
         </Container>
      </>
   );
}
