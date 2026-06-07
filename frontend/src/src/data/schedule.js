import { certifications } from './certifications';

function normalizeDate(value) {
  if (!value) return '';
  if (value.includes('-')) return value;
  return value.replaceAll('.', '-');
}

export const scheduleData = certifications.flatMap((item) =>
  item.schedule.map((schedule) => ({
    certificationId: item.id,
    name: item.name,
    field: item.field,
    examDate: normalizeDate(schedule.testDate),
    registrationStart: normalizeDate(schedule.registrationStart),
    registrationEnd: normalizeDate(schedule.registrationEnd),
    resultDate: normalizeDate(schedule.resultDate),
    status: schedule.status,
    fee: item.fee,
  })),
);

export function buildCalendarEvents(items) {
  const events = [];

  items.forEach((item) => {
    const start = new Date(`${item.registrationStart}T00:00:00`);
    const end = new Date(`${item.registrationEnd}T00:00:00`);

    for (let current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
      events.push({
        date: current.toISOString().slice(0, 10),
        type: current.toISOString().slice(0, 10) === item.registrationStart ? 'start' : 'period',
        label:
          current.toISOString().slice(0, 10) === item.registrationStart
            ? '접수 시작'
            : current.toISOString().slice(0, 10) === item.registrationEnd
              ? '접수 마감'
              : '접수기간',
        name: item.name,
        certificationId: item.certificationId,
      });
    }

    events.push({
      date: item.registrationEnd,
      type: 'end',
      label: '접수 마감',
      name: item.name,
      certificationId: item.certificationId,
    });
    events.push({
      date: item.examDate,
      type: 'exam',
      label: '시험일',
      name: item.name,
      certificationId: item.certificationId,
    });
    events.push({
      date: item.resultDate,
      type: 'result',
      label: '결과 발표',
      name: item.name,
      certificationId: item.certificationId,
    });
  });

  return events;
}
