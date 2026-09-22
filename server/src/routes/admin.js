import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { listUsers, updateUser, updateUserSubscription, getReports } from '../controllers/admin.js';

const router = Router();

router.use(auth, requireRole('admin'));

router.get('/users', listUsers);
router.put('/users/:id', updateUser);
router.put('/users/:id/subscription', updateUserSubscription);
router.get('/reports', getReports);

export default router;