import { useEffect, useState } from 'react';
import { getSettingWebById } from '@/services/getSettingWebById';
import { SettingWeb } from '@/types/settingWeb';

export const useSettingWeb = (id: string) => {
  const [settingWeb, setSettingWeb] = useState<SettingWeb | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSettingWebById(id);
      setSettingWeb(data);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  return { settingWeb, loading };
};
