import { Router, Request, Response, NextFunction } from 'express';
import { ContactMessage } from '../models/ContactMessage';
import { protect } from '../middleware/auth';

const router = Router();

// GET /api/contact (Admin-only: Retrieve all messages)
router.get('/', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/contact/:id (Admin-only: Update message status/read/unread)
router.put('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!msg) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }
    res.json({
      success: true,
      data: msg,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/contact/:id (Admin-only: Delete a message)
router.delete('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }
    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/contact (Public contact submission)
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message } = req.body;

    // Simple robust manual validation (conforming to request validation architecture)
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name is required and must be a valid string',
      });
    }

    if (!email || typeof email !== 'string' || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'A valid email is required',
      });
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required',
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required',
      });
    }

    // Persist to MongoDB database
    const newMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: {
        id: newMessage._id,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
