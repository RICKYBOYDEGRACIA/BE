const UserModel = require('../models/User');
const AuthModel = require('../models/Auth'); // Import your new auth model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
    const { email, password, firstName, middleName, lastName, age, location } = userData;

    // 1. Check if auth (email) already exists
    const existingAuth = await AuthModel.findOne({ email });
    if (existingAuth) {
        const error = new Error('User with this email already exists');
        error.statusCode = 400;
        throw error;
    }

    // 2. Create the User Profile document first
    const userProfile = await UserModel.create({
        firstName,
        middleName,
        lastName,
        age,
        location
    });

    // 3. Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the Auth document linked to the userProfile._id
    await AuthModel.create({
        email,
        password: hashedPassword,
        userId: userProfile._id
    });

    return { 
        message: "Successfully registered user", 
        userId: userProfile._id 
    };
};

const loginUser = async (credentials) => {
    const { email, password } = credentials;

    // Look up credentials in the Auth collection
    const authRecord = await AuthModel.findOne({ email });
    if (!authRecord) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, authRecord.password);
    if (!isMatch) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { id: authRecord.userId, email: authRecord.email },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '1d' }
    );

    return {
        message: "Login successful",
        token: token
    };
};

module.exports = {
    registerUser,
    loginUser
};