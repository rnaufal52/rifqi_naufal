'use client';

import { useEffect, useState } from 'react';
import { Grid } from '@/once-ui/components';
import SkillComponent from './SkillComponent';
import { getSkills } from '@/services/getSkills';
import { Skill } from '@/types/skill';

interface SkillsProps {
  range?: [number] | [number, number];
  columns?: '1' | '2' | '3';
  thumbnail?: boolean;
  direction?: 'row' | 'column';
}

export function Skills({
  range,
  columns = '1',
  thumbnail = false,
  direction,
}: SkillsProps) {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    async function fetchSkills() {
      const data = await getSkills();
      setSkills(data);
    }
    fetchSkills();
  }, []);

  const displayedSkills = range
    ? skills.slice(range[0] - 1, range.length === 2 ? range[1] : skills.length)
    : skills;

  return (
    <>
      {displayedSkills.length > 0 && (
        <Grid
          columns={columns}
          mobileColumns='1'
          fillWidth
          marginBottom='40'
          gap='12'
        >
          {displayedSkills.map((skill, index) => (
            <SkillComponent
              key={index}
              skill={skill}
              thumbnail={thumbnail}
              direction={direction}
            />
          ))}
        </Grid>
      )}
    </>
  );
}
