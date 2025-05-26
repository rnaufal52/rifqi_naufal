import { supabase } from '@/lib/supabaseClient';
import { Study } from '@/types/study';

const formatYear = (dateString: string | null): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
  }).format(date);
};

export const getStudies = async (): Promise<Study[]> => {
  const { data, error } = await supabase
    .from('studies')
    .select('*')
    .order('studies_start', { ascending: false });

  // Tambahkan ini untuk debugging:
  console.log('Supabase Studies Data:', data);
  console.log('Supabase Studies Error:', error);

  if (error) {
    console.error('Error fetching study:', error.message);
    return [];
  }

  return (data ?? []).map((item: any) => ({
    studyName: item.studies_name,
    studyMajor: item.studies_major,
    studyStartDate: formatYear(item.studies_start),
    studyFinishDate: formatYear(item.studies_finish),
    studyID: item.studies_id,
  }));
};
