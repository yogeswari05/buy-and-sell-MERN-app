import React, { useContext, useState, useEffect } from 'react'
import { UserDataContext } from '../context/UserContext'
import { Container, Paper, Typography, Grid2, TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
   const { user, setUser } = useContext(UserDataContext)
   // console.log("User in Profile: ", user)
   const [isEditMode, setIsEditMode] = useState(false);
   const [updatedUser, setUpdatedUser] = useState(user);
   const [reviews, setReviews] = useState([]);

   const editUserProfile = (e) => {
      const { name, value } = e.target;
      setUpdatedUser(prevState => ({
         ...prevState,
         [name]: value
      }));
   }

   const handleSave = async (e) => {
      // console.log("Edit user, updatedUser: ", updatedUser);
      e.preventDefault();
      try {
         const path = `${process.env.REACT_APP_BASE_URL}/user/editProfile`
         // console.log(path);
         const response = await axios.post(path, null, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
               userid: user._id,
               firstname: updatedUser.firstname,
               lastname: updatedUser.lastname,
               email: updatedUser.email,
               age: updatedUser.age,
               contactnumber: updatedUser.contactnumber,
               password: updatedUser.password
            },
         });

         if (response.status === 200) {
            const data = response.data;
            // console.log("Edited profile successfully! ", data);
            setUser(data.user);
         }
      } catch (err) {
         console.error("Error in Profile: ", err);
         toast.error("Error updating profile, please try again later.");
      }
      setIsEditMode(false);
   }

   useEffect(() => {
      if (user && !isEditMode ) {
         const fetchReviews = async () => {
            try {
               const path = `${process.env.REACT_APP_BASE_URL}/reviews/get`;
               const response = await axios.get(path, {
                  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                  params: { sellerid: user._id },
               });
               setReviews(response.data.reviews);
            } catch (error) {
               console.error("Error fetching reviews:", error);
               toast.error("Error fetching reviews, please try again later.");
            }
         };
         fetchReviews();
      }
   }, [isEditMode, user._id]);

   return (
      <>
         <Container maxWidth="sm">
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
            <Paper elevation={4} style={{ padding: '30px', marginTop: '40px', borderRadius: '15px' }}>
               <Typography variant='h4' align='center' gutterBottom>
                  {isEditMode ? 'Edit Profile' : 'My Profile'}
               </Typography>
               <Grid2 container alignItems="center" spacing={2}>
                     {isEditMode ? (
                     <>
                        <Grid2 item xs={12} sm={6}>
                           <TextField
                              fullWidth
                              label="First Name"
                              variant="outlined"
                              name='firstname'
                              value={updatedUser.firstname}
                              onChange={editUserProfile}
                           />
                        </Grid2>
                        <Grid2 item xs={12} sm={6}>
                           <TextField
                              fullWidth
                              label="Last Name"
                              variant="outlined"
                              name='lastname'
                              value={updatedUser.lastname}
                              onChange={editUserProfile}
                           />
                        </Grid2>
                        <Grid2 item xs={12}>
                           <TextField
                              fullWidth
                              label="Email"
                              variant="outlined"
                              name='email'
                              value={updatedUser.email}
                              // onChange={editUserProfile}
                              disabled
                           />
                        </Grid2>
                        <Grid2 item xs={12} sm={6}>
                           <TextField
                              fullWidth
                              label="Age"
                              variant="outlined"
                              name='age'
                              type='number'
                              value={updatedUser.age}
                              onChange={editUserProfile}
                           />
                        </Grid2>
                        <Grid2 item xs={12} sm={6}>
                           <TextField
                              fullWidth
                              label="Contact Number"
                              variant="outlined"
                              name='contactnumber'
                              value={updatedUser.contactnumber}
                              onChange={editUserProfile}
                           />
                        </Grid2>
                        <Grid2 item xs={12} container  justifyContent="center" spacing={2}>
                        <Grid2 item>
                           <Button variant="contained" color="primary" onClick={handleSave}>
                              Save
                           </Button>
                        </Grid2>
                        <Grid2 item>
                           <Button variant="outlined" color="secondary" onClick={() => setIsEditMode(false)}>
                              Cancel
                           </Button>
                        </Grid2>
                     </Grid2>
                     </>
                     ) : (
                        <>
                           <Grid2 item xs={12} container direction="column" alignItems="center">
                           <Typography
                              variant="h4"
                           >
                              {user.firstname} {user.lastname}
                              </Typography>
                           </Grid2>
                           <Grid2 item xs={12} >
                           <Typography
                              variant="body1">
                              <strong>Email:</strong> {user.email}
                           </Typography>
                           <Typography
                              variant="body1">
                              <strong>Age:</strong> {user.age}
                           </Typography>
                           <Typography
                              variant="body1">
                              <strong>Contact Number:</strong> {user.contactnumber}
                              </Typography>
                           </Grid2>
                           <Grid2 item xs={12} container justifyContent="center">
                              <Button onClick={() => setIsEditMode(true)} variant="contained" color="secondary">
                                 Edit Profile
                              </Button>
                           </Grid2>
                           
                        </>
                  )}
                  {!isEditMode && (
                     <Grid2 item xs={12} style={{ marginTop: '20px' }}>
                     <Typography variant="h5" align="center" gutterBottom>
                        Reviews
                     </Typography>
                     {reviews.length > 0 ? (
                        <List>
                           {reviews.map((review, index) => (
                              <React.Fragment key={index}>
                                 <ListItem>
                                    <ListItemText primary={review.review} />
                                 </ListItem>
                                 {index < reviews.length - 1 && <Divider />}
                              </React.Fragment>
                           ))}
                        </List>
                     ) : (
                        <Typography variant="body1" align="center">
                           No reviews available.
                        </Typography>
                     )}
                     </Grid2>
                  )}
               </Grid2>
            </Paper>
         </Container>
      </>
   )
}

export default Profile