import React, { useState, useEffect } from 'react';
import CalendarComponent from '../components/Calendar';
import TaskModal from '../components/TaskModal';
import TaskList from '../components/TaskList';
import SearchFilter from '../components/SearchFilter';
import { Grid, Paper, Typography, Box, Snackbar } from '@mui/material';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from '../utils/localStorage';

const categories = [
  { value: 'work', label: 'Work', color: '#FF5733' },
  { value: 'personal', label: 'Personal', color: '#33FF57' },
  { value: 'important', label: 'Important', color: '#3357FF' },
  { value: 'other', label: 'Other', color: '#FF33F1' }
];

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [view, setView] = useState('month');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

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

  const handleAddTask = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleSaveTask = (task) => {
    try {
      let updatedTasks;
      if (editingTask) {
        updatedTasks = tasks.map((t) => 
          t.id === editingTask.id ? { ...task, id: t.id } : t
        );
        setSnackbar({ open: true, message: 'Task updated successfully', severity: 'success' });
      } else {
        updatedTasks = [...tasks, { ...task, id: Date.now() }];
        setSnackbar({ open: true, message: 'Task added successfully', severity: 'success' });
      }
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setEditingTask(null);
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving task:', error);
      setSnackbar({ open: true, message: 'Error saving task. Please try again.', severity: 'error' });
    }
  };

  const handleDeleteTask = (taskId) => {
    try {
      const newTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(newTasks);
      saveTasksToLocalStorage(newTasks);
      setSnackbar({ open: true, message: 'Task deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Error deleting task:', error);
      setSnackbar({ open: true, message: 'Error deleting task. Please try again.', severity: 'error' });
    }
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setSelectedDate(new Date(taskToEdit.startTime));
      setModalOpen(true);
    } else {
      setSnackbar({ open: true, message: 'Task not found', severity: 'error' });
    }
  };

  const handleToggleComplete = (taskId) => {
    try {
      const newTasks = tasks.map((task) => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      setTasks(newTasks);
      saveTasksToLocalStorage(newTasks);
      setSnackbar({ open: true, message: 'Task status updated', severity: 'success' });
    } catch (error) {
      console.error('Error updating task status:', error);
      setSnackbar({ open: true, message: 'Error updating task status. Please try again.', severity: 'error' });
    }
  };

  const filteredTasks = tasks.filter(task => 
    (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     new Date(task.startTime).toLocaleDateString().includes(searchTerm)) &&
    (categoryFilter === '' || task.category === categoryFilter)
  );

  const calendarEvents = filteredTasks.map(task => ({
    id: task.id,
    title: task.title,
    start: new Date(task.startTime),
    end: new Date(task.endTime),
    allDay: false,
    color: categories.find(cat => cat.value === task.category)?.color || '#808080'
  }));

  return (
    <Box sx={{ height: '100%' }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              categories={categories}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} sx={{ height: 'calc(100% - 80px)' }}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <CalendarComponent 
              events={calendarEvents}
              onAddTask={handleAddTask}
              view={view}
              onView={setView}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} sx={{ height: 'calc(100% - 80px)' }}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Tasks
            </Typography>
            <TaskList 
              tasks={filteredTasks}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              onToggleComplete={handleToggleComplete}
            />
          </Paper>
        </Grid>
      </Grid>
      <TaskModal
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        selectedDate={selectedDate}
        initialData={editingTask}
        categories={categories}  // Make sure this line is present
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default CalendarView;