import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Paper, Box } from '@mui/material';
import CalendarView from './pages/CalendarView';
import { red } from '@mui/material/colors';

const theme = createTheme({
   palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

const App = () => {
  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CalendarView />
      </Box>
    </>
  );
};

export default App;