const Coupan = require('../models/coupan');


exports.create = async(req, res) => {
    try{
        const {name, expiry, discount} = req.body;
        res.json(await new Coupan({name, expiry, discount}).save());
    }catch(error) {
        console.log("ERROR", error);
    }
}

exports.remove = async(req, res) => {
    try{
        res.json(await Coupan.findByIdAndDelete(req.params.coupanId).exec());
    }catch(error) {
        console.log("ERROR", error);
    }
}

exports.list = async(req, res) => {
    try{
        res.json(await Coupan.find({}).sort({createdAt: -1}).exec());
    }catch(error) {
        console.log("ERROR", error);
    }
}

