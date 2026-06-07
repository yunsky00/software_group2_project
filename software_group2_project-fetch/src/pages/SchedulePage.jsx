import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import CalendarView from '../components/CalendarView';

function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedules() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('exam_schedules')
          .select(`
            id,
            exam_date,
            round_name,
            certificates!exam_schedules_certificate_id_fkey ( name ) 
          `);
        
        if (error) throw error;
        
        const formattedData = (data || []).map(item => ({
          id: item.id,
          name: item.certificates?.name || '시험',
          round: item.round_name,
          examDate: item.exam_date,
          text: `[${item.round_name}] ${item.certificates?.name || '시험'}`
        }));
        
        setSchedules(formattedData);
      } catch (error) {
        console.error('스케줄 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSchedules();
  }, []);

  const events = useMemo(() => {
    return schedules.map((item) => ({
      id: `${item.id}-exam`,
      date: item.examDate,
      type: 'exam',
      text: item.text
    }));
  }, [schedules]);

  const eventsByDate = useMemo(() => {
    return schedules.filter((item) => item.examDate === selectedDate);
  }, [schedules, selectedDate]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '150px 20px' }}><h2>🗓️ 스케줄을 불러오는 중...</h2></div>;
  }

  return (
    <div className="page-stack schedule-page">
      <Link to="/" className="back-link">← 돌아가기</Link>
      
      <section className="schedule-page__header">
        <h1>D-day 시험일정 캘린더</h1>
      </section>

      <div className="panel" style={{ padding: '24px' }}>
        <CalendarView
          currentMonth={currentMonth}
          onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          eventsByDate={events} 
        />
      </div>

      <div className="schedule-detail-list">
        {eventsByDate.length === 0 ? (
          <div className="schedule-empty-state" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
            <p>해당 날짜에 예정된 일정이 없습니다.</p>
          </div>
        ) : (
          eventsByDate.map((item) => (
            <div key={item.id} className="schedule-detail-card" style={{ 
              marginBottom: '20px', 
              padding: '20px', 
              border: '1px solid #e0e0e0', 
              borderRadius: '12px', 
              backgroundColor: '#ffffff', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '10px', 
                marginBottom: '15px' 
              }}>
                <strong style={{ fontSize: '1.5em', color: '#333', wordBreak: 'keep-all' }}>{item.name}</strong>
                <span style={{ 
                  backgroundColor: '#f0f4f8', 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  fontSize: '1.1em', 
                  color: '#555',
                  fontWeight: '600'
                }}>
                  {item.round}
                </span>
              </div>
              <div style={{ 
                color: '#666', 
                fontSize: '1.3em', 
                paddingTop: '10px',
                borderTop: '1px solid #f0f0f0' 
              }}>
                시험일: <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{item.examDate || '미정'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SchedulePage;