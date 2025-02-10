import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Item from '../components/Item';
import { SearchContext } from '../context/SearchContext';
import { UserDataContext } from '../context/UserContext';
import { Box } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';

const SearchPage = () => {
   const [items, setItems] = useState([]);
   const { query } = useContext(SearchContext);
   const { user } = useContext(UserDataContext);

   useEffect(() => {
      const fetchItems = async () => {
         try {
            const path = `${process.env.REACT_APP_BASE_URL}/item/search`;
            const response = await axios.get(path, {
               params: {
                  query: query || '',
                  userId: user._id,
               },
            });
            setItems(response.data);
         } catch (error) {
            console.error('Error fetching items:', error);
            toast.error('Error fetching items, please try again later.');
         }
      };
      fetchItems();
   }, [query]);

   const removeItemFromList = (itemId) => {
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
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
         {items.length === 0 ? (
            <div sx={{ textAlign: 'center', marginTop: '20px' }}>
               <h2>No items found. Please try a different search query.</h2>
            </div>
         ) : (
         <Box
            sx={{
               padding: '20px',
               display: 'grid',
               gap: '20px',
               gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
               justifyContent: 'center',
               maxWidth: '1200px',
               margin: '0 auto',
            }}
         >
            {items.map((item) => (
               <Item
                  key={item._id}
                  itemid={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  category={item.category}
                  seller={item.sellerid.firstname + ' ' + item.sellerid.lastname}
                  removeItemFromList={removeItemFromList} 
               />
            ))}
         </Box>
         )}
      </>
   );
};

export default SearchPage;
