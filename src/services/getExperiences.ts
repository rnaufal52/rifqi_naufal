import { supabase } from '@/lib/supabaseClient';
import { Experience } from '@/types/experience';

const formatDateToMonthYear = (dateString: string | null): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const getExperiences = async (): Promise<Experience[]> => {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('experience_start_date', { ascending: false });

  if (error) {
    console.error('Error fetching experience:', error.message);
    return [];
  }

  return (data ?? []).map((item: any) => ({
    experiencePosition: item.experience_position,
    experienceOffice: item.experience_office,
    experienceUrlWebsite: item.experience_url_website,
    experienceDesc: Array.isArray(item.experience_desc)
      ? item.experience_desc
      : [],
    experienceStartDate: formatDateToMonthYear(item.experience_start_date),
    experienceFinishDate: formatDateToMonthYear(item.experience_finish_date),
    experienceID: item.experience_id,
  }));
};
