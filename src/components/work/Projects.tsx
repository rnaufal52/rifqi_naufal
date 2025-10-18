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
  itemsPerPage?: number; // Tambah prop untuk custom items per page
}

export function Projects({ range, itemsPerPage = 6 }: ProjectsProps) {
  const [portofolios, setPortofolios] = useState<Portofolio[]>([]);
  const [filtered, setFiltered] = useState<Portofolio[]>([]);
  const [types, setTypes] = useState<PortofolioType[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const [portofolioData, typeData] = await Promise.all([
        getPortofolios(),
        getPortofolioTypes(),
      ]);
      setPortofolios(portofolioData);
      setTypes(typeData);
      setFiltered(portofolioData);
      
      // Hitung total pages
      setTotalPages(Math.ceil(portofolioData.length / itemsPerPage));
    };
    fetchData();
  }, [itemsPerPage]);

  // Fungsi filter hanya dipakai kalau tidak ada range
  const filterByType = (typeId: string | null) => {
    setActiveType(typeId);
    setCurrentPage(1); // Reset ke page 1 ketika filter berubah
    
    if (typeId === null) {
      setFiltered(portofolios);
      setTotalPages(Math.ceil(portofolios.length / itemsPerPage));
    } else {
      const filteredData = portofolios.filter((p) => p.portofolioTypeId === typeId);
      setFiltered(filteredData);
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    }
  };

  // Fungsi untuk pagination
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Kalau range ada, ambil portofolio sesuai range tanpa filter & tombol filter
  // Kalau tidak ada range, pakai filter dengan pagination
  const displayed = range
    ? portofolios.slice(-range[0])
    : filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Generate page numbers untuk pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <Column gap='xl' paddingX='l' marginBottom='40'>
      {!range && (
        <>
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Flex gap='8' justify='center' align='center' marginTop='16'>
              <Button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                variant='secondary'
                size='sm'
              >
                Previous
              </Button>
              
              {getPageNumbers().map((page) => (
                <Button
                  key={page}
                  onClick={() => goToPage(page)}
                  variant={currentPage === page ? 'primary' : 'secondary'}
                  size='sm'
                >
                  {page}
                </Button>
              ))}
              
              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                variant='secondary'
                size='sm'
              >
                Next
              </Button>
            </Flex>
          )}
        </>
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

      {/* Pagination di bawah untuk mobile atau alternatif layout */}
      {!range && totalPages > 1 && (
        <Flex gap='8' justify='center' align='center' marginTop='24'>
          <Button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            variant='secondary'
            size='sm'
          >
            Previous
          </Button>
          
          <span style={{ margin: '0 8px' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            variant='secondary'
            size='sm'
          >
            Next
          </Button>
        </Flex>
      )}
    </Column>
  );
}
