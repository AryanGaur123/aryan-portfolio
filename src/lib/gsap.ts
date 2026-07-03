import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once, import from here everywhere.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
