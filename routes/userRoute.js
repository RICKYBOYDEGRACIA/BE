const express = require('express');
const app = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken')

app.get('/', verifyToken, getAllUsers)
app.get('/:id',verifyToken, getUserById)
app.post('/', createUser)
app.put('/:id', updateUser)
app.delete('/:id', verifyToken, deleteUser)

module.exports = app;