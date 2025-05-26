import { supabase } from '@/lib/supabaseClient';
import { PortofolioType } from '@/types/portofolioType';

export const getPortofolioTypes = async (): Promise<PortofolioType[]> => {
  const { data, error } = await supabase.from('portofolio_types').select('*');

  if (error) {
    console.error('Error fetching portofolio type:', error.message);
    return [];
  }

  // Map data dari database ke bentuk Skill sesuai tipe
  return data.map((item: any) => ({
    portofolioTypeId: item.portofolio_type_id,
    portofolioTypeName: item.portofolio_type_name,
  }));
};
