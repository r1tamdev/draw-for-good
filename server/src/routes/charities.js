import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  listCharities,
  getCharity,
  selectCharity,
  createCharity,
  updateCharity,
  deleteCharity,
} from '../controllers/charities.js';

const router = Router();

router.get('/', listCharities);
router.get('/:id', getCharity);
router.post('/select', auth, selectCharity);
router.post('/', auth, requireRole('admin'), createCharity);
router.put('/:id', auth, requireRole('admin'), updateCharity);
router.delete('/:id', auth, requireRole('admin'), deleteCharity);

export default router;