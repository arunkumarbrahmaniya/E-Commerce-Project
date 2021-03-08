const Product = require('../models/product');
const slugify = require('slugify');

exports.create = async(req, res) => {
    try {
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch(error) {
        // res.status(400).send("Product creation failed");
        res.status(400).json({
            error: error.message,
        })
    }
}
exports.read = async(req, res) => {
    let products = await Product.find({});
    res.json(products);
}