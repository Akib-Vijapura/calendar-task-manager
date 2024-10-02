import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText, Box } from '@mui/material';

const TaskForm = ({ onAddTask, onClose, initialData, categories, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStartTime(initialData.startTime ? new Date(initialData.startTime).toISOString().slice(0, 16) : '');
      setEndTime(initialData.endTime ? new Date(initialData.endTime).toISOString().slice(0, 16) : '');
      setCategory(initialData.category || '');
    } else if (selectedDate) {
      const startDate = new Date(selectedDate);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      setStartTime(startDate.toISOString().slice(0, 16));
      
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);
      setEndTime(endDate.toISOString().slice(0, 16));
    }
  }, [initialData, selectedDate]);

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (!title.trim()) newErrors.title = "Title is required";
    
    if (!startTime) {
      newErrors.startTime = "Start time is required";
    } else if (startDate < now) {
      newErrors.startTime = "Start time cannot be in the past";
    }

    if (!endTime) {
      newErrors.endTime = "End time is required";
    } else if (endDate <= startDate) {
      newErrors.endTime = "End time must be after start time";
    }

    if (!category) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const task = {
        title,
        description,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        category,
        color: categories.find(cat => cat.value === category)?.color
      };
      onAddTask(task);
      onClose();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        margin="normal"
        error={!!errors.title}
        helperText={errors.title}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={3}
        margin="normal"
      />
      <TextField
        label="Start Time"
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        fullWidth
        required
        margin="normal"
        InputLabelProps={{ shrink: true }}
        error={!!errors.startTime}
        helperText={errors.startTime}
      />
      <TextField
        label="End Time"
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        fullWidth
        required
        margin="normal"
        InputLabelProps={{ shrink: true }}
        error={!!errors.endTime}
        helperText={errors.endTime}
      />
      <FormControl fullWidth margin="normal" error={!!errors.category}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          label="Category"
        >
          {categories.map((cat) => (
            <MenuItem key={cat.value} value={cat.value}>
              {cat.label}
            </MenuItem>
          ))}
        </Select>
        {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
      </FormControl>
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, mb: 2 }}>
        {initialData ? 'Update Task' : 'Add Task'}
      </Button>
    </Box>
  );
};

export default TaskForm;