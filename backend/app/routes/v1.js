const express = require('express');
const router = express.Router();
const passport = require('passport');

const UserController 	= require('./../controllers/UserController');
const MainController = require('./../controllers/MainController');

require('./../middleware/passport')(passport)


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Parcel Pending API", data:{"version_number":"v1.0.0"}})
});


/**
 * User Endpoints
 */
/*
  POST Request
  Sample request:
    {
      "email": test@stanford.edu,
      "username": "coolio-beanz",
      "password": pwd,
      "school": "Stanford University"
    }
*/ 
router.post('/users/create', UserController.create);

/*
  POST Request
  Sample request:
    {
      "code": 1234
    }
*/ 
router.post('/users/verifyCheck', passport.authenticate('jwt', {session:false}), UserController.confirmUserMobile);

/*
  POST Request
  No body necessary

*/ 
router.post('/users/resendVerification', passport.authenticate('jwt', {session:false}), UserController.resendVerificationEmail);


/*
    GET Request
*/
router.get('/users/get', passport.authenticate('jwt', {session:false}), UserController.get);

/*
  POST Request
  Sample request:
    {
      "email": test@stanford.edu,
      "password": yolo420blazeit
    }
*/ 
router.post('/users/login', UserController.login);

router.post('/users/refreshToken', passport.authenticate('jwt', {session:false}), UserController.refreshUserToken);

router.post('/users/resetPassword', UserController.resetPassword);

router.get('/main/authSpotify', MainController.authSpotify);

router.get('/main/spotifyCallback', MainController.handleSpotifyCallback);

router.get('/main/testText', MainController.sendText);

router.get('/main/lol', MainController.lol);


module.exports = router;
