const User = require('../models/user');

exports.createOrUpdateUser = async(req, res) => {
    const { name, picture,email } = req.user;
    const user = await User.findOneAndUpdate({email: email}, {name: name, picture: picture}, {new: true});
    
    if (user) {
        console.log("LOG", user)
        res.json(user)
    } else {
        console.log("LOG2", email, name, picture)
        const newUser = await new User({
            email, name, picture,
        }).save();
        res.json(newUser)
    }
}