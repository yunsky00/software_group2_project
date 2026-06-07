import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleData } from '../data/schedule';
import './Schedule.css';

function Schedule() {
  const navigate = useNavigate();
  // 상태 필터를 관리합니다.
  const [filter, setFilter] = useState('전체');

  // 상태 필터 옵션
  const statusOptions = ['전체', '접수 예정', '접수중', '마감임박'];

  // 선택한 필터에 맞춰 리스트를 걸러냅니다.
  const filteredSchedule = filter === '전체'
    ? scheduleData
    : scheduleData.filter((item) => item.status === filter);

  // D-day를 계산하는 도우미 함수
  const getDDay = (examDate) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
  };

  // 상단 상태 카드 데이터
  const summary = [
    {
      title: '접수 예정',
      count: scheduleData.filter((item) => item.status === '접수 예정').length,
      color: 'status-blue',
    },
    {
      title: '접수중',
      count: scheduleData.filter((item) => item.status === '접수중').length,
      color: 'status-green',
    },
    {
      title: '긴급 (D-7 이내)',
      count: scheduleData.filter((item) => {
        const diff = Math.ceil((new Date(item.examDate) - new Date()) / (1000 * 60 * 60 * 24));
        return diff >= 0 && diff <= 7;
      }).length,
      color: 'status-red',
    },
  ];

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
        <div>
          <h1 className="schedule-title">D-day 시험일정 캘린더</h1>
          <p className="schedule-description">다가오는 자격증 시험 일정과 접수 상태를 한눈에 확인하세요.</p>
        </div>
      </header>

      <section className="status-grid">
        {summary.map((item) => (
          <article key={item.title} className={`status-card ${item.color}`}>
            <p className="status-card-title">{item.title}</p>
            <p className="status-card-value">{item.count}개</p>
          </article>
        ))}
      </section>

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
        {filteredSchedule.map((item) => (
          <article key={item.name} className="schedule-item">
            <div className="schedule-card-badge">
              <div className="dday-icon">D</div>
              <div className="dday-count">{getDDay(item.examDate).replace('D-', '')}</div>
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
        ))}
      </section>
    </div>
  );
}

export default Schedule;
