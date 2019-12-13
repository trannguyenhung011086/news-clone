const { default: test } = require('ava');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const http = require('http');
const listen = require('test-listen');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();

const isEmail = require('isemail');
const faker = require('faker');

const config = require('../../src/config');

const app = require('../../src/app');
const server = http.createServer(app);
const baseUrl = listen(server).then(url => url);

test.before(async () => {
    mongod.getConnectionString().then(uri => {
        mongoose.connect(uri, config.mongoOptions);
    });
});

test.after.always(() => {
    server.close();
    mongod.stop();
});

test('Wrong method of create user', async t => {
    const res = await fetch((await baseUrl) + '/user/register', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });
    const body = await res.json();

    t.deepEqual(res.status, 404);
    t.deepEqual(body.message, 'Not found!');
});

test('Cannot create user without required fields', async t => {
    const res = await fetch((await baseUrl) + '/user/register', {
        method: 'post',
        body: JSON.stringify({ test: '' }),
        headers: { 'Content-Type': 'application/json' },
    });
    const body = await res.json();

    t.deepEqual(res.status, 500);
    t.deepEqual(body.errors, [
        'username is a required field',
        'email is a required field',
        'password is a required field',
    ]);
});

test('Can create user with required fields', async t => {
    const res = await fetch((await baseUrl) + '/user/register', {
        method: 'post',
        body: JSON.stringify({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }),
        headers: { 'Content-Type': 'application/json' },
    });
    const body = await res.json();

    t.deepEqual(res.status, 200);
    t.assert(body.id);
    t.assert(body.username);
    t.assert(isEmail.validate(body.email));
    t.false(body.active);
});
