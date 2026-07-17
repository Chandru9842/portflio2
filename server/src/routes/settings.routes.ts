import { Router, Request, Response, NextFunction } from 'express';
import { SiteSettings } from '../models/SiteSettings';
import { protect } from '../middleware/auth';

const router = Router();

// GET /api/settings
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings) {
      return res.json({
        success: true,
        data: {
          siteName: 'Chandru Portfolio',
          siteDescription: 'Professional Full-Stack Developer Portfolio CMS',
          primaryColor: '#6366F1',
          themeMode: 'dark',
        },
      });
    }
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/settings (Update or create site settings)
router.post('/', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await SiteSettings.findOne();
    if (settings) {
      Object.assign(settings, req.body);
      await settings.save();
    } else {
      settings = new SiteSettings(req.body);
      await settings.save();
    }
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
