const express = require('express');

const router = express.Router();
const { authCheck }  = require('../middlewares/auth');
const {
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    applyCoupanToUserCart
} = require("../controllers/user");
// router.get('/user', (req, res) => {
//     res.json({
//         data: 'you hit the user node apI'
//     });
// });

router.post('/user/cart', authCheck, userCart);
router.get('/user/cart', authCheck, getUserCart);
router.delete('/user/cart', authCheck, emptyCart);
router.post('/user/address', authCheck, saveAddress);
router.post('/user/cart/coupan', authCheck, applyCoupanToUserCart);
module.exports = router;