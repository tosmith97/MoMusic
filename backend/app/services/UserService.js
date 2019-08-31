const User = require('../models').User;
const _ = require('underscore');
const Constants = require('./../constants/defs');


getUserByEmail = async function (email) {
    let err, user;
    [err, user] = await to(User.findOne({email}));
    if (err) TE("Unable to find user: " + err.message);

    return user;
}

exports.updateUser = async function (filter, update) {
    let err, user;
    [err, user] = await to(User.findOneAndUpdate(filter, update));
    if (err) TE("Unable to update user: " + err.message);

    return user;
}