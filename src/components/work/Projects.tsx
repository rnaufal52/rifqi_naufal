'use client';

import { useEffect, useState } from 'react';
import { Column, Button, Flex } from '@/once-ui/components';
import { ProjectCard } from '@/components';
import { getPortofolios } from '@/services/getPortofolios';
import { getPortofolioTypes } from '@/services/getPortofolioTypes';
import { Portofolio } from '@/types/portofolio';
import { PortofolioType } from '@/types/portofolioType';

interface ProjectsProps {
  range?: [number, number?];
}

export function Projects({ range }: ProjectsProps) {
  const [portofolios, setPortofolios] = useState<Portofolio[]>([]);
  const [filtered, setFiltered] = useState<Portofolio[]>([]);
  const [types, setTypes] = useState<PortofolioType[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [portofolioData, typeData] = await Promise.all([
        getPortofolios(),
        getPortofolioTypes(),
      ]);
      setPortofolios(portofolioData);
      setTypes(typeData);
      setFiltered(portofolioData); // default semua
    };
    fetchData();
  }, []);

  // Fungsi filter hanya dipakai kalau tidak ada range
  const filterByType = (typeId: string | null) => {
    setActiveType(typeId);
    if (typeId === null) {
      setFiltered(portofolios);
    } else {
      setFiltered(portofolios.filter((p) => p.portofolioTypeId === typeId));
    }
  };

  // Kalau range ada, ambil portofolio sesuai range tanpa filter & tombol filter
  // Kalau tidak ada range, pakai filter
  const displayed = range
    ? portofolios.slice(-range[0]) // misal 2 terakhir
    : filtered;

  return (
    <Column gap='xl' paddingX='l' marginBottom='40'>
      {!range && (
        <Flex gap='8' wrap>
          <Button
            onClick={() => filterByType(null)}
            variant={activeType === null ? 'primary' : 'secondary'}
          >
            Semua
          </Button>
          {types.map((type) => (
            <Button
              key={type.portofolioTypeId}
              onClick={() => filterByType(type.portofolioTypeId)}
              variant={
                activeType === type.portofolioTypeId ? 'primary' : 'secondary'
              }
            >
              {type.portofolioTypeName}
            </Button>
          ))}
        </Flex>
      )}

      <Column fillWidth gap='xl' marginTop='24'>
        {displayed.map((item, index) => (
          <ProjectCard
            key={item.portofolioId}
            priority={index < 2}
            href={`/work/${item.slug}`}
            images={[
              `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${item.portofolioURL}`,
            ]}
            title={item.portofolioTitle}
            description={
              item.portofolioDesc.length > 100
                ? item.portofolioDesc.slice(0, 100) + '...'
                : item.portofolioDesc
            }
            content={item.slug}
            avatars={[]}
            link={item.projectURL || ''}
          />
        ))}
      </Column>
    </Column>
  );
}
