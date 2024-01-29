const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../database/models/User');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        //checking if any field is missing
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "Please enter all fields" });
        }

        //checking if user already registered
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ error: "Email is already registered" });
        }

        //check if both password are matching
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password and confirm-password doesn't match" });
        }

        //generating the password hash or encrypting the password
        const hashedPassword = await bcrypt.hash(password, 12);

        //if no error then saving into db or creating new user
        const newUser = await User.create({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            password: hashedPassword,
        })

        res.status(201).json({
            success: true,
            message: "User signed up successfully",
        })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.login = async (req, res) =>{
    const {email, password} = req.body;

    //check if field is missing
    if(!email || !password){
        return res.status(400).json({error: "Please enter all fields"});
    }

    //check if email is registered or not
    const user = await User.findOne({email});
    if (!user){
        return res.status(404).json({error: "User is not registered"})
    }

    //compare the password
    const isMatched = await bcrypt.compare(password, user.password);
    if(!isMatched){
        return res.status(409).json({error: "Invalid password"});
    }

    //generating jwt token for a user
    const jwtToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET_KEY);

    res.status(200).json({
        success: true,
        jwtToken,
        message: "User Logged in successfully"
    });
}
