import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const ProfileAbout = ({
    profile: {
        bio, 
        skills, 
        user: {name}
        }
    }) => (
        <div class="profile-about bg-light p-2">
            {bio && (
                <Fragment>
                    <h2 class="text-primary">{name}'s Bio</h2>
                    <p>{bio}</p>
                    <div class="line"></div>
                </Fragment>
            )}
          <h2 class="text-primary">Skill Set</h2>
            <div class="skills">
            {skills.map((skills, index) => (
                <div key={index} className="p-1">  
                    <i className='fas fa-circle-notch'></i> {skills}
                </div>
            ))}
          </div>
        </div>
    )

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileAbout;
