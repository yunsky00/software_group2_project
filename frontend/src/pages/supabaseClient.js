import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 값이 잘 들어왔는지 확인하는 코드 (에러 발생 시 콘솔 확인)
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase 환경변수를 찾을 수 없습니다. .env 파일 이름과 VITE_ 접두사를 확인하세요.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
