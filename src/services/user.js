const yup = require('yup');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const config = require('../config');

const UserModel = require('../models/user');
const myEmitter = require('../events/mailer');

const validateRegister = async ({ username, email, password }) => {
    let payload = { username, email, password };
    const schema = yup.object({
        username: yup
            .string()
            .required()
            .lowercase(),
        email: yup
            .string()
            .email()
            .required()
            .lowercase(),
        password: yup
            .string()
            .min(6)
            .required(),
    });

    await schema.validate(payload, { abortEarly: false });
    return payload;
};

const getUserById = async userId => {
    const id = new mongoose.Types.ObjectId(userId);
    return await UserModel.findById(id);
};

const getUserByEmail = async email => {
    return await UserModel.findOne({ email: email.toLowerCase() }).select(
        'password',
    );
};

const getUserByUsername = async username => {
    return await UserModel.findOne({ username: username.toLowerCase() });
};

const createActiveUrl = ({ userId }) => {
    const uuid = uuidv4();
    return `${config.baseUrl}/user/${userId}/${uuid}/active`;
};

module.exports = {
    getUserById,
    getUserByEmail,
    getUserByUsername,

    createUser: async ({ username, email, password }) => {
        const payload = { username, email, password };
        await validateRegister(payload);

        let user = await getUserByEmail(email);
        if (user) {
            throw new Error('Email already registered!');
        }

        user = await getUserByUsername(username);
        if (user) {
            throw new Error('Username already registered!');
        }

        payload.password = await bcrypt.hash(password, 10);
        let newUser = await UserModel.create(payload);

        const send = myEmitter.emit('register', { username, email, url });
        if (!send) myEmitter.emit('error');

        const url = createActiveUrl({ userId: newUser._id });
        newUser.activeLink = url;
        newUser = await newUser.save();

        return newUser;
    },

    activeUser: async ({ userId, uuid }) => {
        const user = await getUserById(userId);
        if (!user) {
            throw new Error('User not found!');
        }
        if (!user.activeLink.includes(uuid)) {
            throw new Error('Invalid active code!');
        }

        user.active = true;
        await user.save();
        return { userId: user._id, active: user.active };
    },

    resendActiveEmail: async ({ userId }) => {
        const user = await getUserById(userId);

        if (!user) {
            throw new Error('User not found!');
        }
        if (user.active) {
            throw new Error('User already active!');
        }

        const url = createActiveUrl({ userId });
        user.activeLink = url;
        await user.save();

        const send = myEmitter.emit('resend', {
            username: user.username,
            email: user.email,
            url,
        });
        if (!send) myEmitter.emit('error');

        return { send, activeLink: url };
    },
};
