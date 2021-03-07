const admin = require('../firebase');
const User = require('../models/user');
exports.authCheck = async(req, res, next) => {
    try{
        const firebaseUser = await admin
        .auth()
        .verifyIdToken(req.headers.authtoken);
        req.user = firebaseUser;
        return next();
    }catch(error) {
        res.status(401).json({
            error: "INVALID OR EXPIRED TOKEN PROVIDED"
        })
    }
    next();
}

exports.adminCheck = async(req, res, next) => {
    const {email} = req.user;
    const adminUser = await User.findOne({email}).exec()
    if (adminUser.role !== 'admin') {
        res.status(403).send({
            error: 'Admin resource access denied'
        })
    } else {
        next();
    }
}