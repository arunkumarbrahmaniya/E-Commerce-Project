const admin = require('../firebase');

exports.authCheck = async(req, res, next) => {
    try{
        const firebaseUser = await admin
        .auth()
        .verifyIdToken(req.headers.authtoken);
        console.log("FB USER", firebaseUser);
        req.user = firebaseUser;
        return next();
    }catch(error) {
        res.status(401).json({
            error: "INVALID OR EXPIRED TOKEN PROVIDED"
        })
    }
    next();
}