import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  createSubscription,
  getSubscriptionStatus,
  cancelMySubscription,
} from '../controllers/subscription.js';

const router = Router();

router.post('/', auth, createSubscription);
router.get('/status', auth, getSubscriptionStatus);
router.post('/cancel', auth, cancelMySubscription);

export default router;