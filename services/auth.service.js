const UserModel = require('../models/User');
const AuthModel = require('../models/Auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { default: mongoose } = require('mongoose');
const ActiveSession = require('../models/ActiveSession');

const registerUser = async (userData) => {
    const { email, password, firstName, middleName, lastName, age, location, role } = userData;

    // 1. Check if auth (email) already exists first (outside session is fine for quick lookup)
    const existingAuth = await AuthModel.findOne({ email });
    if (existingAuth) {
        const error = new Error('User with this email already exists');
        error.statusCode = 400;
        throw error;
    }

    // 2. Start a Mongoose Session for the Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Pass { session } to all database queries inside the transaction block

        // 3. Create the User Profile document
        const userProfile = await UserModel.create([{
            firstName,
            middleName,
            lastName,
            age,
            location,
            role,
        }], { session }); // Note: Pass as an array when using transactions

        // 4. Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Create the Auth document linked to the userProfile._id
        await AuthModel.create([{
            email,
            password: hashedPassword,
            userId: userProfile[0]._id // userProfile.create with session returns an array
        }], { session });

        // 6. If both succeed, commit the transaction
        await session.commitTransaction();
        session.endSession();

        return { 
            message: "Successfully registered user", 
            userId: userProfile[0]._id 
        };

    } catch (err) {
        // If anything fails, abort the transaction (rolls back both writes)
        await session.abortTransaction();
        session.endSession();
        throw err; // Forward error to your global error handler / next(err)
    }
};

const loginUser = async (userData, req) => { // Pass req to capture IP/User-Agent if needed
    const { email, password } = userData;

    // 1. Find auth record and populate user profile
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

    // 3. Extract role safely
    const userRole = authRecord.userId ? authRecord.userId.role : 'user';
    
    // 4. Block login if role is not admin
    if (userRole !== 'admin') {
        const error = new Error('Access forbidden: Only Administrator can log in here.');
        error.statusCode = 403;
        throw error;
    }

    // --- 5. MONITORING & TOKEN GENERATION ---
    // Generate a unique session ID for tracking this specific login instance
    const sessionId = crypto.randomUUID();

    // Store the session in your database so you can monitor/revoke it later
    await ActiveSession.create({
        sessionId: sessionId,
        userId: authRecord.userId._id,
        ipAddress: req?.ip || 'unknown',
        userAgent: req?.headers['user-agent'] || 'unknown',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // e.g., 7 days
    });

    // Create the JWT containing both the user ID and the session ID
    const token = jwt.sign(
        { 
            userId: authRecord.userId._id, 
            sessionId: sessionId,
            role: userRole 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { token, user: authRecord.userId };
};


module.exports = {
    registerUser,
    loginUser
};