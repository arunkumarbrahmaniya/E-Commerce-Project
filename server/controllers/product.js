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

exports.remove = async(req, res) => {
    try {
        const deletedProduct = await Product.findOneAndRemove({slug: req.params.slug})
        .exec();
        res.json(deletedProduct);
    } catch(error) {
        return res.status(400).send("Product delete failed");
    }
}

exports.read = async(req, res) => {
    const product = await Product.findOne({slug: req.params.slug})
    .populate("category")
    .populate("subs")
    .exec();
    res.json(product);
}

exports.update = async(req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findOneAndUpdate({slug: req.params.slug},
            req.body,
            {new:true}
        ).exec();
        res.json(updatedProduct);
    } catch(error) {
        res.status(400).json({
            error: error.message,
        })
    }
}