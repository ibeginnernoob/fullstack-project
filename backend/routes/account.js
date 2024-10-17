import { Router } from 'express';

import { authMiddleWare } from '../middleware/auth';

import { getBalance } from '../controllers/account';

const router=Router();

router.get('/balance',authMiddleWare,getBalance);

export default router;