const User = require("../models/user");
const registerValidator = require("../validator/register");
const jwt = require("jsonwebtoken");
const keys = require("../keys");
const bycript = require("bcryptjs");
const signInValidator = require("../validator/login");

//const User = mongoose.model('User');

exports.signUp = async (req, res) => {
    const {
        errors,
        isValid
    } = await registerValidator(req.body);

    if (!isValid) {
        return res.status(422).json({
            error: errors,
        });
    }
    if (!req.body.email || !req.body.password || !req.body.name) {
        return res.status(422).json({
            error: "please add all the fields",
        });
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    console.log(email);
    const userExists = await User.findOne({
        email: req.body.email,
    });
    if (userExists)
        return res.status(403).json({
            error: "email is taken!",
        });
    bycript.hash(password, 12).then((hashedpassword) => {
        const user = new User({
            name,
            password: hashedpassword,
            email,
        }).save();
    });

    res.status(200).json({
        message: "sign up success!",
    });
};

exports.signIn = (req, res) => {
    const {
        email,
        password
    } = req.body;
    if (!email || !password) {
        return res.status(422).json({
            error: "please add email or password",
        });
    }

    const {
        errors,
        isValid
    } = signInValidator(req.body);

    if (!isValid) {
        return res.status(422).json({
            error: errors,
        });
    }

    User
        .findOne({
            email: email,
        })
        .then((user) => {
            if (!user) {
                return res.status(422).json({
                    error: "Invalid Email or password",
                });
            }

            bycript
                .compare(password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        // generate token
                        const token = jwt.sign({
                                _id: user._id,
                            },
                            keys.JWTSECRET,
                            // one hour
                            {
                                expiresIn: "1h"
                            }
                        );
                        // create paylod
                        const {
                            _id,
                            name,
                            email,
                            followers,
                            following,
                            pic,
                            createdAt

                        } = user;
                        res.json({
                            token,
                            user: {
                                _id,
                                name,
                                email,
                                followers,
                                following,
                                pic,
                                createdAt
                            },
                        });
                    } else {
                        return res.status(422).json({
                            error: "Invalid email or password",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        });
};