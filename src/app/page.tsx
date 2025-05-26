import React from 'react';

import {
  Heading,
  Flex,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
} from '@/once-ui/components';
import { Projects } from '@/components/work/Projects';

import { baseURL } from '@/app/resources';
import { about, newsletter } from '@/app/resources/content';
import { Mailchimp } from '@/components';
import { Meta, Schema } from '@/once-ui/modules';
import { getPersonByEmail } from '@/services/getPerson';
import { getSettingWebById } from '@/services/getSettingWebById';
import { Skills } from '@/components/Skill/Skills';

const person = await getPersonByEmail('r.naufal2911@gmail.com');
const settingWeb = await getSettingWebById(
  'e2c6f3b4-fedd-4b24-820e-f021f48eabb3'
);

export async function generateMetadata() {
  return Meta.generate({
    title: person?.name || 'anonymous',
    description: `Portfolio website showcasing my work as a ${person?.name}`,
    baseURL: baseURL,
    path: '/',
  });
}

export default async function Home() {
  return (
    <Column maxWidth='m' gap='xl' horizontal='center'>
      {/* meta data */}
      <Schema
        as='webPage'
        baseURL={baseURL}
        path='/'
        title={person?.name || 'Anonymous'}
        description={`Portfolio website showcasing my work as a ${person?.name}`}
        image={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${settingWeb?.logo}`}
        author={{
          name: person?.name || 'Anonymous',
          url: `${baseURL}/about`,
          image: `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${settingWeb?.logo}`,
        }}
      />
      <Column fillWidth paddingY='24' gap='m'>
        <Column maxWidth='s'>
          <RevealFx
            fillWidth
            horizontal='start'
            paddingTop='16'
            paddingBottom='32'
            paddingLeft='12'
          >
            <Badge
              background='brand-alpha-weak'
              paddingX='12'
              paddingY='4'
              onBackground='neutral-strong'
              textVariant='label-default-s'
              arrow={true}
              href={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${person?.cv}`}
            >
              <Row paddingY='2'>Download CV </Row>
            </Badge>
          </RevealFx>
          <RevealFx
            translateY='4'
            fillWidth
            horizontal='start'
            paddingBottom='16'
          >
            <Heading wrap='balance' variant='display-strong-l'>
              {settingWeb?.titleHero}
            </Heading>
          </RevealFx>
          <RevealFx
            translateY='8'
            delay={0.2}
            fillWidth
            horizontal='start'
            paddingBottom='32'
          >
            <Text
              wrap='balance'
              onBackground='neutral-weak'
              variant='heading-default-xl'
            >
              {settingWeb?.descHero}
            </Text>
          </RevealFx>
          <RevealFx
            paddingTop='12'
            delay={0.4}
            horizontal='start'
            paddingLeft='12'
          >
            <Button
              id='about'
              data-border='rounded'
              href={about.path}
              variant='secondary'
              size='m'
              arrowIcon
            >
              <Flex gap='8' vertical='center'>
                {about.avatar.display && (
                  <Avatar
                    style={{ marginLeft: '-0.75rem', marginRight: '0.25rem' }}
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${settingWeb?.logo}`}
                    size='m'
                  />
                )}
                {`About - ${person?.name}`}
              </Flex>
            </Button>
          </RevealFx>
        </Column>
      </Column>
      {/* skills */}
      <Flex fillWidth gap='24' mobileDirection='column'>
        <Flex flex={1} paddingLeft='l' paddingTop='24'>
          <Heading as='h2' variant='display-strong-xs' wrap='balance'>
            Technical Skill&apos;s
          </Heading>
        </Flex>
        <Flex flex={3} paddingX='20'>
          <Skills
            columns='3'
            thumbnail={true}
            direction='column'
            range={[1, 6]}
          />
        </Flex>
      </Flex>
      {/* Project */}
      <Flex fillWidth gap='24' mobileDirection='column'>
        <Flex flex={1} paddingLeft='l' paddingTop='24'>
          <Heading as='h2' variant='display-strong-xs' wrap='balance'>
            My Portofolio
          </Heading>
        </Flex>
        <Flex flex={3} paddingX='20' direction='column' gap='16'>
          <Projects range={[2]} />
          <RevealFx
            paddingTop='12'
            delay={0.4}
            horizontal='end'
            paddingLeft='12'
          >
            <Button
              id='seemore'
              data-border='rounded'
              href='/work'
              variant='secondary'
              size='l'
              arrowIcon
            >
              See More
            </Button>
          </RevealFx>
        </Flex>
      </Flex>
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}
