const express = require('express');
const app = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
const { authorizeRole } = require('../middleware/authorizeRole.middleware');

app.get('/', verifyToken, authorizeRole('admin'),  getAllUsers)
app.get('/:id',verifyToken, getUserById)
app.post('/', createUser)
app.put('/:id', updateUser, authorizeRole('admin'))
app.delete('/:id', verifyToken, deleteUser)

module.exports = app;