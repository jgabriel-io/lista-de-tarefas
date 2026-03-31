import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { loginController } from '../modules/auth/presentation/controllers/login.controller';
import { logoutController } from '../modules/auth/presentation/controllers/logout.controller';
import { refreshController } from '../modules/auth/presentation/controllers/refresh.controller';
import { registerController } from '../modules/auth/presentation/controllers/register.controller';

const router = Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === 'test' ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', registerController);
router.post('/login', loginRateLimiter, loginController);
router.post('/logout', logoutController);
router.post('/refresh', refreshController);

export default router;
