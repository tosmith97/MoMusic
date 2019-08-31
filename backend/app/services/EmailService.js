const nodemailer = require('nodemailer');
const jade = require('jade');

const transporter = nodemailer.createTransport({ service: 'Mailgun', auth: { user: CONFIG.mailgun_username, pass: CONFIG.mailgun_password } });

const templateDir = 'app/templates';
    

/** 
 * template is string that references the html file
 * args is an object that is passed into the jade file
 * to is an object with firstname, lastname, email
 * subject is "header" for email
 * */ 
exports.sendEmail = async function(template, args, toInfo, subject) {
    const emailTemplate = jade.renderFile(templateDir + template, args);
    const { email } = toInfo;

    const mailOptions = {
            from: 'Campus Experiences <alma@mg.almacampus.com>',
            to: '<' + email + '>',
            subject,
            html: emailTemplate,
            text:'text'
    };

    transporter.sendMail(mailOptions, function (err) {
        if (err) TE(err.message);
    });
}