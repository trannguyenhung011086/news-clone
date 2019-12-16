const config = require('../config');
const mailer = require('@sendgrid/mail');

mailer.setApiKey(config.sendgrid);

module.exports = {
    sendActiveEmail: async ({ username, email, url }) => {
        try {
            const msg = {
                to: email,
                from: 'learn-svelte@example.com',
                subject: 'Your active link',
                text: `Hi ${username}, please click the following url to activate your account: ${url}.\nThank you!`,
                html: `<p>Hi <strong>${username}</strong>,</p> 
                <p>Please click <a href=${url}>the following url</a> to activate your account.</p>
                <p>Thank you!</p>`,
            };
            const send = await mailer.send(msg);
            console.log('Active email is sent to ' + email);
            return send;
        } catch (err) {
            console.error('Cannot send email!\n', err);
        }
    },
};
