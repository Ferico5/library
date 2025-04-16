const express = require("express");
const { createUser, loginUser, changePassword } = require("../controllers/UserController.js");
const authMiddleware = require('../auth/authMiddleware')

const router = express.Router();

router.post('/users', createUser);
router.post('/auth', loginUser);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
