'use client';

import { useEffect, useState, useMemo } from 'react';
import { Column, Button, Flex } from '@/once-ui/components';
import { ProjectCard } from '@/components';
import { getPortofolios } from '@/services/getPortofolios';
import { getPortofolioTypes } from '@/services/getPortofolioTypes';
import { Portofolio } from '@/types/portofolio';
import { PortofolioType } from '@/types/portofolioType';

// Konstanta untuk menentukan berapa banyak item per halaman
const ITEMS_PER_PAGE = 6; 

interface ProjectsProps {
  range?: [number, number?];
}

export function Projects({ range }: ProjectsProps) {
  const [portofolios, setPortofolios] = useState<Portofolio[]>([]);
  const [filtered, setFiltered] = useState<Portofolio[]>([]);
  const [types, setTypes] = useState<PortofolioType[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // State baru untuk halaman saat ini

  useEffect(() => {
    const fetchData = async () => {
      const [portofolioData, typeData] = await Promise.all([
        getPortofolios(),
        getPortofolioTypes(),
      ]);
      setPortofolios(portofolioData);
      setTypes(typeData);
      setFiltered(portofolioData); // default semua
      setCurrentPage(1); // Pastikan halaman reset setelah data dimuat
    };
    fetchData();
  }, []);

  // Fungsi filter. Reset halaman ke 1 saat filter berubah.
  const filterByType = (typeId: string | null) => {
    setActiveType(typeId);
    setCurrentPage(1); // Reset halaman ke 1 saat filter berubah

    if (typeId === null) {
      setFiltered(portofolios);
    } else {
      setFiltered(portofolios.filter((p) => p.portofolioTypeId === typeId));
    }
  };

  // Tentukan item mana yang akan melalui proses pagination/range
  const itemsToPaginate = range
    ? portofolios.slice(-range[0]) // Jika ada range, ambil item sesuai range
    : filtered; // Jika tidak ada range, gunakan hasil filter

  // Hitung jumlah total halaman jika tidak ada range
  const totalPages = range ? 1 : Math.ceil(itemsToPaginate.length / ITEMS_PER_PAGE);

  // Ambil item yang akan ditampilkan di halaman saat ini (atau item range)
  const displayed = useMemo(() => {
    if (range) {
        return itemsToPaginate; 
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return itemsToPaginate.slice(startIndex, endIndex);
  }, [itemsToPaginate, currentPage, range]);

  // Fungsi untuk berpindah halaman
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        // Opsional: Scroll ke atas saat pindah halaman
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Column gap='xl' paddingX='l' marginBottom='40'>
      
      {/* Tombol Filter (Hanya muncul jika tidak ada range) */}
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

      {/* Daftar Project Card */}
      <Column fillWidth gap='xl' marginTop='24'>
        {displayed.map((item, index) => (
          <ProjectCard
            key={item.portofolioId}
            // priority hanya diberikan pada 2 item pertama di halaman pertama (index < 2) 
            // dan hanya jika tidak menggunakan prop range
            priority={!range && currentPage === 1 && index < 2} 
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
        
        {/* Pesan jika tidak ada hasil */}
        {displayed.length === 0 && (
            <p>Tidak ada portofolio yang ditemukan.</p>
        )}
      </Column>

      {/* --- Komponen Pagination (Hanya muncul jika tidak ada range & total halaman > 1) --- */}
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

          {/* Tombol Halaman */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            
            // Tampilkan beberapa halaman utama dan halaman di sekitar halaman saat ini
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

            // Tampilkan elipsis (...) jika ada halaman yang dilewati
            if (
                pageNumber === currentPage - 2 && currentPage > 3 ||
                pageNumber === currentPage + 2 && currentPage < totalPages - 2
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
  );
}
