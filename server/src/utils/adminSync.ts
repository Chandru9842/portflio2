import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';
import { Profile } from '../models/Profile';
import { Skill } from '../models/Skill';
import { Experience } from '../models/Experience';
import { Education } from '../models/Education';
import { Project } from '../models/Project';
import { Certificate } from '../models/Certificate';
import { Achievement } from '../models/Achievement';
import { SocialLink } from '../models/SocialLink';
import { SiteSettings } from '../models/SiteSettings';
import { FooterSettings } from '../models/FooterSettings';

/**
 * Automatically seeds the database collections with high-quality default portfolio data
 * if they are completely empty. This ensures the CMS has immediate records to display
 * and edit, and prevents a blank public view.
 */
async function seedDefaultData(): Promise<void> {
  try {
    // 1. Profile
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      console.log('🌱 [AdminSync] Seeding default profile...');
      await Profile.create({
        fullName: 'Chandru M',
        professionalTitle: 'Full Stack Developer',
        shortBio: 'Building robust backend architectures & highly performant user interfaces.',
        about: 'I am a passionate Full Stack Developer specializing in building scalable web applications, robust distributed systems, and modern, highly accessible user experiences. With deep expertise in the React ecosystem, Node.js, and Java/Spring Boot, I bridge the gap between complex system design and user-centric frontend engineering.',
        email: 'chandrumohan550@gmail.com',
        phone: '+91 9876543210',
        location: 'Singapore',
        profileImage: '',
        resumeUrl: '#',
        availabilityStatus: 'available',
      });
    }

    // 2. Skills
    const skillsCount = await Skill.countDocuments();
    if (skillsCount === 0) {
      console.log('🌱 [AdminSync] Seeding default skills...');
      const defaultSkills = [
        { name: 'Java', category: 'Languages', proficiencyLabel: 'Advanced', displayOrder: 1 },
        { name: 'TypeScript', category: 'Languages', proficiencyLabel: 'Advanced', displayOrder: 2 },
        { name: 'JavaScript', category: 'Languages', proficiencyLabel: 'Advanced', displayOrder: 3 },
        { name: 'Python', category: 'Languages', proficiencyLabel: 'Intermediate', displayOrder: 4 },
        { name: 'SQL', category: 'Languages', proficiencyLabel: 'Advanced', displayOrder: 5 },
        { name: 'React', category: 'Frontend', proficiencyLabel: 'Advanced', displayOrder: 6 },
        { name: 'Next.js', category: 'Frontend', proficiencyLabel: 'Intermediate', displayOrder: 7 },
        { name: 'HTML5 / CSS3', category: 'Frontend', proficiencyLabel: 'Advanced', displayOrder: 8 },
        { name: 'Tailwind CSS', category: 'Frontend', proficiencyLabel: 'Advanced', displayOrder: 9 },
        { name: 'Redux Toolkit', category: 'Frontend', proficiencyLabel: 'Advanced', displayOrder: 10 },
        { name: 'Node.js', category: 'Backend', proficiencyLabel: 'Advanced', displayOrder: 11 },
        { name: 'Express.js', category: 'Backend', proficiencyLabel: 'Advanced', displayOrder: 12 },
        { name: 'Spring Boot', category: 'Backend', proficiencyLabel: 'Advanced', displayOrder: 13 },
        { name: 'RESTful APIs', category: 'Backend', proficiencyLabel: 'Advanced', displayOrder: 14 },
        { name: 'GraphQL', category: 'Backend', proficiencyLabel: 'Intermediate', displayOrder: 15 },
        { name: 'PostgreSQL', category: 'Databases', proficiencyLabel: 'Advanced', displayOrder: 16 },
        { name: 'MongoDB', category: 'Databases', proficiencyLabel: 'Advanced', displayOrder: 17 },
        { name: 'MySQL', category: 'Databases', proficiencyLabel: 'Advanced', displayOrder: 18 },
        { name: 'Redis', category: 'Databases', proficiencyLabel: 'Intermediate', displayOrder: 19 },
        { name: 'Git & GitHub', category: 'Tools', proficiencyLabel: 'Advanced', displayOrder: 20 },
        { name: 'Docker', category: 'Tools', proficiencyLabel: 'Intermediate', displayOrder: 21 },
        { name: 'AWS (S3/EC2)', category: 'Tools', proficiencyLabel: 'Intermediate', displayOrder: 22 },
        { name: 'Postman', category: 'Tools', proficiencyLabel: 'Advanced', displayOrder: 23 },
        { name: 'Nginx', category: 'Tools', proficiencyLabel: 'Intermediate', displayOrder: 24 },
        { name: 'Data Structures & Algorithms', category: 'Core CS', proficiencyLabel: 'Advanced', displayOrder: 25 },
        { name: 'Object-Oriented Programming (OOP)', category: 'Core CS', proficiencyLabel: 'Advanced', displayOrder: 26 },
        { name: 'Database Design (3NF/SQL)', category: 'Core CS', proficiencyLabel: 'Advanced', displayOrder: 27 },
        { name: 'System Design Essentials', category: 'Core CS', proficiencyLabel: 'Intermediate', displayOrder: 28 },
      ];
      await Skill.insertMany(defaultSkills);
    }

    // 3. Experience
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      console.log('🌱 [AdminSync] Seeding default experiences...');
      const defaultExp = [
        {
          role: 'Full Stack Engineer Intern',
          company: 'Apex Software Labs',
          employmentType: 'Full-time',
          location: 'Bangalore, India (Remote)',
          startDate: new Date('2026-01-01'),
          currentlyWorking: true,
          description: [
            'Architected and deployed a containerized multi-tenant user authentication microservice utilizing Node.js, Express, and Redis, reducing session validation latencies by 35%.',
            'Refactored heavy client-side rendering components in a complex React dashboard to implement React 19 server-side rendering, improving First Contentful Paint (FCP) by 1.2s.',
            'Collaborated with senior engineers to model high-performance PostgreSQL queries and indexing schemas, saving over 15% execution overhead on high-frequency transactions.'
          ],
          technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
          displayOrder: 1,
          isVisible: true,
        },
        {
          role: 'Backend Developer Fellow',
          company: 'OpenSource Catalyst',
          employmentType: 'Full-time',
          location: 'Chennai, India (Hybrid)',
          startDate: new Date('2025-08-01'),
          endDate: new Date('2025-12-31'),
          currentlyWorking: false,
          description: [
            'Implemented secure, standard REST APIs and enterprise integrations using Spring Boot and Hibernate for high-load transaction environments.',
            'Designed and optimization-audited a customized message-broker-driven workflow using RabbitMQ to achieve asynchronous email and notification dispatching.',
            'Authored rigorous JUnit test suites covering 90%+ branch coverage, successfully identifying and patching edge-case token expiration bugs before release.'
          ],
          technologies: ['Spring Boot', 'Java', 'Hibernate', 'PostgreSQL', 'RabbitMQ', 'JUnit'],
          displayOrder: 2,
          isVisible: true,
        },
      ];
      await Experience.insertMany(defaultExp);
    }

    // 4. Education
    const eduCount = await Education.countDocuments();
    if (eduCount === 0) {
      console.log('🌱 [AdminSync] Seeding default education...');
      await Education.create({
        institution: 'State Technological University',
        degree: 'Bachelor of Engineering',
        fieldOfStudy: 'Computer Science & Engineering',
        location: 'Tamil Nadu, India',
        startDate: new Date('2022-06-01'),
        endDate: new Date('2026-05-31'),
        description: 'Graduated with First Class with Distinction (GPA: 9.1 / 10.0). Core coursework: Advanced Data Structures, Relational Database Management Systems, Compiler Design, Software Architecture. Recipient of the Merit Scholarship for Academic Excellence (Top 2% of department).',
        displayOrder: 1,
        isVisible: true,
      });
    }

    // 5. Projects
    const projectsCount = await Project.countDocuments();
    if (projectsCount === 0) {
      console.log('🌱 [AdminSync] Seeding default projects...');
      const defaultProjects = [
        {
          title: 'OmniQueue: Distributed Task Scheduler',
          slug: 'omniqueue-distributed-task-scheduler',
          shortDescription: 'A resilient distributed task scheduling system designed for sub-second job dispatching, delayed tasks, and automatic failure recovery.',
          description: 'OmniQueue was born out of the need for an extremely lightweight, fault-tolerant job scheduler. Built with Node.js and Redis, it handles high-throughput asynchronous workloads. It includes a beautiful React-based observability dashboard featuring real-time stream tracking, task pause/resume actions, and visual dead-letter queue diagnostics.',
          image: 'omniqueue',
          technologies: ['Node.js', 'TypeScript', 'Redis', 'React', 'Tailwind CSS', 'Docker'],
          liveUrl: 'https://github.com/chandru-m/omniqueue',
          githubUrl: 'https://github.com/chandru-m/omniqueue',
          featured: true,
          displayOrder: 1,
          isVisible: true,
        },
        {
          title: 'SaaS Tenant Provisioner & Gateway',
          slug: 'saas-tenant-provisioner-gateway',
          shortDescription: 'An automated multi-tenant SaaS workspace provisioner that dynamically allocates cloud resources, databases, and setups routing policies.',
          description: 'A comprehensive developer-focused DevOps utility. It automatically provisions sandboxed database schemas, registers secure domain configurations under reverse proxy servers, and establishes customized workspace environments for new client registrations. Written entirely in TypeScript and utilizing Spring Boot core services.',
          image: 'saas-provisioner',
          technologies: ['Spring Boot', 'TypeScript', 'Nginx', 'PostgreSQL', 'Docker', 'Express'],
          liveUrl: 'https://github.com/chandru-m/saas-provisioner',
          githubUrl: 'https://github.com/chandru-m/saas-provisioner',
          featured: true,
          displayOrder: 2,
          isVisible: true,
        },
        {
          title: 'DevPulse: Developer Workspace Analytics',
          slug: 'devpulse-developer-workspace-analytics',
          shortDescription: 'A non-intrusive local development productivity telemetry collector and personal insights dashboard.',
          description: 'DevPulse interfaces directly with development work processes to securely aggregate coding metrics, repository contributions, and active work rhythms. Uses secure client-side storage to protect user privacy and visualizes personal productivity cycles through interactive D3.js timelines.',
          image: 'devpulse',
          technologies: ['React', 'D3.js', 'TypeScript', 'Tailwind CSS', 'IndexedDB'],
          liveUrl: 'https://github.com/chandru-m/devpulse',
          githubUrl: 'https://github.com/chandru-m/devpulse',
          featured: false,
          displayOrder: 3,
          isVisible: true,
        },
      ];
      await Project.insertMany(defaultProjects);
    }

    // 6. Certificates
    const certsCount = await Certificate.countDocuments();
    if (certsCount === 0) {
      console.log('🌱 [AdminSync] Seeding default certificates...');
      const defaultCerts = [
        {
          name: 'AWS Certified Developer – Associate',
          issuer: 'Amazon Web Services (AWS)',
          issueDate: new Date('2025-11-01'),
          credentialUrl: 'https://aws.amazon.com/verification',
          displayOrder: 1,
          isVisible: true,
        },
        {
          name: 'MongoDB Certified Developer Associate',
          issuer: 'MongoDB Academy',
          issueDate: new Date('2025-08-01'),
          credentialUrl: 'https://university.mongodb.com',
          displayOrder: 2,
          isVisible: true,
        },
        {
          name: 'Spring Certified Professional',
          issuer: 'VMware',
          issueDate: new Date('2025-05-01'),
          credentialUrl: 'https://cp.vmware.com',
          displayOrder: 3,
          isVisible: true,
        },
      ];
      await Certificate.insertMany(defaultCerts);
    }

    // 7. Achievements
    const achsCount = await Achievement.countDocuments();
    if (achsCount === 0) {
      console.log('🌱 [AdminSync] Seeding default achievements...');
      const defaultAchs = [
        {
          title: 'Smart India Hackathon 2025 National Winner',
          description: 'Led a 6-member team to construct a real-time predictive track defect logging dashboard, currently under evaluation by the railway infrastructure authority.',
          organization: '1st Place / 250+ Teams',
          date: new Date('2025-12-01'),
          displayOrder: 1,
          isVisible: true,
        },
        {
          title: 'LeetCode Top Tier Contributor',
          description: 'Achieved a peak contest rating of 1885+ (ranked in Top 5.2% globally). Actively practicing core data structures, graph theory, and dynamic programming.',
          organization: '600+ Problems Solved',
          displayOrder: 2,
          isVisible: true,
        },
        {
          title: 'Open Source Core Utility Contributions',
          description: 'Optimized string processing routines in various open-source utility engines, reducing garbage collection spikes in backend event loops by 12%.',
          organization: 'Merged Pull Requests',
          date: new Date('2025-07-01'),
          displayOrder: 3,
          isVisible: true,
        },
      ];
      await Achievement.insertMany(defaultAchs);
    }

    // 8. Social Links
    const socialCount = await SocialLink.countDocuments();
    if (socialCount === 0) {
      console.log('🌱 [AdminSync] Seeding default social links...');
      const defaultSocials = [
        { platform: 'GitHub', url: 'https://github.com/chandru-m', displayOrder: 1, isVisible: true },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/chandru-m', displayOrder: 2, isVisible: true },
        { platform: 'LeetCode', url: 'https://leetcode.com/chandru-m', displayOrder: 3, isVisible: true },
      ];
      await SocialLink.insertMany(defaultSocials);
    }

    // 9. Site Settings
    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      console.log('🌱 [AdminSync] Seeding default site settings...');
      await SiteSettings.create({
        siteName: 'Chandru Portfolio',
        siteDescription: 'Professional Full-Stack Developer Portfolio CMS',
        primaryColor: '#6366F1',
        themeMode: 'dark',
      });
    }

    // 10. Footer Settings
    const footerCount = await FooterSettings.countDocuments();
    if (footerCount === 0) {
      console.log('🌱 [AdminSync] Seeding default footer settings...');
      await FooterSettings.create({
        description: 'Refined Full-Stack Developer & Software Architect',
        copyrightText: '© 2026 Chandru. All rights reserved.',
        showAdminLogin: true,
        quickLinks: [
          { label: 'Privacy Policy', href: '#' },
          { label: 'Terms of Service', href: '#' },
        ],
      });
    }

    console.log('🌱 [AdminSync] Seeding checks complete.');
  } catch (err: any) {
    console.error('❌ [AdminSync] Error seeding default portfolio data:', err?.message || err);
  }
}

