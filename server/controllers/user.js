const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Coupan = require('../models/coupan');
exports.userCart = async(req, res) => {
    const {cart} = req.body;

    let products = [];

    const user = await User.findOne({email:req.user.email})
    .exec();
    
    let cartExistByThisUser = await Cart.findOne({orderedBy: user._id})
    .exec();
    if(cartExistByThisUser) {
        cartExistByThisUser.remove()
    }
    for(let i = 0; i < cart.length; i++) {
        let object = {};
        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;
        let productFromDB = await Product.findById(cart[i]._id)
        .select('price')
        .exec();
        object.price = productFromDB.price;
        products.push(object);
    }
    console.log("PRODUCTS", products);
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++){
        cartTotal =cartTotal + products[i].price * products[i].count;
    }
    console.log("CARTTOTAL", cartTotal);
    let newCart = await new Cart({
        products,
        cartTotal,
        orderedBy: user._id,
    }).save();
    console.log("NEW CART", newCart);
    res.json({ok: true});
};

exports.getUserCart = async(req, res) => {
    console.log("USER TEST", req);
    const user = await User.findOne({email: req.user.email})
    .exec();
    let cart = await Cart.findOne({orderedBy: user._id})
    .populate('products.product', '_id title price totalAfterDiscount')
    .exec();
    const {products, cartTotal, totalAfterDiscount} = cart;
    res.json({
        products,
        cartTotal,
        totalAfterDiscount
    });
}

exports.emptyCart = async(req, res) => {
    const user = await User.findOne({email: req.user.email})
    .exec();
    const cart = await Cart.findOneAndRemove({orderedBy: user._id})
    .exec();
    res.json(cart) 
}

exports.saveAddress = async (req, res) => {
    const userAddress = await User.findOneAndUpdate(
        {email: req.user.email},
        {address: req.body.address}
    ).exec();
    res.json({ok: true});
};

exports.applyCoupanToUserCart = async(req, res) => {
    const {coupan} = req.body;
    const validCoupan = await Coupan.findOne({name: coupan}).exec();
    if (validCoupan === null) {
        return res.json({
            error: 'Invalid coupan'
        });
    }
    const user = await User.findOne({email: req.user.email}).exec();
    let {products, cartTotal} = await Cart.findOne({orderedBy: user._id})
    .populate("products.product", "_id, title price")
    .exec();
    let totalAfterDiscount = (cartTotal - ((cartTotal * validCoupan.discount)/100))
    .toFixed(2);
    Cart.findOneAndUpdate(
        {orderedBy: user._id},
        {totalAfterDiscount},
        {new:true}
    );
    res.json(totalAfterDiscount);
}
