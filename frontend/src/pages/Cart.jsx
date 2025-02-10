import React from 'react'
import { useState, useEffect, useContext } from 'react'
import CartItem from '../components/CartItem'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Container from '@mui/material/Container';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Cart = () => {
   const [cartItems, setCartItems] = useState([])
   const [loading, setLoading] = useState(true)
   const { user, setUser } = useContext(UserDataContext);
   const [orderOtp, setOrderOtp] = useState({}); // mapping between order and otp
   
   const notify = (message) => toast.error(message);

   const navigate = useNavigate();
   if (!user) {
      navigate('/login');
   }

   const randomOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
   }

   const hashOTP = (otp) => {
      return otp.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
   }

   const totalCost = () => {
      let total = 0;
      cartItems.forEach((item) => {
         total += item.price;
      });
      return total;
   }

   const handlePlaceOrder = async () => {
      try {
         const token = localStorage.getItem('token');
         if (!token) {
            notify("Please login to place orders");
            navigate('/login');
         }
         const orderPath = `${process.env.REACT_APP_BASE_URL}/orders/create`;
         const removePath = `${process.env.REACT_APP_BASE_URL}/item/delete`;
         const cartPath = `${process.env.REACT_APP_BASE_URL}/user/emptycart`;
         await Promise.all(cartItems.map(async (item) => {
            try {
               const { data, status } = await axios.post(orderPath, {
                  buyerid: user._id,
                  item: {
                     itemId: item._id,
                     sellerid: item.sellerid
                  },
                  amount: item.price,
               }, {
                  headers: {
                     Authorization: `Bearer ${token}`
                  }
               });
               if (status === 201) {
                  const { order, otp } = data;
                  setOrderOtp(prev => ({ ...prev, [order._id]: otp }));
                  await axios.post(removePath, { item: item }, {
                     headers: {
                        Authorization: `Bearer ${token}`
                     }
                  });
               }
            } catch (error) {
               console.error(`Error in processing order for item ${item._id}`);
               notify(`Error in processing order for ${item.name}, please try again later.`)
            }
         }));
         
         await axios.delete(cartPath, {
            headers: {
               Authorization: `Bearer ${token}`
            },
            params: {
               userid: user._id,
            },
         });
         setCartItems([]);
         toast.success("All Orders placed successfully, cart emptied!")
      } catch (error) {
         console.error("Error in placing orders: ", error);
         notify("Error in placing orders, please try again later");
      }
   };

   useEffect(() => {
      const fetchCartItems = async () => {
         try {
            const token = localStorage.getItem('token')
            const path = `${process.env.REACT_APP_BASE_URL}/user/cart`
            // console.log("User in cart: ", user)
            const response = await axios.get(path, {
               params: {
                  userid: user._id
               },
               headers: {
                  Authorization: `Bearer ${token}`
               }
            });
            if (response.status === 200) {
               setCartItems(response.data);
               console.log("Cart items: ", response.data)
               setLoading(false)
            }
         } catch (err) {
            console.error("Error in fetching cart items: ", err);
            notify("Error in fetching cart items, please try again");
         }
      }
      fetchCartItems();
   }, [user]);

   if (loading) {
      return <div>Loading...</div>
   }

   return (
      <Container sx={{ mt: 5 }}>
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
         <Typography variant='h4' sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
            Your Cart
         </Typography>
         {cartItems.length === 0 ? (
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '500px',
                  border: '1px dashed #ddd',
                  borderRadius: 2,
                  p: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: 3,
               }}
            >
               <ShoppingCartIcon color='primary' sx={{ fontSize: 80 }} />
               <Typography variant='h5' sx={{ fontWeight: 'bold', mt: 3, color: '#777' }} >
                  Your cart is empty
               </Typography>
               <Typography variant='body1' sx={{ mt: 2, color: '#777' }} >
                  Start shopping now and fill your cart with amazing items
               </Typography>
               <Button variant='contained' sx={{ mt: 3 }} onClick={() => navigate('/search')}>Shop Now</Button>
            </Box>
         ) : (
               <div>
                  {cartItems.map((item) => {
                     return (
                        <CartItem
                        key={item._id}
                        itemid={item._id}
                        item={item}
                        name={item.name}
                        price={item.price}
                        description={item.description}
                        category={item.category}
                        seller={item.firstname + ' ' + item.lastname}
                        sellerid={item.sellerid}
                        setCartItems={setCartItems}
                        />
                     )
                  })}
                  <Typography variant='h5' sx={{ textAlign: 'right', fontWeight: 'bold', mt: 4 }}>
                     Total: ${totalCost()}
                  </Typography>
                  <Button variant='contained' onClick={handlePlaceOrder}>Place Order</Button>
               </div>
            )
         }
      </Container>
   )
}

export default Cart