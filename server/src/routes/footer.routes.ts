import { Router, Request, Response, NextFunction } from 'express';
import { FooterSettings } from '../models/FooterSettings';
import { protect } from '../middleware/auth';

const router = Router();

// GET /api/footer
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const footer = await FooterSettings.findOne();
    if (!footer) {
      return res.json({
        success: true,
        data: {
          description: 'Refined Full-Stack Developer & Software Architect',
          copyrightText: '© 2026 Chandru. All rights reserved.',
          showAdminLogin: true,
          quickLinks: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
          ],
        },
      });
    }
    res.json({
      success: true,
      data: footer,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/footer (Update or create footer settings)
router.post('/', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    let footer = await FooterSettings.findOne();
    if (footer) {
      Object.assign(footer, req.body);
      await footer.save();
    } else {
      footer = new FooterSettings(req.body);
      await footer.save();
    }
    res.json({
      success: true,
      data: footer,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
