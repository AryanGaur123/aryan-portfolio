import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const TestimonialsSection = styled.section`
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

const TestimonialsContainer = styled(motion.div)`
  position: relative;
  padding: 2rem 0;
`;

const TestimonialCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2.5rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: ${({ theme }) => theme.colors.gradient.primary};
  }
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: 2rem;
  left: 2.5rem;
  font-size: 2rem;
  color: rgba(79, 70, 229, 0.1);
`;

const TestimonialText = styled.p`
  font-size: 1.125rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #2a2a2a;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AuthorPosition = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TestimonialControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const ControlButton = styled(motion.button)<{ isActive?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme, isActive }) => 
      isActive ? theme.colors.primary : 'rgba(255, 255, 255, 0.3)'};
  }
`;

const Testimonials: React.FC = () => {
  const { ref: titleRef, controls: titleControls } = useScrollAnimation();
  const { ref: testimonialRef, controls: testimonialControls } = useScrollAnimation(0.1);

  return (
    <TestimonialsSection>
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
            Testimonials
          </SectionTitle>
          <SectionSubtitle
            initial="hidden"
            animate={titleControls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
            }}
          >
            Testimonials coming soon
          </SectionSubtitle>
        </div>

        <TestimonialsContainer
          ref={testimonialRef}
          initial="hidden"
          animate={testimonialControls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6 } }
          }}
        >
          <TestimonialCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <QuoteIcon>
              <span style={{ fontSize: '24px' }}>"</span>
            </QuoteIcon>
            <TestimonialText style={{ textAlign: 'center' }}>
              Testimonials will be added soon. Check back later to see what people are saying about my work!
            </TestimonialText>
          </TestimonialCard>
        </TestimonialsContainer>
      </Container>
    </TestimonialsSection>
  );
};

export default Testimonials;
