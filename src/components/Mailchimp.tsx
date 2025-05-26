'use client';

import { useEffect, useState } from 'react';
import { getPersonByEmail } from '@/services/getPerson';
import { mailchimp } from '@/app/resources';
import {
  Button,
  Column,
  Heading,
  Text,
  Background,
} from '@/once-ui/components';
import { opacity, SpacingToken } from '@/once-ui/types';
import { usePerson } from '@/hook/usePerson';

type NewsletterProps = {
  display: boolean;
  title: string | JSX.Element;
  description: string | JSX.Element;
};

export const Mailchimp = ({ newsletter }: { newsletter: NewsletterProps }) => {
  const { person } = usePerson('r.naufal2911@gmail.com');

  const handleContactClick = () => {
    if (!person?.email) return;
    window.location.href = `mailto:${person.email}?subject=Project Subscription&body=Please subscribe me to the newsletter.`;
  };
  return (
    <Column
      overflow='hidden'
      fillWidth
      padding='xl'
      radius='l'
      marginBottom='m'
      horizontal='center'
      align='center'
      background='surface'
      border='neutral-alpha-weak'
    >
      <Background
        position='absolute'
        mask={{ ...mailchimp.effects.mask }}
        gradient={{
          ...mailchimp.effects.gradient,
          opacity: mailchimp.effects.gradient.opacity as opacity,
        }}
        dots={{
          ...mailchimp.effects.dots,
          opacity: mailchimp.effects.dots.opacity as opacity,
          size: mailchimp.effects.dots.size as SpacingToken,
        }}
        grid={{
          ...mailchimp.effects.grid,
          opacity: mailchimp.effects.grid.opacity as opacity,
        }}
        lines={{
          ...mailchimp.effects.lines,
          opacity: mailchimp.effects.lines.opacity as opacity,
          size: mailchimp.effects.lines.size as SpacingToken,
        }}
      />

      <Heading
        style={{ position: 'relative' }}
        marginBottom='s'
        variant='display-strong-xs'
      >
        {newsletter.title}
      </Heading>

      <Text
        style={{
          position: 'relative',
          maxWidth: 'var(--responsive-width-xs)',
        }}
        wrap='balance'
        marginBottom='l'
        onBackground='neutral-medium'
      >
        {newsletter.description}
      </Text>

      {person?.email && (
        <Button size='m' onClick={handleContactClick}>
          Contact Me
        </Button>
      )}
    </Column>
  );
};
