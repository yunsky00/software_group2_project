import { useState, useEffect } from 'react';
import { 링크, useParams } from 'react-router-dom';
import CertificationCard from '../components/CertificationCard';
import { categoryMeta } from '../data/certifications';
import { supabase } from './supabaseClient'; 

function CategoryPage() {
  const { 입력 } = useParams();
  const [items, setItems] = useState([]);
  const [selectedField, setSelectedField] = useState('전체');
  const [isLoading, setIsLoading] = useState(true);
  
  const meta = categoryMeta[type];

  useEffect(() => {
    async function fetchCategoryItems() {
      setIsLoading(true);
      try {

        const typeMap = {
          'corporate': 'corporate', '대기업': 'corporate',
          'public': 'public', '공기업': 'public',
          'government': 'government', '공무원': 'government'
        };

        const resolvedCategory = typeMap[type] || type;
        console.log("🔍 DB 조회 시도 (category 컬럼):", resolvedCategory);

        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('category', resolvedCategory); 
        
        if (error) throw error;
        
        console.log("🔥 가져온 데이터:", data); 
        setItems(data || []);
      } catch (error) {
        console.error('조회 실패:', error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (type) fetchCategoryItems();
  }, [type]);

  if (!meta) return <section>카테고리를 찾을 수 없습니다.</section>;

  const uniqueFields = ['전체', ...new Set(items.map((item) => item.field).filter(Boolean))];
  const filtered = selectedField === '전체' ? items : items.filter((item) => item.field === selectedField);

  return (
    <div className="page-stack category-page">
      <Link to="/" className="back-link">← 돌아가기</Link>
      <section className="category-page__header">
        <h1>{meta.title}</h1>
        <strong className="category-page__count">{filtered.length}개 항목</strong>
      </section>

      {isLoading ? <div>로딩 중...</div> : (
        <>
          <div className="filter-row">
            {uniqueFields.map((field) => (
              <button key={field} onClick={() => setSelectedField(field)} className={selectedField === field ? 'chip--active' : ''}>
                {field}
              </button>
            ))}
          </div>
          <section className="list-grid">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <CertificationCard 
                  key={item.id} 
                  item={{ 
                    ...item, 
                    title: item.name, 
                    organization: item.issuer 
                  }} 
                />
              ))
            ) : (
              <div style={{ padding: '40px', textAlign: 'center' }}>해당 분류의 자격증이 없습니다.</div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default CategoryPage;
