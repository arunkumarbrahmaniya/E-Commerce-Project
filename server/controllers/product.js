const Product = require('../models/product');
const slugify = require('slugify');
const { populate } = require('../models/product');

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
exports.listAll = async(req, res) => {
    let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([["createdAt", "desc"]])
    .exec();
    res.json(products);
}