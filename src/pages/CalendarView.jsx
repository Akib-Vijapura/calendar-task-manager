import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Button, useTheme, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CustomCalendar from '../components/Calendar';
import TaskModal from '../components/TaskModal';
import TaskList from '../components/TaskList';
import SearchFilter from '../components/SearchFilter';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from '../utils/localStorage';

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
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const categories = [
  { value: 'work', label: 'Work', color: '#3f51b5' },
  { value: 'personal', label: 'Personal', color: '#4caf50' },
  { value: 'important', label: 'Important', color: '#f44336' },
  { value: 'other', label: 'Other', color: '#ff9800' }
];

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [completedFilter, setCompletedFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const storedTasks = loadTasksFromLocalStorage();
    if (storedTasks && storedTasks.length > 0) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      saveTasksToLocalStorage(tasks);
    }
  }, [tasks]);

  const handleAddTask = (date) => {
    setSelectedDate(date);
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleSaveTask = (task) => {
    let updatedTasks;
    if (editingTask) {
      updatedTasks = tasks.map((t) => 
        t.id === editingTask.id ? { ...task, id: t.id } : t
      );
    } else {
      updatedTasks = [...tasks, { ...task, id: Date.now() }];
    }
    setTasks(updatedTasks);
    setEditingTask(null);
    setModalOpen(false);
  };

  const handleDeleteTask = (taskId) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setSelectedDate(new Date(taskToEdit.startTime));
      setModalOpen(true);
    }
  };

  const handleToggleComplete = (taskId) => {
    const newTasks = tasks.map((task) => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const filteredTasks = tasks.filter(task => 
    (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === '' || task.category === categoryFilter) &&
    (completedFilter === 'all' || 
     (completedFilter === 'completed' && task.completed) ||
     (completedFilter === 'active' && !task.completed))
  );

  const calendarEvents = filteredTasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    start: new Date(task.startTime),
    end: new Date(task.endTime),
    category: task.category,
    completed: task.completed,
    color: categories.find(cat => cat.value === task.category)?.color || '#808080'
  }));

  const handleCompletedFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setCompletedFilter(newFilter);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
            Calendar Task Manager
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden' }}>
                <CustomCalendar 
                  events={calendarEvents}
                  onAddTask={handleAddTask}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddTask(new Date())}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Add New Task
                </Button>
                <SearchFilter
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  categoryFilter={categoryFilter}
                  onCategoryFilterChange={setCategoryFilter}
                  categories={categories}
                />
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Filter by status:
                  </Typography>
                  <ToggleButtonGroup
                    value={completedFilter}
                    exclusive
                    onChange={handleCompletedFilterChange}
                    aria-label="task completion filter"
                    size="small"
                    fullWidth
                  >
                    <ToggleButton value="all" aria-label="all tasks">
                      All
                    </ToggleButton>
                    <ToggleButton value="active" aria-label="active tasks">
                      Active
                    </ToggleButton>
                    <ToggleButton value="completed" aria-label="completed tasks">
                      Completed
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <Box sx={{ mt: 2, maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                  <TaskList 
                    tasks={filteredTasks}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={handleEditTask}
                    onToggleComplete={handleToggleComplete}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <TaskModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        selectedDate={selectedDate}
        initialData={editingTask}
        categories={categories}
      />
    </ThemeProvider>
  );
};

export default CalendarView;