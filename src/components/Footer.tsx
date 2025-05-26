import {
  Flex,
  IconButton,
  SmartLink,
  Text,
  Button,
} from '@/once-ui/components';
import { social } from '@/app/resources/content';
import styles from './Footer.module.scss';
import { getPersonByEmail } from '@/services/getPerson';
const person = await getPersonByEmail('r.naufal2911@gmail.com');

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      as='footer'
      fillWidth
      padding='8'
      horizontal='center'
      mobileDirection='column'
    >
      <Flex
        className={styles.mobile}
        maxWidth='m'
        paddingY='8'
        paddingX='16'
        gap='16'
        horizontal='space-between'
        vertical='center'
      >
        <Text variant='body-default-s' onBackground='neutral-strong'>
          <Text onBackground='neutral-weak'>© {currentYear} /</Text>
          <Text paddingX='4'>{person?.name}</Text>
          <Text onBackground='neutral-weak'>
            {/* Usage of this template requires attribution. Please don't remove the link to Once UI. */}
            / Build your portfolio with{' '}
            <SmartLink href='https://once-ui.com/templates/magic-portfolio'>
              Once UI
            </SmartLink>
          </Text>
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
      </Flex>
      <Flex height='80' show='s'></Flex>
    </Flex>
  );
};
