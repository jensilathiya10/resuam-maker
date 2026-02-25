import { Router } from 'express';
import { generateResumeContent, generateFullResume, generateResumePreviews } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/generate', generateResumeContent);
router.post('/generate-resume', generateFullResume);
router.post('/generate-resume-previews', generateResumePreviews);

export default router;
