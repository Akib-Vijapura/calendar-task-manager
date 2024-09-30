import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Paper, Box } from '@mui/material';
import CalendarView from './pages/CalendarView';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <CalendarView />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;