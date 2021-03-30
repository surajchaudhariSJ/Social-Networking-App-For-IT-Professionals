import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';


const EditProfile = ({ 
    profile: { profile, loading }, 
    createProfile, 
    getCurrentProfile, 
    history 
}) => {
    const [formData, setFormData] = useState({
        company: '',
        website: '',
        location: '',
        status: '',
        skills: '',
        bio: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        instagram: ''
    });

    const [displaySocialInputs, toggleSocialInputs] = useState(false);

    useEffect(() => {
        getCurrentProfile();

        setFormData({
            company: loading || !profile.company ? '' : profile.company,
            website: loading || !profile.website ? '' : profile.website,
            location: loading || !profile.location ? '' : profile.location,
            status: loading || !profile.status ? '' : profile.status,
            skills: loading || !profile.skills ? '' : profile.skills.join(','),
            bio: loading || !profile.bio ? '' : profile.bio,
            twitter: loading || !profile.twitter ? '' : profile.twitter,
            facebook: loading || !profile.facebook ? '' : profile.facebook,
            linkedin: loading || !profile.linkedin ? '' : profile.linkedin,
            youtube: loading || !profile.youtube ? '' : profile.youtube,
            instagram: loading || !profile.instagram ? '' : profile.instagram
        });
    }, [loading, getCurrentProfile]);

    const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        twitter,
        facebook,
        linkedin,
        youtube,
        instagram
    } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        createProfile(formData, history, true);
    }

    return (
     <Fragment>
       <div className="create_profile_align">
            <p className="lead">
                Edit your profile 
            </p>
            <form className="form" onSubmit={e => onSubmit(e)}>
            <div className="form-group">
                <select name="status" value={status} onChange={e => onChange(e)}>
                <option value="0">* Select Current Job Profile</option>
                    <option value="Developer">System Engineer</option>
                    <option value="Junior Developer">Junior Developer</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="Manager">Manager</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Student or Learning">Student</option>
                    <option value="Instructor">Network Enginner</option>
                    <option value="Intern">Linux Administrator</option>
                    <option value="Intern">Database Administrator</option>
                    <option value="Intern">Information Security Officer</option>
                    <option value="Other">Other</option>
                </select>
            </div>
        <div className="form-group">
          <input type="text" placeholder="Company" name="company" value={company} onChange={e => onChange(e)}/>
          <small className="form-text">Current company name or college name</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Website" name="website" value={website} onChange={e => onChange(e)}/>
          <small className="form-text">company / college website</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Location" name="location" value={location} onChange={e => onChange(e)}/>
          <small className="form-text">(eg. Pune, Mumbai, Banglore)</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Skills" name="skills" value={skills} onChange={e => onChange(e)}/>
          <small className="form-text">(eg.Java, Python, Database, HTML, CSS)</small>
        </div>
        <div className="form-group">
          <textarea placeholder="A short bio of yourself" name="bio" value={bio} onChange={e => onChange(e)}></textarea>
          <small className="form-text">about yourself</small>
        </div>

        <div className="my-2">
          <button onClick={() => toggleSocialInputs(!displaySocialInputs)} type="button" className="btn btn-dark">
            Add Links
          </button>
        </div>

        {displaySocialInputs && 
        <Fragment>
            <div className="form-group social-input">
            <i className="fab fa-twitter fa-2x"></i>
                <input type="text" placeholder="Twitter URL" name="twitter" value={twitter} onChange={e => onChange(e)}/>
            </div>

            <div className="form-group social-input">
             <i className="fab fa-facebook fa-2x"></i>
             <input type="text" placeholder="Facebook URL" name="facebook" value={facebook} onChange={e => onChange(e)}/>
            </div>

            <div className="form-group social-input">
             <i className="fab fa-youtube fa-2x"></i>
                <input type="text" placeholder="YouTube URL" name="youtube" value={youtube} onChange={e => onChange(e)}/>
            </div>

            <div className="form-group social-input">
             <i className="fab fa-linkedin fa-2x"></i>
             <input type="text" placeholder="Linkedin URL" name="linkedin" value={linkedin} onChange={e => onChange(e)}/>
            </div>

            <div className="form-group social-input">
             <i className="fab fa-instagram fa-2x"></i>
             <input type="text" placeholder="Instagram URL" name="instagram" value={instagram} onChange={e => onChange(e)}/>
            </div>            
        </Fragment>}

        
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-dark my-1" to="/dashboard">Go Back</Link>
      </form>
      </div>
     </Fragment>
    )
}

EditProfile.propTypes = {
    createProfile: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(EditProfile));
