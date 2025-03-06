import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { socialLinks } from '../../utils/data';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 4rem 2rem 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-5px);
  }
`;

const Copyright = styled.div`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Aryan Gaur</FooterTitle>
          <p>Software Engineer specializing in full-stack development with expertise in the MERN stack, UI/UX design, Python, and C++.</p>
          <SocialLinks>
            {socialLinks.map((link) => (
                <SocialIcon 
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  whileTap={{ y: 0 }}
                >
                  {link.name}
                </SocialIcon>
            ))}
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink href="#home">Home</FooterLink>
          <FooterLink href="#about">About</FooterLink>
          <FooterLink href="#skills">Skills</FooterLink>
          <FooterLink href="#projects">Projects</FooterLink>
          <FooterLink href="#experience">Experience</FooterLink>
          <FooterLink href="#contact">Contact</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Contact</FooterTitle>
          <FooterLink href="mailto:aryan.gaur@sjsu.edu">
            aryan.gaur@sjsu.edu
          </FooterLink>
          <p>San Jose State University</p>
          <p>San Jose, California</p>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        <p>&copy; {currentYear} Aryan Gaur. All rights reserved.</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
