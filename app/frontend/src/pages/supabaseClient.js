import { createClient } from '@supabase/supabase-js';

// 수파베이스 웹사이트 프로젝트 대시보드(Settings -> API)에 있는 주소와 Anon 키를 적어줍니다.
const SUPABASE_URL = 'https://kxbbcnjzfmfdrlvdsdsb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YmJjbmp6Zm1mZHJsdmRzZHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzEyMzgsImV4cCI6MjA5NDI0NzIzOH0.VGF-PDx7uFrN87Fo-xbpYIM9kWIL3YMjQkAJS21wOdM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
