const User = require('../models').User;
const authService = require('../services/AuthService');
const userService = require('../services/UserService');
// const emailService = require('../services/emailService');

const randtoken = require('rand-token');
const crypto = require('crypto');

const Constants = require('./../constants/defs');

exports.create = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    req.sanitize('email').normalizeEmail({
        gmail_remove_dots: false
    });

    req.checkBody('email', 'Enter a valid email address').isEmail();
    const errors = req.validationErrors();
    if (errors) {
        return ReE(res, 'Please enter a valid school email to register.', 422);
    }
    const body = req.body;
    if (!body.email) {
        return ReE(res, 'Please enter an email to register.', 422);
    } else if (!body.password) {
        return ReE(res, 'Please enter a password to register.', 422);
    } else {

    let err, user;
    [err, user] = await to(authService.createUser(body));
    if (err) {
        return ReE(res, err, 422);
    }

    const userJson = user.toWeb();
    return ReS(res, {
        userJson,
        refreshToken: user.refreshToken.token,
        token: user.getJWT(),
    }, 201);
    }
}

exports.resendVerificationEmail = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;
    const body = req.body;
    
    //verify user email flow 
    const toInformation = {
        email: user.email
    };
    const args = { code: user.code };
    const subject = 'Verification Code: ' + user.code;
    const template = '/emailVerificationMobile.html';
    
    // [err, _] = await to(emailService.sendEmail(template, args, toInformation, subject));
    if (err) return TE(err.message, true);

    return ReS(res, {
        //userJson
    });
}

exports.confirmUserMobile = async function(req, res, next) {
    const user = req.user;
    const { code } = req.body

    if(user.code == code) {
        user.isVerified = true

        user.save(function(err) {
            if(err) return ReE(res, err, 422);

            return ReS(res, {
                message: 'Successfully verified user.'
            }, 201);
        })
    } else {
        return ReE(res, 'The confirmation code does not match', 400)
    }
}

exports.get = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;
    const userJson = user.toWeb();

    return ReS(res, {
        userJson
    });
}

exports.login = async function (req, res) {
    if (!checkProps(req.body, "email|password")) return ReE(res, 'Missing properties for endpoint', 400);
    res.setHeader('Content-Type', 'application/json');
    let err, user;
    [err, user] = await to(authService.authUser(req.body));
    if (err) return ReE(res, err, 422);
    
    const userJson = user.toWeb();

    return ReS(res, {
        token: user.getJWT(),
        refreshToken: user.refreshToken.token,
        userJson
    });
}

/**
 * Refresh token for user
 */
exports.refreshUserToken = async function (req, res) {
    let user, refreshToken;
    user = req.user;
    refreshToken = req.body.refreshToken;

    if (user.refreshToken.token === refreshToken) {
        return ReS(res, {
            token: user.getJWT(),
        });
    } else {
        return ReE(res, 'Invalid refresh token');
    }
}

// POST that needs to include token and new password
// Resets forgotten password; different from changing a password
exports.resetPassword = async function (req, res) {
    let err, user;
    [err, user] = await to(authService.resetPassword(req.body));

    if (err) {
        return ReE (res, err, 401);
    }

    return ReS(res, {
        message: 'Successfully updated password!',
    }, 201);
}
