import { Router, Request, Response, NextFunction } from 'express';
import { Profile } from '../models/Profile';
import { protect } from '../middleware/auth';

const router = Router();

// GET /api/profile
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.json({
        success: true,
        data: {
          fullName: 'Chandru M',
          professionalTitle: 'Professional Full-Stack Developer',
          shortBio: 'Ready-to-configure profile in Phase 3',
          about: 'Database connection established.',
          email: 'chandrumohan550@gmail.com',
          location: 'Singapore',
          availabilityStatus: 'available',
        },
      });
    }
    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/profile (Updates or creates the single profile)
router.post('/', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    let profile = await Profile.findOne();
    if (profile) {
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      profile = new Profile(req.body);
      await profile.save();
    }
    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
