import { useMemo } from 'react';

function buildMonthCells(currentMonth) {
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());
  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
}

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

const eventBarStyle = {
  backgroundColor: '#d1e7ff',
  color: '#004a99',
  padding: '1px 3px',        
  borderRadius: '3px',
  fontSize: '10px',         
  fontWeight: '500',         
  marginBottom: '2px',
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',   
  textAlign: 'left'
};

function CalendarView({ currentMonth, selectedDate, eventsByDate, onSelectDate, onPrevMonth, onNextMonth }) {
  const cells = buildMonthCells(currentMonth);

  const eventMap = useMemo(() => {
    const map = new Map();
    (eventsByDate || []).forEach((event) => {
      const dateKey = event.date;
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey).push(event);
    });
    return map;
  }, [eventsByDate]);

  return (
    <section className="calendar-panel">
      <div className="calendar-panel__toolbar">
        <button type="button" className="calendar-nav-button" onClick={onPrevMonth}>‹</button>
        <strong>{currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월</strong>
        <button type="button" className="calendar-nav-button" onClick={onNextMonth}>›</button>
      </div>

      <div className="calendar-board__head">
        {dayLabels.map((day) => <span key={day}>{day}</span>)}
      </div>

      <div className="calendar-board">
        {cells.map((date) => {
          const dateKey = date.toISOString().slice(0, 10);
          const events = eventMap.get(dateKey) || [];
          const isOutside = date.getMonth() !== currentMonth.getMonth();
          const isSelected = selectedDate === dateKey;

          return (
            <button
              key={dateKey}
              type="button"
              className={`calendar-board__cell${isOutside ? ' calendar-board__cell--outside' : ''}${isSelected ? ' calendar-board__cell--selected' : ''}`}
              onClick={() => onSelectDate(dateKey)}
            >
              <span className="calendar-board__date">{date.getDate()}</span>
              <div style={{ marginTop: '4px', width: '100%', padding: '0 2px' }}>
                {events.slice(0, 2).map((event, index) => (
                  <div key={`${event.id}-${index}`} style={eventBarStyle}>
                    {event.text.includes(']') ? event.text.split(']')[1].trim() : event.text}
                  </div>
                ))}
                {events.length > 2 && (
                  <div style={{ fontSize: '9px', textAlign: 'center', color: '#888', marginTop: '2px' }}>
                    +{events.length - 2}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CalendarView;
