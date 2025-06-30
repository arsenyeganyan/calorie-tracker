const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateRandomCode = require('../utils/generateRandCode');
const sendEmail = require('../utils/sendEmail');

exports.validate = async (req, res, next) => {
    try {
        const { username, email } = req.body;

        const checkUser = await User.findOne({ username, email });
        if(checkUser) {
            return res.status(409).json({ msg: 'User already exists!' });
        }
        
        const confirmation = generateRandomCode();
        
        await sendEmail(
            `Your email confirmation code: ${confirmation}`,
            email
        );
    
        res.status(200).json({ 
            msg: 'Email sent!',
            confirmation,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Error validating user!', details: err.message });
    }
}

exports.signup = async (req, res, next) => {
    try {
        const { username, email, password, age, weight, goal, activity_level, gender } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ username, email, password: hashedPassword, age, weight, goal, activity_level, gender });
        newUser.save();

        req.session.userId = newUser._id;
        console.log('session test: ', req.session.userId);

        res.status(200).json({ msg: 'User created!' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Error creating user!', details: err.message });
    }
}

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        let user = await User.findOne({ username });
        if(!user) 
            return res.status(401).json({ error: 'Invalid credentials!' });

        let userId = user?._id;
        
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if(!passwordsMatch) 
            return res.status(401).json({ error: 'Invalid credentials!' });

        req.session.userId = userId;
        console.log('session test: ', req.session.userId);

        res.status(200).json({ msg: 'Logged in successfully!'  });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Error while logging in!' });
    }
}

exports.getSession = (req, res) => {
    if (req.session.userId) {
        console.log('session id backend: ', req.session.userId);
        
        res.status(200).json({ userId: req.session.userId });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Error while logging out!', details: err.message });
        }

        res.status(204).send();
    });
}