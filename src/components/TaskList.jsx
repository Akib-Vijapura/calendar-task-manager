import React from 'react';
import { List, ListItem, ListItemText, IconButton, Checkbox, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TaskList = ({ tasks, onDeleteTask, onEditTask, onToggleComplete }) => {
  return (
    <List>
      {tasks.map((task) => (
        <ListItem key={task.id}>
          <Checkbox
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
          />
          <ListItemText
            primary={task.title}
            secondary={
              <>
                {`${new Date(task.startTime).toLocaleString()} - ${new Date(task.endTime).toLocaleString()}`}
                <br />
                <Chip
                  label={task.category}
                  size="small"
                  style={{ backgroundColor: task.color, marginTop: '5px' }}
                />
              </>
            }
            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
          />
          <IconButton edge="end" onClick={() => onEditTask(task.id)}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" onClick={() => onDeleteTask(task.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;