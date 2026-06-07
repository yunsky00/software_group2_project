// src/utils/tracking.js
import { supabase } from '../pages/supabaseClient'; 

export const trackView = async (certId) => {
  try {
    const { error } = await supabase
      .from('certificate_views')
      .insert([{ cert_id: certId }]);
    
    if (error) throw error;
  } catch (err) {
    console.error('조회수 기록 실패:', err.message);
  }
};