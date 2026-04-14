import { Router } from 'express';
import { register, verifyEmail, login } from '../controllers/auth';

const router = Router();

router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);

export default router;