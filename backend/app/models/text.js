const mongoose = require('mongoose');

const TextSchema = mongoose.Schema({
    body: String,
    to_number: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    errorMessage: String,
    twilioSID: String
}, {
    timestamps: true
});
const Text = mongoose.model('Text', TextSchema);

module.exports = Text; 