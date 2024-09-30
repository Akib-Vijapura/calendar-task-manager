// src/components/Calendar.jsx
import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent = ({ events, onAddTask, view, onView }) => {
  const handleSelectSlot = (slotInfo) => {
    onAddTask(slotInfo);
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 600 }}
      selectable
      onSelectSlot={handleSelectSlot}
      view={view}
      onView={onView}
      views={['month', 'week', 'day']}
    />
  );
};

export default CalendarComponent;