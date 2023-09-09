const Router = require('express').Router()
const {login,getProfile} = require('../controllers/authController')

Router.route('/login').post(login)

module.exports = Router