import React, { useState, useEffect, useContext} from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, Tabs, Tab, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeliverItems = () => {
   const [ordersReceived, setOrdersReceived] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [otpInputs, setOtpInputs] = useState({});

   const { user, setUser } = useContext(UserDataContext);

   const notify = (message) => toast.error(message);
   useEffect(() => {
      const token = localStorage.getItem('token');
      
      const getSellerOrders = async () => {
         try {
            const path = `${process.env.REACT_APP_BASE_URL}/orders/getSellerOrders`;
            const response = await axios.get(path, {
               headers: { 'Authorization': `Bearer ${token}` },
               params: { sellerid: user._id },
            });
            const pendingOrders = response.data.orders.filter(order => order.status === 'Pending');
            setOrdersReceived(pendingOrders);
         }
         catch (error) {
            console.error("Error: ", error); 
            notify("Error in fetching orders, please try again later.");
         } finally {
            setIsLoading(false);
         }
      };
      if (user) {
         getSellerOrders();
      }
   }, [user]);

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

   const completeTransaction = async (orderid) => {
      try {
         const path = `${process.env.REACT_APP_BASE_URL}/orders/verifyOTP/${orderid}`;
         const response = await axios.post(path,
            { otp: otpInputs[orderid] },
            { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
         if (response.data) {
            toast.success("Transaction completed successfully");
            setOrdersReceived(prevOrders => prevOrders.filter(order => order._id !== orderid));
         }
         else {
            toast.error("Incorrect OTP! Please try again.");
         }
      } catch (error) {
         console.log("Error completing transaction: ", error);
         notify("Error in completing transaction, please try again later.");
      }
   };


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
            Pending Deliveries
         </Typography>

         <TableContainer component={Paper}>
            {ordersReceived.length === 0 ? (
               <Typography variant="body1">No pending deliveries.</Typography>
            ) : (
            <Table>
               <TableBody>
                  {ordersReceived.map((order) => (
                     <React.Fragment key={order._id}>
                        {/* ordersummary */}
                        <TableRow>
                           <TableCell colSpan={5} sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                              Order ID: {order._id} | Item: {order.item.name} | Date: {order.date}
                           </TableCell>
                        </TableRow>
                        {/* item */}
                        <TableRow>
                           <TableCell></TableCell>
                           <TableCell>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                 {order.item.name}
                              </Typography>
                              <Typography variant="body2">Category: {order.item.category}</Typography>
                              <Typography variant="body2">Description: {order.item.description}</Typography>
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
                           <TableCell>
                              <TextField
                                 label="Enter OTP"
                                 variant='outlined'
                                 size='small'
                                 value={otpInputs[order._id] || ""}
                                 onChange={(e) => handleOtpChange(order._id, e.target.value)}
                              />
                              <Button variant='contained' color='primary' size='small' sx={{ textTransform: 'none', m1: 1 }}
                                 onClick={() => completeTransaction(order._id)}
                              >
                                 Complete Transaction
                              </Button>
                           </TableCell>
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

export default DeliverItems;
