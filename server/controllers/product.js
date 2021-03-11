const Product = require('../models/product');
const slugify = require('slugify');
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

exports.listRelated = async(req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    const related = await Product.find({
        _id: {$ne: product._id},
        category: product.category,
    })
    .limit(3)
    .populate("category")
    .populate("subs")
    .populate('postedBy')
    .exec();
    res.json(related);
};

// search filter

const handleQuery = async(req, res, query) => {
    const products = await Product.find({$text: {$search: query}})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();
    res.json(products);
}

const handlePrice = async(req, res, price) => {
     try {
         let products = await Product.find({
             price:{
                 $gte: price[0],
                 $lte: price[1]
             },
         })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();
        res.json(products);
     }catch(error) {
        res.status(400).json({
            error: error.message
        })
     }
}

const handleCategory = async(req, res, category) => {
    try{
        let products = await Product.find({category})
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();
        res.json(products);
    }catch(error) {
        console.log("CAT", error);
        res.status(400).json({
            error: error.message
        })
    }
}

const handleStar = (req, res, stars) => {
    Product.aggregate([
        {
            $project:{
                document: "$$ROOT",
                floorAverage: {
                    $floor: {
                        $avg: "$rating.star"
                    }
                }
            },
        },
        {
            $match: {floorAverage: stars}
        }
    ])
    .limit(12)
    .exec((error, aggregates) => {
        if (error) {
            console.log("AGGREGATES", error)
        } else {
            Product.find({_id:aggregates})
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec((error, products) => {
                if (error) {
                    console.log("AGGREGATE 2", error)
                } else {
                    res.json(products);
                }
            });
        }
    })
}
const handleSub = async(req, res, sub) => {
    const products = await Product.find({subs: sub})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();
    res.json(products);
}

const handleShipping = async(req, res, shipping) => {
    const products = await Product.find({
        shipping
    })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();
    res.json(products);

}
const handleColor = async(req, res, color) => {
    const products = await Product.find({
        color
    })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();
    res.json(products);
}
const handleBrand = async(req, res, brand) => {
    const products = await Product.find({
        brand
    })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();
    res.json(products);
}

exports.searchFilters = async(req, res) => {
    const {query, price, category, stars, sub, shipping, color, brand} = req.body;
    if (query) {
        await handleQuery(req, res,query);
    }
    if (price !== undefined) {
        await handlePrice(req, res, price);
    }
    if (category) {
        await handleCategory(req, res, category);
    }
    if (stars) {
        await handleStar(req, res, stars);
    }
    if (sub) {
        await handleSub(req, res, sub);
    }
    if (shipping) {
        await handleShipping(req, res, shipping);
    }
    if (color) {
        await handleColor(req, res, color);
    }
    if (brand) {
        await handleBrand(req, res, brand);
    }

}

