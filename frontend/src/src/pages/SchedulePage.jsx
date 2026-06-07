import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CalendarView from '../components/CalendarView';
import { buildCalendarEvents, scheduleData } from '../data/schedule';

function getDDay(dateString) {
  const today = new Date('2025-06-07T00:00:00');
  const target = new Date(`${dateString}T00:00:00`);
  const diff = Math.ceil((today - target) / (1000 * 60 * 60 * 24));
  return diff <= 0 ? `D-${Math.abs(diff)}` : `D+${diff}`;
}

function formatDateLabel(dateString) {
  return dateString.replaceAll('-', '.');
}

function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date('2025-06-01T00:00:00'));
  const [selectedDate, setSelectedDate] = useState('2025-06-14');

  const events = useMemo(() => buildCalendarEvents(scheduleData), []);
  const eventsByDate = useMemo(() => {
    const map = new Map();
    events.forEach((event) => {
      const current = map.get(event.date) || [];
      current.push(event);
      map.set(event.date, current);
    });
    return map;
  }, [events]);

  const selectedEvents = eventsByDate.get(selectedDate) || [];
  const scheduleCards = useMemo(
    () =>
      scheduleData
        .filter((item) => item.examDate.slice(0, 7) === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`)
        .sort((a, b) => new Date(a.examDate) - new Date(b.examDate)),
    [currentMonth],
  );

  return (
    <div className="page-stack schedule-page">
      <Link to="/" className="back-link">← 돌아가기</Link>

      <section className="schedule-page__hero">
        <div className="schedule-page__title">
          <span className="schedule-page__icon">🗓️</span>
          <div>
            <h1>D-day 시험일정 캘린더</h1>
            <p>다가오는 시험 일정과 접수 상태를 한눈에 확인하세요.</p>
          </div>
        </div>
      </section>

      <section className="panel schedule-calendar-section">
        <CalendarView
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          eventsByDate={eventsByDate}
          onSelectDate={setSelectedDate}
          onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
          onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
        />

        <div className="schedule-summary-panel">
          <div className="schedule-legend">
            <span><i className="calendar-dot calendar-dot--start" /> 접수 시작</span>
            <span><i className="calendar-dot calendar-dot--end" /> 접수 마감</span>
            <span><i className="calendar-dot calendar-dot--period" /> 접수기간</span>
            <span><i className="calendar-dot calendar-dot--exam" /> 시험일</span>
            <span><i className="calendar-dot calendar-dot--result" /> 결과 발표</span>
          </div>

          <div className="schedule-selected-events">
            <h2>{selectedDate} 일정</h2>
            <div className="schedule-selected-events__list">
              {selectedEvents.length > 0 ? (
                selectedEvents.map((event, index) => (
                  <div key={`${event.name}-${event.type}-${index}`} className="schedule-selected-events__item">
                    <span className={`schedule-mini-tag schedule-mini-tag--${event.type}`}>{event.label}</span>
                    <strong>{event.name}</strong>
                  </div>
                ))
              ) : (
                <p>선택한 날짜의 일정이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="schedule-card-list">
        {scheduleCards.map((item) => (
          <Link key={`${item.certificationId}-${item.examDate}`} to={`/certifications/${item.certificationId}`} className="schedule-detail-card">
            <div className="schedule-detail-card__dday">
              <div className="schedule-detail-card__dday-icon">D</div>
              <strong>{getDDay(item.examDate)}</strong>
            </div>

            <div className="schedule-detail-card__content">
              <div className="schedule-detail-card__header">
                <div>
                  <strong>{item.name}</strong>
                  <span className={`schedule-pill schedule-pill--${item.status === '시험일' ? 'exam' : item.status === '접수 예정' ? 'period' : item.status === '접수중' ? 'period' : 'end'}`}>
                    {item.status}
                  </span>
                </div>
                <span className="schedule-detail-card__elapsed">{getDDay(item.examDate)}</span>
              </div>

              <div className="schedule-detail-card__grid">
                <div>
                  <span>접수기간</span>
                  <strong>{formatDateLabel(item.registrationStart)} ~ {formatDateLabel(item.registrationEnd)}</strong>
                </div>
                <div>
                  <span>시험일</span>
                  <strong>{formatDateLabel(item.examDate)}</strong>
                </div>
                <div>
                  <span>합격발표</span>
                  <strong>{formatDateLabel(item.resultDate)}</strong>
                </div>
                <div>
                  <span>응시료</span>
                  <strong>{item.fee}</strong>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SchedulePage;
