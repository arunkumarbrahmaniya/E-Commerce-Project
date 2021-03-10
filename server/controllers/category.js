const Category = require('../models/category');
const slugify = require('slugify');
const Sub = require('../models/sub');
const Product = require('../models/product');
const product = require('../models/product');
exports.create = async(req, res) => {
    try {
        const {name} = req.body;
        const category = await new Category({name, slug:slugify(name)}).save();
        res.json(category);
    } catch(error) {
        res.status(400).send('Creation of category failed')
    }
}
exports.list = async(req, res) => {
    res.json(await Category.find({}).sort({createdAt: -1}).exec());
}
exports.read = async(req, res) => {
    let category = await Category.findOne({slug: req.params.slug}).exec();
    const products = await Product.find({category: category})
    .populate("category")
    .exec();
    console.log("CATE", products)
    res.json({
        category,
        products,
    });
}
exports.remove = async(req, res) => {
    try{
        const deleted = await Category.findOneAndDelete({slug: req.params.slug});
        res.json(deleted);
    }catch(error){
        res.status(400).send("Category delete failed")
    }
}
exports.update = async(req, res) => {
    const { name } = req.body;
    try {
        const updatedCategory = await Category.findOneAndUpdate(
            {slug: req.params.slug},
            {name, slug: slugify(name)},
            {new:true}
            );
            res.json(updatedCategory);
    }catch(error) {
        res.status(400).send("Category update failed")
    }
};

exports.getSubs = async(req, res) => {
    Sub.find({parent: req.params._id}).exec((err, subs) => {
        if (err) {
            console.log(err)
        } else {
            res.json(subs);
        }
    })
}
