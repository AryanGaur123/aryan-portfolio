import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { experiences, education } from '../../utils/data';

const ExperienceSection = styled.section`
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

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    height: 100%;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      left: 15px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 1rem;
  }
`;

const TimelineDot = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  z-index: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 30px;
    height: 30px;
    font-size: 0.75rem;
  }
`;

const TimelineContent = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  flex: 1;
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1.5rem;
  }
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const TimelineTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TimelineSubtitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const TimelineDuration = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  background-color: rgba(79, 70, 229, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const TimelineDescription = styled.ul`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TimelineDescriptionItem = styled.li`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &::before {
    content: '•';
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const TechTag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  background-color: rgba(79, 70, 229, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const SectionDivider = styled.div`
  height: 4rem;
`;

const Experience: React.FC = () => {
  const { ref: titleRef, controls: titleControls } = useScrollAnimation();
  const { ref: expRef, controls: expControls } = useScrollAnimation(0.1);
  const { ref: eduTitleRef, controls: eduTitleControls } = useScrollAnimation();
  const { ref: eduRef, controls: eduControls } = useScrollAnimation(0.1);

  return (
    <>
      <ExperienceSection id="experience">
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
              Experience
            </SectionTitle>
            <SectionSubtitle
              initial="hidden"
              animate={titleControls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
              }}
            >
              My professional journey
            </SectionSubtitle>
          </div>

          <TimelineContainer ref={expRef}>
            {experiences.map((exp, index) => (
              <TimelineItem
                key={exp.id}
                initial="hidden"
                animate={expControls}
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { 
                    opacity: 1, 
                    x: 0, 
                    transition: { duration: 0.5, delay: index * 0.1 } 
                  }
                }}
              >
                <TimelineDot>{index + 1}</TimelineDot>
                <TimelineContent>
                  <TimelineHeader>
                    <div>
                      <TimelineTitle>{exp.position}</TimelineTitle>
                      <TimelineSubtitle>{exp.company}</TimelineSubtitle>
                    </div>
                    <TimelineDuration>{exp.duration}</TimelineDuration>
                  </TimelineHeader>
                  <TimelineDescription>
                    {exp.description.map((item, i) => (
                      <TimelineDescriptionItem key={i}>
                        {item}
                      </TimelineDescriptionItem>
                    ))}
                  </TimelineDescription>
                  <TechStack>
                    {exp.technologies.map((tech, i) => (
                      <TechTag key={i}>{tech}</TechTag>
                    ))}
                  </TechStack>
                </TimelineContent>
              </TimelineItem>
            ))}
          </TimelineContainer>
        </Container>
      </ExperienceSection>

      <SectionDivider id="education" />

      <ExperienceSection>
        <Container>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <SectionTitle
              ref={eduTitleRef}
              initial="hidden"
              animate={eduTitleControls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
            >
              Education
            </SectionTitle>
            <SectionSubtitle
              initial="hidden"
              animate={eduTitleControls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
              }}
            >
              My academic background
            </SectionSubtitle>
          </div>

          <TimelineContainer ref={eduRef}>
            {education.map((edu, index) => (
              <TimelineItem
                key={edu.id}
                initial="hidden"
                animate={eduControls}
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { 
                    opacity: 1, 
                    x: 0, 
                    transition: { duration: 0.5, delay: index * 0.1 } 
                  }
                }}
              >
                <TimelineDot>{index + 1}</TimelineDot>
                <TimelineContent>
                  <TimelineHeader>
                    <div>
                      <TimelineTitle>{edu.degree}</TimelineTitle>
                      <TimelineSubtitle>{edu.institution}</TimelineSubtitle>
                    </div>
                    <TimelineDuration>{edu.duration}</TimelineDuration>
                  </TimelineHeader>
                  <p style={{ color: '#94A3B8', lineHeight: 1.6 }}>{edu.description}</p>
                  <TimelineDescription>
                    {edu.achievements.map((item, i) => (
                      <TimelineDescriptionItem key={i}>
                        {item}
                      </TimelineDescriptionItem>
                    ))}
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </TimelineContainer>
        </Container>
      </ExperienceSection>
    </>
  );
};

export default Experience;