/**
 * Automatically synchronizes the administrative user in the MongoDB database
 * with the current environment variables (ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FULL_NAME).
 * If the account does not exist, it will be created. If any details or the password hash
 * are outdated, they will be securely updated.
 */
export async function syncAdminCredentials(): Promise<void> {
  const username = process.env.ADMIN_USERNAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME;

  if (!username || !email || !password || !fullName) {
    console.warn('⚠️  [AdminSync] Skipping auto-sync. Missing required administrator environment variables:');
    if (!username) console.warn('   - ADMIN_USERNAME is missing');
    if (!email) console.warn('   - ADMIN_EMAIL is missing');
    if (!password) console.warn('   - ADMIN_PASSWORD is missing');
    if (!fullName) console.warn('   - ADMIN_FULL_NAME is missing');
    return;
  }

  const cleanUsername = username.toLowerCase().trim();
  const cleanEmail = email.toLowerCase().trim();
  const cleanFullName = fullName.trim();

  try {
    // Search for any administrator account matching either the username or the email
    const existingAdmin = await Admin.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }],
    });

    if (existingAdmin) {
      // Check if password hash is outdated or if any details have changed
      const isPasswordMatch = await bcrypt.compare(password, existingAdmin.passwordHash);
      const isUsernameMatch = existingAdmin.username === cleanUsername;
      const isEmailMatch = existingAdmin.email === cleanEmail;
      const isFullNameMatch = existingAdmin.fullName === cleanFullName;
      const isActiveMatch = existingAdmin.isActive === true;
      const isRoleMatch = existingAdmin.role === 'admin';

      if (!isPasswordMatch || !isUsernameMatch || !isEmailMatch || !isFullNameMatch || !isActiveMatch || !isRoleMatch) {
        console.log('🔄 [AdminSync] Detected outdated administrator credentials or details in database. Updating securely...');
        
        if (!isPasswordMatch) {
          const salt = await bcrypt.genSalt(12);
          existingAdmin.passwordHash = await bcrypt.hash(password, salt);
        }
        
        existingAdmin.username = cleanUsername;
        existingAdmin.email = cleanEmail;
        existingAdmin.fullName = cleanFullName;
        existingAdmin.role = 'admin';
        existingAdmin.isActive = true;

        await existingAdmin.save();
        console.log('✅ [AdminSync] Administrative credentials synchronized and updated successfully.');
      } else {
        console.log('✅ [AdminSync] Administrative credentials are fully up-to-date in database.');
      }
    } else {
      console.log('🆕 [AdminSync] No administrator account found. Initializing new account...');
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      const newAdmin = new Admin({
        username: cleanUsername,
        email: cleanEmail,
        fullName: cleanFullName,
        passwordHash,
        role: 'admin',
        isActive: true,
      });

      await newAdmin.save();
      console.log('✅ [AdminSync] Administrative account initialized and saved successfully.');
    }

    // Always check/seed default portfolio data on startup
    await seedDefaultData();

  } catch (error: any) {
    console.error('❌ [AdminSync] Failed to synchronize administrator credentials:', error?.message || error);
  }
}
