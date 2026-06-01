const express = require('express');
const { getMenu, addMenuItem } = require('../controllers/menuController');

const router = express.Router();

router.get('/menu', getMenu);
router.post('/menu', addMenuItem);

module.exports = router;
