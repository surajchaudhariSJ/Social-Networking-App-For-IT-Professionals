import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import Experience from './Experience';
import Education from './Education';
import { deleteAccount, getCurrentProfile } from '../../actions/profile';

import ProfileTop from '../profile/ProfileTop';
import ProfileAbout from '../profile/ProfileAbout';

const Dashboard = ({ 
        getCurrentProfile, 
        deleteAccount,
        auth: { user }, 
        profile: { profile, loading } 
    }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    return loading && profile == null ? <Spinner /> : 
    <Fragment>
        <div className='prof'>
        <h1 className="large text-primary">Profile</h1>
        <p className="lead">
            <i className="fas fa-user"></i> Welcome { user && user.name }
        </p>
        {profile != null ? (
            <Fragment>
                <div className='profile-grid my-1'>
                    <div>
                        <ProfileTop profile={profile} />
                        <ProfileAbout profile={profile} />
                            <Link to="/edit-profile" className="btn btn-dark">
                                <i className="fas fa-user text-primary"></i>  Edit Profile
                            </Link>
                    </div>
                    
                    <div>
                    <Education education={profile.education}/>
                        <Link to="/add-education" className="btn btn-dark">
                            <i className="fas fa-user-graduate text-primary"></i> Add Education
                        </Link>
                    </div>
                    <div>
                    <Experience experience={profile.experience}/>
                        <Link to="/add-experience" className="btn btn-dark">
                            <i className="fas fa-briefcase text-primary"></i> Add Experience
                        </Link>
                    </div>
                    
                    <div className="my-2">
                        <button onClick={() => deleteAccount()} className="btn btn-danger">
                            <i className="fas fa-user"> Delete Account</i>
                        </button>
                    </div>
                </div>
            </Fragment> 
            ) : ( 
            <Fragment>
                <p>You have not setup a profile yet, please add some info...</p>
                <Link to='/create-profile' className='btn btn-primary my-1'>Create Profile</Link>
            </Fragment> 
        )}
        </div>
    </Fragment>;
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount:PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
