import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { projects } from '../../utils/data';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectsSection = styled.section`
  padding: 8rem 2rem;
  background-color: ${({ theme }) => theme.colors.card};

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

const ProjectCategories = styled(motion.div)`
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

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-10px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.7) 100%
    );
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${ProjectCard}:hover &::before {
    opacity: 1;
  }
`;

const StyledProjectImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: #2a2a2a; /* Placeholder color */
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;

  ${ProjectCard}:hover & {
    transform: scale(1.1);
  }
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TechTag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  background-color: rgba(79, 70, 229, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProjectLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Projects: React.FC = () => {
  // Categories removed as requested
  const { ref: titleRef, controls: titleControls } = useScrollAnimation();
  const { ref: projectsRef, controls: projectsControls } = useScrollAnimation(0.1);

  // Categories and filtering removed as requested

  return (
    <ProjectsSection id="projects">
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
            My Projects
          </SectionTitle>
          <SectionSubtitle
            initial="hidden"
            animate={titleControls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
            }}
          >
            Check back later to see my projects as they are being updated
          </SectionSubtitle>
        </div>

        <motion.div
          ref={projectsRef}
          style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            marginTop: '2rem'
          }}
          initial="hidden"
          animate={projectsControls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5 } }
          }}
        >
          <motion.h3
            style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: '#f8f9fa'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Projects Coming Soon
          </motion.h3>
          <motion.p
            style={{
              fontSize: '1.1rem',
              color: '#adb5bd',
              maxWidth: '600px',
              margin: '0 auto'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            I'm currently updating my portfolio with new projects. Please check back later to see my latest work!
          </motion.p>
        </motion.div>
      </Container>
    </ProjectsSection>
  );
};

export default Projects;
