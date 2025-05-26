// src/app/work/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getPortofolioBySlug } from '@/services/getPortofolioBySlug';
import {
  Column,
  Heading,
  SmartImage,
  Text,
  Button,
} from '@/once-ui/components';

export default async function ProjectDetail({
  params,
}: {
  params: { slug: string };
}) {
  const portofolio = await getPortofolioBySlug(params.slug);

  if (!portofolio) {
    notFound();
  }

  return (
    <Column as='section' maxWidth='m' horizontal='start' gap='l'>
      <Button href='/work' variant='tertiary' size='s' prefixIcon='chevronLeft'>
        Projects
      </Button>

      <Heading variant='display-strong-s'>{portofolio.portofolioTitle}</Heading>

      <SmartImage
        priority
        aspectRatio='16 / 9'
        radius='m'
        alt={portofolio.portofolioTitle}
        src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${portofolio.portofolioURL}`}
      />

      <Text variant='body-default-m' paddingTop='20'>
        {portofolio.portofolioDesc}
      </Text>

      {portofolio.projectURL && (
        <Button href={portofolio.projectURL} variant='secondary' arrowIcon>
          View Project
        </Button>
      )}
    </Column>
  );
}
