import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CertificationCard from '../components/CertificationCard';
import { categoryMeta, certifications, fieldOptions } from '../data/certifications';

function CategoryPage() {
  const { type } = useParams();
  const [selectedField, setSelectedField] = useState('전체');
  const meta = categoryMeta[type];

  if (!meta) {
    return (
      <section className="empty-state">
        <h1>존재하지 않는 카테고리입니다.</h1>
        <Link to="/" className="button button--primary">홈으로 이동</Link>
      </section>
    );
  }

  const items = certifications.filter((item) => item.category === type);
  const filtered = selectedField === '전체' ? items : items.filter((item) => item.field === selectedField);
  const visibleFields = fieldOptions.filter((field) => field === '전체' || items.some((item) => item.field === field));

  return (
    <div className="page-stack category-page">
      <Link to="/" className="back-link">← 돌아가기</Link>

      <section className="category-page__header">
        <div className="category-page__title">
          <span className="category-page__icon">{meta.icon}</span>
          <div>
            <h1>{meta.title}</h1>
            <p>{meta.subtitle}</p>
          </div>
        </div>
        <strong className="category-page__count">{meta.countLabel}</strong>
      </section>

      <div className="filter-row filter-row--compact">
        {visibleFields.map((field) => (
          <button
            key={field}
            type="button"
            className={`chip${selectedField === field ? ' chip--active' : ''}`}
            onClick={() => setSelectedField(field)}
          >
            {field}
          </button>
        ))}
      </div>

      <section className="list-grid list-grid--stack">
        {filtered.map((item) => (
          <CertificationCard key={item.id} item={item} />
        ))}
      </section>
    </div>
  );
}

export default CategoryPage;
