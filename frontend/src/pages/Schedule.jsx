import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleData } from '../data/schedule';
import './Schedule.css';

function Schedule() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('전체');
  const statusOptions = ['전체', '접수 예정', '접수중', '마감임박'];

  const filteredSchedule = filter === '전체'
    ? scheduleData
    : scheduleData.filter((item) => item.status === filter);

  // D-day 계산 로직 강화 (날짜가 없을 때 에러 방지)
  const getDDay = (examDate) => {
    if (!examDate) return '미정';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return `D+${Math.abs(diff)}`;
    if (diff === 0) return 'D-Day';
    return `D-${diff}`;
  };

  const getChipClass = (status) => {
    if (status === '접수중') return 'status-chip status-chip-open';
    if (status === '마감임박') return 'status-chip status-chip-urgent';
    if (status === '접수 예정') return 'status-chip status-chip-pending';
    return 'status-chip';
  };

  return (
    <div className="schedule-page">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        ← 돌아가기
      </button>
      
      <header className="schedule-header">
        <h1>D-day 시험일정 리스트</h1>
        <p>다가오는 자격증 시험 일정과 접수 상태를 확인하세요.</p>
      </header>
      
      <div className="schedule-filters">
        {statusOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={`filter-button ${filter === option ? 'active' : ''}`}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <section className="schedule-list">
        {filteredSchedule.map((item, idx) => (
          <article key={idx} className="schedule-item">
            <div className="schedule-card-badge">
              <div className="dday-icon">D</div>
              <div className="dday-count">{getDDay(item.examDate).replace('D-', '').replace('D+', '')}</div>
            </div>
            
            <div className="schedule-card-body">
              <div className="schedule-item-header">
                <div>
                  <h2 className="schedule-item-title">{item.name}</h2>
                  <div className={getChipClass(item.status)}>{item.status}</div>
                </div>
                <div className="schedule-item-label">{getDDay(item.examDate)}</div>
              </div>

              <div className="schedule-meta-grid">
                <div className="schedule-meta-item">
                  <span>접수기간</span>

                  <strong>{item.registrationStart} ~ {item.registrationEnd}</strong>
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
        ))}
      </section>
    </div>
  );
}

export default Schedule;
