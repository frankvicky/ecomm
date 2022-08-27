const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { 
    requireEmail, 
    requirePassword, 
    requirePasswordConfirmation, 
    requireEmailExist, 
    requireValidPasswordForUser 
} = require('./validators');
//router could see as app which is like what we use in index.js
//but actually it is a sub app, to give us more flexibility to write
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

//bodyParser has many function in it, urlencoded is specific for html form
router.post(
    '/signup',
    [ requireEmail, requirePassword, requirePasswordConfirmation ],
    async (req, res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.send(signupTemplate({ req, errors }));
        }

        const { email, password, passwordConfirmation } = req.body;
        const { id } = await usersRepo.create({ email, password });
        req.session.userId = id;

        res.send('Account created');
    });

router.get('/signout', (req, res) => {
    //tell cookie-session to forget all info store in cookie
    req.session = null;
    res.send('You are loged out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
});

router.post('/signin', [ requireEmailExist, requireValidPasswordForUser ], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.send(signinTemplate({ errors }));
    }

    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;
    res.send('You are sign in.')
});

module.exports = router;