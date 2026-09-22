import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireActiveSub } from '../middleware/requireActiveSub.js';
import { createScore, listScores, editScore, removeScore } from '../controllers/scores.js';

const router = Router();

router.use(auth, requireActiveSub);

router.post('/', createScore);
router.get('/', listScores);
router.put('/:id', editScore);
router.delete('/:id', removeScore);

export default router;