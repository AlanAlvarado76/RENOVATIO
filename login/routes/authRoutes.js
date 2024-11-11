const express = require('express');
const { loginUser, logoutUser } = require('../controllers/authController');
const router = express.Router();

router.post('/auth/user', loginUser);
router.get('/logout', logoutUser);

module.exports = router;
