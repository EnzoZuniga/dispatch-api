import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthService } from './service';
import { InMemoryUserRepository } from './repository';
import { validate } from '../../middleware/validate';
import { loginSchema } from './schemas';

const router = Router();
const authService = new AuthService(new InMemoryUserRepository());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many login attempts', code: 'RATE_LIMIT' },
});

router.post('/login', loginLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const token = await authService.login(req.body);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;
