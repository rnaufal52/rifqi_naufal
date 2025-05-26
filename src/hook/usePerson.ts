import { useEffect, useState } from 'react';
import { getPersonByEmail } from '@/services/getPerson';
import { Person } from '@/types/person';

export const usePerson = (email: string) => {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerson = async () => {
      const data = await getPersonByEmail(email);
      setPerson(data);
      setLoading(false);
    };

    fetchPerson();
  }, [email]);

  return { person, loading };
};
