import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Checkbox, 
  Typography, 
  Box, 
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';

const TaskList = ({ tasks, onDeleteTask, onEditTask, onToggleComplete }) => {
  const formatDate = (date) => {
    return format(new Date(date), "MMM d, yyyy h:mm a");
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden' }}>
      {tasks.map((task, index) => (
        <React.Fragment key={task.id}>
          {index > 0 && <Divider />}
          <ListItem
            alignItems="flex-start"
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
              cursor: 'default',
              userSelect: 'none',
            }}
          >
            <Checkbox
              edge="start"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              sx={{ mr: 1, alignSelf: 'flex-start', mt: 1 }}
            />
            <ListItemText
              primary={
                <Typography
                  variant="subtitle1"
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'text.secondary' : 'text.primary',
                    fontWeight: 'medium',
                  }}
                >
                  {task.title}
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    {formatDate(task.startTime)} - {formatDate(task.endTime)}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5, mb: 1 }}
                  >
                    {task.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Chip 
                      label={task.category} 
                      size="small" 
                      sx={{ 
                        bgcolor: task.color || 'grey.500',
                        color: 'white',
                        fontWeight: 'bold',
                      }} 
                    />
                    <Chip 
                      label={task.completed ? 'Completed' : 'Pending'} 
                      size="small" 
                      sx={{ 
                        bgcolor: task.completed ? 'success.main' : 'warning.main',
                        color: 'white',
                        fontWeight: 'bold',
                      }} 
                    />
                  </Box>
                </React.Fragment>
              }
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
              <Tooltip title="Edit">
                <IconButton edge="end" aria-label="edit" onClick={() => onEditTask(task.id)} size="small">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteTask(task.id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  );
};

export default TaskList;