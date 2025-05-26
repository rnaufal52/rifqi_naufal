import { supabase } from '@/lib/supabaseClient';
import { Person } from '@/types/person';

export const getPersonByEmail = async (
  email: string
): Promise<Person | null> => {
  const { data, error } = await supabase
    .from('descriptions')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    console.error('Error fetching person:', error?.message);
    return null;
  }

  return {
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    avatar: data.avatar,
    role: data.role_name,
    location: data.location,
    languages: Array.isArray(data.languages) ? data.languages : [],
    callName: data.call_name,
    cv: data.cv,
    name: `${data.first_name} ${data.last_name}`,
    github: data.github,
    linkedin: data.linkedin,
  };
};
