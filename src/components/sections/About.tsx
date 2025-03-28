import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const AboutSection = styled.section`
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

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const AboutImageContainer = styled(motion.div)`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  height: 450px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
    z-index: 1;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 400px;
  }
`;

const AboutImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: #2a2a2a;
  background-image: url('/about-image.png');
  background-position: center;
  background-size: cover;
`;

const AboutInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const AboutDescription = styled(motion.p)`
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;

const ResumeButton = styled(motion.a)`
  display: inline-block;
  padding: 0.875rem 2rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.colors.text.primary};
  align-self: flex-start;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;

const About: React.FC = () => {
  const { ref, controls } = useScrollAnimation();
  
  return (
    <AboutSection id="about" ref={ref}>
      <Container>
        <AboutContent>
          <AboutImageContainer
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
            }}
            initial="hidden"
            animate={controls}
          >
            <AboutImage />
          </AboutImageContainer>
          
          <AboutInfo
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
            }}
            initial="hidden"
            animate={controls}
          >
            <SectionTitle
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              initial="hidden"
              animate={controls}
            >
              About Me
            </SectionTitle>
            
            <AboutDescription
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } }
              }}
              initial="hidden"
              animate={controls}
            >
              I'm a passionate Software Engineer with expertise in full-stack development, focusing on creating efficient and user-friendly applications. With a strong foundation in computer engineering and a keen eye for detail, I strive to build software that makes a positive impact.
              <br /><br />
              Currently pursuing my Bachelor's of Science in Computer Engineering at San Jose State University, I combine academic knowledge with practical experience to deliver high-quality solutions. I enjoy tackling complex problems and continuously learning new technologies.
            </AboutDescription>
            
            <ResumeButton
              as="a"
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="resume.pdf"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
              }}
              initial="hidden"
              animate={controls}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Resume
            </ResumeButton>
          </AboutInfo>
        </AboutContent>
      </Container>
    </AboutSection>
  );
};

export default About;
