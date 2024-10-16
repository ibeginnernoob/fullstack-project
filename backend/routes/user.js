import express from 'express';

import { signin, signup, updateUser, filterUsers } from '../controllers/user';

const router=express.Router();

router.post('/signup',signup);

router.post('/signin',signin);

router.put('/',updateUser);

router.get('/bulk',filterUsers);

export default router;