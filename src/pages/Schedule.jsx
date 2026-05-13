import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleData } from '../data/schedule';
import './Schedule.css';

const weekLabels = ['일', '월', '화', '수', '목', '금', '토'];

const toDateOnly = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatKey = (date) => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseRegistrationPeriod = (period) => {
  const [startText, endText] = period.split('~').map((text) => text.trim());
  return {
    start: toDateOnly(startText),
    end: toDateOnly(endText),
  };
};

function Schedule() {
  const navigate = useNavigate();

  const [viewDate, setViewDate] = useState(() => {
    const firstExam = scheduleData[0]?.examDate;
    return firstExam ? toDateOnly(firstExam) : new Date();
  });

  const [selectedDateKey, setSelectedDateKey] = useState(() => {
    const firstExam = scheduleData[0]?.examDate;
    return firstExam || formatKey(new Date());
  });

  const filteredSchedule = scheduleData;

  const getStatusChipClass = (status) => {
    if (status === '접수중') return 'status-chip status-chip-open';
    if (status === '마감임박') return 'status-chip status-chip-urgent';
    if (status === '접수 예정') return 'status-chip status-chip-pending';
    return 'status-chip';
  };

  const getDateTagPillClass = (tag) => {
    if (tag === '접수 시작') return 'event-pill pending';
    if (tag === '접수 마감') return 'event-pill urgent';
    if (tag === '접수기간') return 'event-pill registration';
    if (tag === '시험일') return 'event-pill exam';
    if (tag === '결과 발표') return 'event-pill result';
    return 'event-pill';
  };

  const getDDay = (examDate) => {
    const today = new Date();
    const exam = toDateOnly(examDate);
    const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
  };

  const monthLabel = `${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`;

  const calendarEventsByDate = useMemo(() => {
    const map = new Map();

    const pushEvent = (date, event) => {
      const key = formatKey(date);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(event);
    };

    scheduleData.forEach((item) => {
      const { start, end } = parseRegistrationPeriod(item.registrationPeriod);
      pushEvent(start, { type: '접수 시작', name: item.name, color: 'pending' });
      pushEvent(end, { type: '접수 마감', name: item.name, color: 'urgent' });
      pushEvent(toDateOnly(item.examDate), { type: '시험일', name: item.name, color: 'exam' });
      pushEvent(toDateOnly(item.resultDate), { type: '결과 발표', name: item.name, color: 'result' });

      const registrationDay = new Date(start);
      registrationDay.setDate(registrationDay.getDate() + 1);
      while (registrationDay < end) {
        pushEvent(new Date(registrationDay), { type: '접수기간', name: item.name, color: 'registration' });
        registrationDay.setDate(registrationDay.getDate() + 1);
      }
    });

    return map;
  }, []);

  const selectedDayEvents = calendarEventsByDate.get(selectedDateKey) || [];

  const selectedDateSchedule = useMemo(() => {
    const selectedDate = toDateOnly(selectedDateKey);
    return filteredSchedule
      .map((item) => {
        const { start, end } = parseRegistrationPeriod(item.registrationPeriod);
        const exam = toDateOnly(item.examDate);
        const result = toDateOnly(item.resultDate);

        const isRegistrationStart = formatKey(start) === selectedDateKey;
        const isRegistrationEnd = formatKey(end) === selectedDateKey;
        const isExamDate = formatKey(exam) === selectedDateKey;
        const isResultDate = formatKey(result) === selectedDateKey;

        const isInRegistrationRange = selectedDate >= start && selectedDate <= end;

        if (!isRegistrationStart && !isRegistrationEnd && !isExamDate && !isResultDate && !isInRegistrationRange) {
          return null;
        }

        const matchedTags = [];
        if (isRegistrationStart) matchedTags.push('접수 시작');
        if (isRegistrationEnd) matchedTags.push('접수 마감');
        if (isExamDate) matchedTags.push('시험일');
        if (isResultDate) matchedTags.push('결과 발표');
        if (isInRegistrationRange && matchedTags.length === 0) matchedTags.push('접수기간');

        return { ...item, matchedTags };
      })
      .filter(Boolean);
  }, [filteredSchedule, selectedDateKey]);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startWeekDay = firstDay.getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const prevMonthLastDate = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = startWeekDay - 1; i >= 0; i -= 1) {
      const day = prevMonthLastDate - i;
      const date = new Date(year, month - 1, day);
      days.push({ date, inCurrentMonth: false });
    }

    for (let day = 1; day <= lastDate; day += 1) {
      const date = new Date(year, month, day);
      days.push({ date, inCurrentMonth: true });
    }

    while (days.length % 7 !== 0) {
      const nextDay = days.length - (startWeekDay + lastDate) + 1;
      const date = new Date(year, month + 1, nextDay);
      days.push({ date, inCurrentMonth: false });
    }

    return days;
  }, [viewDate]);

  const moveMonth = (diff) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + diff, 1));
  };

  return (
    <div className="schedule-page">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        ← 돌아가기
      </button>

      <header className="schedule-header">
        <div className="schedule-icon">🗓️</div>
        <div>
          <h1 className="schedule-title">D-day 시험일정 캘린더</h1>
          <p className="schedule-description">다가오는 시험 일정과 접수 상태를 한눈에 확인하세요.</p>
        </div>
      </header>

      <section className="calendar-panel">
        <div className="calendar-header">
          <button type="button" className="calendar-nav" onClick={() => moveMonth(-1)}>
            ‹
          </button>
          <h2>{monthLabel}</h2>
          <button type="button" className="calendar-nav" onClick={() => moveMonth(1)}>
            ›
          </button>
        </div>

        <div className="calendar-weekdays">
          {weekLabels.map((label) => (
            <div key={label} className="weekday">
              {label}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map(({ date, inCurrentMonth }) => {
            const dateKey = formatKey(date);
            const dayEvents = calendarEventsByDate.get(dateKey) || [];
            const isSelected = selectedDateKey === dateKey;

            return (
              <button
                key={dateKey}
                type="button"
                className={`calendar-cell ${inCurrentMonth ? '' : 'other-month'} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDateKey(dateKey)}
              >
                <span className="cell-date">{date.getDate()}</span>
                <div className="cell-events">
                  {dayEvents.slice(0, 2).map((event) => (
                    <span key={`${event.type}-${event.name}`} className={`event-dot ${event.color}`} title={`${event.type} · ${event.name}`} />
                  ))}
                  {dayEvents.length > 2 && <span className="event-more">+{dayEvents.length - 2}</span>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="calendar-legend">
          <span><i className="event-dot pending" />접수 시작</span>
          <span><i className="event-dot urgent" />접수 마감</span>
          <span><i className="event-dot registration" />접수기간</span>
          <span><i className="event-dot exam" />시험일</span>
          <span><i className="event-dot result" />결과 발표</span>
        </div>

        <div className="selected-events">
          <h3>{selectedDateKey} 일정</h3>
          {selectedDayEvents.length > 0 ? (
            <ul>
              {selectedDayEvents.map((event) => (
                <li key={`${event.type}-${event.name}`}>
                  <span className={`event-pill ${event.color}`}>{event.type}</span>
                  <span>{event.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-events">선택한 날짜의 일정이 없습니다.</p>
          )}
        </div>
      </section>

      <section className="schedule-list">
        {selectedDateSchedule.length > 0 ? (
          selectedDateSchedule.map((item) => (
            <article key={`${item.name}-${selectedDateKey}`} className="schedule-item">
              <div className="schedule-card-badge">
                <div className="dday-icon">D</div>
                <div className="dday-count">{getDDay(item.examDate).replace('D-', '')}</div>
              </div>
              <div className="schedule-card-body">
                <div className="schedule-item-header">
                  <div>
                    <div className="schedule-title-row">
                      <h2 className="schedule-item-title">{item.name}</h2>
                      {item.matchedTags[0] ? (
                        <div className={getDateTagPillClass(item.matchedTags[0])}>
                          {item.matchedTags[0]}
                        </div>
                      ) : (
                        <div className={getStatusChipClass(item.status)}>{item.status}</div>
                      )}
                    </div>
                  </div>
                  <div className="schedule-item-label">{getDDay(item.examDate)}</div>
                </div>

                <div className="schedule-meta-grid">
                  <div className="schedule-meta-item">
                    <span>접수기간</span>
                    <strong>{item.registrationPeriod}</strong>
                  </div>
                  <div className="schedule-meta-item">
                    <span>시험일</span>
                    <strong>{item.examDate}</strong>
                  </div>
                  <div className="schedule-meta-item">
                    <span>합격발표</span>
                    <strong>{item.resultDate}</strong>
                  </div>
                  <div className="schedule-meta-item">
                    <span>응시료</span>
                    <strong>{item.fee}</strong>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="schedule-empty">선택한 날짜에 해당하는 자격증 일정이 없습니다.</div>
        )}
      </section>
    </div>
  );
}

export default Schedule;
