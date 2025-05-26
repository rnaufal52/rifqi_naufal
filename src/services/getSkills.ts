import { supabase } from '@/lib/supabaseClient';
import { Skill } from '@/types/skill';

export const getSkills = async (): Promise<Skill[]> => {
  const { data, error } = await supabase.from('skills').select('*');

  if (error) {
    console.error('Error fetching skills:', error.message);
    return [];
  }

  // Map data dari database ke bentuk Skill sesuai tipe
  return data.map((item: any) => ({
    skillName: item.skill_name,
    skillLevel: item.skill_level,
    skillIcon: item.skill_icon_url,
  }));
};
