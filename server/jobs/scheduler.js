const agenda = require('./agenda');

module.exports = {
    scheduleActiveEmail: async ({ username, email, url }) => {
        await agenda.schedule('in 1 second', 'register', {
            username,
            email,
            url,
        });
    },

    scheduleResendActiveEmail: async ({ username, email, url }) => {
        await agenda.schedule('in 1 second', 'resend', {
            username,
            email,
            url,
        });
    },

    scheduleWelcomeEmail: async ({ username, email }) => {
        await agenda.schedule('in 30 seconds', 'welcome', { username, email });
    },
};
