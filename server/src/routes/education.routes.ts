import { Router, Request, Response, NextFunction } from 'express';
import { Education } from '../models/Education';
import { protect } from '../middleware/auth';

const router = Router();

// GET /api/education
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.headers.authorization ? {} : { isVisible: true };
    const education = await Education.find(filter).sort({ displayOrder: 1, startDate: -1 });
    res.json({
      success: true,
      data: education,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/education (Create education)
router.post('/', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const edu = new Education(req.body);
    await edu.save();
    res.status(201).json({
      success: true,
      data: edu,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/education/:id (Update education)
router.put('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!edu) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found',
      });
    }
    res.json({
      success: true,
      data: edu,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/education/:id (Delete education)
router.delete('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const edu = await Education.findByIdAndDelete(req.params.id);
    if (!edu) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found',
      });
    }
    res.json({
      success: true,
      message: 'Education record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
