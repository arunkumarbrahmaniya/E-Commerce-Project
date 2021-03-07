const User = require('../models/user');

exports.createOrUpdateUser = async(req, res) => {
        const { name, picture,email } = req.user;
        await User.findOne({email})
        .then(async(user) => {
            if (user) {
                return res.json({user})
            } else {
                const newUser = new User({
                    email,
                    name,
                    picture,
                });
                await newUser.save();
                return res.json({newUser});
            }
        })
        .catch((error) => {
            console.log("ERROR!!!", error)
        })
}