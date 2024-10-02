import React, { useState } from 'react';
import { Box, Grid, Typography, IconButton, Button, useTheme, Tooltip } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay,
  format, isSameMonth, isSameDay, addMonths, subMonths, addDays, 
  subDays, addWeeks, subWeeks, eachHourOfInterval, isBefore, isAfter
} from 'date-fns';

const CustomCalendar = ({ events, onAddTask }) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');

  const onDateClick = (day) => {
    setSelectedDate(day);
    onAddTask(day);
  };

  const renderTaskTooltip = (task) => (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2">{task.title}</Typography>
      <Typography variant="body2">
        {format(new Date(task.start), 'HH:mm')} - {format(new Date(task.end), 'HH:mm')}
      </Typography>
      <Typography variant="body2">Category: {task.category}</Typography>
      <Typography variant="body2">Status: {task.completed ? 'Completed' : 'Pending'}</Typography>
      {task.description && <Typography variant="body2">Description: {task.description}</Typography>}
    </Box>
  );

  const renderHeader = () => {
    const dateFormat = view === 'month' ? "MMMM yyyy" : "MMMM d, yyyy";
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 1 }}>
        <IconButton onClick={prevPeriod} size="small">
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {format(currentDate, dateFormat)}
        </Typography>
        <IconButton onClick={nextPeriod} size="small">
          <ChevronRight />
        </IconButton>
      </Box>
    );
  };

  const renderViewControls = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 , mt : 3}}>
      {['Month', 'Week', 'Day'].map((viewOption) => (
        <Button 
          key={viewOption}
          onClick={() => setView(viewOption.toLowerCase())}
          variant={view === viewOption.toLowerCase() ? 'contained' : 'outlined'}
          size="small"
          sx={{ mx: 0.5 }}
        >
          {viewOption}
        </Button>
      ))}
    </Box>
  );

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = view === 'month' ? startOfWeek(startOfMonth(currentDate)) : startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      days.push(
        <Grid item xs key={i}>
          <Typography variant="caption" align="center" sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>
            {format(addDays(startDate, i), dateFormat)}
          </Typography>
        </Grid>
      );
    }
    return <Grid container>{days}</Grid>;
  };

  const renderMonthCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const eventsForDay = events.filter(event => isSameDay(new Date(event.start), cloneDay));
        days.push(
          <Grid item xs key={day}>
            <Box
              onClick={() => onDateClick(cloneDay)}
              sx={{
                height: 100,
                border: '1px solid',
                borderColor: theme.palette.divider,
                bgcolor: !isSameMonth(day, monthStart)
                  ? theme.palette.grey[50]
                  : isSameDay(day, selectedDate)
                  ? theme.palette.primary.light
                  : 'white',
                p: 0.5,
                position: 'relative',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <Typography 
                variant="caption"
                sx={{ 
                  fontWeight: isSameDay(day, new Date()) ? 'bold' : 'normal',
                  color: isSameDay(day, new Date()) ? theme.palette.primary.main : 'inherit'
                }}
              >
                {format(day, dateFormat)}
              </Typography>
              <Box sx={{ mt: 0.5, maxHeight: 70, overflowY: 'auto' }}>
                {eventsForDay.map((event, index) => (
                  <Tooltip key={index} title={renderTaskTooltip(event)} arrow placement="top">
                    <Box
                      sx={{
                        bgcolor: event.color,
                        color: 'white',
                        p: 0.25,
                        borderRadius: 0.5,
                        mb: 0.25,
                        fontSize: '0.7rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                      }}
                    >
                      {`${format(new Date(event.start), 'HH:mm')} ${event.title}`}
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          </Grid>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid container spacing={0} key={day}>
          {days}
        </Grid>
      );
      days = [];
    }
    return rows;
  };

  const renderTimelineCells = () => {
    const startDate = view === 'week' ? startOfWeek(currentDate) : startOfDay(currentDate);
    const endDate = view === 'week' ? endOfWeek(currentDate) : endOfDay(currentDate);
    const hours = eachHourOfInterval({ start: startDate, end: endDate });

    return (
      <Box sx={{ display: 'flex', height: 560, overflowX: 'auto' }}>
        <Box sx={{ width: 50, flexShrink: 0, borderRight: `1px solid ${theme.palette.divider}` }}>
          {hours.map((hour, index) => (
            <Box key={index} sx={{ height: 60, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption">{format(hour, 'HH:mm')}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          {view === 'week' && (
            <Box sx={{ display: 'flex', borderBottom: `1px solid ${theme.palette.divider}` }}>
              {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                const day = addDays(startDate, dayOffset);
                return (
                  <Box key={dayOffset} sx={{ flexGrow: 1, textAlign: 'center', p: 0.5, borderRight: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="caption">{format(day, 'EEE d')}</Typography>
                  </Box>
                );
              })}
            </Box>
          )}
          <Box sx={{ position: 'relative', height: '100%' }}>
            {events.map((event, index) => {
              const eventStart = new Date(event.start);
              const eventEnd = new Date(event.end);
              if (isBefore(eventEnd, startDate) || isAfter(eventStart, endDate)) return null;

              const top = (eventStart.getHours() + eventStart.getMinutes() / 60) * 60;
              const height = ((eventEnd.getHours() + eventEnd.getMinutes() / 60) - (eventStart.getHours() + eventStart.getMinutes() / 60)) * 60;
              const left = view === 'week' ? `${(eventStart.getDay()) * (100 / 7)}%` : 0;
              const width = view === 'week' ? `${100 / 7}%` : '100%';

              return (
                <Tooltip key={index} title={renderTaskTooltip(event)} arrow placement="top">
                  <Box
                    sx={{
                      position: 'absolute',
                      top: `${top}px`,
                      left: left,
                      width: width,
                      height: `${height}px`,
                      bgcolor: event.color,
                      color: 'white',
                      p: 0.5,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    {event.title}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      </Box>
    );
  };

  const nextPeriod = () => {
    const actions = { month: addMonths, week: addWeeks, day: addDays };
    setCurrentDate(date => actions[view](date, 1));
  };

  const prevPeriod = () => {
    const actions = { month: subMonths, week: subWeeks, day: subDays };
    setCurrentDate(date => actions[view](date, 1));
  };

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      {renderViewControls()}
      {renderHeader()}
      {view === 'month' && renderDays()}
      {view === 'month' ? renderMonthCells() : renderTimelineCells()}
    </Box>
  );
};

export default CustomCalendar;