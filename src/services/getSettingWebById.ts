import { supabase } from '@/lib/supabaseClient';
import { SettingWeb } from '@/types/settingWeb';

export const getSettingWebById = async (
  id: string
): Promise<SettingWeb | null> => {
  const { data, error } = await supabase
    .from('porto_web')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching settingWeb:', error?.message);
    return null;
  }

  return {
    logo: data.logo,
    titleHero: data.title_hero,
    descHero: data.desc_hero,
  };
};
