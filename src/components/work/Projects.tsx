"use client";

import { useEffect, useState } from "react";
import { Column, Button, Flex, Text } from "@/once-ui/components";
import { ProjectCard } from "@/components";
import { getPortofolios } from "@/services/getPortofolios";
import { getPortofolioTypes } from "@/services/getPortofolioTypes";
import { Portofolio } from "@/types/portofolio";
import { PortofolioType } from "@/types/portofolioType";

interface ProjectsProps {
  range?: [number, number?];
  itemsPerPage?: number;
}

export function Projects({ range, itemsPerPage = 6 }: ProjectsProps) {
  const [portofolios, setPortofolios] = useState<Portofolio[]>([]);
  const [filtered, setFiltered] = useState<Portofolio[]>([]);
  const [types, setTypes] = useState<PortofolioType[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set client side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [portofolioData, typeData] = await Promise.all([
          getPortofolios(),
          getPortofolioTypes(),
        ]);
        setPortofolios(portofolioData);
        setTypes(typeData);
        setFiltered(portofolioData);

        // Hitung total pages
        setTotalPages(Math.ceil(portofolioData.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
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
      const filteredData = portofolios.filter(
        (p) => p.portofolioTypeId === typeId
      );
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
    : filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

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

  // Jangan render apa-apa di server untuk menghindari hydration mismatch
  if (!isClient) {
    return (
      <Column gap="xl" paddingX="l">
        <Flex gap="8" wrap>
          <Button variant="secondary">Semua</Button>
          {/* Skeleton untuk tombol filter */}
          {[1, 2, 3].map((i) => (
            <Button key={i} variant="secondary" disabled>
              ...
            </Button>
          ))}
        </Flex>
        <Column fillWidth gap="xl" marginTop="24">
          {/* Skeleton untuk project cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: "200px", background: "#f0f0f0" }} />
          ))}
        </Column>
      </Column>
    );
  }

  return (
    <Column gap="xl" paddingX="l">
      {!range && (
        <Flex gap="8" wrap>
          <Button
            onClick={() => filterByType(null)}
            variant={activeType === null ? "primary" : "secondary"}
          >
            Semua
          </Button>
          {types.map((type) => (
            <Button
              key={type.portofolioTypeId}
              onClick={() => filterByType(type.portofolioTypeId)}
              variant={
                activeType === type.portofolioTypeId ? "primary" : "secondary"
              }
            >
              {type.portofolioTypeName}
            </Button>
          ))}
        </Flex>
      )}

      <Column fillWidth gap="xl" marginTop="24">
        {isLoading ? (
          // Loading state
          <Column align="center" gap="m">
            <Text onBackground="neutral-medium">Memuat proyek...</Text>
          </Column>
        ) : displayed.length === 0 ? (
          // Empty state
          <Column align="center" horizontal="center" gap="m">
            <Text onBackground="neutral-medium">
              {activeType
                ? `Tidak ada proyek dalam kategori "${
                    types.find((t) => t.portofolioTypeId === activeType)
                      ?.portofolioTypeName || "ini"
                  }"`
                : "Belum ada proyek yang ditambahkan"}
            </Text>
            {activeType && (
              <Button
                onClick={() => filterByType(null)}
                variant="secondary"
                size="m"
              >
                Lihat Semua Proyek
              </Button>
            )}
          </Column>
        ) : (
          // Data tersedia
          displayed.map((item, index) => {
            // Cek jika portofolioURL adalah YouTube link
            const isYouTube =
              item.portofolioURL?.includes("youtube.com") ||
              item.portofolioURL?.includes("youtu.be");

            return (
              <ProjectCard
                key={item.portofolioId}
                priority={index < 2}
                href={`/work/${item.slug}`}
                images={
                  isYouTube
                    ? []
                    : [
                        // Jika YouTube, kosongkan images
                        `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${item.portofolioURL}`,
                      ]
                }
                youtubeLinks={
                  isYouTube
                    ? [
                        // Jika YouTube, masukkan ke youtubeLinks
                        `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${item.portofolioURL}`,
                      ]
                    : []
                }
                title={item.portofolioTitle}
                description={item.portofolioDesc}
                content={item.slug}
                avatars={[]}
                link={item.projectURL || ""}
              />
            );
          })
        )}
      </Column>

      {/* Pagination di bawah untuk mobile atau alternatif layout */}
      {!range && totalPages > 1 && displayed.length > 0 && (
        <Column gap="8" align="center" horizontal="center" marginTop="16">
          <Flex gap="8" align="center">
            <Button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              variant="secondary"
              size="m"
            >
              Previous
            </Button>

            {getPageNumbers().map((page) => (
              <Button
                key={page}
                onClick={() => goToPage(page)}
                variant={currentPage === page ? "primary" : "secondary"}
                size="m"
              >
                {page}
              </Button>
            ))}

            <Button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              variant="secondary"
              size="m"
            >
              Next
            </Button>
          </Flex>
        </Column>
      )}
    </Column>
  );
}
