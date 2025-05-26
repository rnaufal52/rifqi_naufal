import {
  Avatar,
  Button,
  Column,
  Flex,
  Heading,
  Icon,
  IconButton,
  Tag,
  Text,
  SmartLink,
} from '@/once-ui/components';
import { baseURL } from '@/app/resources';
import TableOfContents from '@/components/about/TableOfContents';
import styles from '@/components/about/about.module.scss';
import { about } from '@/app/resources/content';
import React from 'react';
import { Meta, Schema } from '@/once-ui/modules';
import { getPersonByEmail } from '@/services/getPerson';
import { getSettingWebById } from '@/services/getSettingWebById';
import { getExperiences } from '@/services/getExperiences';
import { getStudies } from '@/services/getStudies';

const person = await getPersonByEmail('r.naufal2911@gmail.com');
const settingWeb = await getSettingWebById(
  'e2c6f3b4-fedd-4b24-820e-f021f48eabb3'
);
const experience = await getExperiences();
const studies = await getStudies();

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default function About() {
  const structure = [
    {
      title: 'Introduction',
      display: true,
      items: [],
    },
    {
      title: 'Work Experience',
      display: true,
      items: [],
    },
    {
      title: 'Studies',
      display: true,
      items: [],
    },
  ];
  const languages = person?.languages;
  return (
    <Column maxWidth='m'>
      <Schema
        as='webPage'
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={`${baseURL}/og?title=${encodeURIComponent(about.title)}`}
        author={{
          name: `${person?.name}`,
          url: `${baseURL}/about`,
          image: `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${settingWeb?.logo}`,
        }}
      />
      <Column
        left='0'
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        position='fixed'
        paddingLeft='24'
        gap='32'
        hide='s'
      >
        <TableOfContents structure={structure} />
      </Column>

      <Flex fillWidth mobileDirection='column' horizontal='center'>
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            position='sticky'
            minWidth='160'
            paddingX='l'
            paddingBottom='xl'
            gap='m'
            flex={3}
            horizontal='center'
          >
            <Avatar
              src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${settingWeb?.logo}`}
              size='xl'
            />
            <Flex gap='8' vertical='center'>
              <Icon onBackground='accent-weak' name='globe' />
              {person?.location}
            </Flex>
            {languages && languages.length > 0 && (
              <Flex wrap gap='8'>
                {languages.map((language, index) => (
                  <Tag key={`${language}-${index}`} size='l'>
                    {language}
                  </Tag>
                ))}
              </Flex>
            )}
          </Column>
        )}
        <Column className={styles.blockAlign} flex={9} maxWidth={40}>
          <Column
            id='Introduction'
            fillWidth
            minHeight='160'
            vertical='center'
            marginBottom='32'
          >
            <Heading className={styles.textAlign} variant='display-strong-xl'>
              {person?.name}
            </Heading>
            <Text
              className={styles.textAlign}
              variant='display-default-xs'
              onBackground='neutral-weak'
            >
              {person?.role}
            </Text>
            {/* social media */}
            <Flex
              className={styles.blockAlign}
              paddingTop='20'
              paddingBottom='8'
              gap='8'
              wrap
              horizontal='center'
              fitWidth
              data-border='rounded'
            >
              <Button
                className='s-flex-hide'
                href={person?.github}
                prefixIcon='github'
                label='GitHub'
                size='s'
                variant='secondary'
              />
              <IconButton
                className='s-flex-show'
                size='l'
                href={person?.github}
                icon='github'
                variant='secondary'
              />

              <Button
                className='s-flex-hide'
                href={person?.linkedin}
                prefixIcon='linkedin'
                label='LinkedIn'
                size='s'
                variant='secondary'
              />
              <IconButton
                className='s-flex-show'
                size='l'
                href={person?.linkedin}
                icon='linkedin'
                variant='secondary'
              />

              <Button
                className='s-flex-hide'
                href={`mailto:${person?.email}`}
                prefixIcon='email'
                label='Email'
                size='s'
                variant='secondary'
              />
              <IconButton
                className='s-flex-show'
                size='l'
                href={`mailto:${person?.email}`}
                icon='email'
                variant='secondary'
              />
            </Flex>
          </Column>

          {/* desc */}
          <Column
            textVariant='body-default-l'
            fillWidth
            gap='m'
            marginBottom='xl'
          >
            {settingWeb?.descHero}
          </Column>

          {/* work experience */}
          {about.work.display && (
            <>
              <Heading
                as='h2'
                id='Work Experience'
                variant='display-strong-s'
                marginBottom='m'
              >
                Work Experience
              </Heading>
              <Column fillWidth gap='l' marginBottom='40'>
                {experience.map((exp, index) => (
                  <Column key={`${exp.experienceID}-${index}`} fillWidth>
                    <Flex
                      fillWidth
                      horizontal='space-between'
                      vertical='end'
                      marginBottom='4'
                    >
                      <Text
                        id={exp.experienceOffice}
                        variant='heading-strong-l'
                      >
                        {exp.experienceOffice}
                      </Text>
                      <Text
                        variant='heading-default-xs'
                        onBackground='neutral-weak'
                      >
                        {exp.experienceStartDate} -{' '}
                        {exp.experienceFinishDate ?? 'Present'}
                      </Text>
                    </Flex>
                    <Text
                      variant='body-default-s'
                      onBackground='brand-weak'
                      marginBottom='m'
                    >
                      {exp.experiencePosition}
                    </Text>
                    <Column as='ul' gap='16'>
                      {exp.experienceDesc.map((desc, idx) => (
                        <Text
                          as='li'
                          variant='body-default-m'
                          key={`${exp.experienceID}-${idx}`} // <--- PERBAIKAN DI SINI
                        >
                          {desc}
                        </Text>
                      ))}
                    </Column>
                    {exp.experienceUrlWebsite && (
                      <SmartLink
                        suffixIcon='arrowUpRightFromSquare'
                        style={{ margin: '0', width: 'fit-content' }}
                        href={exp.experienceUrlWebsite}
                      >
                        <Text variant='body-default-s'>View Website</Text>
                      </SmartLink>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {/* studies */}
          {about.studies.display && (
            <>
              <Heading
                as='h2'
                id='Studies'
                variant='display-strong-s'
                marginBottom='m'
              >
                Studies
              </Heading>
              <Column fillWidth gap='l' marginBottom='40'>
                {studies.map((institution, index) => (
                  <Column
                    key={`${institution.studyID}-${index}`}
                    fillWidth
                    gap='4'
                  >
                    <Flex
                      fillWidth
                      horizontal='space-between'
                      vertical='end'
                      marginBottom='4'
                    >
                      <Text
                        id={institution.studyName}
                        variant='heading-strong-l'
                      >
                        {institution.studyName}
                      </Text>
                      <Text
                        variant='heading-default-xs'
                        onBackground='neutral-weak'
                      >
                        {institution.studyStartDate} -{' '}
                        {institution.studyFinishDate ?? 'Present'}
                      </Text>
                    </Flex>
                    <Text
                      variant='heading-default-xs'
                      onBackground='neutral-weak'
                    >
                      {institution.studyMajor}
                    </Text>
                  </Column>
                ))}
              </Column>
            </>
          )}
        </Column>
      </Flex>
    </Column>
  );
}
