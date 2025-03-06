import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { socialLinks } from '../../utils/data';

const ContactSection = styled.section`
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
  margin-bottom: 1rem;
  text-align: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 3rem;
  text-align: center;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContactInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContactInfoTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ContactInfoItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.card};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const ContactInfoContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContactInfoLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ContactInfoValue = styled.a`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled(motion.a)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.card};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.25rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
    transform: translateY(-5px);
  }
`;

const ContactForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormInput = styled.input`
  padding: 1rem;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormTextarea = styled.textarea`
  padding: 1rem;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: #fff;
  border-radius: 4px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Contact: React.FC = () => {
  const { ref, controls } = useScrollAnimation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
      alert('Thank you for your message! I will get back to you soon.');
    }, 1500);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'FaGithub':
        return <FaGithub />;
      case 'FaLinkedin':
        return <FaLinkedin />;
      case 'FaTwitter':
        return <FaTwitter />;
      case 'FaEnvelope':
        return <FaEnvelope />;
      default:
        return null;
    }
  };
  
  return (
    <ContactSection id="contact" ref={ref}>
      <Container>
        <SectionTitle
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          initial="hidden"
          animate={controls}
        >
          Get In Touch
        </SectionTitle>
        
        <SectionSubtitle
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } }
          }}
          initial="hidden"
          animate={controls}
        >
          Feel free to reach out if you have any questions, opportunities, or just want to say hello!
        </SectionSubtitle>
        
        <ContactContent>
          <ContactInfo
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { 
                opacity: 1, 
                x: 0, 
                transition: { 
                  duration: 0.6, 
                  delay: 0.2,
                  staggerChildren: 0.1
                } 
              }
            }}
            initial="hidden"
            animate={controls}
          >
            <ContactInfoTitle>Contact Information</ContactInfoTitle>
            
            <ContactInfoItem
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <IconWrapper>
                <FaEnvelope />
              </IconWrapper>
              <ContactInfoContent>
                <ContactInfoLabel>Email</ContactInfoLabel>
                <ContactInfoValue href="mailto:aryan.gaur@sjsu.edu">
                  aryan.gaur@sjsu.edu
                </ContactInfoValue>
              </ContactInfoContent>
            </ContactInfoItem>
            
            <ContactInfoItem
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <IconWrapper>
                <FaLinkedin />
              </IconWrapper>
              <ContactInfoContent>
                <ContactInfoLabel>LinkedIn</ContactInfoLabel>
                <ContactInfoValue 
                  href="https://linkedin.com/in/gauraryan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/gauraryan
                </ContactInfoValue>
              </ContactInfoContent>
            </ContactInfoItem>
            
            <ContactInfoItem
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <IconWrapper>
                <FaGithub />
              </IconWrapper>
              <ContactInfoContent>
                <ContactInfoLabel>GitHub</ContactInfoLabel>
                <ContactInfoValue 
                  href="https://github.com/aryangaur123"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/aryangaur123
                </ContactInfoValue>
              </ContactInfoContent>
            </ContactInfoItem>
            
            <div>
              <ContactInfoLabel style={{ marginBottom: '1rem' }}>Follow Me</ContactInfoLabel>
              <SocialLinks>
                {socialLinks.map((link) => (
                  <SocialLink
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5 }}
                    whileTap={{ y: 0 }}
                  >
                    {getIconComponent(link.icon)}
                  </SocialLink>
                ))}
              </SocialLinks>
            </div>
          </ContactInfo>
          
          <ContactForm
            onSubmit={handleSubmit}
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.3 } }
            }}
            initial="hidden"
            animate={controls}
          >
            <FormGroup>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormInput
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="subject">Subject</FormLabel>
              <FormInput
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="message">Message</FormLabel>
              <FormTextarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <SubmitButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </ContactForm>
        </ContactContent>
      </Container>
    </ContactSection>
  );
};

export default Contact;
