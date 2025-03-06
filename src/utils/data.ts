import { Project, Experience, Education, Skill, SocialLink, NavLink, Testimonial } from '../types';
import { FaReact, FaNodeJs, FaPython, FaDatabase, FaFigma, FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { SiTypescript, SiJavascript, SiMongodb, SiExpress, SiCplusplus, SiCss3, SiHtml5 } from 'react-icons/si';

export const navLinks: NavLink[] = [
  { id: 'home', name: 'Home', url: '#home' },
  { id: 'about', name: 'About', url: '#about' },
  { id: 'skills', name: 'Skills', url: '#skills' },
  { id: 'projects', name: 'Projects', url: '#projects' },
  { id: 'experience', name: 'Experience', url: '#experience' },
  { id: 'education', name: 'Education', url: '#education' },
  { id: 'contact', name: 'Contact', url: '#contact' },
];

export const socialLinks: SocialLink[] = [
  { id: 'github', name: 'GitHub', url: 'https://github.com/aryangaur123', icon: 'FaGithub' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/in/gauraryan', icon: 'FaLinkedin' },
  { id: 'twitter', name: 'Twitter', url: 'https://twitter.com/Aryan_Gaur_', icon: 'FaTwitter' },
  { id: 'email', name: 'Email', url: 'mailto:aryan.gaur@sjsu.edu', icon: 'FaEnvelope' },
];

export const skills: Skill[] = [
  { id: 'react', name: 'React', icon: 'FaReact', level: 5, category: 'frontend' },
  { id: 'typescript', name: 'TypeScript', icon: 'SiTypescript', level: 4, category: 'language' },
  { id: 'javascript', name: 'JavaScript', icon: 'SiJavascript', level: 5, category: 'language' },
  { id: 'nodejs', name: 'Node.js', icon: 'FaNodeJs', level: 4, category: 'backend' },
  { id: 'express', name: 'Express', icon: 'SiExpress', level: 4, category: 'backend' },
  { id: 'mongodb', name: 'MongoDB', icon: 'SiMongodb', level: 4, category: 'backend' },
  { id: 'python', name: 'Python', icon: 'FaPython', level: 4, category: 'language' },
  { id: 'cpp', name: 'C++', icon: 'SiCplusplus', level: 4, category: 'language' },
  { id: 'html', name: 'HTML', icon: 'SiHtml5', level: 5, category: 'frontend' },
  { id: 'css', name: 'CSS', icon: 'SiCss3', level: 5, category: 'frontend' },
  { id: 'figma', name: 'Figma', icon: 'FaFigma', level: 4, category: 'tool' },
];

export const projects: Project[] = [
  {
    id: 'project1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with user authentication, product catalog, cart functionality, and payment integration.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux', 'Stripe'],
    image: '/images/projects/ecommerce.jpg',
    githubUrl: 'https://github.com/aryangaur/ecommerce-platform',
    liveUrl: 'https://ecommerce-platform.vercel.app',
    featured: true,
    category: 'web'
  },
  {
    id: 'project2',
    title: 'AI Image Generator',
    description: 'An application that uses machine learning to generate unique images based on text prompts.',
    technologies: ['React', 'Python', 'TensorFlow', 'Flask', 'OpenAI API'],
    image: '/images/projects/ai-image.jpg',
    githubUrl: 'https://github.com/aryangaur/ai-image-generator',
    liveUrl: 'https://ai-image-generator.vercel.app',
    featured: true,
    category: 'web'
  },
  {
    id: 'project3',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, task assignment, and progress tracking.',
    technologies: ['React', 'TypeScript', 'Firebase', 'Styled Components'],
    image: '/images/projects/task-app.jpg',
    githubUrl: 'https://github.com/aryangaur/task-management',
    liveUrl: 'https://task-management-app.vercel.app',
    featured: false,
    category: 'web'
  },
  {
    id: 'project4',
    title: 'Portfolio Website',
    description: 'A modern and interactive portfolio website showcasing projects and skills.',
    technologies: ['React', 'TypeScript', 'Three.js', 'Framer Motion', 'Styled Components'],
    image: '/images/projects/portfolio.jpg',
    githubUrl: 'https://github.com/aryangaur/portfolio',
    liveUrl: 'https://aryangaur.dev',
    featured: false,
    category: 'web'
  },
  {
    id: 'project5',
    title: 'Data Visualization Dashboard',
    description: 'An interactive dashboard for visualizing complex datasets with filtering and analysis capabilities.',
    technologies: ['React', 'D3.js', 'Node.js', 'Express', 'MongoDB'],
    image: '/images/projects/data-viz.jpg',
    githubUrl: 'https://github.com/aryangaur/data-visualization',
    liveUrl: 'https://data-visualization-dashboard.vercel.app',
    featured: true,
    category: 'web'
  },
];

export const experiences: Experience[] = [
  {
    id: 'exp1',
    company: 'Mind and Match',
    position: 'Software Engineering Intern',
    duration: 'Jun 2024 - Sep 2024',
    description: [
      'Created an advanced regulatory agent to address and resolve questions related to practicing across state lines, enhancing regulatory compliance and support for therapists. Leveraged the MERN stack (MongoDB, Express.js, React, Node.js) to build and maintain dynamic, responsive web applications, ensuring seamless integration and user experience. Simplified and streamlined interstate practice management, benefiting over 300 therapists on the Mind and Match platform by improving operational efficiency and reducing administrative overhead.',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Git']
  },
  {
    id: 'exp2',
    company: 'Lowes',
    position: 'Sales Associate',
    duration: 'Jan 2024 - Apr 2024',
    description: [
      'Achieved Daily Sales Targets: Personally sold approximately $2,000 worth of power tools daily, demonstrating strong product knowledge and effective sales strategies. Utilized advanced sales techniques to successfully procure add-on products, increasing overall transaction value and customer satisfaction. Excelled in a fast-paced team setting, collaborating effectively with colleagues to meet store goals and provide exceptional customer service.',
    ],
    technologies: []
  },
];

export const education: Education[] = [
  {
    id: 'edu1',
    institution: 'San Jose State University',
    degree: 'Bachelor of Science in Computer Engineering',
    duration: '2023 - 2026',
    description: 'Studying Computer Engineering with a balance of software engineering and hardware design.',
    achievements: [
      'Full Merit Scholarship Recipient',
      'Dean\'s List',
      'Member of Software and Computer Engineering Society',
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 'test1',
    name: 'Dr. Sarah Johnson',
    position: 'Professor',
    company: 'San Jose State University',
    text: 'Aryan is one of the most dedicated and talented students I\'ve had the pleasure of teaching. His problem-solving skills and attention to detail are exceptional.',
    image: '/images/testimonials/sarah.jpg'
  },
  {
    id: 'test2',
    name: 'Michael Chen',
    position: 'Senior Developer',
    company: 'Tech Innovators Inc.',
    text: 'During his internship, Aryan demonstrated exceptional technical skills and a great ability to learn quickly. He made significant contributions to our projects.',
    image: '/images/testimonials/michael.jpg'
  },
  {
    id: 'test3',
    name: 'Emily Rodriguez',
    position: 'UX Lead',
    company: 'Creative Solutions',
    text: 'Aryan has a natural talent for understanding user needs and creating intuitive designs. His technical background combined with design skills make him a valuable asset.',
    image: '/images/testimonials/emily.jpg'
  },
];

export const aboutMe = {
  title: 'About Me',
  description: `I'm Aryan Gaur, a Computer Science student at San Jose State University with a passion for creating innovative and user-friendly web applications. I specialize in full-stack development using the MERN stack and have a strong foundation in UI/UX design principles.

  My journey in software engineering began with a curiosity about how digital products are built and has evolved into a deep passion for creating elegant solutions to complex problems. I'm particularly interested in the intersection of technology and user experience, and I strive to create applications that are not only functional but also intuitive and enjoyable to use.
  
  When I'm not coding, you can find me in a powerlifting gym or at lacrosse practice.`,
  values: [
    'Continuous learning and improvement',
    'Clean, maintainable code',
    'User-centered design',
    'Collaborative problem-solving',
    'Innovation and creativity'
  ]
};
