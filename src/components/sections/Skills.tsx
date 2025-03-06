import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { skills } from '../../utils/data';
import { FaReact, FaNodeJs, FaPython, FaDatabase, FaFigma } from 'react-icons/fa';
import { SiTypescript, SiJavascript, SiMongodb, SiExpress, SiCplusplus, SiCss3, SiHtml5 } from 'react-icons/si';

const SkillsSection = styled.section`
  padding: 8rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 6rem 1rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: ${({ theme }) => theme.colors.gradient.primary};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 3rem;
  text-align: center;
`;

const SkillCategories = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const CategoryButton = styled(motion.button)<{ isActive: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : 'rgba(255, 255, 255, 0.05)'};
  color: ${({ theme, isActive }) => 
    isActive ? theme.colors.white : theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme, isActive }) => 
      isActive ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const SkillCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const SkillName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
`;

const SkillLevel = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.5rem;
`;

const LevelDot = styled.div<{ filled: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ theme, filled }) => 
    filled ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
`;

const Skills: React.FC = () => {
  // Categories removed as requested
  const { ref: titleRef, controls: titleControls } = useScrollAnimation();
  const { ref: skillsRef, controls: skillsControls } = useScrollAnimation(0.1);

  // Categories removed as requested
  const filteredSkills = skills; // Show all skills without filtering

  // Simplified icon component to avoid TypeScript errors
  const getIconComponent = (iconName: string): JSX.Element => {
    // Using a simple div with the icon name as text instead of actual icons
    return (
      <div style={{ 
        width: '24px', 
        height: '24px', 
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        color: '#4f46e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: 'bold'
      }}>
        {iconName.replace('Fa', '').replace('Si', '')}
      </div>
    );
  };

  return (
    <SkillsSection id="skills">
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <SectionTitle
            ref={titleRef}
            initial="hidden"
            animate={titleControls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            My Skills
          </SectionTitle>
          <SectionSubtitle
            initial="hidden"
            animate={titleControls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
            }}
          >
            Technologies I work with
          </SectionSubtitle>
        </div>

        {/* Categories section removed as requested */}

        <SkillsGrid
          ref={skillsRef}
          initial="hidden"
          animate={skillsControls}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {filteredSkills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { duration: 0.5, delay: index * 0.05 } 
                }
              }}
            >
              <IconWrapper>
                {getIconComponent(skill.icon)}
              </IconWrapper>
              <SkillName>{skill.name}</SkillName>
              <SkillLevel>
                {[1, 2, 3, 4, 5].map((level) => (
                  <LevelDot key={level} filled={level <= skill.level} />
                ))}
              </SkillLevel>
            </SkillCard>
          ))}
        </SkillsGrid>
      </Container>
    </SkillsSection>
  );
};

export default Skills;
