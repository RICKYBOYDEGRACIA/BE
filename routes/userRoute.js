const express = require('express');
const app = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');

app.get('/', getAllUsers)
app.get('/:id', getUserById)
app.post('/', createUser)
app.put('/:id', updateUser)
app.delete('/:id', deleteUser)

module.exports = app;