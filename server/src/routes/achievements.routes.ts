import { Router, Request, Response, NextFunction } from 'express';
import { Achievement } from '../models/Achievement';
import { protect } from '../middleware/auth';

const router = Router();

// GET /api/achievements
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.headers.authorization ? {} : { isVisible: true };
    const achievements = await Achievement.find(filter).sort({ displayOrder: 1 });
    res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/achievements (Create achievement)
router.post('/', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ach = new Achievement(req.body);
    await ach.save();
    res.status(201).json({
      success: true,
      data: ach,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/achievements/:id (Update achievement)
router.put('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ach = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ach) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }
    res.json({
      success: true,
      data: ach,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/achievements/:id (Delete achievement)
router.delete('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ach = await Achievement.findByIdAndDelete(req.params.id);
    if (!ach) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }
    res.json({
      success: true,
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
