import { Router } from 'express';
import userRouter from './users';
const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

router.use('/users/', userRouter);

export default router;
