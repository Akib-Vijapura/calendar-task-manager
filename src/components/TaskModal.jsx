import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TaskForm from './TaskForm';

const TaskModal = ({ open, onClose, onSave, selectedDate, initialData, categories }) => {
  const handleSave = (task) => {
    onSave({
      ...task,
      start: new Date(task.startTime),
      end: new Date(task.endTime),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? 'Edit Task' : 'Add Task'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TaskForm
          onAddTask={handleSave}
          onClose={onClose}
          initialData={initialData}
          categories={categories}
          selectedDate={selectedDate}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;