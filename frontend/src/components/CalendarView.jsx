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

function CalendarView({
  currentMonth,
  selectedDate,
  eventsByDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}) {
  const cells = buildMonthCells(currentMonth);

  return (
    <section className="calendar-panel">
      <div className="calendar-panel__toolbar">
        <button type="button" className="calendar-nav-button" onClick={onPrevMonth} aria-label="이전 달">
          ‹
        </button>
        <strong>
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </strong>
        <button type="button" className="calendar-nav-button" onClick={onNextMonth} aria-label="다음 달">
          ›
        </button>
      </div>

      <div className="calendar-board__head">
        {dayLabels.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="calendar-board">
        {cells.map((date) => {
          const dateKey = date.toISOString().slice(0, 10);
          const events = eventsByDate.get(dateKey) || [];
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
              <div className="calendar-board__dots">
                {events.slice(0, 3).map((event, index) => (
                  <span key={`${event.type}-${index}`} className={`calendar-dot calendar-dot--${event.type}`} />
                ))}
                {events.length > 3 && <span className="calendar-board__more">+{events.length - 2}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CalendarView;
