const Router = require('express').Router()
const {registerUser,searchUser} = require('../controllers/userController')
Router.route('/register').post(registerUser)
Router.route('/search').post(searchUser)
module.exports = Router