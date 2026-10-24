const UserModel = require('../models/User');

//Get: This will get all user in db
const getAllUsers = async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { role: { $ne: 'admin' } };

    try{
        const items = await UserModel.find(filter)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);

        const total = await UserModel.countDocuments(filter);
        
        if(items.length <= 0 && page === 1){
            return res.status(404).json({
                message: "No data found"
            })
        }
        return res.status(200).json({
            message: "Successfully retrieved data",
            data: items,
            limit,
            total,
            pages: Math.ceil(total / limit)
        })
    }catch(err){
        next(err);
    }
}

//Get: This will get user by id
const getUserById = async(req, res, next) => {
    try{
        const data = await UserModel.findById(req.params.id);
        if(!data){
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            message: "Successfully retrieved user",
            data
        })
    }catch(err){
        next(err);
    }
}

//Post: This create user
const createUser = async(req, res, next) => {
    try{
        const data = await UserModel.create(req.body);
        console.log(data)
        if(!data){
            return res.status(400).json({
                message: "Please fill all required fields"
            })
        }
        return res.status(201).json({
            message: "Successfully created a user",
            data
        })
    }catch(err){

        next(err);
    }
}

//Put: This update user by their id
const updateUser = async(req, res, next) => {
    try{
        const data = await UserModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: true, runValidators: true
            }
        );
        if(!data){
            return res.status(404).json({
                message: "Invalid entry"
            })
        }
        return res.status(201).json({
            message: "Successfully updated a user",
            data
        })
    }catch(err){
        
        next(err);
    }
}

//Delete: This will delete user by id
const deleteUser = async(req, res, next) => {
    try{
        const data = await UserModel.findByIdAndDelete(req.params.id);
        if(!data){
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            message: "Successfully deleted user"
        })
    }catch(err){
        next(err);
    }
}



module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}