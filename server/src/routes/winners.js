import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  listMyWinnings,
  uploadProof,
  listAllWinners,
  verifyWinner,
  markPaid,
} from '../controllers/winners.js';

const router = Router();

router.get('/mine', auth, listMyWinnings);
router.post('/:id/proof', auth, uploadProof);
router.get('/', auth, requireRole('admin'), listAllWinners);
router.put('/:id/verify', auth, requireRole('admin'), verifyWinner);
router.put('/:id/pay', auth, requireRole('admin'), markPaid);

export default router;