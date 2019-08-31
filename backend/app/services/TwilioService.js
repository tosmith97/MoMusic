const twilio = require('twilio');
const client = new twilio(CONFIG.twilio_account_sid, CONFIG.twilio_auth_token);


exports.sendText = async function(body, toNumber) {
    let err, message;
    [err, message] = await to(client.messages.create({
        body,
        to: '+12622717436',
        from: CONFIG.twilio_number
    }));
    if (err) TE('Unable to sent text: ' + err.message);
    console.log(message);
}
