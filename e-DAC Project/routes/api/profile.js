const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route   GET api/profile/me
// @desc    Get current users profile 
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile
        .findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar']);

        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile
// @desc    Create or update a user profile 
// @access  Private
router.post('/', 
    [
        auth, 
        [ 
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'skills are required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        } 

        const{
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //Build Profile object
        const profilefields = {};
        profilefields.user = req.user.id;
        if(company) profilefields.company = company;
        if(website) profilefields.website = website;
        if(location) profilefields.location = location;
        if(bio) profilefields.bio = bio;
        if(status) profilefields.status = status;
        if(githubusername) profilefields.githubusername = githubusername;
        if(skills){
            profilefields.skills = skills.split(',').map(skill => skill.trim());
        }

        //Build Social media link object
        profilefields.social = {}
        if(youtube) profilefields.social.youtube = youtube;
        if(twitter) profilefields.social.twitter = twitter;
        if(facebook) profilefields.social.facebook = facebook;
        if(linkedin) profilefields.social.linkedin = linkedin;
        if(instagram) profilefields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if(profile){
                //update
                profile = await Profile
                .findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: profilefields },
                    {new: true }
                    );

                return res.json(profile);
            }
            //create
            profile = new Profile(profilefields);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   GET api/profile
// @desc    Get all profiles 
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/user/user_id
// @desc    Get profile by user id 
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile
            .findOne({ user: req.params.user_id })
            .populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile
// @desc    Delete profile, user and posts 
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        //remove users posts after account deletion
        await Post.deleteMany({ user: req.user.id });

        //Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });

        //Remove profile
        await User.findOneAndRemove({ _id: req.user.id });

        //Remove user
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/profile/experience
// @desc    add experience in profile
// @access  Private
router.put('/experience', 
    [auth, [
        check('title', 'title is required').not().isEmpty(),
        check('company', 'company is required').not().isEmpty(),
        check('from', 'from date is required').not().isEmpty()
        ] 
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.send(500).send('Server Error');
        }
    }
);

// @route   DELETE api/profile/experience/exp_id
// @desc    delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.send(500).send('Server Error');
    }
});

// @route   PUT api/profile/education
// @desc    add education in profile
// @access  Private
router.put('/education', 
    [auth, [
        check('school', 'School is required').not().isEmpty(),
        check('degree', 'Degree is required').not().isEmpty(),
        check('marks', 'Marks are required').not().isEmpty(),
        check('fieldofstudy', 'Field of study is required').not().isEmpty(),
        check('from', 'from date is required').not().isEmpty()
        ] 
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            school,
            degree,
            marks,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            marks,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.send(500).send('Server Error');
        }
    }
);

// @route   DELETE api/profile/education/edu_id
// @desc    delete education from profile
// @access  Private
router.delete('/education/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.send(500).send('Server Error');
    }
});


module.exports = router;