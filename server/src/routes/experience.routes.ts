import { Router, Request, Response, NextFunction } from 'express';
import { Experience } from '../models/Experience';
import { protect } from '../middleware/auth';

const router = Router();

// GET /api/experience
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.headers.authorization ? {} : { isVisible: true };
    const experience = await Experience.find(filter).sort({ displayOrder: 1, startDate: -1 });
    res.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/experience (Create experience)
router.post('/', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exp = new Experience(req.body);
    await exp.save();
    res.status(201).json({
      success: true,
      data: exp,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/experience/:id (Update experience)
router.put('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!exp) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found',
      });
    }
    res.json({
      success: true,
      data: exp,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/experience/:id (Delete experience)
router.delete('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found',
      });
    }
    res.json({
      success: true,
      message: 'Experience record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
