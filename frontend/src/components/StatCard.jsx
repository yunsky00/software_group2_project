function StatCard({ label, value, sublabel, tone }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{sublabel}</p>
    </article>
  );
}

export default StatCard;
