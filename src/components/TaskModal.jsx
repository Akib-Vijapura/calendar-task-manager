import React from 'react';
import { Modal, Box } from '@mui/material';
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
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <h2>{initialData ? 'Edit Task' : 'Add Task'}</h2>
        <TaskForm 
          onAddTask={handleSave} 
          onClose={onClose} 
          initialData={initialData}
          categories={categories}
          selectedDate={selectedDate}
        />
      </Box>
    </Modal>
  );
};

export default TaskModal;