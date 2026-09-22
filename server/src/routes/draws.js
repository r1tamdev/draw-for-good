import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { simulate, publish, listDraws, getUpcomingDraw } from '../controllers/draws.js';

const router = Router();

router.get('/upcoming', auth, getUpcomingDraw);
router.get('/', auth, requireRole('admin'), listDraws);
router.post('/simulate', auth, requireRole('admin'), simulate);
router.post('/publish', auth, requireRole('admin'), publish);

export default router;