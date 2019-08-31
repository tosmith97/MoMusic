const SpotifyWebApi = require('spotify-web-api-node');

const scopes = ['user-top-read', 'user-library-read', 'user-read-email']
const spotifyApi = new SpotifyWebApi({
    clientId: CONFIG.spotify_client_id,
    clientSecret: CONFIG.spotify_client_secret,
    redirectUri: CONFIG.spotify_redirect_uri
});


exports.getSpotifyAuthURL = async function() {
    const authURL = spotifyApi.createAuthorizeURL(scopes, '');
    // if (err) TE('Error getting auth URL: ' + err.message);
    console.log(authURL);

    // save token 

    return authURL;
}


exports.lol = async function() {
    const code = "AQDCOD6fNX4FvLf2PWwnynw6d94kbMMTHFW9kQtghuvnPAmpPYeMsCv-oWzISyJUJB95lfHv80-SzlS7LcuPsy73QVtxP9V6Cp4oig5gJYdqCW3gv-zsCBfn0gcLeD5_ANJLRhMmftnQsp5V8jUv_8ECK7cDEl06UWYStUzhvXOZFMdCx6OlhJlqoGOjO3iY220PTX7QcevNLaXWaPm2PVYuVYjpMtCSoHk2ylHXE7hHivhhOsl3cJPx3Vnt3HuOGSi7onaRevG18UgYNBciC7ErmL_xGjSG";
    let err, data;
    [err, data] = await to(spotifyApi.authorizationCodeGrant(code));

    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);

    [err, data] = await to(spotifyApi.getMe());
    console.log(data);
}


// Important fields in each artist JSON obj from Spotify:
// genres, external_urls.spotify, name, uri
extractTopArtistsFromTA = async function(topArtistsList) {
    let topArtists = new Set();
    for (const artist of topArtistsList) {
        topArtists.add(artist.name);
    }
    return topArtists;
}

// important fields for each track JSON obj from Spotify:
// arr: artists, obj: external_urls, str: name, obj: album
extractTopArtistsFromTopTracks = async function(topTracksList) {
    let topArtists = new Set();
    for (const track of topTracksList) {
        // todo: add all artists on a song?
        try {
            topArtists.add(track.topArtists[0]['name']);
        }
        catch (err){
            continue;
        }
    }
    return topArtists;
}

exports.setAPICredentials = async function(code){
    let err, data, _;
    [err, data] = await to(spotifyApi.authorizationCodeGrant(code));
    if (err) TE('Error granting auth: ' + err.message);

    // TODO: figure out if this is user-specific or dev-specific
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
}

exports.getEmailFromSpotify = async function() {
    [err, data] = await to(spotifyApi.getMe());
    if (err) TE('Error granting auth: ' + err.message);

    return data.body.email;
}

exports.getSpotifyTopArtists = async function() {
    [err, data] = await to(spotifyApi.getMyTopArtists({ limit:30, time_range: 'medium_term' }));
    if (err) TE('Error getting top artists: ' + err.message);

    let topArtistsFromTA;
    [err, topArtistsFromTA] = await to(extractTopArtistsFromTA(data.body.items)); 
    if (err) TE('Error extracting top artists: ' + err.message);

    [err, data] = await to(spotifyApi.getMyTopTracks({ limit:1000, time_range: 'medium_term' }));
    if (err) TE('Error getting top tracks: ' + err.message);

    let topArtistsFromTopTracks;
    [err, topArtistsFromTopTracks] = await to(extractTopArtistsFromTopTracks(data.body.items)); 
    if (err) TE('Error extracting top artists from tracks: ' + err.message);

    const topArtistsAll = Array.from(new Set([...topArtistsFromTA, ...topArtistsFromTopTracks]));

    return topArtistsAll;
}