require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWTSECRET,
    accessTokenSecret: process.env.ACCESSTOKENSECRET,
    refreshTokenSecret: process.env.REFRESHTOKENSECRET,
    accessTokenLife: process.env.ACCESSTOKENLIFE,
    refreshTokenLife: process.env.REFRESHTOKENLIFE,
    port: process.env.PORT || 4000,
    database: process.env.DATABASE || 'mongodb://127.0.0.1:27017/learn_svelte',
};
