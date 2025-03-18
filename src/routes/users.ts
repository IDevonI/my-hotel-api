import { Router } from 'express';
import { login, refreshToken } from '../controllers/users';

const router = Router();

router.post('/login', login);

router.post('/refresh-token', refreshToken);

export default router;