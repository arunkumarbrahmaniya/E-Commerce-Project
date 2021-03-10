const Product = require('../models/product');
const slugify = require('slugify');
const { populate } = require('../models/product');
const User = require('../models/user');

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

//without pagination

// exports.list = async (req, res) => {
//     try {
//         const {sort, order, limit} = req.body;
//         const products = await Product.find({})
//         .populate("category")
//         .populate("subs")
//         .sort([[sort, order]])
//         .limit(limit)
//         .exec();
//         return res.json(products);
//     } catch(error) {
//         console.log(error)
//     }
// }

exports.list = async (req, res) => {
    try {
        const {sort, order, page} = req.body;
        const currentPage = page || 1;
        const perpage = 3;

        const products = await Product.find({})
        .skip((currentPage - 1) * perpage)
        .populate("category")
        .populate("subs")
        .sort([[sort, order]])
        .limit(perpage)
        .exec();
        return res.json(products);
    } catch(error) {
        console.log(error)
    }
}

exports.productsCount = async (req, res) => {
    let total = await Product.find({})
    .estimatedDocumentCount()
    .exec();
    res.json(total);
}

exports.productStar = async(req, res) => {
    const product = await Product.findById(req.params.productId)
    .exec();
    const user = await User.findOne({email: req.user.email})
    .exec();
    const {star} = req.body;
    let existingRatingObject = product.rating.find(
        (element) => (element.postedBy.toString() === user._id.toString())
    );
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(product._id, {
           $push: {rating: {star: star, postedBy: user._id}}, 
        },
        {new: true}
    ).exec();
    console.log("RATING", ratingAdded)
    res.json(ratingAdded);
    } else {
        const ratingUpdated = await Product.updateOne({
            rating: {$elemMatch: existingRatingObject},
        }, {$set: {"rating.$.star": star}},
        {new:true}
        ).exec();
        res.json(ratingUpdated);
    }
};