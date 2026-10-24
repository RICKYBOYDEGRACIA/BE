const UserModel = require('../models/User');
const AuthModel = require('../models/Auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
    const { email, password, firstName, middleName, lastName, age, location, role} = userData;

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
        location,
        role,
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

const loginUser = async (userData) => {
    const { email, password } = userData;

    // 1. Find auth record and populate the associated user profile to check the role
    const authRecord = await AuthModel.findOne({ email }).populate('userId');
    if (!authRecord) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, authRecord.password);
    if (!isMatch) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    // 3. Extract role safely from the populated user profile
    const userRole = authRecord.userId ? authRecord.userId.role : 'user';

    // 4. Block login if role is not admin
    if (userRole !== 'admin') {
        const error = new Error('Access forbidden: Only Administrator can log in here.');
        error.statusCode = 403;
        throw error;
    }

    // 5. Generate token
    const token = jwt.sign(
        { id: authRecord.userId._id, email: authRecord.email, role: userRole },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '1d' }
    );

    return { 
        message: "Login successful", 
        token 
    };
};

module.exports = {
    registerUser,
    loginUser
};