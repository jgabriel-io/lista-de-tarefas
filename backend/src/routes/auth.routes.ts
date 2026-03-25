import { Router } from 'express';
import { register } from '../controllers/auth.controller';
import rateLimit from 'express-rate-limit';
import { loginController } from '../modules/auth/presentation/controllers/login.controller';


const router = Router();

router.post('/register', register);

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// novo login (Zod + access/refresh tokens + auditoria + refresh persistido)
router.post('/login', loginRateLimiter, loginController);

export default router;
