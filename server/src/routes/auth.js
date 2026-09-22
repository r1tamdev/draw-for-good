import { Router } from 'express';
import { signup, login, getProfile } from '../controllers/auth.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, getProfile);

export default router;