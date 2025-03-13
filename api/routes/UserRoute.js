import express from 'express';
import { createUser, loginUser } from '../controllers/UserController.js';

const router = express.Router();

router.post('/users', createUser);
router.post('/auth', loginUser);

export default router;
