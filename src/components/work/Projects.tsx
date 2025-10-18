'use client';

import { useEffect, useState, useMemo } from 'react';
import { useEffect, useState } from 'react';
import { Column, Button, Flex } from '@/once-ui/components';
import { ProjectCard } from '@/components';
import { getPortofolios } from '@/services/getPortofolios';
import { getPortofolioTypes } from '@/services/getPortofolioTypes';
import { Portofolio } from '@/types/portofolio';
import { PortofolioType } from '@/types/portofolioType';

const ITEMS_PER_PAGE = 6;

interface ProjectsProps {
  range?: [number, number?];
}

export function Projects({ range }: ProjectsProps) {
  const [portofolios, setPortofolios] = useState<Portofolio[]>([]);
  const [filtered, setFiltered] = useState<Portofolio[]>([]);
  const [types, setTypes] = useState<PortofolioType[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1);
    if (typeId === null) {
      setFiltered(portofolios);
    } else {
      setFiltered(portofolios.filter((p) => p.portofolioTypeId === typeId));
    }
  };

  // Kalau range ada, ambil portofolio sesuai range tanpa filter & tombol filter
  // Kalau tidak ada range, pakai filter
  const itemsToPaginate = range
    ? portofolios.slice(-range[0]) // misal 2 terakhir
    : filtered;
  
  // Hitung jumlah total halaman
  const totalPages = Math.ceil(itemsToPaginate.length / ITEMS_PER_PAGE);

  // Ambil item yang akan ditampilkan di halaman saat ini (jika tidak ada range)
  const displayed = useMemo(() => {
    if (range) {
        return itemsToPaginate; // Jika ada range, tampilkan semua item range
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return itemsToPaginate.slice(startIndex, endIndex);
  }, [itemsToPaginate, currentPage, range]);

  // Fungsi untuk mengubah halaman
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        // Opsional: scroll ke atas halaman saat pindah halaman
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  

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
            description={item.portofolioDesc}
            content={item.slug}
            avatars={[]}
            link={item.projectURL || ''}
          />
        ))}
      </Column>

      </Column>

      {/* --- Komponen Pagination --- */}
      {!range && totalPages > 1 && (
        <Flex gap='8' justifyContent='center' marginTop='40'>
          {/* Tombol Sebelumnya */}
          <Button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            variant='secondary'
          >
            &larr; Sebelumnya
          </Button>

          {/* Tombol Halaman (Opsional: Tampilkan beberapa halaman) */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            // Hanya tampilkan beberapa halaman di sekitar halaman saat ini
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <Button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  variant={currentPage === pageNumber ? 'primary' : 'secondary'}
                >
                  {pageNumber}
                </Button>
              );
            }
            // Tambahkan elipsis jika ada halaman yang dilewati
            if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
            ) {
                return <span key={`dots-${pageNumber}`}>...</span>;
            }
            return null;
          })}

          {/* Tombol Selanjutnya */}
          <Button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant='secondary'
          >
            Selanjutnya &rarr;
          </Button>
        </Flex>
      )}
      {/* --- Akhir Komponen Pagination --- */}
    </Column>
    </Column>
  );
}

