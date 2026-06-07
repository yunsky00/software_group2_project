import { supabase } from '../pages/supabaseClient'; // 경로 확인 필요

// 1. 세션 확인 (비동기)
export async function isAuthenticated() {
  const { data } = await supabase.auth.getSession();
  return !!data.session; // 세션이 있으면 true, 없으면 false
}

// 2. 로그인 (이메일/비밀번호 방식)
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// 3. 로그아웃
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}