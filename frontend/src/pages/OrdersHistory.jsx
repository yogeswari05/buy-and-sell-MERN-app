import React, { useState, useEffect, useContext} from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tabs, Tab, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderHistory = () => {
   const [ordersPlaced, setOrdersPlaced] = useState([]);
   const [ordersReceived, setOrdersReceived] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [activeTab, setActiveTab] = useState(0);
   const [otpInputs, setOtpInputs] = useState({});
   const [review, setReviews] = useState({});

   const { user, setUser } = useContext(UserDataContext);

   const handleTabChange = (event, newValue) => {
      setActiveTab(newValue);
   };
   
   useEffect(() => {
      const token = localStorage.getItem('token');
      const getBuyerOrders = async () => {
         try {
            const path = `${process.env.REACT_APP_BASE_URL}/orders/getBuyerOrders`;
            const response = await axios.get(path, {
               headers: { 'Authorization': `Bearer ${token}` },
               params: { buyerid: user._id, },
            });
            console.log("response Orders: ", response.data.orders); 
            setOrdersPlaced(response.data.orders || []);
            const initialOtps = {};
            response.data.orders.forEach(order => {
               initialOtps[order._id] = order.otp;
            });
            setOtpInputs(initialOtps);
         }
         catch (error) {
            console.error("Error: ", error);
            toast.error("Error in fetching orders, please try again later.");
         }
      };

      const getSellerOrders = async () => {
         try {
            const path = `${process.env.REACT_APP_BASE_URL}/orders/getSellerOrders`;
            const response = await axios.get(path, {
               headers: { 'Authorization': `Bearer ${token}` },
               params: { sellerid: user._id },
            });
            setOrdersReceived(response.data.orders);
            console.log("Seller orders: ", response.data.orders || []);
            // set otps on frontend
            const initialOtps = {};
            response.data.orders.forEach(order => {
               initialOtps[order._id] = order.otp;
            });
            setOtpInputs(initialOtps);
         }
         catch (error) {
            console.error("Error: ", error);
            toast.error("Error in fetching orders, please try again later.");
         }
      };
      if (user) {
         Promise.all([getBuyerOrders(), getSellerOrders()]).then(() => setIsLoading(false)).catch(() => setIsLoading(false));
      }
      setIsLoading(false);
   }, [user]);

   const activeOrders = activeTab === 0 ? ordersPlaced : ordersReceived;

   if (isLoading) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
         </Box>
      );
   }

   const handleOtpChange = (orderid, value) => {
      setOtpInputs(prev => ({ ...prev, [orderid]: value })); // each order maintains its own OTP
   }

   const regenerateOtp = async (orderid) => {
      try {
         const path = `${process.env.REACT_APP_BASE_URL}/orders/regenerateOtp/${orderid}`;
         const response = await axios.post(path);
         const { otp } = response.data;
         setOtpInputs(prev => ({ ...prev, [orderid]: otp }));
      } catch (error) {
         console.error("Error regenerating OTP:", error);
         toast.error("Error regenerating OTP");
      }
   }

   const handleReviewSubmit = async (review, order) => {
      try {
         const path = `${process.env.REACT_APP_BASE_URL}/reviews/create`;
         await axios.post(path, { sellerid: order.item.itemId.sellerid, review });
         toast.success("Review submitted successfully");
         setReviews(prev => ({ ...prev, [order._id]: review }));
      } catch (error) {
         console.error("Error submitting review:", error);
         toast.error("Error submitting review");
      }
   }

   return (
      <Box sx={{ padding: '2rem' }}>
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
         <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Order History
         </Typography>

         <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            textColor="primary"
            indicatorColor="primary"
            sx={{ marginBottom: 3 }}
         >
            <Tab label="Orders Placed" />
            <Tab label="Orders Received" />
         </Tabs>

         <TableContainer component={Paper}>
            {Array.isArray(activeOrders) && activeOrders.length === 0 ? (
               <Typography variant="body1">No orders available.</Typography>
            ) : (
            <Table>
               <TableBody>
                  {activeOrders.map((order) => (
                     <React.Fragment key={order._id}>
                        {/*ordersumary*/}
                        <TableRow>
                           <TableCell colSpan={5} sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                              Order ID: {order._id} | Date: {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              {activeTab === 0 ? (
                                 <Typography variant="body2">Seller details: {order.item.sellerid.firstname} {order.item.sellerid.lastname}</Typography>
                              ) : (
                                    <Typography variant="body2">Buyer details: {order.buyerid.firstname} {order.buyerid.lastname}</Typography>
                              )}
                           </TableCell>
                        </TableRow>
                        {/*item*/}
                        <TableRow>
                           <TableCell></TableCell>
                           <TableCell>
                              {order.item.itemId ? (
                                 <>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                       Name: {order.item.itemId.name}
                                    </Typography>
                                    <Typography variant="body2">Category: {order.item.itemId.category}</Typography>
                                    <Typography variant="body2">Description: {order.item.itemId.description}</Typography>
                                 </>
                              ) : (
                                 <Typography variant="body2" color="error">Item details not available</Typography>
                              )}
                           </TableCell>
                           <TableCell>
                              <Typography
                                 sx={{
                                    color: order.status === 'Delivered' ? 'green' : order.status === 'Pending' ? 'red' : 'orange',
                                    fontWeight: 'bold',
                                 }}
                              >
                                 {order.status}
                              </Typography>
                           </TableCell>
                           {activeTab === 0 && order.status === 'Pending' && (
                              <TableCell>
                                 <Typography variant='body1'>OTP: {otpInputs[order._id] || "Not generated"}</Typography>
                                 <Button variant='contained' color='primary' size='small' sx={{ textTransform: 'none', m1: 1 }}
                                    onClick={() => regenerateOtp(order._id)}
                                 >
                                    Regenerate OTP
                                 </Button>
                              </TableCell>
                           )}
                           {activeTab == 0 && order.status === "Completed" && !review[order._id] && (
                              <Box>
                                 <TextField
                                    label="Review"
                                    multiline 
                                    rows={2}
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => setReviews(e.target.value)}
                                 />  
                                 <Button
                                    variant="contained"
                                    color="primary" size='small' sx={{ textTransform: 'none', m1: 1 }}
                                    onClick={() => handleReviewSubmit(review, order)}
                                 >
                                    Submit Review
                                 </Button>
                              </Box>
                           )}
                        </TableRow>
                     </React.Fragment>
                  ))}
               </TableBody>
            </Table>
            )}
         </TableContainer>
      </Box>
   );
};

export default OrderHistory;
