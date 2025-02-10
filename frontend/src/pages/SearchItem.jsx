import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { SearchContext } from '../context/SearchContext';

export default function FreeSolo() {
  const { query, setQuery } = React.useContext(SearchContext);
   const items = [
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

   return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        multiple
        id="buy-sell-items-search"
        disableClearable
        options={items.map((option) => option.category)}
        onChange={(event, value) => setQuery(value || [])}
        onInputChange={(event, value) => setQuery(value || '')} 
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            variant='outlined'
            sx={{
              input: {
                color: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'white', 
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white', 
                },
                '&:hover fieldset': {
                  borderColor: 'white', 
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', 
                },
              },
            }}
          />
        )}
      />
    </Stack>
  );
}