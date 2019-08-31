const User = require('./../models').User;
const validator = require('validator');
const Constants = require('./../constants/defs');

exports.createUser = async function (userInfo) {
    console.log(userInfo);
    [err, oldUser] = await to(User.findOne({
        'email': userInfo.email
    }));
    console.log(oldUser);
    if (oldUser) TE('User already exists with that email');
    
    //generate code for verification
    userInfo.code = Math.random().toString(36).substring(2,6);

    [err, newUser] = await to(User.create(userInfo));
    if (err) TE(err.message);

    if (CONFIG.app === "Production") {
        //verify user email flow 
        const toInformation = {
            email: userInfo.email
        };
        const args = { code: userInfo.code };
        const subject = 'Verification Code: ' + userInfo.code;
        const template = '/emailVerificationMobile.html';
        
        // [err, _] = await to(emailService.sendEmail(template, args, toInformation, subject));
        if (err) return TE(err.message, true);
    }

    return newUser;
}

exports.authUser = async function (userInfo) { //returns token
    if (!userInfo.password) TE('Please enter a password to login');
    const school_email = userInfo.email.toLowerCase();
    if(!Constants.SCHOOL_DOMAINS.find(domain => school_email.endsWith(domain))) TE('The Campus Experiences app is not available for this school.');
    let user;

    if (validator.isEmail(school_email)) {
        [err, user] = await to(User.findOne({
            'email': school_email
        }));
        if (err) TE(err.message, true);
    } else {
        TE('A valid email was not entered');
    }

    if (!user) TE('Not registered');
    [err, user] = await to(user.comparePassword(userInfo.password));
    if (err) TE(err.message, true);
    return user;
}

exports.resetPassword = async function (reqBody) {
    if (!reqBody.resetPasswordToken) TE('Invalid token');
    if (!reqBody.newPassword) TE('Invalid password');
    
    let err, user;
    const conditions = {
        resetPasswordToken: reqBody.resetPasswordToken,
        resetPasswordExpires: {
            $gt: Date.now()
        },
    };

    [err, user] = await to(User.findOne(conditions));

    if (!user) TE('Invalid or expired token');

    /**
     * hashed password and creation of a new refresh token 
     * handled by 'save' hook in user model
     */

    user.password = reqBody.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    [err, user] = await to(user.save());
    if (err) TE(err.message);

    return user;
}
