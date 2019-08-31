const userService = require('../services/UserService');
const spotifyService = require('../services/SpotifyService');
const twilioService = require('../services/TwilioService');

exports.authSpotify = async function (req, res) {
    let err, authURL;
    [err, authURL] = await to(spotifyService.getSpotifyAuthURL());
    if (err) return ReE(res, err, 422);
    
    return ReS(res, {
        authURL
    });
}

// TODO: figure out how to deal w this after signing in
// ie rn user logs in, then auths spotify acct
// how do we link that login w this callbacK?
// temp solution: have email they use be same one as Spotify
exports.handleSpotifyCallback = async function (req, res) {
    const code = req.query.code; 
    console.log(code);

    let err, _, topArtists, email;
    [err, _] = await to(spotifyService.setAPICredentials(code));
    if (err) return ReE(res, err, 422);

    [err, topArtists] = await to(spotifyService.getSpotifyTopArtists());
    if (err) return ReE(res, err, 422);

    [err, email] = await to(spotifyService.getEmailFromSpotify());
    if (err) return ReE(res, err, 422);

    [err, user] = await to(userService.updateUser({ email }, { $set: { topArtists } }));
    if (err) return ReE(res, err, 422);

    return ReS(res, {
        status: "success",
    });
}

exports.sendText = async function (req, res) {
    twilioService.sendText('test message', '');

    return ReS(res, {message:'good'}, 200);
}

exports.lol = async function(req, res) {
    spotifyService.getSpotifyUserInfo();
    return ReS(res, {
        code
    });
}