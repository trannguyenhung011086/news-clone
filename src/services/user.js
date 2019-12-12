const yup = require('yup');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user');

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

const getUserByEmail = async email => {
    return await UserModel.findOne({ email: email.toLowerCase() }).select(
        'password',
    );
};

module.exports = {
    createUser: async ({ username, email, password }) => {
        const payload = { username, email, password };
        await validateRegister(payload);
        payload.password = await bcrypt.hash(password, 10);

        const user = await getUserByEmail(email);
        if (user) {
            throw new Error('User already registered!');
        }

        return await UserModel.create(payload);
    },

    getUserById: async userId => {
        const id = new mongoose.Types.ObjectId(userId);
        return await UserModel.findById(id);
    },

    getUserByEmail,
};
