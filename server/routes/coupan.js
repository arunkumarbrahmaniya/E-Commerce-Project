const express = require('express');
const router = express.Router();
const { authCheck, adminCheck }  = require('../middlewares/auth');
const { create, remove, list }  = require('../controllers/coupans');

router.post('/coupan', authCheck, adminCheck, create);
router.get('/coupans', list);
router.delete('/coupan/:coupanId', authCheck, adminCheck, remove);



module.exports = router;