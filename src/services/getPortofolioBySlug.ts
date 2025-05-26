import { supabase } from '@/lib/supabaseClient';
import { Portofolio } from '@/types/portofolio';

export const getPortofolioBySlug = async (
  slug: string
): Promise<Portofolio | null> => {
  const { data, error } = await supabase
    .from('portofolios')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching portofolio:', error?.message);
    return null;
  }

  return {
    portofolioId: data.portofolio_id,
    portofolioTypeId: data.portofolio_type_id,
    portofolioTitle: data.portofolio_title,
    portofolioDesc: data.portofolio_desc,
    portofolioURL: data.portofolio_img_url,
    projectURL: data.project_url,
    slug: data.slug,
  };
};
