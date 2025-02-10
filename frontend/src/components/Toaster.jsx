import * as React from 'react';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Snackbar from '@mui/joy/Snackbar';

export default function Toaster({col, message}) {
  const [open, setOpen] = React.useState(false);
  const [variant, setVariant] = React.useState('outlined');
  const [color, setColor] = React.useState('neutral');
  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <Stack spacing={1} direction="row">
         <Button
            key={color}
            variant="soft"
            color={color}
            size="sm"
            onClick={() => {
               setOpen(true);
               setColor({color});
            }}
         >
            CLick here!
         </Button>
      </Stack>
      <Snackbar
        autoHideDuration={4000}
        open={open}
        variant={variant}
        color={color}
        onClose={(event, reason) => {
          if (reason === 'clickaway') {
            return;
          }
          setOpen(false);
        }}
      >
        {message}
      </Snackbar>
    </Stack>
  );
}
