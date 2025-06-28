const Auth = require('../controllers/auth.controller');
const User = require('../controllers/user.controller');
const Middleware = require('../helpers/middleware');

const router=require('express').Router();

//auth apis
router.post('/auth/register',Auth.register);
router.post('/auth/login',Auth.login);


//user apis
router.get('/user/get-details',Middleware.checkAuthToken,User.getDetails);

module.exports=router;