import { PortfolioData } from '../types';

/**
 * TEMPORARY DEVELOPMENT DATA
 * This centralized, typed data file is used to feed the portfolio public components.
 * It will be integrated with the MongoDB/Express API endpoints in Phase 2.
 */
export const portfolioData: PortfolioData = {
  name: "Chandru M",
  title: "Full Stack Developer",
  subTitle: "Building robust backend architectures & highly performant user interfaces.",
  description: "I am a passionate Full Stack Developer specializing in building scalable web applications, robust distributed systems, and modern, highly accessible user experiences. With deep expertise in the React ecosystem, Node.js, and Java/Spring Boot, I bridge the gap between complex system design and user-centric frontend engineering.",
  avatarPlaceholder: "CM", // For professional SVG/monogram fallback
  resumeUrl: "#", // Placeholder for actual resume file
  socials: {
    github: "https://github.com/chandru-m",
    linkedin: "https://linkedin.com/in/chandru-m",
    leetcode: "https://leetcode.com/chandru-m",
    email: "chandrumohan550@gmail.com"
  },
  skills: [
    // Languages
    { name: "Java", category: "Languages", level: "Advanced" },
    { name: "TypeScript", category: "Languages", level: "Advanced" },
    { name: "JavaScript", category: "Languages", level: "Advanced" },
    { name: "Python", category: "Languages", level: "Intermediate" },
    { name: "SQL", category: "Languages", level: "Advanced" },
    
    // Frontend
    { name: "React", category: "Frontend", level: "Advanced" },
    { name: "Next.js", category: "Frontend", level: "Intermediate" },
    { name: "HTML5 / CSS3", category: "Frontend", level: "Advanced" },
    { name: "Tailwind CSS", category: "Frontend", level: "Advanced" },
    { name: "Redux Toolkit", category: "Frontend", level: "Advanced" },
    
    // Backend
    { name: "Node.js", category: "Backend", level: "Advanced" },
    { name: "Express.js", category: "Backend", level: "Advanced" },
    { name: "Spring Boot", category: "Backend", level: "Advanced" },
    { name: "RESTful APIs", category: "Backend", level: "Advanced" },
    { name: "GraphQL", category: "Backend", level: "Intermediate" },
    
    // Databases
    { name: "PostgreSQL", category: "Databases", level: "Advanced" },
    { name: "MongoDB", category: "Databases", level: "Advanced" },
    { name: "MySQL", category: "Databases", level: "Advanced" },
    { name: "Redis", category: "Databases", level: "Intermediate" },
    
    // Tools
    { name: "Git & GitHub", category: "Tools", level: "Advanced" },
    { name: "Docker", category: "Tools", level: "Intermediate" },
    { name: "AWS (S3/EC2)", category: "Tools", level: "Intermediate" },
    { name: "Postman", category: "Tools", level: "Advanced" },
    { name: "Nginx", category: "Tools", level: "Intermediate" },
    
    // Core CS
    { name: "Data Structures & Algorithms", category: "Core CS", level: "Advanced" },
    { name: "Object-Oriented Programming (OOP)", category: "Core CS", level: "Advanced" },
    { name: "Database Design (3NF/SQL)", category: "Core CS", level: "Advanced" },
    { name: "System Design Essentials", category: "Core CS", level: "Intermediate" }
  ],
  experience: [
    {
      id: "exp-1",
      role: "Full Stack Engineer Intern",
      company: "Apex Software Labs",
      duration: "Jan 2026 - Present",
      location: "Bangalore, India (Remote)",
      description: [
        "Architected and deployed a containerized multi-tenant user authentication microservice utilizing Node.js, Express, and Redis, reducing session validation latencies by 35%.",
        "Refactored heavy client-side rendering components in a complex React dashboard to implement React 19 server-side rendering, improving First Contentful Paint (FCP) by 1.2s.",
        "Collaborated with senior engineers to model high-performance PostgreSQL queries and indexing schemas, saving over 15% execution overhead on high-frequency transactions."
      ],
      technologies: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Redis", "Docker"]
    },
    {
      id: "exp-2",
      role: "Backend Developer Fellow",
      company: "OpenSource Catalyst",
      duration: "Aug 2025 - Dec 2025",
      location: "Chennai, India (Hybrid)",
      description: [
        "Implemented secure, standard REST APIs and enterprise integrations using Spring Boot and Hibernate for high-load transaction environments.",
        "Designed and optimization-audited a customized message-broker-driven workflow using RabbitMQ to achieve asynchronous email and notification dispatching.",
        "Authored rigorous JUnit test suites covering 90%+ branch coverage, successfully identifying and patching edge-case token expiration bugs before release."
      ],
      technologies: ["Spring Boot", "Java", "Hibernate", "PostgreSQL", "RabbitMQ", "JUnit"]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Engineering in Computer Science & Engineering",
      institution: "State Technological University",
      duration: "2022 - 2026",
      location: "Tamil Nadu, India",
      highlights: [
        "Graduated with First Class with Distinction (GPA: 9.1 / 10.0)",
        "Core coursework: Advanced Data Structures, Relational Database Management Systems, Compiler Design, Software Architecture.",
        "Recipient of the Merit Scholarship for Academic Excellence (Top 2% of department)."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "OmniQueue: Distributed Task Scheduler",
      shortDescription: "A resilient distributed task scheduling system designed for sub-second job dispatching, delayed tasks, and automatic failure recovery.",
      fullDescription: "OmniQueue was born out of the need for an extremely lightweight, fault-tolerant job scheduler. Built with Node.js and Redis, it handles high-throughput asynchronous workloads. It includes a beautiful React-based observability dashboard featuring real-time stream tracking, task pause/resume actions, and visual dead-letter queue diagnostics.",
      image: "omniqueue",
      tags: ["Node.js", "TypeScript", "Redis", "React", "Tailwind CSS", "Docker"],
      liveUrl: "https://github.com/chandru-m/omniqueue",
      codeUrl: "https://github.com/chandru-m/omniqueue",
      featured: true
    },
    {
      id: "proj-2",
      title: "SaaS Tenant Provisioner & Gateway",
      shortDescription: "An automated multi-tenant SaaS workspace provisioner that dynamically allocates cloud resources, databases, and setups routing policies.",
      fullDescription: "A comprehensive developer-focused DevOps utility. It automatically provisions sandboxed database schemas, registers secure domain configurations under reverse proxy servers, and establishes customized workspace environments for new client registrations. Written entirely in TypeScript and utilizing Spring Boot core services.",
      image: "saas-provisioner",
      tags: ["Spring Boot", "TypeScript", "Nginx", "PostgreSQL", "Docker", "Express"],
      liveUrl: "https://github.com/chandru-m/saas-provisioner",
      codeUrl: "https://github.com/chandru-m/saas-provisioner",
      featured: true
    },
    {
      id: "proj-3",
      title: "DevPulse: Developer Workspace Analytics",
      shortDescription: "A non-intrusive local development productivity telemetry collector and personal insights dashboard.",
      fullDescription: "DevPulse interfaces directly with development work processes to securely aggregate coding metrics, repository contributions, and active work rhythms. Uses secure client-side storage to protect user privacy and visualizes personal productivity cycles through interactive D3.js timelines.",
      image: "devpulse",
      tags: ["React", "D3.js", "TypeScript", "Tailwind CSS", "IndexedDB"],
      liveUrl: "https://github.com/chandru-m/devpulse",
      codeUrl: "https://github.com/chandru-m/devpulse",
      featured: false
    }
  ],
  certificates: [
    {
      id: "cert-1",
      title: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services (AWS)",
      date: "Nov 2025",
      credentialUrl: "https://aws.amazon.com/verification"
    },
    {
      id: "cert-2",
      title: "MongoDB Certified Developer Associate",
      issuer: "MongoDB Academy",
      date: "Aug 2025",
      credentialUrl: "https://university.mongodb.com"
    },
    {
      id: "cert-3",
      title: "Spring Certified Professional",
      issuer: "VMware",
      date: "May 2025",
      credentialUrl: "https://cp.vmware.com"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Smart India Hackathon 2025 National Winner",
      highlight: "1st Place / 250+ Teams",
      description: "Led a 6-member team to construct a real-time predictive track defect logging dashboard, currently under evaluation by the railway infrastructure authority.",
      date: "Dec 2025"
    },
    {
      id: "ach-2",
      title: "LeetCode Top Tier Contributor",
      highlight: "600+ Problems Solved",
      description: "Achieved a peak contest rating of 1885+ (ranked in Top 5.2% globally). Actively practicing core data structures, graph theory, and dynamic programming.",
      date: "Ongoing"
    },
    {
      id: "ach-3",
      title: "Open Source Core Utility Contributions",
      highlight: "Merged Pull Requests",
      description: "Optimized string processing routines in various open-source utility engines, reducing garbage collection spikes in backend event loops by 12%.",
      date: "Jul 2025"
    }
  ]
};
