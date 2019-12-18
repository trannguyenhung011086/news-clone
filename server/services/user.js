const yup = require('yup');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user');
// const myEmitter = require('../events/mailer');
const scheduler = require('../jobs/scheduler');

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

        // const send = myEmitter.emit('register', {
        //     username,
        //     email,
        //     url: newUser.activeLink,
        // });
        // if (!send) myEmitter.emit('error');

        await scheduler.scheduleActiveEmail({
            username,
            email,
            url: newUser.activeLink,
        });

        return newUser;
    },

    activeUser: async ({ userId, uuid }) => {
        const user = await getUserById(userId);
        if (!user) {
            throw new Error('User not found!');
        }
        if (user.active) {
            throw new Error('User already active!');
        }
        if (!user.activeLink.includes(uuid)) {
            throw new Error('Invalid active code!');
        }

        await scheduler.scheduleWelcomeEmail({
            username: user.username,
            email: user.email,
        });

        user.active = true;
        user.welcome = true;
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

        // const send = myEmitter.emit('resend', {
        //     username: user.username,
        //     email: user.email,
        //     url: user.activeLink,
        // });
        // if (!send) myEmitter.emit('error');

        await scheduler.scheduleResendActiveEmail({
            username: user.username,
            email: user.email,
            url: user.activeLink,
        });

        return { send: true, activeLink: user.activeLink };
    },
};
