'use client';

import {
  Column,
  Flex,
  Heading,
  SmartImage,
  Tag,
  Text,
} from '@/once-ui/components';
import styles from './Skills.module.scss';
import { Skill } from '@/types/skill';

interface SkillProps {
  skill: Skill;
  thumbnail: boolean;
  direction?: 'row' | 'column';
}

export default function SkillComponent({
  skill,
  thumbnail,
  direction,
}: SkillProps) {
  return (
    <Flex
      position='relative'
      transition='micro-medium'
      direction={direction}
      radius='l'
      className={styles.hover}
      mobileDirection='column'
      fillWidth
      style={{ borderRadius: 'var(--radius-l)' }}
    >
      {skill.skillIcon && thumbnail && (
        <SmartImage
          priority
          className={styles.image}
          sizes='(max-width: 400px) 100vw, 640px'
          border='neutral-alpha-weak'
          cursor='interactive'
          radius='l'
          src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${skill?.skillIcon}`}
          alt={'Thumbnail of ' + skill.skillName}
          aspectRatio='1 / 1'
        />
      )}
      <Column
        position='relative'
        fillWidth
        gap='4'
        padding='24'
        vertical='center'
      >
        <Heading as='h2' variant='heading-strong-l' wrap='balance'>
          {skill.skillName}
        </Heading>
        <Text variant='label-default-s' onBackground='neutral-weak'>
          Level: {skill.skillLevel}
        </Text>
      </Column>
    </Flex>
  );
}
