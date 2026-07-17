import { Router, Request, Response, NextFunction } from 'express';
import { Skill } from '../models/Skill';
import { protect } from '../middleware/auth';

const router = Router();

// GET /api/skills
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If authenticated admin, return all. Otherwise return only visible ones.
    const filter = req.headers.authorization ? {} : { isVisible: true };
    const skills = await Skill.find(filter).sort({ displayOrder: 1 });
    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/skills (Create skill)
router.post('/', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/skills/:id (Update skill)
router.put('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }
    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/skills/:id (Delete skill)
router.delete('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }
    res.json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
