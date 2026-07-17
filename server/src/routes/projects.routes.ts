import { Router, Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project';
import { protect } from '../middleware/auth';

const router = Router();

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// GET /api/projects
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.headers.authorization ? {} : { isVisible: true };
    const projects = await Project.find(filter).sort({ featured: -1, displayOrder: 1 });
    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:slug
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isVisible: true });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects (Create project)
router.post('/', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = { ...req.body };
    if (!body.slug && body.title) {
      body.slug = slugify(body.title);
    }
    // Check if slug is unique
    let attempt = 0;
    let baseSlug = body.slug;
    while (await Project.findOne({ slug: body.slug })) {
      attempt++;
      body.slug = `${baseSlug}-${attempt}`;
    }

    const proj = new Project(body);
    await proj.save();
    res.status(201).json({
      success: true,
      data: proj,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id (Update project)
router.put('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = { ...req.body };
    if (!body.slug && body.title) {
      body.slug = slugify(body.title);
    }
    const proj = await Project.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!proj) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    res.json({
      success: true,
      data: proj,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id (Delete project)
router.delete('/:id', protect as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proj = await Project.findByIdAndDelete(req.params.id);
    if (!proj) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
