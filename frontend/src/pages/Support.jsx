import React, { useEffect, useState } from 'react'
import { Box, TextField, Button, CircularProgress, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_KEY = "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";
const SITE_URL = 'Trade trial'; 
const SITE_NAME = 'Trade trial'; 

const Support = () => {
   const [chatHistory, setChatHistory] = useState([]);
   const [input, setInput] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [sessionId, setSessionId] = useState(''); 

   useEffect(() => {
      const newSessionId = `session-${Date.now()}`;
      setSessionId(newSessionId);
      setChatHistory([{role: 'system', content: 'Welcome! How can I help you today?'}]);
   }, []);

   const handleSubmit = async (event) => {
      event.preventDefault();
      if (!input.trim()) return;
      const newUserMessage = { role: 'user', content: input };
      setChatHistory([...chatHistory, newUserMessage]);
      setIsLoading(true);
      try {
         const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {model: 'openai/gpt-3.5-turbo', 
               messages: [...chatHistory, newUserMessage], 
            },
            {headers: { 'Authorization': `Bearer ${API_KEY}`,
                  'HTTP-Referer': "localhost:3000", 
                  'X-Title': "Trade trial", 
                  'Content-Type': 'application/json'}
            }
         );
         const answer = response.data.choices[0].message.content;
         setChatHistory([...chatHistory, { role: 'system', content: answer }]);
         setInput('');
      } catch (error) {
         console.error('Error:', error.response ? error.response.data : error.message);
         toast.error('Error in sending message. Please try again later.');
      } finally {
         setIsLoading(false);
      }
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
         <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
               Support Chat
            </Typography>

            <Paper sx={{ maxheight: 400, overflow: 'auto', p: 2, mb: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
               {chatHistory.map((msg, index) => (
                  <Box key={index} sx={{ textAlign: msg.role === 'user' ? 'right' : 'left', mb: 1 }}>
                     <Typography variant="body1" sx={{
                        display: 'inline-block',
                        p: 1,
                        borderRadius: '8px',
                        backgroundColor: msg.role === 'user' ? '#007bff' : '#e0e0e0',
                        color: msg.role === 'user' ? '#fff' : '#000',
                        maxWidth: '75%'
                     }}>
                        {msg.content}
                     </Typography>
                  </Box>
               ))}
            </Paper>

            <TextField
               label="Ask a question"
               variant="outlined"
               fullWidth
               value={input}
               onChange={(e) => setInput(e.target.value)}
               sx={{ mb: 2 }}
            />
            <Button
               variant="contained"
               color="primary"
               onClick={handleSubmit}
               disabled={isLoading}
               fullWidth
            >
               {isLoading ? <CircularProgress size={24} /> : 'Send'}
            </Button>
         </Box>
      </>
   )
}

export default Support