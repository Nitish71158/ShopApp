const user = require("../models/user");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendmail");


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

const Register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await user.create({ name, email, password: hashedPassword });
        if (newUser) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const message = `Thanks for registering with us. ${name},
            Your OTP for registration is ${otp}`;
            await sendEmail(email, "Registration OTP", message);
            newUser.otp = otp;
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                token: generateToken(newUser._id),
            });
            res.status(201).json(newUser);
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

};

exports.Register = Register;


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await user.findOne({ email });
        if (existingUser && (await bcrypt.compare(password, existingUser.password))) {
            res.status(200).json({
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                token: generateToken(existingUser._id),
            });
        } else {
            res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.getUser = async (req, res) => {
    try {
        const userData = await user.find().select("-password");
        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const existingUser = await user.findOne({ email });
        if (existingUser && String(existingUser.otp) === String(otp)) {
            existingUser.verified = true;
            await existingUser.save();
            const message = `Dear ${existingUser.name},
            Your OTP for registration has been verified successfully. You can now log in to your account.`;
            await sendEmail(email, "OTP Verified", message);
            return res.status(200).json({ message: "OTP verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}