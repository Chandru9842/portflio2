import { Router, Request, Response, NextFunction } from 'express';
import { Certificate } from '../models/Certificate';
import { protect } from '../middleware/auth';

const router = Router();

// GET /api/certificates
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.headers.authorization ? {} : { isVisible: true };
    const certificates = await Certificate.find(filter).sort({ displayOrder: 1, issueDate: -1 });
    res.json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/certificates (Create certificate)
router.post('/', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cert = new Certificate(req.body);
    await cert.save();
    res.status(201).json({
      success: true,
      data: cert,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/certificates/:id (Update certificate)
router.put('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }
    res.json({
      success: true,
      data: cert,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/certificates/:id (Delete certificate)
router.delete('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }
    res.json({
      success: true,
      message: 'Certificate deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
