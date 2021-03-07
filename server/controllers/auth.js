const User = require('../models/user');

exports.createOrUpdateUser = async(req, res) => {
        const { name, picture,email } = req.user;
        await User.findOne({email})
        .then(async(user) => {
            if (user) {
                return res.json({data:user})
            } else {
                const newUser = new User({
                    email,
                    name: email.split('@')[0],
                    picture,
                });
                await newUser.save();
                return res.json({data:newUser});
            }
        })
        .catch((error) => {
            res.status(401).send({error: error.message})
        })
};

exports.currentUser = async(req, res) => {
    await User.findOne({email: req.user.email})
    .then(async(user) => {
        res.json({data:user});
    })
    .catch(error => {
        res.status(404).send({error: error.message})
    }) 
};