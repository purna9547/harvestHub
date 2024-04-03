const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const router = express.Router();

router.use(cookieParser());

router.get('/', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username:username, password: hashedPassword });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Error creating user');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send('User not found');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).send('Invalid password');
    }
    
    // Generate JWT token
    const token = jwt.sign({ username: user.username }, 'qwertyujikl8520asdfghjkil', { expiresIn: '5s' });

     // Set token as a cookie
     res.cookie('token', token, { httpOnly: true });
    
    res.redirect(`/dashboard`);
});


router.get('/dashboard', (req, res) => {
    const token = req.cookies.token;
    
    

    if (!token) {
        return res.status(401).send('Token is required');
    }

    jwt.verify(token, 'qwertyujikl8520asdfghjkil', (err, decodedToken) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(404).send('Invalid token');
        }
        const username = decodedToken.username;
        res.render('dashboard',{username});
    })
    });


router.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/login');
});

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
module.exports = router;
