import { Router, Request, Response, NextFunction } from 'express';
import { SocialLink } from '../models/SocialLink';
import { protect } from '../middleware/auth';

const router = Router();

// GET /api/social-links
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.headers.authorization ? {} : { isVisible: true };
    const socialLinks = await SocialLink.find(filter).sort({ displayOrder: 1 });
    res.json({
      success: true,
      data: socialLinks,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/social-links (Create social link)
router.post('/', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const link = new SocialLink(req.body);
    await link.save();
    res.status(201).json({
      success: true,
      data: link,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/social-links/:id (Update social link)
router.put('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Social link not found',
      });
    }
    res.json({
      success: true,
      data: link,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/social-links/:id (Delete social link)
router.delete('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const link = await SocialLink.findByIdAndDelete(req.params.id);
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Social link not found',
      });
    }
    res.json({
      success: true,
      message: 'Social link deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
