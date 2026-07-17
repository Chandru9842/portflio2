import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import skillsRoutes from './skills.routes';
import experienceRoutes from './experience.routes';
import educationRoutes from './education.routes';
import projectsRoutes from './projects.routes';
import certificatesRoutes from './certificates.routes';
import achievementsRoutes from './achievements.routes';
import socialLinksRoutes from './social-links.routes';
import contactRoutes from './contact.routes';
import settingsRoutes from './settings.routes';
import footerRoutes from './footer.routes';

const apiRouter = Router();

import { dbCheck } from '../middleware/dbCheck';

// API Health Check
apiRouter.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio CMS API is running',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      cwd: process.cwd(),
      CLIENT_URL: process.env.CLIENT_URL,
    }
  });
});

// Apply database connection check for all subsequent endpoints
apiRouter.use(dbCheck);

// Register all modular endpoints
apiRouter.use('/auth', authRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/skills', skillsRoutes);
apiRouter.use('/experience', experienceRoutes);
apiRouter.use('/education', educationRoutes);
apiRouter.use('/projects', projectsRoutes);
apiRouter.use('/certificates', certificatesRoutes);
apiRouter.use('/achievements', achievementsRoutes);
apiRouter.use('/social-links', socialLinksRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/footer', footerRoutes);

export default apiRouter;
