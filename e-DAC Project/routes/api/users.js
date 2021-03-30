const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const { JsonWebTokenError } = require('jsonwebtoken');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [
    check('name', 'Name is Required')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min : 6 })
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
    //see if user exists
        let user = await User.findOne({ email });

        if(user){
            return res.status(400).json({ errors : [ { msg: 'User already exists' }] });
        }
        //get the url of gravatar
        const avatar = gravatar.url(email, {
            s: '200',   //default size
            r: 'pg',    //reading
            d: 'mm'     //it will give default image
        })
        //create instance of user
        user = new User({
            name,
            email,
            avatar,
            password
        });

    //Encrypt the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        //sending payload to identify user
        const payload = {
            user: {
                id: user.id
            }
        }
        //Return jsonwebtoken
        jwt.sign(payload, 
            config.get('jwtSecret'), 
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
