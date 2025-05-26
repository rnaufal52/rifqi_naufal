import { supabase } from '@/lib/supabaseClient';
import { Portofolio } from '@/types/portofolio';

export const getPortofolios = async (): Promise<Portofolio[]> => {
  const { data, error } = await supabase.from('portofolios').select('*');

  if (error) {
    console.error('Error fetching portofolios:', error.message);
    return [];
  }

  // Map data dari database ke bentuk Skill sesuai tipe
  return data.map((item: any) => ({
    portofolioId: item.portofolio_id,
    portofolioTypeId: item.portofolio_type_id,
    portofolioTitle: item.portofolio_title,
    portofolioDesc: item.portofolio_desc,
    portofolioURL: item.portofolio_img_url,
    projectURL: item.project_url,
    slug: item.slug,
  }));
};
