import { Router } from 'express';
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
} from '../controllers/resumeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getResumes);
router.get('/:id', getResume);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;
