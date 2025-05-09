const express = require('express');
const { createUser, loginUser, changePassword, getUserById, updateProfile } = require('../controllers/UserController.js');
const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();

router.post('/users', createUser);
router.post('/auth', loginUser);
router.put('/change-password', authMiddleware, changePassword);
router.get('/get-user/:id', getUserById);
router.put('/update-profile/:id', updateProfile);

module.exports = router;
